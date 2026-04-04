import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page(viewport={"width": 1280, "height": 900})
        await page.goto("http://localhost:3000")
        
        # Immediate screenshot of the hero section for Trustpilot and Flutterwave validation
        p1 = '/Users/david/.gemini/antigravity/brain/634c86c1-b086-4e56-b56d-2fd5748ff347/hero_trustpilot_check.png'
        await page.screenshot(path=p1)
        print(f"Hero Screenshot: {p1}")
        
        # Scroll to the "Why Nigerian Traders Choose Noble Funded" grid
        await page.evaluate("window.scrollTo(0, 4800)")
        await asyncio.sleep(2)
        
        p2 = '/Users/david/.gemini/antigravity/brain/634c86c1-b086-4e56-b56d-2fd5748ff347/grid_updated.png'
        await page.screenshot(path=p2)
        print(f"Grid Screenshot: {p2}")
        
        await browser.close()

asyncio.run(main())
