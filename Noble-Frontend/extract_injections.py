import re

with open('faqs.html', 'r', encoding='utf-8') as f:
    data = f.read()

idx = data.find('window.switchTab =')
if idx != -1:
    print("Found switchTab in faqs.html")
    # Search backwards for <style> starting from the find index
    start_idx = data.rfind('<style>', 0, idx)
    # Search forwards for </script>
    end_idx = data.find('</script>', idx)
    faqs_inj = data[start_idx:end_idx + 9]
else:
    faqs_inj = ""

with open('rules.html', 'r', encoding='utf-8') as f:
    data2 = f.read()

idx2 = data2.find('window.switchTabRules =')
if idx2 != -1:
    print("Found switchTabRules in rules.html")
    start_idx2 = data2.rfind('<style>', 0, idx2)
    end_idx2 = data2.find('</script>', idx2)
    rules_inj = data2[start_idx2:end_idx2 + 9]
else:
    rules_inj = ""

injections = faqs_inj + '\n\n' + rules_inj
with open('global_injections.html', 'w', encoding='utf-8') as f:
    f.write(injections)

print(f"Total injections length: {len(injections)}")

