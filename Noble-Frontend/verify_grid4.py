import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page(viewport={"width": 1280, "height": 900})
        await page.goto("http://localhost:3000")
        
        # Hard wait for react to render
        await page.wait_for_timeout(3000)
        
        # Scroll exactly to the Grid
        loc = page.locator("text=Why Nigerian Traders Choose")
        await loc.scroll_into_view_if_needed()
        await page.wait_for_timeout(1000)
        
        p2 = '/Users/david/.gemini/antigravity/brain/634c86c1-b086-4e56-b56d-2fd5748ff347/final_grid_verification.png'
        await page.screenshot(path=p2)
        print(f"Grid Screenshot: {p2}")
        
        await browser.close()

asyncio.run(main())
