import puppeteer from 'puppeteer-extra';
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import dotenv from 'dotenv';
dotenv.config({
    path: "./.env"
});

puppeteer.use(StealthPlugin());

export const launchBrowser = async () => {
    const executablePath = process.env.PUPPETEER_EXECUTABLE_PATH || 
        '/opt/render/project/src/.cache/puppeteer/chrome/linux-146.0.7680.153/chrome-linux64/chrome';
    
    return await puppeteer.launch({
        headless: true,
        executablePath,
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
            "--disable-gpu"
        ]
    });
};