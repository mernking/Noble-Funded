import os
import re

html_files = []
for root, _, files in os.walk('.'):
    for f in files:
        if f.endswith('.html'):
            html_files.append(os.path.join(root, f))

pattern = re.compile(r'/favicon/[a-zA-Z0-9_-]+\.(?:png|ico|svg)')

for file_path in html_files:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_content = pattern.sub('/favicon/NF-header.svg', content)
    
    if new_content != content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {file_path}")
