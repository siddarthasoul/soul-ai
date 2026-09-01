import redis from "../config/redis.js";
import type { RedisClientType } from "redis";

export class RedisRepository {

    private readonly client: RedisClientType;
    private readonly defaultTtl: number;

    constructor(defaultTtl = 3600) {
        this.client = redis.getClient();
        this.defaultTtl = defaultTtl;
    }

    async set(
        key: string,
        value: string,
        ttl = this.defaultTtl
    ): Promise<void> {

        await this.client.set(key, value, {
            EX: ttl,
        });
    }

    async get(
        key: string
    ): Promise<string | null> {

        return this.client.get(key);
    }

    async delete(
        key: string
    ): Promise<void> {

        await this.client.del(key);
    }

    async exists(
        key: string
    ): Promise<boolean> {

        return (await this.client.exists(key)) === 1;
    }
}

const cache = new RedisRepository();

export default cache;