import { z } from "zod";

export const createUserSchema = z.object({
    name: z
        .string({ message: "Name is required" })
        .trim()
        .min(3, "Name must be at least 3 characters")
        .max(34, "Name must be less than 35 characters"),

    email: z
        .string({ message: "Email is required" })
        .trim()
        .toLowerCase()
        .email("Please provide a valid email address"),

    dob: z
        .string({ message: "Date of birth is required" })
        .trim()
        .min(1, "Date of birth is required")
        .pipe(
            z.coerce.date({
                message: "Please provide a valid date of birth",
            })
        )
        .refine(
            (date) => date < new Date(),
            "Date of birth cannot be in the future"
        )
        .refine(
            (date) => {
                const today = new Date();

                let age = today.getFullYear() - date.getFullYear();
                const monthDifference =
                    today.getMonth() - date.getMonth();

                if (
                    monthDifference < 0 ||
                    (monthDifference === 0 &&
                        today.getDate() < date.getDate())
                ) {
                    age--;
                }

                return age >= 13 && age <= 120;
            },
            "Age must be between 13 and 120 years"
        ),
});

export const verifyEmailSchema = z.object({
    email: z
        .string({ message: "Email is required" })
        .trim()
        .toLowerCase()
        .email("Please provide a valid email address"),

    otp: z
        .string({ message: "OTP is required" })
        .trim()
        .length(6, "OTP must be exactly 6 digits")
        .regex(/^\d+$/, "OTP must contain only numbers"),
});


export const resendVerificationOtpSchema =
    z.object({
        email: z
            .string({
                message: "Email is required",
            })
            .trim()
            .toLowerCase()
            .email(
                "Please provide a valid email address"
            ),
    });

export type ResendVerificationOtpInput =
    z.infer<
        typeof resendVerificationOtpSchema
    >;

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type verifyEmailAndSubscribeInput = z.infer<typeof verifyEmailSchema>;
