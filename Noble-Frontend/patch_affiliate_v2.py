import os
import glob
import re

files_to_patch = glob.glob('affiliate.html') + glob.glob('affiliate__rsc_*.html')

# ONLY replace display text, NOT React keys
replacements = {
    # Hero Section - HTML tags
    '>Lead your<': '>Refer Traders.<',
    '>Noble<': '>Earn Naira.<',
    
    # Hero Section - JSON children
    '"children":"Lead your"': '"children":"Refer Traders."',
    '"children":"Noble"': '"children":"Earn Naira."',
    
    # Hero Description
    'Boost your income with our Affiliate Program! Refer new traders and earn up to 15% commission on each successful sign-up.': 'Share Noble Funded with your network and get paid every time someone you refer buys a challenge.',
    
    # Tier Headers - ONLY the children display text, NOT the keys
    '"children":"Bronze"': '"children":"Affiliate"',
    '"children":"Silver"': '"children":"Bronze"',
    '"children":"Gold"': '"children":"Silver"',
    '"children":"Platinum"': '"children":"Gold"',
    '"children":"Diamond"': '"children":"Platinum"',
    '"children":"Emerald"': '"children":"Diamond"',
    
    # Tier Headers - HTML visible text  
    '>Bronze<': '>Affiliate<',
    '>Silver<': '>Bronze<',
    '>Gold<': '>Silver<',
    '>Platinum<': '>Gold<',
    '>Diamond<': '>Platinum<',
    '>Emerald<': '>Diamond<',

    # Tier Referral counts stay the same
    
    # Bonuses - the originals use $$ prefix for some reason
    '$$250 cash bonus': 'Standard Account',
    '$$500 cash bonus': '$50 cash bonus',
    '$$1000 cash bonus': '$150 cash bonus',
    ' $2500 cash bonus': '$300 cash bonus',
    '$$5000 cash bonus': '$500 cash bonus',
    '$$10000 cash bonus': '$1,000 cash bonus',
    
    # Also handle single $ versions
    '$250 cash bonus': 'Standard Account',

    # Step 1
    'Enrol & access': 'Sign Up for Free',
    'Enrol \\u0026 access': 'Sign Up for Free',
    'Register and access your affiliate dashboard': 'Register and access your affiliate dashboard in minutes.',
    
    # Step 2
    'Share your link': 'Share Your Link',
    'Receive your unique tracking link for referring to Noble Funded': 'Get your unique tracking link and promote Noble Funded to your audience.',
    
    # Step 3
    'Track your referrals': 'Earn Commissions',
    'As your visitors come to our site, we track their progress to purchasing an evaluation': 'Get paid automatically when your referrals purchase a challenge.',
}

def apply_replacements(text):
    for old, new in replacements.items():
        text = text.replace(old, new)

    # Fix commission rates: original has 6x "15% Commission"
    # New order: Affiliate=10%, Bronze=10%, Silver=12%, Gold=12%, Platinum=15%, Diamond=15%
    commissions = ['10% Commission', '10% Commission', '12% Commission', '12% Commission', '15% Commission', '15% Commission']
    count = [0]
    def comm_rep(match):
        idx = count[0]
        count[0] += 1
        if idx < len(commissions):
            return commissions[idx]
        return match.group(0)
    text = re.sub(r'15% Commission', comm_rep, text)

    # Hide steps 4 and 5 in HTML by adding display:none
    # Step 4: "Receive commissions"
    # Step 5: "Withdraw"
    # In the HTML, these are divs with class containing "flex sm:flex-row" 
    # We'll use CSS to hide them instead of regex on HTML structure
    
    return text

for f in files_to_patch:
    print(f"Patching {f}...")
    with open(f, 'r', encoding='utf-8') as file:
        data = file.read()
    
    new_data = apply_replacements(data)
    
    with open(f, 'w', encoding='utf-8') as outfile:
        outfile.write(new_data)

print("Patching complete!")
