import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        
        page.on("console", lambda msg: print(f"Browser console: {msg.text}"))
        
        await page.goto("http://localhost:3000", wait_until='networkidle')
        await asyncio.sleep(2)
        print("Page loaded.")
        
        await browser.close()

asyncio.run(main())
