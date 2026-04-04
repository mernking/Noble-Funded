import glob
import re

count = 0
for file in glob.glob('*.html'):
    if "node_modules" in file or ".git" in file:
        continue
    
    try:
        with open(file, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        continue

    original = content
    
    # Check if the interceptor is defined but not called
    if 'setupGlobalCheckoutInterceptor' in content and 'setupGlobalCheckoutInterceptor()' not in content:
        # We need to inject setupGlobalCheckoutInterceptor(); right after "function applyAll() {" or similar
        # Let's find function applyAll(
        
        # This regex finds function applyAll(...) { and inserts the call right after the {
        new_content = re.sub(r'(function\s+applyAll\s*\([^\)]*\)\s*\{)', r'\1\n        setupGlobalCheckoutInterceptor();', content)
        
        if new_content != original:
            with open(file, 'w', encoding='utf-8') as f:
                f.write(new_content)
            count += 1
            print(f"Injected call into {file}")

print(f"Done processing {count} files.")
