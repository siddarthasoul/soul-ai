import nodemailer from "nodemailer";
import logger from "../utils/logger.js"
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
        rejectUnauthorized: env.app.env === "production" ? true : false,
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