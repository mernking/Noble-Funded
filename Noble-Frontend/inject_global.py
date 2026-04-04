import glob

with open('global_injections_full.html', 'r', encoding='utf-8') as f:
    injections = f.read()

for file in glob.glob('*.html'):
    if '__rsc' in file or 'global_injections' in file or 'affiliate_inject' in file or 'inject_snippet' in file: continue
    
    with open(file, 'r', encoding='utf-8') as f:
        data = f.read()
    
    # We remove the end tag, insert the injections, and put the end tag back
    if '</body>' in data:
        print(f"Injecting into {file}...")
        data = data.replace('</body>', injections + '\n</body>')
        
        with open(file, 'w', encoding='utf-8') as f:
            f.write(data)

# Let's also patch the Next.js chunks for Affiliate page to prevent flashing
replacements = {
    '"children":"Lead your"': '"children":"Refer Traders."',
    '"children":"Noble"': '"children":"Earn Naira."',
    '"Bronze"': '"Affiliate_Key"',
    '"Silver"': '"Bronze_Key"',
    '"Gold"': '"Silver_Key"',
    '"Platinum"': '"Gold_Key"',
    '"Diamond"': '"Platinum_Key"',
    '"Emerald"': '"Diamond_Key"',
}

print("Patching JS chunks for affiliate...")
for js_file in glob.glob('_next/static/chunks/app/affiliate/*.js') + glob.glob('_next/static/chunks/*.js'):
    with open(js_file, 'r', encoding='utf-8') as file:
        js_data = file.read()
    
    changed = False
    for old, new in replacements.items():
        if old in js_data:
            js_data = js_data.replace(old, new)
            changed = True
            
    if 'Boost your income with our Affiliate Program!' in js_data:
        js_data = js_data.replace('Boost your income with our Affiliate Program! Refer new traders and earn up to 15% commission on each successful sign-up.', 'Share Noble Funded with your network and get paid every time someone you refer buys a challenge.')
        changed = True

    if changed:
        with open(js_file, 'w', encoding='utf-8') as outfile:
            outfile.write(js_data)
        print(f"Patched JS chunk: {js_file}")

