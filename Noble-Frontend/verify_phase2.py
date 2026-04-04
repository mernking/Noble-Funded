import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page(viewport={"width": 1280, "height": 900})
        await page.goto("http://localhost:3000")
        
        # Hard wait for react to render
        await page.wait_for_timeout(3000)
        
        # 1. Hero Screenshot (No Flutterwave)
        await page.evaluate("window.scrollTo(0, 0)")
        p1 = '/Users/david/.gemini/antigravity/brain/634c86c1-b086-4e56-b56d-2fd5748ff347/final_hero_noflutter.png'
        await page.screenshot(path=p1)
        print(f"Hero Screenshot: {p1}")
        
        # 2. Earnings Calculator & Stats
        calc_loc = page.locator("text=Calculate Earnings")
        if await calc_loc.count() > 0:
            await calc_loc.scroll_into_view_if_needed()
            await page.wait_for_timeout(1000)
            p2 = '/Users/david/.gemini/antigravity/brain/634c86c1-b086-4e56-b56d-2fd5748ff347/final_calculator.png'
            await page.screenshot(path=p2)
            print(f"Calculator Screenshot: {p2}")
            
        # 3. Testimonials
        test_loc = page.locator("text=Traders Success Stories")
        if await test_loc.count() > 0:
            await test_loc.scroll_into_view_if_needed()
            await page.wait_for_timeout(1000)
            p3 = '/Users/david/.gemini/antigravity/brain/634c86c1-b086-4e56-b56d-2fd5748ff347/final_testimonials.png'
            await page.screenshot(path=p3)
            print(f"Testimonials Screenshot: {p3}")
        
        await browser.close()

asyncio.run(main())
