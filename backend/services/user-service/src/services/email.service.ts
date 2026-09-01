import brevo from "../../../../packages/common/config/email.js";
import env from "../../../../packages/common/config/env.js";
import logger from "../../../../packages/common/utils/logger.js";

export class EmailService {
    async sendVerificationOtp(
        to: string,
        otp: string
    ): Promise<void> {
        logger.info("Mail: sending verification OTP", {
            to,
            from: env.mail.from,
        });

        try {
            const result =
                await brevo.transactionalEmails.sendTransacEmail({
                    sender: {
                        name: env.mail.fromName,
                        email: env.mail.from,
                    },

                    to: [
                        {
                            email: to,
                        },
                    ],

                    subject:
                        "Verify your Soul AI account",

                    textContent: `
Your Soul AI verification OTP is: ${otp}

This OTP will expire in 5 minutes.

If you did not request this verification, please ignore this email.
                    `.trim(),

                    htmlContent: `
                        <div>
                            <h2>Verify your Soul AI account</h2>

                            <p>Your Soul AI verification OTP is:</p>

                            <h1>${otp}</h1>

                            <p>
                                This OTP will expire in
                                <strong>5 minutes</strong>.
                            </p>

                            <p>
                                If you did not request this verification,
                                you can safely ignore this email.
                            </p>
                        </div>
                    `.trim(),
                });

            logger.info(
                "Mail: verification OTP sent successfully",
                {
                    to,
                    result,
                }
            );
        } catch (error) {
            logger.error(
                "Mail: failed to send verification OTP",
                {
                    to,
                    error,
                }
            );

            throw error;
        }
    }
}

const emailService = new EmailService();

export default emailService;