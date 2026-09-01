import nodemailer from "nodemailer";

import logger from "../utils/logger.js";
import env from "./env.js";

const transporter = nodemailer.createTransport({

    host: "192.178.158.109",
    
    port: env.mail.port,

    secure: env.mail.port === 465,
    requireTLS: env.mail.port === 587,

    auth: {
        user: env.mail.username,
        pass: env.mail.password,
    },

    tls: {
        servername: "smtp.gmail.com",
        rejectUnauthorized: env.app.env === "production",
    },

    connectionTimeout: 15_000,
    greetingTimeout: 15_000,
    socketTimeout: 20_000,
});


export async function verifyMail(): Promise<void> {
    logger.info("Mail: verifying SMTP connection", {
        server: env.mail.server,
        port: env.mail.port,
        secure: env.mail.port === 465,
        requireTLS: env.mail.port === 587,
    });

    try {
        await transporter.verify();

        logger.info("Mail: SMTP connection verified successfully");
    } catch (error) {
        logger.error("Mail: SMTP connection verification failed", {
            error,
        });

        throw error;
    }
}

export default transporter;