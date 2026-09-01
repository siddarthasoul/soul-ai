import { z } from "zod";

export const requestLoginOtpSchema = z.object({
    email: z
        .string({
            message: "Email is required",
        })
        .trim()
        .toLowerCase()
        .email("Please provide a valid email address"),
});

export const verifyLoginOtpSchema = z.object({
    email: z
        .string({
            message: "Email is required",
        })
        .trim()
        .toLowerCase()
        .email("Please provide a valid email address"),

    otp: z
        .string({
            message: "OTP is required",
        })
        .trim()
        .length(
            6,
            "OTP must be exactly 6 digits"
        )
        .regex(
            /^\d{6}$/,
            "OTP must contain only numbers"
        ),
});

export type RequestLoginOtpInput =
    z.infer<typeof requestLoginOtpSchema>;

export type VerifyLoginOtpInput =
    z.infer<typeof verifyLoginOtpSchema>;