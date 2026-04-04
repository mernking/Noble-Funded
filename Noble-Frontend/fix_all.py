import subprocess
import glob
import re

with open('faqs.html', 'r', encoding='utf-8') as f:
    data = f.read()
# Find the exact string added in update_faqs_final.py
start_idx = data.find('<script>\n    window.switchTab = function(tabId, btnElement)')
end_idx = data.find('</script>', start_idx) + 9 if start_idx != -1 else -1

if start_idx == -1:
    # Try alternate signature
    start_idx = data.find('<script>\nfunction switchTab(')
    end_idx = data.find('</script>', start_idx) + 9 if start_idx != -1 else -1
    
faq_inj = data[start_idx:end_idx] if start_idx != -1 else ""

with open('rules.html', 'r', encoding='utf-8') as f:
    data = f.read()
start_idx = data.find('<script>\nfunction switchTabRules(')
end_idx = data.find('</script>', start_idx) + 9 if start_idx != -1 else -1
rules_inj = data[start_idx:end_idx] if start_idx != -1 else ""

with open('affiliate.html', 'r', encoding='utf-8') as f:
    data = f.read()
start_idx = data.find('<script>\n    (function() {\n        const replaceText')
end_idx = data.find('</script>', start_idx) + 9 if start_idx != -1 else -1
aff_inj = data[start_idx:end_idx] if start_idx != -1 else ""

print("FAQ length:", len(faq_inj))
print("Rules length:", len(rules_inj))
print("Affiliate length:", len(aff_inj))

combined = faq_inj + '\n' + rules_inj + '\n' + aff_inj

# Now inject it into ALL html files
for file in glob.glob('*.html'):
    if '__rsc' in file or 'global_injections' in file: continue
    
    with open(file, 'r', encoding='utf-8') as f:
        html = f.read()
        
    # Strip existing scripts to avoid duplicates
    if faq_inj and faq_inj in html: html = html.replace(faq_inj, '')
    if rules_inj and rules_inj in html: html = html.replace(rules_inj, '')
    if aff_inj and aff_inj in html: html = html.replace(aff_inj, '')
    
    if '</body>' in html:
        html = html.replace('</body>', combined + '\n</body>')
        with open(file, 'w', encoding='utf-8') as f:
            f.write(html)
            print(f"Injected into {file}")

