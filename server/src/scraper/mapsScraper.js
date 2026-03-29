export const scrapeGoogleMaps = async (page, query, limit) => {
    const searchUrl = `https://www.google.com/maps/search/${encodeURIComponent(query)}`;

    await page.goto(searchUrl, { waitUntil: "networkidle2" });

    // wait for listings panel
    await page.waitForSelector('div[role="feed"]');

    const results = [];

    let previousHeight;

    while (results.length < limit) {
        const newData = await page.evaluate(() => {
            const items = document.querySelectorAll('div[role="article"]');

            return Array.from(items).map(item => {

                // 🔥 Better name extraction
                const name =
                    item.querySelector('div.qBF1Pd')?.innerText ||
                    item.querySelector('div.fontHeadlineSmall')?.innerText ||
                    item.querySelector('span')?.innerText;

                const rating =
                    item.querySelector('span.MW4etd')?.innerText ||
                    null;

                return { name, rating };
            });
        });

        results.push(...newData);

        // scroll
        previousHeight = await page.evaluate(
            'document.querySelector("div[role=feed]").scrollHeight'
        );

        await page.evaluate(() => {
            const feed = document.querySelector("div[role=feed]");
            feed.scrollBy(0, 1000);
        });

        await new Promise(res => setTimeout(res, 2000));

        const newHeight = await page.evaluate(
            'document.querySelector("div[role=feed]").scrollHeight'
        );

        if (newHeight === previousHeight) break;
    }

    return results.slice(0, limit);
};