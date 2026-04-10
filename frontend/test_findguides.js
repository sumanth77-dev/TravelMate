const puppeteer = require('puppeteer');

(async () => {
    try {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        
        let errors = [];
        page.on('console', msg => {
            if (msg.type() === 'error') errors.push('Console Error: ' + msg.text());
        });
        page.on('pageerror', err => errors.push('Page Error: ' + err.message));
        
        await page.goto('http://localhost:5000/findguides.html');
        // Let it render
        await page.waitForTimeout(2000);
        
        // click a guide
        await page.click('.dest-card');
        await page.waitForTimeout(1000);
        
        console.log("Collected errors:", errors.length > 0 ? errors : "No errors");
        await browser.close();
    } catch (e) {
        console.error(e);
    }
})();
