import env from "./env.js";
import mongoose from "mongoose";
import logger from "../utils/logger.js";

class Database {
    private isConnected = false;

    public async connect(): Promise<void> {
        if (this.isConnected) {
            logger.warn(
                "MongoDB connection already established."
            );
            return;
        }

        try {
            mongoose.connection.on(
                "connected",
                () => {
                    this.isConnected = true;

                    logger.info(
                        "MongoDB connection event: Connected successfully"
                    );
                }
            );

            mongoose.connection.on(
                "error",
                (err) => {
                    logger.error(
                        "MongoDB connection event error",
                        err
                    );
                }
            );

            mongoose.connection.on(
                "disconnected",
                () => {
                    this.isConnected = false;

                    logger.warn(
                        "MongoDB connection event: Disconnected from database"
                    );
                }
            );

            await mongoose.connect(
                env.mongo.uri,
                {
                    dbName: env.mongo.database,
                    autoIndex:
                        env.app.env !== "production",
                    maxPoolSize: 10,
                    minPoolSize: 2,
                    socketTimeoutMS: 45000,
                    serverSelectionTimeoutMS: 5000,
                }
            );

        } catch (error) {
            logger.error(
                "Failed to execute initial MongoDB connection",
                error
            );

            process.exit(1);
        }
    }

    public isHealthy(): boolean {
        return (
            this.isConnected &&
            mongoose.connection.readyState === 1
        );
    }

    public async disconnect(): Promise<void> {

        try {

            if (
                mongoose.connection.readyState === 0
            ) {
                logger.info(
                    "MongoDB already disconnected"
                );
                return;
            }

            await mongoose.disconnect();

            this.isConnected = false;

            logger.info(
                "MongoDB disconnected successfully"
            );

        } catch (error) {

            logger.error(
                "Failed to cleanly disconnect MongoDB",
                error
            );
        }
    }
}

const database = new Database();
export default database;