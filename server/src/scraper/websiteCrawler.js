import puppeteer from 'puppeteer-extra';

export const crawlWebsite = async (browser, url) => {
    if (!url) return null;

    let page;
    try {
        page = await browser.newPage();
        await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        );

        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });

        const rawText = await page.evaluate(() => {
        // Remove script, style, nav, footer tags — we only want main content
        const unwanted = document.querySelectorAll('script, style, nav, footer, header, noscript');
        unwanted.forEach(el => el.remove());
        return document.body?.innerText || '';
        });

        // Clean and truncate — LLM doesn't need more than ~1500 chars
        const cleaned = rawText
        .replace(/\s+/g, ' ')
        .replace(/[^\x20-\x7E\n]/g, '') // strip non-ASCII
        .trim()
        .slice(0, 1500);

        return cleaned;
    } catch (err) {
        console.log(`⚠️  Could not crawl ${url}: ${err.message}`);
        return null;
    } finally {
        if (page) await page.close();
    }
};