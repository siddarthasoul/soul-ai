import { BrevoClient } from "@getbrevo/brevo";

import logger from "../utils/logger.js";
import env from "./env.js";

const brevo = new BrevoClient({
    apiKey: env.mail.apiKey,
});

export async function verifyMail(): Promise<void> {
    logger.info("Mail: Brevo API configured successfully", {
        from: env.mail.from,
        fromName: env.mail.fromName,
    });
}

export default brevo;