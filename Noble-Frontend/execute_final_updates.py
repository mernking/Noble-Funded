import os
import re

replacements = [
    # Flutterwave logo replacement
    ("/images/flutter-new.png", "/images/flutter-final.png"),
    
    # Grid Heading - Standard DOM and Unescaped RSC
    (
        '"Why we are a ",["$","span",null,{"style":{"backgroundImage":"linear-gradient(90deg, #A7FFEB 0%, #A7FFEB 100%)"},"className":"text-transparent bg-clip-text w-fit","children":"🇳🇬 Nigeria\'s #1 Prop Trading Firm"}]',
        '"Why Nigerian Traders Choose ",["$","span",null,{"style":{"backgroundImage":"linear-gradient(90deg, #A7FFEB 0%, #A7FFEB 100%)"},"className":"text-transparent bg-clip-text w-fit","children":"Noble Funded"}]'
    ),
    (
        'Why we are a <span class="text-transparent bg-clip-text w-fit" style="background-image: linear-gradient(90deg, rgb(167, 255, 235) 0%, rgb(167, 255, 235) 100%);">🇳🇬 Nigeria\'s #1 Prop Trading Firm</span>',
        'Why Nigerian Traders Choose <span class="text-transparent bg-clip-text w-fit" style="background-image: linear-gradient(90deg, rgb(167, 255, 235) 0%, rgb(167, 255, 235) 100%);">Noble Funded</span>'
    ),
    # Grid Heading - doubly-escaped RSC
    (
        '\\"Why we are a \\",[\\"$\\",\\"span\\",null,{\\"style\\":{\\"backgroundImage\\":\\"linear-gradient(90deg, #A7FFEB 0%, #A7FFEB 100%)\\"},\\"className\\":\\"text-transparent bg-clip-text w-fit\\",\\"children\\":\\"🇳🇬 Nigeria\'s #1 Prop Trading Firm\\"}]',
        '\\"Why Nigerian Traders Choose \\",[\\"$\\",\\"span\\",null,{\\"style\\":{\\"backgroundImage\\":\\"linear-gradient(90deg, #A7FFEB 0%, #A7FFEB 100%)\\"},\\"className\\":\\"text-transparent bg-clip-text w-fit\\",\\"children\\":\\"Noble Funded\\"}]'
    ),
    
    # Grid Item 1
    ("Lowest Spreads", "Raw Spreads from 0.0 Pips"),
    ("Reduce your trading costs with our average spread on majors from 0.0 pips, low commissions, and deep interbank liquidity.", "Trade with institutional-grade spreads. Our MT5 servers connect directly to tier-1 liquidity providers for the tightest spreads possible."),
    
    # Grid Item 2
    ("Payouts Guarantee", "Guaranteed 24-Hour Payouts"),
    ("We don't believe in teasing you with lower costs and then making you pay extra for it. With Noble, you can start with as little or as much as you like.", "Every payout request is processed within 24 hours. Nigerian traders receive funds via bank transfer in Naira. No delays, no excuses."),
    
    # Grid Item 3
    ("Range of Markets", "150+ Tradeable Instruments"),
    ("Trade our 150+ range of global markets covering FX, Indices, Commodities, Cryptocurrency, and more.", "Trade Forex, Gold (XAUUSD), Silver, Indices (US30, NAS100), Oil, and Crypto CFDs. All from one MT5 account."),
    
    # Grid Item 4 - Watch out for exact casing on titles
    ("Scale up to $2M in Funding", "Scale Up to ₦3 Million ($2k)"),
    ("Every win moves you closer to $2 million in funding. Perform well, level up, and get rewarded.", "Consistent traders grow their account by 15% every 4 months. Start at $5K and scale all the way to $200k)."),
    
    # Grid Item 5
    ("24/7 Trader Support", "Nigerian Support Team"),
    ("The market never sleeps, so neither does our team. The Noble is here to help you on your trading journey all day, every day.", "Our support team speaks your language and understands your market. Get help via Discord, Telegram, WhatsApp, or email \u2014 24/7."),
    
    # Grid Item 6
    ("AI Trader Journal", "Community & Education"),
    ("AI sees what you miss - and helps you win.", "Join 2,000+ traders in our Discord and Telegram communities. Free market analysis, trading tips, and weekly live sessions.")
]

# Unescaped Trustpilot RSC
tp_unesc = r'\["\$","div",null,\{"className":"trustpilot-widget","data-locale":"en-US","data-template-id":"5419b732fbfb950b10de65e5","data-businessunit-id":"6861f3966deaf67934e504cd","data-style-height":"24px","data-style-width":"100%","data-theme":"dark","children":\["\$","a",null,\{"href":"https://www\.trustpilot\.com/review/noblefunded\.com","target":"_blank","rel":"noopener","children":"Trustpilot"\}\]\}\]'

# Escaped Trustpilot RSC
tp_esc = r'\[\\"\\$\\",\\"div\\",null,\{\\"className\\":\\"trustpilot-widget\\",\\"data-locale\\":\\"en-US\\",\\"data-template-id\\":\\"5419b732fbfb950b10de65e5\\",\\"data-businessunit-id\\":\\"6861f3966deaf67934e504cd\\",\\"data-style-height\\":\\"24px\\",\\"data-style-width\\":\\"100%\\",\\"data-theme\\":\\"dark\\",\\"children\\":\[\\"\\$\\",\\"a\\",null,\{\\"href\\":\\"https://www\.trustpilot\.com/review/noblefunded\.com\\",\\"target\\":\\"_blank\\",\\"rel\\":\\"noopener\\",\\"children\\":\\"Trustpilot\\"\}\]\}\]'


files = []
for d, _, fs in os.walk('.'):
    if any(p in d for p in ['.git', 'node_modules']): continue
    for f in fs:
        if f.endswith('.html'):
            files.append(os.path.join(d, f))

for fp in files:
    try:
        with open(fp, 'r', encoding='utf-8') as f:
            c = f.read()
            
        orig = c
        for old_t, new_t in replacements:
            c = c.replace(old_t, new_t)
            
        # Also remove exact dashboard dash character variations just in case
        c = c.replace("WhatsApp, or email - 24/7.", "WhatsApp, or email \u2014 24/7.")
        # and encoded em dash
        c = c.replace("WhatsApp, or email \\u2014 24/7.", "WhatsApp, or email \u2014 24/7.")
        
        # Remove Trustpilot RSC
        c = re.sub(tp_unesc, 'null', c)
        c = re.sub(tp_esc, 'null', c)
        
        # Remove Trustpilot DOM
        # The DOM looks like <div class="trustpilot-widget"...><iframe></iframe></div>
        # A simple regex to remove the full DOM node if present
        c = re.sub(r'<div class="trustpilot-widget".*?</div>', '', c, flags=re.DOTALL)
        
        if c != orig:
            with open(fp, 'w', encoding='utf-8') as f:
                f.write(c)
            print(f"Updated {fp}")
    except Exception as e:
        pass

print("Done parsing and applying updates.")
