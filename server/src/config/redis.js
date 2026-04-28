import { Redis } from 'ioredis';

export const redisConnection = new Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest: null,
    tls: {} // required for Upstash's rediss:// (TLS) URL
});

redisConnection.on("connect", () => {
    console.log("Redis Connected");
});