import express from "express";

import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";

const userService = express.Router();

userService.use(
    "/users",
    userRoutes
);

userService.use(
    "/auth",
    authRoutes
);

export default userService;