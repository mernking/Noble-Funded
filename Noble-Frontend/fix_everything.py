"""
Comprehensive fix script using two-pass placeholder approach to avoid cascade replacements.
Patches:
1. Affiliate page: tier names, commissions, hero text, steps (HTML + RSC payloads)
2. Affiliate page: add WhatsApp button + remove Intercom CSS
"""
import glob
import re
import bs4

# ============================================================
# PART 1: Patch affiliate content using placeholders
# ============================================================
affiliate_files = ['affiliate.html'] + glob.glob('affiliate__rsc_*.html')

for f in affiliate_files:
    print(f"Patching {f}...")
    with open(f, 'r', encoding='utf-8') as file:
        data = file.read()

    # --- PASS 1: Replace old names with unique placeholders ---
    placeholders = [
        # JSON children display text → placeholder
        ('"children":"Bronze"',   '"children":"__TIER1__"'),
        ('"children":"Silver"',   '"children":"__TIER2__"'),
        ('"children":"Gold"',     '"children":"__TIER3__"'),
        ('"children":"Platinum"', '"children":"__TIER4__"'),
        ('"children":"Diamond"',  '"children":"__TIER5__"'),
        ('"children":"Emerald"',  '"children":"__TIER6__"'),
        # HTML visible text → placeholder
        ('>Bronze<',   '>__TIER1__<'),
        ('>Silver<',   '>__TIER2__<'),
        ('>Gold<',     '>__TIER3__<'),
        ('>Platinum<', '>__TIER4__<'),
        ('>Diamond<',  '>__TIER5__<'),
        ('>Emerald<',  '>__TIER6__<'),
    ]
    for old, placeholder in placeholders:
        data = data.replace(old, placeholder)

    # --- PASS 2: Replace placeholders with new names ---
    final_names = [
        ('__TIER1__', 'Affiliate'),
        ('__TIER2__', 'Bronze'),
        ('__TIER3__', 'Silver'),
        ('__TIER4__', 'Gold'),
        ('__TIER5__', 'Platinum'),
        ('__TIER6__', 'Diamond'),
    ]
    for placeholder, new_name in final_names:
        data = data.replace(placeholder, new_name)

    # --- Hero Section ---
    data = data.replace('"children":"Lead your"', '"children":"Refer Traders."')
    data = data.replace('"children":"Noble"', '"children":"Earn Naira."')
    data = data.replace('>Lead your<', '>Refer Traders.<')
    data = data.replace('>Noble<', '>Earn Naira.<')
    data = data.replace(
        'Boost your income with our Affiliate Program! Refer new traders and earn up to 15% commission on each successful sign-up.',
        'Share Noble Funded with your network and get paid every time someone you refer buys a challenge.'
    )

    # --- Steps ---
    data = data.replace('Enrol & access', 'Sign Up for Free')
    data = data.replace('Enrol \\u0026 access', 'Sign Up for Free')
    data = data.replace('Register and access your affiliate dashboard', 'Register and access your affiliate dashboard in minutes.')
    data = data.replace('Share your link', 'Share Your Link')
    data = data.replace('Receive your unique tracking link for referring to Noble Funded', 'Get your unique tracking link and promote Noble Funded to your audience.')
    data = data.replace('Track your referrals', 'Earn Commissions')
    data = data.replace('As your visitors come to our site, we track their progress to purchasing an evaluation', 'Get paid automatically when your referrals purchase a challenge.')

    # --- Commission rates (original has 6x "15% Commission") ---
    commissions = ['10% Commission', '10% Commission', '12% Commission', '12% Commission', '15% Commission', '15% Commission']
    count = [0]
    def comm_rep(match):
        idx = count[0]
        count[0] += 1
        return commissions[idx] if idx < len(commissions) else match.group(0)
    data = re.sub(r'15% Commission', comm_rep, data)

    with open(f, 'w', encoding='utf-8') as outfile:
        outfile.write(data)

print("Affiliate content patching complete!")

# ============================================================
# PART 2: Add WhatsApp snippet to affiliate.html
# ============================================================
whatsapp_style = ""
whatsapp_script = ""
with open('index.html', 'r', encoding='utf-8') as f:
    soup = bs4.BeautifulSoup(f, 'html.parser')
for s in soup.find_all('script'):
    txt = s.string or ''
    if 'addWhatsAppButton' in txt:
        prev = s.find_previous_sibling('style')
        if prev and 'intercom' in str(prev):
            whatsapp_style = str(prev)
            whatsapp_script = str(s)
        break

if whatsapp_style and whatsapp_script:
    whatsapp_snippet = whatsapp_style + '\n' + whatsapp_script
    with open('affiliate.html', 'r', encoding='utf-8') as f:
        aff_data = f.read()
    if 'addWhatsAppButton' not in aff_data:
        aff_data = aff_data.replace('</body>', whatsapp_snippet + '\n</body>')
        with open('affiliate.html', 'w', encoding='utf-8') as f:
            f.write(aff_data)
        print("Added WhatsApp snippet to affiliate.html")
    else:
        print("WhatsApp snippet already present in affiliate.html")
else:
    print("WARNING: Could not find WhatsApp snippet in index.html")

print("\nAll fixes applied!")
