import express from "express";
import { createServer } from "node:http";
import type { Server as HttpServer } from "node:http";
import cors from "cors";
import rateLimit from "../middlewares/rateLimit.middleware.js";
import cookieParser from "cookie-parser";
import userService from "../../../services/user-service/src/server.js";
import chatService from "../../../services/chat-service/src/server.js";
import feedbaackServices from "../../../services/feedback-service/src/server.js"
import env from "../config/env.js";
import { errorHandler } from "../middlewares/error.middleware.js";
import healthRouter from "../server/health.routes.js";

export function createApp(): express.Express {
    const app = express();

    app.use(
        cors({
            origin: env.app.frontendUrl,
            credentials: true,
        })
    );

    app.use(
        express.json({
            limit: "1mb",
        })
    );

    app.use(
        express.urlencoded({
            extended: true,
            limit: "1mb",
        })
    );

    app.use(cookieParser());

    app.use(healthRouter);



    app.use(
        env.app.apiPrefix,
        rateLimit()
    );


    app.use(
        env.app.apiPrefix,
        userService
    );

    app.use(
        `${env.app.apiPrefix}/chat`,
        chatService
    );


    app.use(
        `${env.app.apiPrefix}/feedback`,
        feedbaackServices
    );



    app.use(errorHandler);

    return app;
}

export function createHttpServer(
    app: express.Express
): HttpServer {
    return createServer(app);
}