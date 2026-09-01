import mongoDatabase from "./mongo.database.js";
import redis from "./redis.js";
import logger from "../utils/logger.js";

export async function connectInfrastructure(): Promise<void> {
    try {
        await mongoDatabase.connect();

        logger.info(
            "MongoDB connected successfully"
        );

        await redis.connect();

        logger.info(
            "Redis connected successfully"
        );
    } catch (error) {
        logger.error(
            "Infrastructure connection failed",
            error
        );

        throw error;
    }
}

export async function disconnectInfrastructure(): Promise<void> {

    logger.info(
        "Disconnecting MongoDB..."
    );

    try {

        await mongoDatabase.disconnect();

        logger.info(
            "MongoDB disconnected successfully"
        );

    } catch (error) {

        logger.error(
            "MongoDB disconnection failed",
            error
        );

    }

    logger.info(
        "Disconnecting Redis..."
    );

    try {

        await redis.disconnect();

        logger.info(
            "Redis disconnected successfully"
        );

    } catch (error) {

        logger.error(
            "Redis disconnection failed",
            error
        );
    }
}