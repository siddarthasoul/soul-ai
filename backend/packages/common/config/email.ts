import nodemailer from "nodemailer";
import logger from "../utils/logger.js"
import env from "./env.js";

// Port 465 requires secure: true (SSL/TLS). Other ports (587, 25) use STARTTLS (secure: false)
const isSecurePort = env.mail.port === 465;

const transporter = nodemailer.createTransport({
    host: env.mail.server,
    port: env.mail.port,
    secure: isSecurePort,
    auth: {
        user: env.mail.username,
        pass: env.mail.password,
    },
    // PRODUCTION SECURITY: Enforce valid SSL certificates in production
    tls: {
        rejectUnauthorized: process.env.NODE_ENV === "production" ? true : false,
    },
});

export async function verifyMail(): Promise<void> {
    try {
        await transporter.verify();
        logger.info("Mail server connected successfully");
    } catch (error) {
        logger.error("Mail server connection failed", error);
    }
}

export default transporter;