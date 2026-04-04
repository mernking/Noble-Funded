with open('index.html', 'r', encoding='utf-8') as f:
    c = f.read()

# find exactly 'class="trustpilot-widget"'
idx = c.find('class="trustpilot-widget"')
if idx != -1:
    print(c[idx-200:idx+400])
