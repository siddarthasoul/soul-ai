"use client";

import {
    FormEvent,
    useEffect,
    useState,
} from "react";

import {
    useRouter,
    useSearchParams,
} from "next/navigation";

import useUser from "@/src/hooks/useUser";

import OtpInput from "./OtpInput";

const RESEND_COOLDOWN = 60;

export default function VerifyForm() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const email =
        searchParams.get("email") ?? "";

    const {
        verifyEmail,
        resendVerificationOtp,
    } = useUser();

    const [otp, setOtp] = useState("");

    const [error, setError] = useState("");

    const [loading, setLoading] =
        useState(false);

    const [resending, setResending] =
        useState(false);

    const [cooldown, setCooldown] =
        useState(0);

    /*
     * Countdown timer
     */
    useEffect(() => {
        if (cooldown <= 0) {
            return;
        }

        const timer = window.setInterval(() => {
            setCooldown((current) =>
                current <= 1
                    ? 0
                    : current - 1
            );
        }, 1000);

        return () => {
            window.clearInterval(timer);
        };
    }, [cooldown]);

    /*
     * Verify OTP
     */
    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>,
    ) => {
        event.preventDefault();

        setError("");

        if (!email) {
            setError(
                "Verification email is missing."
            );

            return;
        }

        if (otp.length !== 6) {
            setError(
                "Enter the 6-digit verification code."
            );

            return;
        }

        try {
            setLoading(true);

            const response =
                await verifyEmail({
                    email,
                    otp,
                });

            if (!response.success) {
                setError(
                    response.message ??
                        "Invalid verification code."
                );

                return;
            }

            /*
             * Backend should have:
             *
             * OTP verified
             *      ↓
             * Email verified
             *      ↓
             * Session created
             *      ↓
             * HttpOnly cookie
             */

            router.replace("/chat");
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Verification failed."
            );
        } finally {
            setLoading(false);
        }
    };

    /*
     * Resend OTP
     */
    const handleResend = async () => {
        if (
            !email ||
            resending ||
            loading ||
            cooldown > 0
        ) {
            return;
        }

        try {
            setResending(true);
            setError("");

            const response =
                await resendVerificationOtp(
                    email
                );

            if (!response.success) {
                setError(
                    response.message ??
                        "Unable to resend code."
                );

                return;
            }

            /*
             * Clear old OTP
             */
            setOtp("");

            /*
             * Start cooldown only after
             * successful resend.
             */
            setCooldown(
                RESEND_COOLDOWN
            );
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Unable to resend code."
            );
        } finally {
            setResending(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="
                flex
                w-full
                flex-col
                gap-5
            "
        >
            {/* Email */}
            <div className="text-center">
                <p className="
                    text-sm
                    leading-6
                    text-white/50
                ">
                    We sent a verification code to
                </p>

                <p className="
                    mt-1
                    truncate
                    text-sm
                    font-medium
                    text-white/80
                ">
                    {email || "your email"}
                </p>
            </div>

            {/* OTP */}
            <div className="
                flex
                flex-col
                gap-3
            ">
                <label className="
                    text-sm
                    font-medium
                    text-white/70
                ">
                    Verification code
                </label>

                <OtpInput
                    value={otp}
                    onChange={(value) => {
                        setOtp(value);
                        setError("");
                    }}
                    disabled={loading}
                    length={6}
                />
            </div>

            {/* Error */}
            {error && (
                <p
                    role="alert"
                    className="
                        rounded-xl
                        border
                        border-red-400/10
                        bg-red-400/[0.05]
                        px-3
                        py-2
                        text-center
                        text-sm
                        text-red-300
                    "
                >
                    {error}
                </p>
            )}

            {/* Verify */}
            <button
                type="submit"
                disabled={
                    loading ||
                    otp.length !== 6 ||
                    !email
                }
                className="
                    h-12
                    w-full
                    rounded-xl
                    bg-white
                    text-sm
                    font-semibold
                    text-black
                    transition
                    hover:bg-white/90
                    active:scale-[0.98]
                    disabled:cursor-not-allowed
                    disabled:opacity-40
                "
            >
                {loading
                    ? "Verifying..."
                    : "Verify"}
            </button>

            {/* Resend */}
            <button
                type="button"
                onClick={handleResend}
                disabled={
                    resending ||
                    loading ||
                    !email ||
                    cooldown > 0
                }
                className="
                    text-sm
                    text-white/50
                    transition
                    hover:text-white
                    disabled:cursor-not-allowed
                    disabled:opacity-40
                "
            >
                {resending
                    ? "Sending new code..."
                    : cooldown > 0
                        ? `Resend code in ${cooldown}s`
                        : "Didn't receive the code? Resend"}
            </button>
        </form>
    );
}