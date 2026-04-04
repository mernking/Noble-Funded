with open('index.html', 'r', encoding='utf-8') as f:
    c = f.read()

idx = c.find("Trustpilot")
if idx != -1:
    print("Trustpilot Unescaped DOM:")
    print(c[idx-500:idx+500])
