"use client";

import {
    FormEvent,
    useState,
} from "react";

import { useRouter } from "next/navigation";

import useAuth from "@/src/hooks/useAuth";

import Button from "@/src/components/ui/Button";

export default function LoginForm() {
    const router = useRouter();

    const { requestOtp, isLoading } = useAuth();

    const [email, setEmail] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>,
    ) => {
        event.preventDefault();

        setError("");

        const normalizedEmail =
            email.trim().toLowerCase();

        if (!normalizedEmail) {
            setError("Email is required.");
            return;
        }

        try {
            const response =
                await requestOtp({
                    email: normalizedEmail,
                });

            if (!response.success) {
                setError(
                    response.message ??
                        "Unable to send verification code.",
                );

                return;
            }

            router.push(
                `/login/verify?email=${encodeURIComponent(
                    normalizedEmail,
                )}`,
            );
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Something went wrong.",
            );
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="
                flex
                w-full
                flex-col
                gap-4
            "
        >
            {/* Email */}
            <div className="flex flex-col gap-1.5">
                <label
                    htmlFor="email"
                    className="
                        text-xs
                        font-medium
                        text-white/60
                    "
                >
                    Email
                </label>

                <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    value={email}
                    onChange={(event) =>
                        setEmail(event.target.value)
                    }
                    placeholder="you@example.com"
                    disabled={isLoading}
                    className="
                        h-10
                        w-full
                        rounded-xl
                        border
                        border-white/10
                        bg-white/[0.035]
                        px-3.5
                        text-sm
                        text-white
                        outline-none
                        placeholder:text-white/25
                        backdrop-blur-xl
                        transition-all
                        duration-300
                        focus:border-cyan-300/30
                        focus:bg-white/[0.055]
                        focus:ring-1
                        focus:ring-cyan-300/10
                        disabled:cursor-not-allowed
                        disabled:opacity-40
                    "
                />
            </div>

            {/* Error */}
            {error && (
                <p
                    role="alert"
                    className="
                        rounded-lg
                        border
                        border-red-400/10
                        bg-red-400/[0.04]
                        px-3
                        py-1.5
                        text-xs
                        leading-5
                        text-red-300/90
                    "
                >
                    {error}
                </p>
            )}

            {/* Continue */}
            <div className="flex justify-center pt-1">
                <Button
                    type="submit"
                    variant="glass"
                    size="sm"
                    loading={isLoading}
                >
                    Continue
                </Button>
            </div>

            {/* Register */}
            <div className="flex items-center justify-center gap-1.5 text-xs">
                <span className="text-white/35">
                    Don&apos;t have a SOUL account?
                </span>

                <button
                    type="button"
                    onClick={() => router.push("/register")}
                    disabled={isLoading}
                    className="
                        text-cyan-300/80
                        transition-colors
                        hover:text-cyan-200
                        disabled:cursor-not-allowed
                        disabled:opacity-40
                    "
                >
                    Create one
                </button>
            </div>
        </form>
    );
}
