import {
    Router,
    type Request,
    type Response,
} from "express";

import healthService from "./health.service.js";
import llmService from "../../../services/chat-service/src/services/llm.service.js";

const router =
    Router();

router.get(
    "/health",
    async (
        _req: Request,
        res: Response
    ) => {

        const health =
            await healthService.check(
                () =>
                    llmService.healthCheck()
            );

        const statusCode =
            health.status === "ok"
                ? 200
                : 503;

        return res
            .status(statusCode)
            .json(health);
    }
);

export default router;