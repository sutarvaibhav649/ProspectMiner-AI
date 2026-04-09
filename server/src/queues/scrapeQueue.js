import { Queue } from 'bullmq';
import { redisConnection } from '../config/redis.js';

export const scrapeQueue = new Queue(
    "scrapeQueue",
    {
        connection:redisConnection
    }
)