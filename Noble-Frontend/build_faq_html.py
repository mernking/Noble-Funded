import re
import json
import glob

print("Starting FAQ Update Script")

# 1. Read Markdown content
with open('Noble_Funded_FAQ_Page.md', 'r') as f:
    md_content = f.read()

# 2. Update the Pricing in the Markdown Content
# User provided: 
# Naira: ₦10k, ₦19k, ₦29k, ₦39k, ₦54k, ₦190k
# USD: $29.99, $59.99, $134.99, $219.99, $379.99, $749.99

md_content = md_content.replace('₦10,000', '₦10,000') # 200k stays 10k based on user list? No, 10k, 19k, 29k, 39k, 54k, 190k.
# Let's do exact replacements on the tables.

naira_table = """**🇳🇬 Naira Account — Starting from ₦10,000:**

| Account Size | Challenge Fee |
|---|---|
| ₦200,000 | ₦10,000 |
| ₦400,000 | ₦19,000 |
| ₦600,000 | ₦29,000 |
| ₦800,000 | ₦39,000 |
| ₦1,000,000 | ₦54,000 |
| ₦3,000,000 | ₦190,000 |"""

usd_table = """**🇺🇸 Dollar Account — Starting from $29.99:**

| Account Size | Challenge Fee |
|---|---|
| $5,000 | $29.99 |
| $10,000 | $59.99 |
| $25,000 | $134.99 |
| $50,000 | $219.99 |
| $100,000 | $379.99 |
| $200,000 | $749.99 |"""

# Use regex to replace the tables
md_content = re.sub(r'\*\*🇳🇬 Naira Account — Starting from ₦10,000:\*\*.*?\| ₦3,000,000 \| ₦150,000 \|', naira_table, md_content, flags=re.DOTALL)
md_content = re.sub(r'\*\*🇺🇸 Dollar Account — Starting from \$29\.99:\*\*.*?\| \$200,000 \| \$599\.99 \|', usd_table, md_content, flags=re.DOTALL)

# 3. Parse Markdown into a structured FAQ object
tabs = {
    'Getting Started': [],
    'Payouts & Earnings': [],
    'Rules & Restrictions': []
}

current_tab = None
current_q = None
current_a = []

for line in md_content.split('\n'):
    if 'TAB 1: 🇳🇬 GETTING STARTED' in line:
        current_tab = 'Getting Started'
    elif 'TAB 2: 💰 PAYOUTS & EARNINGS' in line:
        current_tab = 'Payouts & Earnings'
    elif 'TAB 3: ⚠️ RULES & RESTRICTIONS' in line:
        current_tab = 'Rules & Restrictions'
    elif line.startswith('### Q: '):
        if current_q and current_tab:
            tabs[current_tab].append({'q': current_q, 'a': '\\n'.join(current_a).strip()})
        current_q = line.replace('### Q: ', '').strip()
        current_a = []
    elif current_q and not line.startswith('---') and not line.startswith('## TAB'):
        current_a.append(line)

# Append last question
if current_q and current_tab:
    tabs[current_tab].append({'q': current_q, 'a': '\\n'.join(current_a).strip()})

print(f"Parsed {len(tabs['Getting Started'])} getting started FAQs")
print(f"Parsed {len(tabs['Payouts & Earnings'])} payout FAQs")
print(f"Parsed {len(tabs['Rules & Restrictions'])} rules FAQs")

# 4. Generate the new HTML structure for the FAQ accordion
# We will create a fresh HTML block that replaces the existing accordion completely.
def gen_html_answer(a):
    # Convert markdown answers to HTML for the accordion body
    a = a.replace('\\n\\n', '</p><p class="mb-4">')
    a = a.replace('\\n', '<br/>')
    a = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', a)
    # Simple table to HTML
    if '|---|' in a:
        lines = a.split('<br/>')
        html_lines = []
        in_table = False
        for l in lines:
            if l.startswith('|') and '|---|' not in l:
                if not in_table:
                    html_lines.append('<div class="overflow-x-auto my-4"><table class="w-full text-left text-sm text-gray-400"><tbody>')
                    in_table = True
                
                cells = [c.strip() for c in l.split('|')[1:-1]]
                html_lines.append('<tr class="border-b border-gray-800">')
                for c in cells:
                    html_lines.append(f'<td class="p-2">{c}</td>')
                html_lines.append('</tr>')
            elif '|---|' in l:
                continue
            else:
                if in_table:
                    html_lines.append('</tbody></table></div>')
                    in_table = False
                html_lines.append(l)
        if in_table:
            html_lines.append('</tbody></table></div>')
        a = ''.join(html_lines)
    
    # Strip any hanging empty p tags
    a = a.replace('<p class="mb-4"></p>', '')
    return f'<div class="text-sm md:text-base text-gray-400"><p class="mb-4">{a}</p></div>'

new_faq_html = '<div class="w-full max-w-4xl mx-auto space-y-4">'
for i, (tab_name, faqs) in enumerate(tabs.items()):
    # We will just put them all in one big accordion for now, or match the existing tab structure if needed.
    # The existing site seems to just list them. We'll group them with headings.
    new_faq_html += f'<h3 class="text-xl md:text-2xl font-semibold text-white mt-8 mb-4">{tab_name}</h3>'
    for j, faq in enumerate(faqs):
        idx = f"{i}-{j}"
        q = faq['q']
        a_html = gen_html_answer(faq['a'])
        
        # Build accordion item HTML
        new_faq_html += f"""
        <div class="border border-gray-800 rounded-lg bg-[#0A0F16] overflow-hidden">
            <input type="checkbox" id="faq-{idx}" class="peer hidden" />
            <label for="faq-{idx}" class="flex items-center justify-between w-full p-4 md:p-6 cursor-pointer text-left text-white font-medium md:text-lg hover:bg-[#111823] transition-colors">
                <span>{q}</span>
                <svg class="w-5 h-5 text-gray-400 transform transition-transform duration-200 peer-checked:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
            </label>
            <div class="max-h-0 overflow-hidden transition-all duration-300 peer-checked:max-h-[2000px]">
                <div class="p-4 md:p-6 pt-0 border-t border-gray-800">
                    {a_html}
                </div>
            </div>
        </div>
        """
new_faq_html += '</div>'

# 5. Inject into faqs.html
try:
    with open('faqs.html', 'r', encoding='utf-8') as f:
        full_html = f.read()
    
    # We need to find the container. Usually it's after "Frequently Asked Questions"
    # Find the main container
    match = re.search(r'(<div[^>]*?>\s*<h2[^>]*?>\s*Frequently Asked Questions.*?)(<div class="grid.+?)(<!-- Footer -->|<footer)', full_html, re.DOTALL | re.IGNORECASE)
    if match:
        print("Found FAQ container area via regex")
        # We replace the accordion section
        # Actually it's safer to just replace everything below the hero in the main section up to the footer
    else:
        print("Could not find exact container, doing broad replacement")
        
    # Since Next.js RSC is complex, let's locate the existing accordion items and replace them.
    # The existing items have strings like "What type of Accounts do you offer?"
    import sys
    sys.exit(0) # We will do a different approach in the next step to ensure React hydration doesn't break.
except Exception as e:
    print(f"Error: {e}")
