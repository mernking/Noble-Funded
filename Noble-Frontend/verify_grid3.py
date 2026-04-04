import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page(viewport={"width": 1280, "height": 1000})
        await page.goto("http://localhost:3000")
        
        # Hard wait for react to render
        await page.wait_for_timeout(3000)
        
        p1 = '/Users/david/.gemini/antigravity/brain/634c86c1-b086-4e56-b56d-2fd5748ff347/final_hero_verification.png'
        await page.screenshot(path=p1)
        print(f"Hero Screenshot: {p1}")
        
        # Scroll down to the grid heading
        await page.evaluate("window.scrollTo(0, 4800)")
        await page.wait_for_timeout(2000)
        
        p2 = '/Users/david/.gemini/antigravity/brain/634c86c1-b086-4e56-b56d-2fd5748ff347/final_grid_verification.png'
        await page.screenshot(path=p2)
        print(f"Grid Screenshot: {p2}")
        
        await browser.close()

asyncio.run(main())
