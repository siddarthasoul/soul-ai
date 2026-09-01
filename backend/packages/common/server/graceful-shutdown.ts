import type { Server as HttpServer } from "node:http";

import logger from "../utils/logger.js";

import {
    disconnectInfrastructure,
} from "../config/connections.js";

import {
    SocketService,
} from "../socket/socket.service.js";

let shuttingDown = false;

export function registerGracefulShutdown(
    httpServer: HttpServer
): void {

    const shutdown = async (
        signal: string
    ): Promise<void> => {

        if (shuttingDown) {
            logger.warn(
                "Shutdown already in progress"
            );
            return;
        }

        shuttingDown = true;

        logger.info(
            `${signal} received. Starting graceful shutdown...`
        );

        /*
         * 1. Stop accepting Socket.IO connections
         */
        try {

            SocketService
                .getIO()
                .close();

            logger.info(
                "Socket.IO closed"
            );

        } catch (error) {

            logger.error(
                "Socket.IO shutdown error",
                error
            );

        }

        /*
         * 2. Stop accepting HTTP requests
         */
        try {

            if (httpServer.listening) {

                await new Promise<void>(
                    (resolve) => {

                        httpServer.close(
                            (error) => {

                                if (error) {

                                    logger.error(
                                        "HTTP server shutdown error",
                                        error
                                    );

                                } else {

                                    logger.info(
                                        "HTTP server closed"
                                    );

                                }

                                resolve();

                            }
                        );

                    }
                );

            } else {

                logger.info(
                    "HTTP server was not listening"
                );

            }

        } catch (error) {

            logger.error(
                "HTTP server shutdown error",
                error
            );
        }

        /*
         * 3. Disconnect infrastructure
         */
        try {

            logger.info(
                "Starting infrastructure shutdown..."
            );

            await disconnectInfrastructure();

            logger.info(
                "Infrastructure disconnected"
            );

        } catch (error) {

            logger.error(
                "Infrastructure shutdown error",
                error
            );
        }

        logger.info(
            "Graceful shutdown completed"
        );

        process.exitCode = 0;

    };

    process.once(
        "SIGTERM",
        () => {
            void shutdown("SIGTERM");
        }
    );

    process.once(
        "SIGINT",
        () => {
            void shutdown("SIGINT");
        }
    );
}