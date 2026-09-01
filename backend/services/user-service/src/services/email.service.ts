import transporter from "../../../../packages/common/config/email.js";
import env from "../../../../packages/common/config/env.js";

export class EmailService {

    async sendVerificationOtp(
        to: string,
        otp: string
    ): Promise<void> {

        await transporter.sendMail({
            from: `"Soul AI" <${env.mail.username}>`,
            to,
            subject: "Verify your Soul AI account",

            text: `
Your Soul AI verification OTP is: ${otp}

This OTP will expire in 5 minutes.

If you did not request this verification, please ignore this email.
            `.trim(),

            html: `
                <div>
                    <h2>Verify your Soul AI account</h2>

                    <p>Your verification OTP is:</p>

                    <h1>${otp}</h1>

                    <p>
                        This OTP will expire in <strong>5 minutes</strong>.
                    </p>

                    <p>
                        If you did not request this verification,
                        you can safely ignore this email.
                    </p>
                </div>
            `.trim(),
        });
    }
}


const emailService = new EmailService();

export default emailService;