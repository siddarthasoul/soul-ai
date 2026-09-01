import dns from "node:dns";

dns.setDefaultResultOrder("ipv4first");
import {
    createApp,
    createHttpServer,
} from "./packages/common/server/http-server.js";

import env from "./packages/common/config/env.js";
import logger from "./packages/common/utils/logger.js";

import {
    connectInfrastructure,
} from "./packages/common/config/connections.js";

import {
    SocketService,
} from "./packages/common/socket/socket.service.js";

import {
    registerGracefulShutdown,
} from "./packages/common/server/graceful-shutdown.js";


const app = createApp();

const httpServer = createHttpServer(app);


async function startServer(): Promise<void> {

    try {

        // 1. Connect databases/services
        await connectInfrastructure();

        // 2. Initialize Socket.IO
        SocketService.initialize(
            httpServer
        );

        // 3. Start HTTP server
        await new Promise<void>(
            (resolve, reject) => {

                httpServer.once(
                    "error",
                    reject
                );

                httpServer.listen(
                    env.server.port,
                    env.server.host,
                    () => {

                        logger.info(
                            `Server running on ${env.server.host}:${env.server.port}`
                        );

                        resolve();
                    }
                );
            }
        );

        // 4. Register shutdown ONLY
        // after successful startup
        registerGracefulShutdown(
            httpServer
        );

    } catch (error) {

        logger.error(
            "Failed to start server",
            error
        );

        process.exit(1);
    }
}

void startServer();