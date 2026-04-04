import { writeFileSync, mkdirSync } from "fs";
mkdirSync("/home/user/app", { recursive: true });
const css = `@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --surface: #001716;
  --surface-low: #00201e;
  --surface-high: #0b2f2d;
  --surface-bright: #1d3f3c;
  --primary: #00ffcc;
  --primary-dim: #00d4a8;
  --primary-border: rgba(0,255,204,0.2);
  --secondary: #ffbc7c;
  --on-surface: #fdfffc;
  --on-surface-variant: #b9cbc2;
  --danger: #ff4444;
  --warning: #f59e0b;
  --success: #10b981;
}
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body { height: 100%; overflow: hidden; }
body { background-color: var(--surface); color: var(--on-surface); font-family: 'Inter', sans-serif; -webkit-font-smoothing: antialiased; }
::-webkit-scrollbar { width: 4px; height: 4px; }
::-webkit-scrollbar-track { background: var(--surface-low); }
::-webkit-scrollbar-thumb { background: var(--surface-bright); border-radius: 2px; }
.glass-card { background: rgba(11,47,45,0.4); backdrop-filter: blur(20px); border: 1px solid var(--primary-border); box-shadow: 0 20px 40px rgba(0,255,204,0.04), inset 0 1px 0 rgba(0,255,204,0.1); }
.chip-active { background: rgba(0,255,204,0.1); color: var(--primary); border: 1px solid rgba(0,255,204,0.3); }
.chip-warning { background: rgba(245,158,11,0.1); color: var(--secondary); border: 1px solid rgba(245,158,11,0.3); }
.chip-danger { background: rgba(255,68,68,0.1); color: #ff6b6b; border: 1px solid rgba(255,68,68,0.3); }
.chip-neutral { background: rgba(185,203,194,0.1); color: var(--on-surface-variant); border: 1px solid rgba(185,203,194,0.2); }
.font-display { font-family: 'Space Grotesk', sans-serif; }
.pulse-dot { animation: pulse 2s cubic-bezier(0.4,0,0.6,1) infinite; }
@keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
.blink { animation: blink 1s step-end infinite; }
@keyframes blink { 0%,100% { opacity:1; } 50% { opacity:0; } }
.sidebar-item { transition: all 0.15s ease; }
.page-fade { animation: pageFade 0.2s ease-in-out; }
@keyframes pageFade { from { opacity:0; transform:translateY(4px); } to { opacity:1; transform:translateY(0); } }
.table-row-hover:hover { background: rgba(0,255,204,0.04); cursor: pointer; }
.input-field:focus { outline: none; border-color: rgba(0,255,204,0.5) !important; box-shadow: 0 0 0 1px rgba(0,255,204,0.2); }
.btn-primary:hover { box-shadow: 0 0 20px rgba(0,255,204,0.3); }
`;
writeFileSync("/home/user/app/globals.css", css);
console.log("app/globals.css written");
