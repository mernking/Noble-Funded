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

            // Walk up max 7 levels to find the price box
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
for file in glob.glob('**/*.html', recursive=True):
    if "node_modules" in file or ".git" in file:
        continue
    
    try:
        with open(file, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"Skipping {file}: {e}")
        continue

    original = content
    
    # Check if we already injected it
    if 'setupGlobalCheckoutInterceptor' not in content:
        # 1. Insert functions just before function applyAll() {
        content = re.sub(
            r'([ \t]*)function applyAll\(\)\s*\{', 
            lambda m: interceptor_code + "\n" + m.group(0),
            content,
            count=0 # Replace all matches (often 2 in a file because it's duplicated in some templates)
        )
        
        # 2. Add the call to it inside applyAll: Look for `nukeIntercom();` or `applyHeaderFooterFixes();` inside applyAll to hook onto.
        if 'applyHeaderFooterFixes();' in content:
             content = re.sub(
                 r'([ \t]*)applyHeaderFooterFixes\(\);',
                 lambda m: m.group(0) + "\n" + m.group(1) + "setupGlobalCheckoutInterceptor();",
                 content
             )
        else:
             # Fallback if applyHeaderFooterFixes doesn't exist, inject right after applyAll() {
             content = re.sub(
                 r'([ \t]*)function applyAll\(\)\s*\{',
                 lambda m: m.group(0) + "\n" + m.group(1) + "    setupGlobalCheckoutInterceptor();",
                 content
             )

        # Cleanup previously failed attempts like patchGetFundedButtons
        content = content.replace('patchGetFundedButtons();', '')
        
        if content != original:
            with open(file, 'w', encoding='utf-8') as f:
                f.write(content)
            count += 1
            print(f"Injected into {file}")

print(f"Done processing {count} files.")
