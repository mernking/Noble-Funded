import os
import re

files = []
for d, _, fs in os.walk('.'):
    # skip node_modules and .git
    if any(p in d for p in ['.git', 'node_modules']): continue
    for f in fs:
        if f.endswith('.html'):
            files.append(os.path.join(d, f))

for fp in files:
    try:
        with open(fp, 'r', encoding='utf-8') as f:
            c = f.read()
        
        orig = c
        
        # 1. Unescaped JSON replacement
        # Finds: ["$","$L6","/images/hero/opay.jpeg",{"src":"/images/hero/opay.jpeg","alt":"upi","width":60,"height":60,"className":"sm:w-[70px] w-[60px]"}]
        # I'll just strictly replace it using a regex that doesn't care about the tag identifier.
        pat1 = r'\["\$","([^"]+)","/images/hero/opay\.jpeg",\{"src":"/images/hero/opay\.jpeg","alt":"upi","width":60,"height":60,"className":"sm:w-\[70px\] w-\[60px\]"\}\]'
        def repl1(m):
            t = m.group(1)
            return f'["$","{t}","/images/opay-new.png",{{"src":"/images/opay-new.png","alt":"opay","width":60,"height":60,"className":"sm:w-[70px] w-[60px] object-contain"}}],["$","{t}","/images/flutter-new.png",{{"src":"/images/flutter-new.png","alt":"flutterwave","width":60,"height":60,"className":"sm:w-[70px] w-[60px] object-contain"}}]'
        c = re.sub(pat1, repl1, c)

        # 2. Escaped JSON replacement
        # Finds: [\"$\",\"$L6\",\"/images/hero/opay.jpeg\",{\"src\":\"/images/hero/opay.jpeg\",\"alt\":\"upi\",\"width\":60,\"height\":60,\"className\":\"sm:w-[70px] w-[60px]\"}]
        pat2 = r'\[\\"\\$\\",\\"([^\\"]+)\\",\\"/images/hero/opay\.jpeg\\",\{\\"src\\":\\"/images/hero/opay\.jpeg\\",\\"alt\\":\\"upi\\",\\"width\\":60,\\"height\\":60,\\"className\\":\\"sm:w-\[70px\] w-\[60px\]\\"\}\]'
        def repl2(m):
            t = m.group(1)
            return f'[\\"$\\",\\"{t}\\",\\"/images/opay-new.png\\",{{\\"src\\":\\"/images/opay-new.png\\",\\"alt\\":\\"opay\\",\\"width\\":60,\\"height\\":60,\\"className\\":\\"sm:w-[70px] w-[60px] object-contain\\"}}],[\\"$\\",\\"{t}\\",\\"/images/flutter-new.png\\",{{\\"src\\":\\"/images/flutter-new.png\\",\\"alt\\":\\"flutterwave\\",\\"width\\":60,\\"height\\":60,\\"className\\":\\"sm:w-[70px] w-[60px] object-contain\\"}}]'
        c = re.sub(pat2, repl2, c)
        
        if c != orig:
            with open(fp, 'w', encoding='utf-8') as f:
                f.write(c)
            print(f"Updated {fp}")

    except Exception as e:
        print(f"Error {fp}: {e}")

print("Done.")
