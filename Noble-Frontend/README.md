# 🚀 Noble Funded — Developer Handover Guide

> ⚠️ **IMPORTANT — READ BEFORE TOUCHING ANYTHING**
> This site is deployed and live on Vercel. Every `git push` to `main` auto-deploys in ~60 seconds. Be careful.

---

## 🧠 What Is This Project?

This is the **Noble Funded website** — a **static HTML/CSS/JS site** exported from Next.js and hosted on **Vercel**, connected to the GitHub repo `Damcheck/Noble-Frontend`.

There are **TWO separate projects** you need to know about:

| Project | Folder | Live URL | GitHub |
|---|---|---|---|
| **Main frontend site** | `Damcheck/Noble-Frontend` | `https://noblefunded.co` | `https://github.com/Damcheck/Noble-Frontend` |
| **Checkout app** | Separate Next.js app | `https://checkout.noblefunded.com` | Separate repo |

---

## 📁 Folder Structure — What Each File Does

```
Noble-Frontend/
├── index.html              ← Home page (main file)
├── contact-us.html         ← Contact Us page
├── faqs.html               ← FAQ page
├── rules.html              ← Trading Rules page
├── affiliate.html          ← Referral/Affiliate page (does not exist yet, use /affiliate URL)
├── images/                 ← All images (logos, payouts, icons, ads)
│   ├── logo.svg            ← Site logo (header + footer)
│   ├── og-image.png        ← Open Graph image for social media previews
│   ├── noble-ads.webp      ← Noble Funded ad image (in Traders Success Stories)
│   ├── noble-ads-py.webp   ← Noble Funded ad image (in Traders Success Stories)
│   ├── payouts/            ← Payout certificate screenshots (1.png - 5.png)
│   ├── fast.png            ← Feature card icon
│   ├── spilt.png           ← Feature card icon
│   ├── step.png            ← Feature card icon
│   ├── news.png            ← Feature card icon
│   └── target.png          ← Feature card icon
├── documents/              ← PDF documents (Terms, Privacy, KYC, etc.)
├── sitemap.xml             ← SEO sitemap
├── robots.txt              ← SEO robots file
├── vercel.json             ← Vercel routing config
└── _next/                  ← ⛔ DO NOT TOUCH (compiled React JS/CSS)
```

---

## ✅ What To Edit vs ⛔ What To Leave Alone

### ✅ SAFE TO EDIT

| File/Folder | What It Is |
|---|---|
| `index.html` | Home page — edit text, links, prices here |
| `contact-us.html` | Contact page — has its own embedded JS |
| `faqs.html` | FAQ page |
| `rules.html` | Trading Rules page |
| `images/` | Swap or add images here |
| `documents/` | Swap PDF files here |
| `sitemap.xml` | Add new pages when you add new `.html` files |
| `vercel.json` | Update URL routing rules if you add new pages |

### ⛔ DO NOT TOUCH

| File/Folder | Why |
|---|---|
| `_next/static/` | Compiled React JS — extremely fragile. One wrong character breaks the whole site. |
| `*__rsc_*.html` files | React Server Component internal caches — ignore them |
| `global_v*.html` files | Old working drafts left as backups — do not deploy or delete |
| `index__rsc_*.html` | RSC cache files — leave alone |

> **Exception:** The `_next/static/chunks/652-8c1b25fb4aeaa8fd.js` file has already been intentionally modified (see section below). If you need to update testimonial videos or the payout carousel, that is the file — but be very careful.

---

## ✅ What Has Already Been Done — Do NOT Redo

### 🎨 Design & Branding
- [x] Full color rebrand (`#002B36`, `#14655B`, `#A7FFEB`)
- [x] Logo replaced in header and footer on all pages
- [x] Hero section with background video, animated ticker, and statistics
- [x] Pricing/Challenge cards with Naira (₦) + Dollar ($) toggle
- [x] Feature cards with custom icons (user-provided images)
- [x] Testimonials masonry grid
- [x] Earnings calculator with MUI sliders
- [x] Payout certificate scrolling carousel (bottom)
- [x] Footer with social links: Instagram, Discord, X/Twitter, YouTube, WhatsApp

### 📄 Pages
- [x] Home (`index.html`) — Fully designed
- [x] FAQ (`faqs.html`) — Updated with Noble Funded Q&As
- [x] Trading Rules (`rules.html`) — Updated
- [x] Affiliate/Referral — Fully redesigned (served from `/affiliate` route)
- [x] Contact Us (`contact-us.html`) — Fully redesigned with form + validation + success toast

### 🛒 Checkout Integration
- [x] Separate checkout app built and deployed at `checkout.noblefunded.com`
- [x] All "Get Funded" buttons on the home page deep-link to the checkout with the correct currency and account size pre-selected as URL params: `?currency=ngn&size=200000`

### 📢 Open Graph / Social Media Previews
- [x] OG image set to `images/og-image.png` (1200×630 PNG)
- [x] Full OG meta tags added to all pages: `og:image`, `og:image:width`, `og:image:height`, `og:image:type`, `twitter:image`
- [x] OG image URL uses Vercel CDN (`https://noble-frontend-lilac.vercel.app/images/og-image.png`) to work from ANY domain
- [x] Works on: WhatsApp, Facebook, Twitter/X, LinkedIn, Telegram, Discord

### 🔄 Payout Carousel (Verified Trader Stats Section)
- [x] **Two carousels** — one scrolling right-to-left (normal), one scrolling left-to-right (reverse)
- [x] Both use the same 5 payout screenshot images: `images/payouts/1.png` through `5.png`
- [x] This was built by modifying `_next/static/chunks/652-8c1b25fb4aeaa8fd.js` directly

### 🎥 Traders Success Stories Section
- [x] 8 cards in a masonry layout
- [x] **Video card 1** → YouTube Short: `https://www.youtube.com/embed/mroO7lO2Jow`
- [x] **Video card 2** → Noble Funded ad image: `images/noble-ads.webp`
- [x] **Video card 3** → YouTube Short: `https://www.youtube.com/embed/2vtVzb-gY58`
- [x] **Video card 4** → Noble Funded ad image: `images/noble-ads-py.webp`
- [x] Text cards (Chinedu O., Amina B., Ngozi E., Tunde A.) are unchanged
- [x] The React render logic was updated to support `imageSrc` in addition to `videoSrc`

### ⚡ Performance Optimisation
- [x] Payout images converted from PNG to WebP
- [x] `logo.svg` optimized (was 711KB, reduced significantly)
- [x] `lastsection.webp` and `sectiob3.png` compressed
- [x] Massive unused Next.js JSON payloads stripped from HTML pages

### 🔍 SEO
- [x] `sitemap.xml` created
- [x] `robots.txt` created
- [x] Primary meta tags (title, description, keywords, theme-color) on all pages
- [x] Open Graph + Twitter Card tags on all pages
- [x] Canonical URLs on all pages
- [x] LocalBusiness/Organization Schema Markup (JSON-LD) on `index.html`
- [x] Semantic `alt` attributes on key images

### 🔒 Next.js Hydration Fix
- [x] A `MutationObserver` script injected into `index.html` to prevent Next.js from replacing the Traders Success Stories cards with "404: NOT_FOUND" errors
- [x] The script specifically targets only the masonry grid children — it does **not** affect the carousels or any other section

---

## 🔧 What Still Needs To Be Done

These are open tasks for the developer:

### 1. Wire Up the Contact Form
The form in `contact-us.html` currently shows a success toast but uses `mailto:` as a fallback. It does **not** automatically send emails to your inbox.

**Recommended service: [Formspree](https://formspree.io) (free tier available)**

Steps:
1. Go to [formspree.io](https://formspree.io) and create an account
2. Create a new form → enter your email (e.g. `support@noblefunded.com`)
3. Copy your Form ID (looks like `https://formspree.io/f/abcdefgh`)
4. Open `contact-us.html`, find this line:
```javascript
var mailto = 'mailto:support@noblefunded.com'
```
5. Replace the `setTimeout` block that builds the mailto link with:
```javascript
fetch('https://formspree.io/f/YOUR-FORM-ID', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: nameInput.value,
    email: emailInput.value,
    subject: subjectInput.value,
    message: msgInput.value
  })
})
.then(function() {
  btn.classList.remove('loading');
  btn.textContent = origText;
  form.reset();
  var toast = document.getElementById('contact-success-toast');
  if (toast) {
    toast.classList.add('show');
    setTimeout(function() { toast.classList.remove('show'); }, 4500);
  }
})
.catch(function() {
  btn.classList.remove('loading');
  btn.textContent = origText;
  alert('Something went wrong. Please email us directly at support@noblefunded.com');
});
```

### 2. Fix Mobile Hamburger Menu (contact-us.html)
The hamburger menu icon shows on mobile but does not open a nav panel. The Next.js hydration blocker in `contact-us.html` prevents the original React JS from running the menu toggle.

**Fix:** Add a simple vanilla JS toggle below the hydration blocker script:
```javascript
document.addEventListener('DOMContentLoaded', function() {
  var hamburger = document.querySelector('[data-mobile-menu-toggle]');
  var mobileMenu = document.querySelector('[data-mobile-menu]');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function() {
      mobileMenu.style.display = mobileMenu.style.display === 'none' ? 'block' : 'none';
    });
  }
});
```

> Note: `index.html` and other pages have the hamburger menu working correctly as they rely on the Next.js runtime. Only `contact-us.html` has this issue because it uses a hydration blocker.

### 3. Link the Sign Up Button
Currently the "Sign Up" button links to the same URL as "Log In" (`https://dashboard.noblefunded.com`).

To update: Search all HTML files for `injected-signup` to find where it is injected and set the correct registration URL.

### 4. Fix Mobile Horizontal Overflow (contact-us.html)
The contact page has a horizontal scroll/shake on mobile. This is a CSS overflow issue.

**Fix:** Add to the contact page style block:
```css
body, html { overflow-x: hidden; max-width: 100vw; }
```

### 5. Add Analytics
Open `index.html` and paste your tracking snippets just before `</head>`:
- **Google Analytics**: Get from analytics.google.com
- **Facebook Pixel**: Get from Meta Business Suite → Events Manager
- **Hotjar / Microsoft Clarity**: Optional session recording tools

---

## 🎥 How To Update the Testimonial Videos / Images

The **Traders Success Stories** section is controlled by the data array in:

```
_next/static/chunks/652-8c1b25fb4aeaa8fd.js
```

Search for `mroO7lO2Jow` to find the start of the array. Each entry is either:
- A **video card**: `{videoSrc: "https://www.youtube.com/embed/VIDEO_ID", title: "...", name: "...", position: ""}`
- An **image card**: `{imageSrc: "/images/your-image.webp", title: "...", name: "...", position: ""}`
- A **text card**: `{title: "...", desc: "...", name: "...", position: "..."}`

> ⚠️ This is minified JS — edit with extreme care. Test locally before pushing.

To embed a **YouTube Short** use the same embed format: `https://www.youtube.com/embed/SHORT_VIDEO_ID`

---

## 🔄 How To Update the Payout Carousel Images

The carousel images are in `images/payouts/` and named `1.png` through `5.png`.

To swap them: simply replace those files with your new screenshots (keep the same filenames).

To add more: open `_next/static/chunks/652-8c1b25fb4aeaa8fd.js`, search for `"/images/payouts/1.png"` and add your new image paths to the array.

---

## 🖼️ How To Update the Open Graph (Social Share) Image

To change the image that appears when the site is shared on WhatsApp, Facebook, LinkedIn, etc.:

1. Prepare your new image — **must be PNG, 1200×630 pixels**
2. Name it `og-image.png`
3. Replace `images/og-image.png` with your new file
4. Push to GitHub

> The OG image URL is already hardcoded in all HTML pages. As long as you keep the same filename, no HTML changes are needed.

---

## 🛒 The Checkout App — Separate Project

The checkout at `checkout.noblefunded.com` is a **completely separate Next.js app** in its own GitHub repo and Vercel project.

### How it works:
- The home page "Get Funded" buttons link to the checkout with URL params:
  `https://checkout.noblefunded.com?currency=ngn&size=200000`
- The checkout reads `currency` and `size` from the URL and pre-selects the correct account
- Supported currencies: `ngn` (Naira) and `usd` (Dollar)
- Supported sizes match the pricing section values

### If you need to change checkout logic:
1. Open the checkout repo (separate from this one)
2. Edit `product-checkout.tsx` — that's the main checkout page component
3. URL param reading logic is at the top of that component in a `useEffect`
4. Deploy by pushing to the checkout repo's `main` branch

### If the "Get Funded" button URLs need updating:
Open `index.html`, search for `checkout.noblefunded.com` to find all the deep-links and update the `size` or `currency` values.

---

## 💬 How To Change Text Content

Most text is directly in the `.html` files. Open the file in VSCode, use **Ctrl+F** to find and replace.

| What to change | Search for |
|---|---|
| Support email | `support@noblefunded.com` |
| WhatsApp number | `2349070552755` |
| Promo banner text | `NOBLE25` |
| Company name | `Noble Funded Ltd` |
| Discord link | `discord.gg/ScpkyxPec9` |
| Telegram handle | `@noblefunded` |
| Twitter/X handle | `x.com/noblefunded` |
| Dashboard/login URL | `dashboard.noblefunded.com` |

---

## 📦 How To Deploy Changes

```bash
# 1. Stage your changes
git add .

# 2. Commit with a description
git commit -m "what you changed"

# 3. Push — Vercel auto-deploys in ~60 seconds
git push origin main
```

Test locally first with:
```bash
python3 -m http.server 3000
# Then open http://localhost:3000/index.html
```

---

## ⚠️ Critical Rules — Do Not Break These

1. **Never freely edit `_next/static/`** — the only files intentionally modified there are `652-8c1b25fb4aeaa8fd.js`. Everything else is completely off-limits.

2. **The `contact-us.html` hydration blocker** — there is a script at the very top of `<body>` that prevents Next.js from overwriting the new contact page design. **Do NOT delete it.**

3. **The MutationObserver script in `index.html`** — injected just before `</body>`. It prevents "404: NOT_FOUND" from appearing in the Traders Success Stories cards. **Do NOT delete it.**

4. **The `__rsc_*.html` files** — these are internal Next.js cache files. Vercel uses them for routing. Do not delete or edit.

5. **Always commit before making risky changes** — emergency rollback:
```bash
git revert HEAD         # undo the last commit
git checkout -- file.html  # undo changes to one file
```

---

## 🌐 Useful Links

| Link | What It Is |
|---|---|
| [https://noblefunded.co](https://noblefunded.co) | Primary live domain |
| [https://noble-frontend-lilac.vercel.app](https://noble-frontend-lilac.vercel.app) | Vercel preview URL (also live) |
| [https://dashboard.noblefunded.com](https://dashboard.noblefunded.com) | Trader dashboard (external) |
| [https://checkout.noblefunded.com](https://checkout.noblefunded.com) | Checkout app |
| [https://github.com/Damcheck/Noble-Frontend](https://github.com/Damcheck/Noble-Frontend) | This repo |
| [https://formspree.io](https://formspree.io) | Recommended contact form backend |
| [https://metatags.io](https://metatags.io) | Test OG/social share preview |

---

## 🆘 If Something Breaks

1. Check what you changed: `git diff`
2. See recent commits: `git log --oneline -10`
3. Undo a specific file: `git checkout -- filename.html`
4. Undo last commit (but keep changes): `git reset HEAD~1`
5. Full revert to last working state: `git revert HEAD`

---

*Last updated: March 2026 | Noble Funded Frontend + Checkout Documentation*
