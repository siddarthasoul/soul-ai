import {
    createClient,
    type RedisClientType,
} from "redis";

import env from "./env.js";

import logger from "../utils/logger.js";

class Redis {

    private client: RedisClientType;

    constructor() {

        this.client = createClient({

            username:
                env.redis.username,

            password:
                env.redis.password,

            socket: {

                host: env.redis.host,

                port: env.redis.port,

                reconnectStrategy: (
                    retries
                ) => {

                    if (retries > 10) {

                        logger.error(
                            `Redis reconnection failed after ${retries} attempts. Stopping retries.`
                        );

                        return new Error(
                            "Redis reconnection failed"
                        );
                    }

                    const delay =
                        Math.min(
                            retries * 500,
                            5000
                        );

                    logger.warn(
                        `Redis reconnecting in ${delay}ms... (Attempt ${retries})`
                    );

                    return delay;
                },
            },

            database:
                env.redis.db,
        });

        this.registerEvents();
    }

    private registerEvents(): void {

        this.client.on(
            "connect",
            () => {

                logger.info(
                    "Redis establishing connection stream..."
                );
            }
        );

        this.client.on(
            "ready",
            () => {

                logger.info(
                    "Redis connected and ready to use"
                );
            }
        );

        this.client.on(
            "reconnecting",
            () => {

                logger.warn(
                    "Redis socket is attempting reconnection..."
                );
            }
        );

        this.client.on(
            "end",
            () => {

                logger.warn(
                    "Redis client connection has ended"
                );
            }
        );

        this.client.on(
            "error",
            (error) => {

                logger.error(
                    "Redis runtime error occurred",
                    error
                );
            }
        );
    }

    public async connect(): Promise<void> {

        if (!this.client.isOpen) {

            await this.client.connect();
        }
    }

    public async disconnect(): Promise<void> {
        if (!this.client.isOpen) {
            logger.info(
                "Redis already disconnected"
            );
            return;
        }

        logger.info(
            "Redis disconnect requested"
        );

        this.client.destroy();

        logger.info(
            "Redis client disconnected"
        );
    }

    public async ping(): Promise<string> {

        if (!this.client.isOpen) {

            throw new Error(
                "Redis client is not connected"
            );
        }

        return this.client.ping();
    }

    public getClient(): RedisClientType {

        return this.client;
    }
}

const redis =
    new Redis();

export default redis;