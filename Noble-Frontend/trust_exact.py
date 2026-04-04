with open('index.html', 'r', encoding='utf-8') as f:
    c = f.read()

# I will find the start of the Trustpilot array element and extract the exact string until the closing bracket
idx1 = c.find('["$","div",null,{"className":"trustpilot-widget"')
if idx1 != -1:
    end1 = c.find('}]', idx1) + 2
    s1 = c[idx1:end1]
    print(f"S1 length: {len(s1)}")
    # test replace
    c = c.replace(s1, 'null')

idx2 = c.find('[\\"$\\",\\"div\\",null,{\\"className\\":\\"trustpilot-widget\\"')
if idx2 != -1:
    end2 = c.find('}]', idx2) + 2
    s2 = c[idx2:end2]
    print(f"S2 length: {len(s2)}")
    c = c.replace(s2, 'null')

# remove from DOM
import re
c = re.sub(r'<div class="trustpilot-widget".*?</iframe></div>', '', c, flags=re.DOTALL)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(c)
