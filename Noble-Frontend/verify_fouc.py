import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page(viewport={"width": 1280, "height": 900})
        await page.goto("http://localhost:3000")
        # Scroll to stats bar instantly
        await page.evaluate("window.scrollTo(0, 600)")
        # Wait a very short time (200ms) to catch the immediate render
        await asyncio.sleep(0.2)
        p1 = '/Users/david/.gemini/antigravity/brain/634c86c1-b086-4e56-b56d-2fd5748ff347/fouc_test_130.png'
        await page.screenshot(path=p1)
        print(f"FOUC Test Screenshot: {p1}")
        await browser.close()

asyncio.run(main())
