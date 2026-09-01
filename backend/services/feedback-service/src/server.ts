import express from "express";

import feedbackRoutes from "./routes/feedback.routes.js";

const app = express();

app.use(
    express.json()
);

app.use(
    "/",
    feedbackRoutes
);

export default app;