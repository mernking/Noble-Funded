import os
import re

replacements = [
    # Meta Tags
    (
        "<title>Noble Funded</title>",
        "<title>Noble Funded | Nigeria's #1 Naira Prop Trading Firm | Get Funded Up to ₦50M</title>\n<meta name=\"description\" content=\"Noble Funded is Nigeria's premier Naira-denominated prop trading firm. Get funded up to ₦3,000,000 or $200,000. Pay in Naira, get paid in Naira. 80% profit split, 24hr payouts, no time limits. Start your challenge from ₦10,000.\">"
    ),
    (
        '"title":"Noble Funded"',
        '"title":"Noble Funded | Nigeria\'s #1 Naira Prop Trading Firm | Get Funded Up to ₦50M"'
    ),

    # Remove Flutterwave (hide it)
    (
        'class="sm:w-[70px] w-[60px] object-contain" src="/images/flutter-final.png"',
        'class="hidden" src="/images/flutter-final.png"'
    ),
    (
        'className":"sm:w-[70px] w-[60px] object-contain"',
        'className":"hidden"'
    ),

    # --- Testimonial 1 (John -> Chinedu O.) ---
    ('>John<', '>Chinedu O.<'),
    ('"children":"John"', '"children":"Chinedu O."'),
    ('Crypto Swing Trader', 'Gold Scalper'),
    ('From Odd Jobs to Full-Time Trader', 'From Side Hustle to Full-Time Trader'),
    (
        'I was doing odd jobs when I found Noble Funded. Passed the challenge in three weeks, got my first payout in five days, and booked a Cape Town trip. Now I trade full-time. Fast payouts helped me turn everything around.',
        'I was running a small phone accessories business in Lagos when a friend told me about Noble Funded. I paid ₦25,000 for the $10K challenge, passed in two weeks, and got my first payout of ₦380,000. Now I trade full-time and my family is proud.'
    ),

    # --- Testimonial 2 (Sofia -> Amina B.) ---
    ('>Sofia<', '>Amina B.<'),
    ('"children":"Sofia"', '"children":"Amina B."'),
    ('Technical Analyst', 'Forex Swing Trader'),
    ('From Waiter to Full-Time Trader', 'Funded Without Breaking the Bank'),
    (
        "I was waiting tables to pay rent and felt stuck. A friend introduced me to forex, but I had no capital - until I found Noble Funded's instant account. Made profit fast, got paid in 24 hours, and went full-time trading.",
        "Other prop firms wanted ₦100,000+ just to start. Noble Funded let me in for ₦15,000. I passed the challenge trading XAUUSD and got funded. My first month's profit was more than my old salary. This is the opportunity Nigeria needed."
    ),

    # --- Testimonial 3 (Omar -> Tunde A.) ---
    ('>Omar<', '>Tunde A.<'),
    ('"children":"Omar"', '"children":"Tunde A."'),
    ('Forex Scalper', 'Algo Trader'),
    ('Clean Tools, Fast Payouts, Real Growth', 'The EA Trader Who Found His Firm'),
    (
        "I'm 22 and got funded in three weeks. The dashboard's clean, shows everything clearly, and the journaling plus AI helped me improve fast. I’ve already received two payouts, with a third on the way. Super smooth, reliable experience so far.",
        "Most prop firms ban EAs or make it nearly impossible. Noble Funded lets me run my Expert Advisor freely. I coded my own strategy, passed the challenge on autopilot, and now I earn passive income. No restrictions, no drama."
    ),

    # --- Testimonial 4 (Arjun -> Ngozi E.) ---
    ('>Arjun<', '>Ngozi E.<'),
    ('"children":"Arjun"', '"children":"Ngozi E."'),
    ('Full-time Trader', 'Part-Time Trader'),
    ('From Engineer to Funded Trader', 'From University Student to Funded Trader'),
    (
        "I was stuck in a 9-to-6 engineering job with no real capital. Joined Noble Funded, passed in under a month, and got my first payout two weeks later. Paid off student loans, treated my family, and now trade full-time. Life-changing.",
        "I'm a 300-level student at UNILAG. I saved up ₦15,000 from my allowance, bought the smallest challenge, and passed it during exam break. Now I'm funding my own education. Noble Funded changed my perspective completely."
    ),

    # --- Calculator / Payouts ---
    ('90% Profit Split', '80% Profit Split'),
    ('Start at 80% and scale up to 80%', 'Start at 80% and scale up to 90%'), # Fix the over-replace above
    ('>8k+<', '>1k+<'),
    ('"children":"8k+"', '"children":"1k+"'),
    ('>2hrs<', '>24hrs<'),
    ('"children":"2hrs"', '"children":"24hrs"'),
    
    # Wait, $600k+ is used. Let's precise replace it
    ('>600k+<', '>₦80M+<'),
    ('"children":"600k+"', '"children":"₦80M+"'),
    ('>$600k+<', '>₦80M+<'),
    ('"children":"$600k+"', '"children":"₦80M+"'),

    # Payouts ticker overrides
    ('Alice Thompson', 'Emeka O.'),
    ('Canada', 'Lagos'),
    ('$725.75', '₦1,162,000'),
    
    ('Fatima A.', 'Oluwaseun B.'), # replace previously translated names to new fresh distinct ones
    ('Chinedu K.', 'Nnamdi O.'),
]

files = ['index.html', 'index__rsc_q74wz.html', 'index__rsc_4antu.html', 'index__rsc_zhpqn.html', 'index__rsc_1ehg9.html']

for fp in files:
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

print("Done phase 2 wipe.")
