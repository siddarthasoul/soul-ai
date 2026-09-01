import { Router } from "express";

import chatRoutes from "./routes/chat.routes.js";

const router = Router();

router.use("/", chatRoutes);

export default router;