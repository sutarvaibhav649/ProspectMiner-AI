import puppeteer from 'puppeteer-extra';
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import dotenv from 'dotenv';
dotenv.config({
    path: "./.env"
});

puppeteer.use(StealthPlugin());

export const launchBrowser = async () => {
    return await puppeteer.launch({
        headless: true,
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || null,
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
            "--disable-gpu"
        ]
    });
};