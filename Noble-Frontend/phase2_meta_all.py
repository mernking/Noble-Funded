import glob

replacements = [
    (
        "<title>Noble Funded</title>",
        "<title>Noble Funded | Nigeria's #1 Naira Prop Trading Firm | Get Funded Up to ₦50M</title>\n<meta name=\"description\" content=\"Noble Funded is Nigeria's premier Naira-denominated prop trading firm. Get funded up to ₦3,000,000 or $200,000. Pay in Naira, get paid in Naira. 80% profit split, 24hr payouts, no time limits. Start your challenge from ₦10,000.\">"
    ),
    (
        '"title":"Noble Funded"',
        '"title":"Noble Funded | Nigeria\'s #1 Naira Prop Trading Firm | Get Funded Up to ₦50M"'
    ),
]

for fp in glob.glob("*.html"):
    if fp == 'index.html': continue  # Already processed
    try:
        with open(fp, 'r', encoding='utf-8') as f:
            c = f.read()
            
        orig = c
        for old_t, new_t in replacements:
            c = c.replace(old_t, new_t)
            
        if c != orig:
            with open(fp, 'w', encoding='utf-8') as f:
                f.write(c)
            print(f"Updated {fp}")
            
    except Exception as e:
        pass

print("Done phase 2 meta all.")
