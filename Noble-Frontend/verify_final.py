import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page(viewport={"width": 1280, "height": 900})
        await page.goto("http://localhost:3000")
        await page.wait_for_timeout(4000)
        
        # Hero
        p1 = '/Users/david/.gemini/antigravity/brain/634c86c1-b086-4e56-b56d-2fd5748ff347/final_hero_noflutter.png'
        await page.screenshot(path=p1)
        print(f"Hero: {p1}")
        
        # Scroll to testimonials
        loc = page.locator("text=Traders Success Stories")
        if await loc.count() > 0:
            await loc.scroll_into_view_if_needed()
            await page.wait_for_timeout(1500)
        p2 = '/Users/david/.gemini/antigravity/brain/634c86c1-b086-4e56-b56d-2fd5748ff347/final_testimonials.png'
        await page.screenshot(path=p2)
        print(f"Testimonials: {p2}")
        
        # Scroll to calculator
        loc2 = page.locator("text=80% Profit Split")
        if await loc2.count() > 0:
            await loc2.first.scroll_into_view_if_needed()
            await page.wait_for_timeout(1500)
        p3 = '/Users/david/.gemini/antigravity/brain/634c86c1-b086-4e56-b56d-2fd5748ff347/final_calculator.png'
        await page.screenshot(path=p3)
        print(f"Calculator: {p3}")
        
        # Check page title
        title = await page.title()
        print(f"Page Title: {title}")
        
        await browser.close()

asyncio.run(main())
