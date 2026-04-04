import re
with open('index.html', 'r', encoding='utf-8') as f:
    c = f.read()

# Grab the 6 grid items from the unescaped RSC section
start = c.rfind("Why we are a ")
end = c.find("</section>", start)
section = c[start:end]

# Extract titles and descriptions
titles = re.findall(r'<div class="font-semibold sm:text-2xl text-xl">([^<]+)</div>', section)
descs = re.findall(r'<div class="text-light font-light max-w-xs sm:text-base text-sm">([^<]+)</div>', section)

for t, d in zip(titles, descs):
    print(f"TITLE: {t}")
    print(f"DESC:  {d}\n")

# Find Trustpilot snippet
tp = c.find('Trustpilot')
if tp != -1:
    print("Trustpilot snippet:")
    print(c[tp-200:tp+200])

