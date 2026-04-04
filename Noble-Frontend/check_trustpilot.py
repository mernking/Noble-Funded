with open('index.html', 'r', encoding='utf-8') as f:
    c = f.read()

idx = c.find("Trustpilot")
if idx != -1:
    print("STILL THERE:")
    print(c[idx-50:idx+50])
else:
    print("GONE!")
