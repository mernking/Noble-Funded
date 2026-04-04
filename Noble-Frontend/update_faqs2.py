import re
import glob
import os

md_path = '../Noble_Funded_FAQ_Page.md'
with open(md_path, 'r', encoding='utf-8') as f:
    md_content = f.read()

# Replace prices
md_content = md_content.replace('₦400,000 | ₦20,000', '₦400,000 | ₦19,000')
md_content = md_content.replace('₦600,000 | ₦30,000', '₦600,000 | ₦29,000')
md_content = md_content.replace('₦800,000 | ₦40,000', '₦800,000 | ₦39,000')
md_content = md_content.replace('₦1,000,000 | ₦50,000', '₦1,000,000 | ₦54,000')
md_content = md_content.replace('₦3,000,000 | ₦150,000', '₦3,000,000 | ₦190,000')

md_content = md_content.replace('$10,000 | $49.99', '$10,000 | $59.99')
md_content = md_content.replace('$25,000 | $99.99', '$25,000 | $134.99')
md_content = md_content.replace('$50,000 | $199.99', '$50,000 | $219.99')
md_content = md_content.replace('$100,000 | $349.99', '$100,000 | $379.99')
md_content = md_content.replace('$200,000 | $599.99', '$200,000 | $749.99')

tabs = {'Getting Started': [], 'Payouts & Earnings': [], 'Rules & Restrictions': []}
current_tab = None
current_q = None
current_a = []

for line in md_content.split('\n'):
    if 'TAB 1: 🇳�� GETTING STARTED' in line: current_tab = 'Getting Started'
    elif 'TAB 2: 💰 PAYOUTS & EARNINGS' in line: current_tab = 'Payouts & Earnings'
    elif 'TAB 3: ⚠️ RULES & RESTRICTIONS' in line: current_tab = 'Rules & Restrictions'
    elif line.startswith('### Q: '):
        if current_q and current_tab:
            tabs[current_tab].append({'question': current_q, 'answer': '\\n'.join(current_a).strip()})
        current_q = line.replace('### Q: ', '').strip()
        current_a = []
    elif current_q and not line.startswith('---') and not line.startswith('## TAB'):
        if line.strip() != '':
            current_a.append(line)

if current_q and current_tab:
    tabs[current_tab].append({'question': current_q, 'answer': '\\n'.join(current_a).strip()})

def md_to_html(a):
    a = a.replace('\\n\\n', '</p><p class="text-xs sm:text-sm font-light leading-10 my-4 text-[#A7FFEB]">')
    a = a.replace('\\n', '<br/>')
    a = re.sub(r'\*\*(.*?)\*\*', r'<strong class="font-semibold text-white">\1</strong>', a)
    
    if '|---|' in a:
        lines = a.split('<br/>')
        html_lines = []
        in_table = False
        for l in lines:
            if l.startswith('|') and '|---|' not in l:
                if not in_table:
                    html_lines.append('<div class="w-full overflow-x-auto my-4"><table class="w-full text-left text-xs sm:text-sm text-[#A7FFEB] border border-[#A7FFEB]/20 rounded-lg"><tbody>')
                    in_table = True
                
                cells = [c.strip() for c in l.split('|')[1:-1]]
                html_lines.append('<tr class="border-b border-[#A7FFEB]/20 hover:bg-[#A7FFEB]/5 transition-colors">')
                for c in cells:
                    html_lines.append(f'<td class="p-3">{c}</td>')
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
    
    a = a.replace('<p class="text-xs sm:text-sm font-light leading-10 my-4 text-[#A7FFEB]"></p>', '')
    return f'<div class="text-xs sm:text-sm font-light leading-10 text-[#A7FFEB]"><p>{a}</p></div>'

new_faq_html = '<div class="flex flex-col sm:gap-5 gap-3 container mx-auto" id="new-faqs-container" style="display: flex !important; visibility: visible !important; opacity: 1 !important; max-height: none !important;">'
new_faq_html += '<div class="flex flex-wrap justify-center sm:gap-5 gap-3">'

active_tab_classes = "inline-flex items-center cursor-pointer justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-[#A7FFEB] text-black hover:bg-[#A7FFEB]/90 h-11 rounded-3xl px-10 max-w-xs w-full"
inactive_tab_classes = "inline-flex items-center cursor-pointer justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border bg-transparent shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-11 rounded-3xl px-10 max-w-xs w-full"

tab_ids = ["tab-getting-started", "tab-payouts", "tab-rules"]
for i, tab_name in enumerate(tabs.keys()):
    t_class = active_tab_classes if i == 0 else inactive_tab_classes
    new_faq_html += f'<button onclick="switchTab(\'{tab_ids[i]}\', this)" class="faq-tab-btn-orig {t_class}">{tab_name}</button>'

new_faq_html += '</div>'
new_faq_html += '<div data-slot="accordion" class="sm:mt-5 mt-0 max-w-7xl mx-auto w-full max-sm:px-5" data-orientation="vertical">'

for i, (tab_name, faqs) in enumerate(tabs.items()):
    display_style = "block" if i == 0 else "none"
    new_faq_html += f'<div id="{tab_ids[i]}" class="faq-tab-content-orig" style="display: {display_style};">'
    for j, faq in enumerate(faqs):
        idx = f'{i}-{j}'
        q = faq['question']
        a_html = md_to_html(faq['answer'])
        
        new_faq_html += f"""
        <div class="border p-3 border-[#A7FFEB]/20 rounded-2xl last:border-b-0 bg-[#002B36] mt-4 overflow-hidden">
            <h3 class="flex font-normal m-0 relative">
                <button type="button" onclick="toggleAccordion('{idx}')" class="focus-visible:border-ring text-[#A7FFEB] focus-visible:ring-ring/50 flex flex-1 items-center justify-between py-4 text-sm font-medium transition-all outline-none md:text-xl sm:text-lg cursor-pointer w-full text-left bg-transparent border-none">
                    {q}
                    <svg id="icon-faq-{idx}" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down text-muted-foreground shrink-0 transition-transform duration-200 text-white w-8 h-8 font-light" style="transform: rotate(0deg);"><path d="m6 9 6 6 6-6"></path></svg>
                </button>
            </h3>
            <div id="content-faq-{idx}" class="overflow-hidden transition-all duration-300 ease-in-out" style="max-height: 0px;">
                <div class="pb-4 pt-0">
                    <div class="text-xs sm:text-sm font-light leading-10">
                        {a_html}
                    </div>
                </div>
            </div>
        </div>
        """
    new_faq_html += '</div>'

new_faq_html += '</div>'

s_o = '<sc' + 'ript>'
s_c = '</sc' + 'ript>'
new_faq_html += f"""
{s_o}
function switchTab(tabId, btnElement) {{
    document.querySelectorAll('.faq-tab-content-orig').forEach(el => el.style.display = 'none');
    document.getElementById(tabId).style.display = 'block';
    document.querySelectorAll('.faq-tab-btn-orig').forEach(btn => {{
        btn.className = "{inactive_tab_classes}";
    }});
    if(btnElement) {{
        btnElement.className = "{active_tab_classes}";
    }}
}}
function toggleAccordion(idx) {{
    const content = document.getElementById('content-faq-' + idx);
    const icon = document.getElementById('icon-faq-' + idx);
    if (!content || !icon) return;
    if (content.style.maxHeight === '0px' || content.style.maxHeight === '') {{
        content.style.maxHeight = '3000px';
        icon.style.transform = 'rotate(180deg)';
    }} else {{
        content.style.maxHeight = '0px';
        icon.style.transform = 'rotate(0deg)';
    }}
}}
{s_c}
</div>
"""

# Let's revert faqs.html and just COMPLETELY DELETE the old React payload strings
# This is the single bulletproof way to fix NextJS hydration flashing.
import subprocess
try:
    subprocess.run(["git", "checkout", "faqs.html"], check=True)
except:
    pass

for f in glob.glob('faqs*.html'):
    with open(f, 'r', encoding='utf-8') as file:
        data = file.read()
    
    # Safely replace the DOM structure directly inside faqs.html
    # We will find the EXACT block we want to replace.
    orig_start = '<div class="flex flex-col sm:gap-5 gap-3 container mx-auto">'
    if orig_start in data:
        end_str = '</section>'
        idx_start = data.find(orig_start)
        idx_end = data.find(end_str, idx_start)
        if idx_start != -1 and idx_end != -1:
            # We completely cut out the old structural markup and put ours IN ITS PLACE
            data = data[:idx_start] + new_faq_html + data[idx_end:]
            
            # Now, to absolutely prevent Hydration from rebuilding the old FAQ,
            # We simply remove the specific strings that NextJS uses for hydration payload!
            # NextJS encodes the React Tree in `<script>(()=>{self.__next_f.push...`
            data = data.replace('What type of Accounts do you offer?', 'REMOVED_FAQ_PAYLOAD_1')
            data = data.replace('Do I need to know how to trade?', 'REMOVED_FAQ_PAYLOAD_2')
            data = data.replace('What are your trading rules?', 'REMOVED_FAQ_PAYLOAD_3')
            data = data.replace('Is there a Minimum Payout amount?', 'REMOVED_FAQ_PAYLOAD_4')
            data = data.replace('What are Noble Spartan Accounts?', 'REMOVED_FAQ_PAYLOAD_5')
            data = data.replace('What is Group Trading?', 'REMOVED_FAQ_PAYLOAD_6')
            
            with open(f, 'w', encoding='utf-8') as outfile:
                outfile.write(data)
            print(f"Replaced FAQ HTML in: {f}")

# Clean up JS chunks to ensure the new strings aren't reverted if the browser loads a JS file that overrides it
for js_file in glob.glob('_next/static/chunks/*.js') + glob.glob('_next/static/chunks/app/*/*.js'):
    with open(js_file, 'r', encoding='utf-8') as file:
        js_data = file.read()
    if 'What type of Accounts do you offer?' in js_data:
        # Same replacement in JS to prevent it from ever repainting the old FAQ state
        js_data = js_data.replace('What type of Accounts do you offer?', 'REMOVED_FAQ_PAYLOAD_1')
        js_data = js_data.replace('Do I need to know how to trade?', 'REMOVED_FAQ_PAYLOAD_2')
        with open(js_file, 'w', encoding='utf-8') as outfile:
            outfile.write(js_data)
        print(f"Replaced FAQ text in JS chunk: {js_file}")

