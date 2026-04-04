import bs4
import glob

faq_script = ""
with open('faqs.html', 'r', encoding='utf-8') as f:
    soup = bs4.BeautifulSoup(f, 'html.parser')
    for script in soup.find_all('script'):
        s_text = script.string or ""
        if 'switchTab' in s_text and 'faq-tab-btn' in s_text:
            faq_script = str(script).replace("window.switchTab = ", "window.switchTabFaq = ").replace("function switchTab(", "function switchTabFaq(")

rules_script = ""
with open('rules.html', 'r', encoding='utf-8') as f:
    soup = bs4.BeautifulSoup(f, 'html.parser')
    for script in soup.find_all('script'):
        s_text = script.string or ""
        if 'switchTab' in s_text and 'rules-tab-btn' in s_text:
            rules_script = str(script).replace("window.switchTab = ", "window.switchTabRules = ").replace("function switchTab(", "function switchTabRules(")

aff_script = ""
with open('affiliate.html', 'r', encoding='utf-8') as f:
    soup = bs4.BeautifulSoup(f, 'html.parser')
    for script in soup.find_all('script'):
        s_text = script.string or ""
        if 'Lead your' in s_text or 'replaceText' in s_text:
            aff_script = str(script)

print(f"FAQ Script present: {bool(faq_script)}")
print(f"Rules Script present: {bool(rules_script)}")
print(f"Affiliate Script present: {bool(aff_script)}")

# Before combining, we need to update the onclick handlers in faqs.html and rules.html to match the renamed functions
def update_html(filename, old_func, new_func):
    with open(filename, 'r', encoding='utf-8') as f:
        html = f.read()
    html = html.replace(f'onclick="{old_func}', f'onclick="{new_func}')
    html = html.replace(f"onclick='{old_func}", f"onclick='{new_func}")
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(html)
        
update_html('faqs.html', "window.switchTab(", "window.switchTabFaq(")
update_html('faqs.html', "switchTab(", "switchTabFaq(")

update_html('rules.html', "window.switchTab(", "window.switchTabRules(")
update_html('rules.html', "switchTab(", "switchTabRules(")

# We combine them together
combined = "\n<!-- GLOBAL INJECTIONS FOR REACT HYDRATION -->\n" + faq_script + "\n" + rules_script + "\n" + aff_script + "\n<!-- END GLOBAL -->\n"

for file in glob.glob('*.html'):
    if '__rsc' in file or 'global_injections' in file: continue
    with open(file, 'r', encoding='utf-8') as f:
        html = f.read()

    # If it's already there, replace the old block instead of appending again
    import re
    if '<!-- GLOBAL INJECTIONS FOR REACT HYDRATION -->' in html:
        # Use string find since re.sub chokes on \u escapes in the script
        start = html.find('<!-- GLOBAL INJECTIONS FOR REACT HYDRATION -->')
        end = html.find('<!-- END GLOBAL -->', start) + len('<!-- END GLOBAL -->')
        html = html[:start] + combined + html[end:]
    elif '</body>' in html:
        html = html.replace('</body>', combined + '\n</body>')
        
    with open(file, 'w', encoding='utf-8') as f:
        f.write(html)
    print(f"Injected global script into {file}")

