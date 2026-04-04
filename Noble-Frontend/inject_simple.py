import glob
import re

interceptor_code = """
    // Map the unique Challenge Fee shown above the button to the correct plan
    var PRICE_TO_PLAN_MAP = {
        '\\u20a610,000': 'ngn-200k', '\\u20a619,000': 'ngn-400k', '\\u20a629,000': 'ngn-600k',
        '\\u20a639,000': 'ngn-800k', '\\u20a654,000': 'ngn-1m', '\\u20a6190,000': 'ngn-3m',
        '$29.99': 'usd-5k', '$59.99': 'usd-10k', '$134.99': 'usd-25k',
        '$219.99': 'usd-50k', '$379.99': 'usd-100k', '$749.99': 'usd-200k'
    };

    function getPlanFromPriceCard(cardEl) {
        var text = cardEl ? (cardEl.innerText || cardEl.textContent || '') : '';
        var keys = Object.keys(PRICE_TO_PLAN_MAP);
        for (var i = 0; i < keys.length; i++) {
            if (text.indexOf(keys[i]) !== -1) return PRICE_TO_PLAN_MAP[keys[i]];
        }
        return null;
    }

    function setupGlobalCheckoutInterceptor() {
        if (window._nobleCheckoutInterceptorActive) return;
        window._nobleCheckoutInterceptorActive = true;

        window.addEventListener('click', function(e) {
            var target = e.target;
            var linkNode = null;
            while (target && target !== document) {
                if ((target.tagName === 'A' || target.tagName === 'BUTTON') && 
                    (target.textContent || target.innerText || '').trim().toLowerCase().indexOf('get funded') !== -1 &&
                    (target.textContent || target.innerText || '').trim().toLowerCase().indexOf('get funded now') === -1) {
                    linkNode = target;
                    break;
                }
                target = target.parentNode;
            }
            if (!linkNode) return;

            e.preventDefault();
            e.stopPropagation();

            var node = linkNode;
            var plan = null;
            for (var i = 0; i < 7; i++) {
                if (!node || !node.parentElement) break;
                node = node.parentElement;
                plan = getPlanFromPriceCard(node);
                if (plan) break;
            }

            var checkoutUrl = 'https://noble-funded-checkout.vercel.app' + (plan ? '?plan=' + plan : '');
            window.open(checkoutUrl, '_blank');
        }, true);
    }
"""

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
    
    if 'setupGlobalCheckoutInterceptor' not in content:
        # Replace the first applyAll function implementation
        idx = content.find('function applyAll() {')
        if idx != -1:
            content = content[:idx] + interceptor_code + "\n" + content[idx:]
            # Then add the call
            content = content.replace('function applyAll() {', 'function applyAll() {\n        setupGlobalCheckoutInterceptor();')
            # Fix duplicate calls if there are multiple applyAll() blocks
            content = content.replace('setupGlobalCheckoutInterceptor();\n        setupGlobalCheckoutInterceptor();', 'setupGlobalCheckoutInterceptor();')
            
        if content != original:
            with open(file, 'w', encoding='utf-8') as f:
                f.write(content)
            count += 1
            print(f"Injected into {file}")

print(f"Done processing {count} files.")
