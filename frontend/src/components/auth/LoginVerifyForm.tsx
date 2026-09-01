"use client";

import {
    FormEvent,
    useState,
} from "react";

import { useRouter, useSearchParams } from "next/navigation";

import useAuth from "@/src/hooks/useAuth";

import Button from "@/src/components/ui/Button";
import OtpInput from "@/src/components/auth/OtpInput";

export default function LoginVerifyForm() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const email =
        searchParams.get("email") ?? "";

    const {
        verifyOtp,
        requestOtp,
        isLoading,
    } = useAuth();

    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const [resending, setResending] =
        useState(false);

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>,
    ) => {
        event.preventDefault();

        setError("");

        if (!email) {
            setError(
                "Email is missing. Please start again.",
            );
            return;
        }

        if (otp.length !== 6) {
            setError(
                "Enter the 6-digit verification code.",
            );
            return;
        }

        try {
            const response =
                await verifyOtp({
                    email,
                    otp,
                });

            if (!response.success) {
                setError(
                    response.message ??
                        "Invalid verification code.",
                );
                return;
            }

            router.push("/");
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Something went wrong.",
            );
        }
    };

    const handleResend = async () => {
        if (!email || resending) {
            return;
        }

        setError("");
        setResending(true);

        try {
            const response =
                await requestOtp({
                    email,
                });

            if (!response.success) {
                setError(
                    response.message ??
                        "Unable to resend code.",
                );
            }
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Unable to resend code.",
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
                items-center
                gap-4
            "
        >
            {/* Email */}
            <p className="text-center text-xs text-white/40">
                Code sent to{" "}
                <span className="text-white/70">
                    {email}
                </span>
            </p>

            {/* OTP */}
            <OtpInput
                value={otp}
                onChange={setOtp}
                disabled={isLoading}
            />

            {/* Error */}
            {error && (
                <p
                    role="alert"
                    className="
                        w-full
                        rounded-lg
                        border
                        border-red-400/10
                        bg-red-400/[0.04]
                        px-3
                        py-1.5
                        text-center
                        text-xs
                        leading-5
                        text-red-300/90
                    "
                >
                    {error}
                </p>
            )}

            {/* Verify */}
            <Button
                type="submit"
                variant="glass"
                size="sm"
                loading={isLoading}
            >
                Verify
            </Button>

            {/* Resend */}
            <button
                type="button"
                onClick={handleResend}
                disabled={
                    isLoading ||
                    resending
                }
                className="
                    text-xs
                    text-white/40
                    transition-colors
                    hover:text-cyan-300/80
                    disabled:pointer-events-none
                    disabled:opacity-40
                "
            >
                {resending
                    ? "Sending..."
                    : "Resend code"}
            </button>
        </form>
    );
}