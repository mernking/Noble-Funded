import os
import glob
import re

files_to_patch = glob.glob('affiliate.html') + glob.glob('affiliate__rsc_*.html')

replacements = {
    # HTML Replacements
    '>Lead your<': '>Refer Traders.<',
    '>Noble<': '>Earn Naira.<',
    
    # JSON Replacements
    '"children":"Lead your"': '"children":"Refer Traders."',
    '"children":"Noble"': '"children":"Earn Naira."',
    
    # Hero Description
    'Boost your income with our Affiliate Program! Refer new traders and earn up to 15% commission on each successful sign-up.': 'Share Noble Funded with your network and get paid every time someone you refer buys a challenge.',
    
    # Tier Headers (HTML & JSON)
    '>Bronze<': '>Affiliate<',
    '"children":"Bronze"': '"children":"Affiliate"',
    '>Silver<': '>Bronze<',
    '"children":"Silver"': '"children":"Bronze"',
    '>Gold<': '>Silver<',
    '"children":"Gold"': '"children":"Silver"',
    '>Platinum<': '>Gold<',
    '"children":"Platinum"': '"children":"Gold"',
    '>Diamond<': '>Platinum<',
    '"children":"Diamond"': '"children":"Platinum"',
    '>Emerald<': '>Diamond<',
    '"children":"Emerald"': '"children":"Diamond"',
    
    # Keys in JSON (often used as React keys)
    '"Bronze"': '"Affiliate_Key"',
    '"Silver"': '"Bronze_Key"',
    '"Gold"': '"Silver_Key"',
    '"Platinum"': '"Gold_Key"',
    '"Diamond"': '"Platinum_Key"',
    '"Emerald"': '"Diamond_Key"',

    # Tier Referral counts
    '0 - 49 Life Time Referrals': '0 - 49 Life Time Referrals',
    '50 - 99 Life Time Referrals': '50 - 99 Life Time Referrals',
    '100 - 249 Life Time Referrals': '100 - 249 Life Time Referrals',
    '250 - 499 Life Time Referrals': '250 - 499 Life Time Referrals',
    '500 - 999 Life Time Referrals': '500 - 999 Life Time Referrals',
    '1000+ Life Time Referrals': '1000+ Life Time Referrals',

    # Bonuses
    # Note: Diamond (was Emerald) is $1000, Platinum (was Diamond) is $500, Gold (was Platinum) is $300, etc.
    # The originals were: Bronze ($250), Silver ($500), Gold ($1000), Platinum ($2500), Diamond ($5000), Emerald ($10000)
    # The new ones: Affiliate (none/omit? the user said: Bronze 10%, nothing about bonus for Tier 1)
    # Wait, the string "$$250 cash bonus" exists!
    '$$250 cash bonus': 'No bonus',
    '$$500 cash bonus': '$50 cash bonus',
    '$$1000 cash bonus': '$150 cash bonus',
    ' $2500 cash bonus': '$300 cash bonus',
    '$$5000 cash bonus': '$500 cash bonus',
    '$$10000 cash bonus': '$1,000 cash bonus',

    # Step 1
    'Enrol & access': 'Sign Up for Free',
    'Register and access your affiliate dashboard': 'Register and access your affiliate dashboard in minutes.',
    
    # Step 2
    'Share your link': 'Share Your Link',
    'Receive your unique tracking link for referring to Noble Funded': 'Get your unique tracking link and promote Noble Funded to your audience.',
    
    # Step 3
    'Track your referrals': 'Earn Commissions',
    'As your visitors come to our site, we track their progress to purchasing an evaluation': 'Get paid automatically when your referrals purchase a challenge.',
}

def apply_complex_replacements(text):
    for old, new in replacements.items():
        text = text.replace(old, new)

    # Now carefully patch the commissions
    # The original has 6 blocks of "15% Commission", but they apply to 6 tiers.
    # 1. Affiliate: 10%
    # 2. Bronze: 10%
    # 3. Silver: 12%
    # 4. Gold: 12%
    # 5. Platinum: 15%
    # 6. Diamond: 15%
    # So the order of appearances of "15% Commission" matches the cards.
    # Let's use a regex to replace them in order.
    
    commissions = ['10% Commission', '10% Commission', '12% Commission', '12% Commission', '15% Commission', '15% Commission']
    def comm_rep(match):
        if hasattr(comm_rep, 'idx'):
            comm_rep.idx += 1
        else:
            comm_rep.idx = 0
        if comm_rep.idx < len(commissions):
            return commissions[comm_rep.idx]
        return match.group(0)
    
    # Reset index and replace
    if hasattr(comm_rep, 'idx'):
        del comm_rep.idx
    text = re.sub(r'15% Commission', comm_rep, text)

    # Hide steps 4 and 5 completely by injecting a CSS class to their wrapper in HTML 
    # And replacing the JSON node with null in RSC files
    # For JSON: [\"$\",\"div\",\"Receive commissions\",...] -> null
    # For HTML: We will use regex to find step 4 and step 5 and hide them.
    text = re.sub(r'\["\$","div","Receive commissions",.*?\}]\}]\}]', 'null', text)
    text = re.sub(r'\["\$","div","Withdraw",.*?\}]\}]\}]', 'null', text)
    
    # For the HTML version:
    text = re.sub(r'(<div[^>]*>[\s\S]*?)>([^<]*)(Receive commissions)([\s\S]*?</div>[\s\S]*?</div>[\s\S]*?</div>)', r'\1 style="display:none !important;">\2\3\4', text)
    text = re.sub(r'(<div[^>]*>[\s\S]*?)>([^<]*)(Withdraw)([\s\S]*?</div>[\s\S]*?</div>[\s\S]*?</div>)', r'\1 style="display:none !important;">\2\3\4', text)

    # For the Bonus in Tier 1: Change 'No bonus' div to be hidden or just change text to empty
    text = text.replace('No bonus', 'Standard Account')

    return text

for f in files_to_patch:
    print(f"Patching {f}...")
    with open(f, 'r', encoding='utf-8') as file:
        data = file.read()
    
    new_data = apply_complex_replacements(data)
    
    with open(f, 'w', encoding='utf-8') as outfile:
        outfile.write(new_data)

print("Patching complete!")
