import puppeteer from 'puppeteer-extra';
import StealthPlugin from "puppeteer-extra-plugin-stealth";

puppeteer.use(StealthPlugin());

export const launchBrowser = async () => {
    return await puppeteer.launch({
        headless: false,
        executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", 
        args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });
};