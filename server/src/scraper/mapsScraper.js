// src/scraper/mapsScraper.js

export const scrapeGoogleMaps = async (page, query, limit) => {
    const delay = (ms) => new Promise((res) => setTimeout(res, ms));

    const searchUrl = `https://www.google.com/maps/search/${encodeURIComponent(query)}`;

    await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    );

    await page.goto(searchUrl, { waitUntil: "networkidle2" });
    await delay(4000);

    const results = [];
    const seenNames = new Set();
    let processedIndex = 0;

    console.log(`🔍 Searching for: ${query} | Limit: ${limit}`);

    while (results.length < limit) {
        const listingCount = await page.evaluate(() => {
        const cards = document.querySelectorAll('[role="feed"] > div > div > a');
        return cards.length;
        });

        console.log(`Total listings visible: ${listingCount} | Processed: ${processedIndex}`);

        if (processedIndex < listingCount) {
        try {
            // Scroll the target card into view
            await page.evaluate((idx) => {
            const cards = document.querySelectorAll('[role="feed"] > div > div > a');
            if (cards[idx]) {
                cards[idx].scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            }, processedIndex);

            await delay(1000);

            // Click the card
            await page.evaluate((idx) => {
            const cards = document.querySelectorAll('[role="feed"] > div > div > a');
            if (cards[idx]) cards[idx].click();
            }, processedIndex);

            await delay(3500);

            // Extract data from the detail panel
            const details = await page.evaluate((searchQuery) => {
            const getText = (selectors) => {
                const list = Array.isArray(selectors) ? selectors : [selectors];
                for (const sel of list) {
                const el = document.querySelector(sel);
                if (el && el.innerText?.trim()) return el.innerText.trim();
                }
                return null;
            };

            // NAME
            const name = getText(['h1.DUwDvf', 'h1', '.fontHeadlineLarge']);

            // RATING
            let rating = null;
            let reviewCount = null;
            const ratingEl = document.querySelector('.F7nice');
            if (ratingEl) {
                const ratingText = ratingEl.innerText;
                const ratingMatch = ratingText.match(/(\d+\.?\d*)/);
                const reviewMatch = ratingText.match(/\((\d[\d,]*)\)/);
                if (ratingMatch) rating = parseFloat(ratingMatch[0]);
                if (reviewMatch) reviewCount = parseInt(reviewMatch[1].replace(',', ''));
            }
            if (!rating) {
                const ratingSpan = document.querySelector('span[aria-label*="stars"]');
                if (ratingSpan) {
                const m = ratingSpan.getAttribute('aria-label').match(/(\d+\.?\d*)/);
                if (m) rating = parseFloat(m[0]);
                }
            }

            // PHONE
            let phone = null;
            const phoneBtn = document.querySelector('button[data-item-id*="phone"]');
            if (phoneBtn) {
                phone = phoneBtn.innerText?.replace(/\s+/g, ' ').trim();
            }
            if (!phone) {
                const allBtns = document.querySelectorAll('button[aria-label*="phone" i]');
                for (const btn of allBtns) {
                const t = btn.getAttribute('aria-label') || btn.innerText || '';
                const m = t.replace(/\s+/g, '').match(/(\+?[\d]{7,15})/);
                if (m) {
                    phone = m[0];
                    break;
                }
                }
            }

            // WEBSITE
            let website = null;
            const websiteAnchor = document.querySelector('a[data-item-id="authority"]');
            if (websiteAnchor && websiteAnchor.href && !websiteAnchor.href.includes('google.com')) {
                website = websiteAnchor.href;
            }

            // ADDRESS
            let address = null;
            const addressBtn = document.querySelector(
                'button[data-item-id="address"], [data-item-id="address"], button[aria-label*="Address"]'
            );
            if (addressBtn) {
                address = addressBtn.innerText?.trim();
            }
            if (!address) {
                const candidates = document.querySelectorAll('[class*="Io6YTe"]');
                for (const el of candidates) {
                const t = el.innerText?.trim();
                if (t && t.length > 15 && /\d/.test(t)) {
                    address = t;
                    break;
                }
                }
            }

            // CATEGORY
            let category = null;
            const catEl = document.querySelector('.DkEaL, .fontBodyMedium .OKAoZd');
            if (catEl) category = catEl.innerText?.trim();

            return { name, rating, reviewCount, phone, website, address, category, query: searchQuery };
            }, query);

            // Validate and push
            if (
            details.name &&
            details.name.length > 1 &&
            details.name !== 'Results' &&
            !seenNames.has(details.name)
            ) {
            seenNames.add(details.name);
            results.push(details);
            console.log(`[${results.length}/${limit}] ${details.name}`);
            console.log(`   ${details.phone || 'N/A'} |  ${details.rating || 'N/A'} |  ${details.website || 'N/A'}`);
            } else {
            console.log(`⏭Skipping: "${details.name}" (duplicate or invalid)`);
            }

            // Close detail panel and wait for it to clear
            await page.keyboard.press('Escape');
            await page.waitForFunction(
            () => !document.querySelector('h1.DUwDvf') || document.querySelector('h1.DUwDvf')?.innerText === '',
            { timeout: 3000 }
            ).catch(() => {});
            await delay(1500);

        } catch (err) {
            console.log(`Error on index ${processedIndex}: ${err.message}`);
        }

        processedIndex++;

        } else {
        // Scroll feed for more results
        console.log('⬇Scrolling feed for more results...');

        const endOfResults = await page.evaluate(() => {
            const feed = document.querySelector('[role="feed"]');
            if (!feed) return false;
            feed.scrollTop += 1500;
            const endMsg = document.querySelector('.HlvSq');
            return !!endMsg;
        });

        await delay(2500);

        if (endOfResults) {
            console.log('Reached end of results.');
            break;
        }
        }
    }

    console.log(`\nFinal: ${results.length} businesses scraped`);
    return results;
};