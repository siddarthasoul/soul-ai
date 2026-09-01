import nodemailer from "nodemailer";

import logger from "../utils/logger.js";
import env from "./env.js";

const transporter = nodemailer.createTransport({
    host: env.mail.server,
    port: env.mail.port,
    secure: env.mail.port === 465,

    auth: {
        user: env.mail.username,
        pass: env.mail.password,
    },

    requireTLS: env.mail.port === 587,

    tls: {
        rejectUnauthorized: env.app.env === "production",
    },
});

export async function verifyMail(): Promise<void> {
    logger.info("Mail: verifying SMTP connection", {
        server: env.mail.server,
        port: env.mail.port,
        secure: env.mail.port === 465,
        requireTLS: env.mail.port === 587,
        username: env.mail.username,
    });

    try {
        await transporter.verify();

        logger.info("Mail: SMTP connection verified successfully", {
            server: env.mail.server,
            port: env.mail.port,
        });
    } catch (error) {
        logger.error("Mail: SMTP connection verification failed", {
            server: env.mail.server,
            port: env.mail.port,
            error,
        });

        throw error;
    }
}


export default transporter;