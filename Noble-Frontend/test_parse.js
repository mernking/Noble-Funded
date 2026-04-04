const fs = require('fs');
const html = fs.readFileSync('global_v2.html', 'utf8');
const match = html.match(/<script>([\s\S]*?)<\/script>/);
const js = match[1];
fs.writeFileSync('test_global.js', js);
