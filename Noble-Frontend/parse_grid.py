import re

with open('index.html', 'r', encoding='utf-8') as f:
    c = f.read()

# Let's extract everything from "Why we are a " to the next main section.
# A snippet of 2000 chars should be enough.
idx = c.find("Why we are a ")
if idx != -1:
    print(c[idx:idx+2000])

print("\n--- RSC PAYLOAD ---\n")
idx2 = c.rfind("Why we are a ")
if idx2 != -1 and idx2 != idx:
    print(c[idx2:idx2+2000])

