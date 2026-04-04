import bs4, re

# The FAQ and Rules pages both call window.toggleAccordion() and window.switchTab()
# but neither defines those functions. Let's inject them.

FAQ_SCRIPT = """
<script>
window.switchTab = function(tabId, btnElement) {
    document.querySelectorAll('.faq-tab-content-orig').forEach(function(el) { el.style.display = 'none'; });
    var target = document.getElementById(tabId);
    if (target) target.style.display = 'block';
    document.querySelectorAll('.faq-tab-btn-orig').forEach(function(btn) {
        btn.setAttribute('data-state', 'inactive');
        btn.style.backgroundColor = '';
        btn.style.color = '';
    });
    if (btnElement) {
        btnElement.setAttribute('data-state', 'active');
    }
};
window.toggleAccordion = function(idx) {
    var content = document.getElementById('content-faq-' + idx);
    var icon = document.getElementById('icon-faq-' + idx);
    if (!content || !icon) return;
    if (content.style.maxHeight === '0px' || content.style.maxHeight === '') {
        content.style.maxHeight = content.scrollHeight + 500 + 'px';
        icon.style.transform = 'rotate(180deg)';
    } else {
        content.style.maxHeight = '0px';
        icon.style.transform = 'rotate(0deg)';
    }
};
</script>
"""

RULES_SCRIPT = """
<script>
window.switchTabRules = function(tabId, btnElement) {
    document.querySelectorAll('.rules-tab-content-orig').forEach(function(el) { el.style.display = 'none'; });
    var target = document.getElementById(tabId);
    if (target) target.style.display = 'block';
    document.querySelectorAll('.rules-tab-btn-orig').forEach(function(btn) {
        btn.setAttribute('data-state', 'inactive');
    });
    if (btnElement) {
        btnElement.setAttribute('data-state', 'active');
    }
};
window.switchTab = window.switchTabRules;
window.toggleAccordion = function(idx) {
    var content = document.getElementById('content-faq-' + idx);
    var icon = document.getElementById('icon-faq-' + idx);
    if (!content || !icon) return;
    if (content.style.maxHeight === '0px' || content.style.maxHeight === '') {
        content.style.maxHeight = content.scrollHeight + 500 + 'px';
        icon.style.transform = 'rotate(180deg)';
    } else {
        content.style.maxHeight = '0px';
        icon.style.transform = 'rotate(0deg)';
    }
};
</script>
"""

for fname, snippet in [('faqs.html', FAQ_SCRIPT), ('rules.html', RULES_SCRIPT)]:
    with open(fname, 'r', encoding='utf-8') as f:
        html = f.read()
    
    # Remove any old copies of our injection to avoid duplicates
    if 'window.toggleAccordion = function' in html:
        print(f"{fname}: already has toggleAccordion, replacing...")
        start = html.find('<script>\nwindow.switchTab')
        if start == -1:
            start = html.find('<script>\nwindow.switchTabRules')
        if start == -1:
            start = html.find('<script>\nwindow.toggleAccordion')
        if start != -1:
            end = html.find('</script>', start) + 9
            html = html[:start] + html[end:]

    html = html.replace('</body>', snippet + '\n</body>')
    with open(fname, 'w', encoding='utf-8') as f:
        f.write(html)
    print(f"Injected accordion/tab script into {fname}")

