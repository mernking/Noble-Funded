import glob

# 1. Read faqs.html to extract the FAQ JS
with open('faqs.html', 'r', encoding='utf-8') as f:
    faq_data = f.read()
faq_script_start = faq_data.rfind('<style>\n        #hide-me-faqs')
if faq_script_start != -1:
    faq_script_end = faq_data.find('</script>', faq_script_start) + 9
    faq_script = faq_data[faq_script_start:faq_script_end]
else:
    faq_script = ""

# 2. Read rules.html to extract the Rules JS
with open('rules.html', 'r', encoding='utf-8') as f:
    rules_data = f.read()
rules_script_start = rules_data.rfind('<style>\n        #hide-me-rules')
if rules_script_start != -1:
    rules_script_end = rules_data.find('</script>', rules_script_start) + 9
    rules_script = rules_data[rules_script_start:rules_script_end]
else:
    rules_script = ""

# 3. Read affiliate.html for Affiliate JS
with open('affiliate.html', 'r', encoding='utf-8') as f:
    aff_data = f.read()
aff_script_start = aff_data.rfind('<script>\n    (function() {\n        const replaceText')
if aff_script_start != -1:
    aff_script_end = aff_data.find('</script>', aff_script_start) + 9
    affiliate_script = aff_data[aff_script_start:aff_script_end]
else:
    affiliate_script = ""

# Combine them inside a single master script to inject everywhere
combined_script = faq_script + "\n" + rules_script + "\n" + affiliate_script

print("Combined script length:", len(combined_script))
with open('global_injections_full.html', 'w', encoding='utf-8') as f:
    f.write(combined_script)
