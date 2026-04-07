import { Redis } from "@upstash/redis";
import crypto from 'crypto';

const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

const redis = redisUrl && redisToken ? new Redis({ url: redisUrl, token: redisToken }) : null;

export function generateCacheKey(resume: string, jd: string, lang: string, strength: string): string {
    const hash = crypto.createHash('sha256');
    hash.update(`${resume}|${jd}|${lang}|${strength}`);
    return `tailor:v1:${hash.digest('hex')}`;
}

export async function getCachedTailoring(key: string): Promise<any | null> {
    if (!redis) return null;
    try {
        return await redis.get(key);
    } catch (e) {
        console.warn('[Cache] Redis get failed', e);
        return null;
    }
}

export async function setCachedTailoring(key: string, data: any): Promise<void> {
    if (!redis) return;
    try {
        // Cache for 24 hours (86400 seconds)
        await redis.set(key, data, { ex: 86400 });
    } catch (e) {
        console.warn('[Cache] Redis set failed', e);
    }
}
