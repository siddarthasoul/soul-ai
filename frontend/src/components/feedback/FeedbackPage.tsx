
"use client";

import {
    useEffect,
    useState,
} from "react";

import { useRouter } from "next/navigation";

import FeedbackForm from "./FeedbackForm";
import useFeedback from "@/src/hooks/useFeedback";
import apiClient from "@/src/lib/api/client";

interface CurrentUser {
    id: string;
    name?: string;
    email?: string;
}

export default function FeedbackPage() {
    const router = useRouter();

    const [user, setUser] =
        useState<CurrentUser | null>(null);

    const [authLoading, setAuthLoading] =
        useState(true);

    const {
        submitFeedback,
        isSubmitting,
        rateLimited,
        retryAfter,
    } = useFeedback(Boolean(user));

    /*
     * ------------------------------------------------------------
     * CHECK AUTHENTICATION
     * ------------------------------------------------------------
     */

    useEffect(() => {
        let mounted = true;

        const checkAuth = async () => {
            try {
                const response =
                    await apiClient.get(
                        "/api/v1/users/me"
                    );

                const currentUser =
                    response.data?.data;

                if (!mounted) {
                    return;
                }

                if (currentUser) {
                    setUser({
                        id: currentUser.id,
                        name: currentUser.name,
                        email: currentUser.email,
                    });
                } else {
                    setUser(null);
                }
            } catch {
                console.log(
                    "[FeedbackPage] User is not authenticated"
                );

                if (mounted) {
                    setUser(null);
                }
            } finally {
                if (mounted) {
                    setAuthLoading(false);
                }
            }
        };

        void checkAuth();

        return () => {
            mounted = false;
        };
    }, []);

    /*
     * ------------------------------------------------------------
     * AUTH NAVIGATION
     * ------------------------------------------------------------
     */

    const openLogin = () => {
        router.push("/login");
    };

    const openRegister = () => {
        router.push("/register");
    };

    /*
     * ------------------------------------------------------------
     * AUTH LOADING
     * ------------------------------------------------------------
     */

    if (authLoading) {
        return (
            <main className="relative min-h-dvh w-full px-4 pb-16 pt-24 sm:px-6 sm:pt-28">
                <div className="mx-auto flex w-full max-w-3xl justify-center">
                    <div className="w-full max-w-2xl rounded-3xl border border-white/[0.08] bg-white/[0.025] p-8 text-center backdrop-blur-xl">
                        <div className="mx-auto mb-4 size-6 animate-spin rounded-full border-2 border-white/10 border-t-white/70" />

                        <p className="text-sm text-white/60">
                            Checking your account...
                        </p>
                    </div>
                </div>
            </main>
        );
    }

    /*
     * ------------------------------------------------------------
     * NOT AUTHENTICATED
     * ------------------------------------------------------------
     */

    if (!user) {
        return (
            <main className="relative min-h-dvh w-full px-4 pb-16 pt-24 sm:px-6 sm:pt-28">
                <div className="mx-auto w-full max-w-3xl">

                    <div className="mb-10 text-center">
                        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-cyan-200/40">
                            SOUL FEEDBACK
                        </p>

                        <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                            Help us make SOUL better
                        </h1>

                        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-white/45 sm:text-base">
                            Your feedback helps us improve
                            SOUL and create a better
                            experience for everyone.
                        </p>
                    </div>

                    <div className="mx-auto w-full max-w-2xl rounded-3xl border border-white/[0.08] bg-white/[0.025] p-6 text-center backdrop-blur-xl sm:p-8">

                        <div className="mx-auto mb-5 flex size-12 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.04]">
                            <span className="text-xl">
                                ✦
                            </span>
                        </div>

                        <h2 className="text-lg font-medium text-white">
                            Verify yourself first
                        </h2>

                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/40">
                            Please sign in or create an
                            account before submitting
                            feedback. This helps us connect
                            your feedback to your SOUL
                            account.
                        </p>

                        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">

                            <button
                                type="button"
                                onClick={openLogin}
                                className="
                                    h-11
                                    rounded-2xl
                                    border
                                    border-white/[0.1]
                                    bg-white/[0.04]
                                    px-6
                                    text-sm
                                    font-medium
                                    text-white
                                    transition
                                    hover:bg-white/[0.08]
                                "
                            >
                                Sign in
                            </button>

                            <button
                                type="button"
                                onClick={openRegister}
                                className="
                                    h-11
                                    rounded-2xl
                                    bg-white
                                    px-6
                                    text-sm
                                    font-medium
                                    text-black
                                    transition
                                    hover:bg-white/90
                                "
                            >
                                Create account
                            </button>

                        </div>

                        <p className="mt-5 text-[11px] text-white/25">
                            Already have an account?

                            <button
                                type="button"
                                onClick={openLogin}
                                className="ml-1 text-cyan-200/60 transition hover:text-cyan-200"
                            >
                                Sign in
                            </button>
                        </p>

                    </div>
                </div>
            </main>
        );
    }

    /*
     * ------------------------------------------------------------
     * AUTHENTICATED
     * ------------------------------------------------------------
     */

    return (
        <main className="relative min-h-dvh w-full px-4 pb-16 pt-24 sm:px-6 sm:pt-28">
            <div className="mx-auto w-full max-w-3xl">

                <div className="mb-10 text-center">
                    <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-cyan-200/40">
                        SOUL FEEDBACK
                    </p>

                    <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                        Help us make SOUL better
                    </h1>

                    <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-white/45 sm:text-base">
                        Tell us what you think about your
                        experience with SOUL. Your feedback
                        helps us improve.
                    </p>
                </div>

                <div className="mx-auto mb-5 flex w-full max-w-2xl items-center justify-between rounded-2xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">

                    <div className="min-w-0">
                        <p className="text-[11px] uppercase tracking-wider text-white/25">
                            Signed in as
                        </p>

                        <p className="mt-0.5 truncate text-sm text-white/65">
                            {user.name ||
                                user.email ||
                                "SOUL user"}
                        </p>
                    </div>

                    <div className="ml-4 flex shrink-0 items-center gap-2">
                        <span className="size-2 rounded-full bg-emerald-400" />

                        <span className="text-xs text-white/35">
                            Verified
                        </span>
                    </div>

                </div>

                <FeedbackForm
                    onSubmit={submitFeedback}
                    isSubmitting={isSubmitting}
                    rateLimited={rateLimited}
                    retryAfter={retryAfter}
                />

            </div>
        </main>
    );
}
