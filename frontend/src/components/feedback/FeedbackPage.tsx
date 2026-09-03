
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
                const response = await apiClient.get(
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
                // Not authenticated = guest user.
                // This is not an error for the feedback page.
                console.log(
                    "[FeedbackPage] Continuing as guest"
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

    /*
     * ------------------------------------------------------------
     * AUTHENTICATED
     * ------------------------------------------------------------
     */

    return (
        <main className="relative min-h-dvh w-full px-4 pb-16 pt-24 sm:px-6 sm:pt-28">
            <div className="mx-auto w-full max-w-3xl">

                {/* HEADER */}
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

                {/* IDENTITY */}
                {user ? (
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
                ) : (
                    <div className="mx-auto mb-5 w-full max-w-2xl rounded-2xl border border-white/[0.06] bg-white/[0.02] px-4 py-4">

                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                            <div className="min-w-0">
                                <p className="text-sm font-medium text-white/70">
                                    You're giving feedback as a guest
                                </p>

                                <p className="mt-1 text-xs leading-5 text-white/35">
                                    You can submit feedback now, or
                                    sign in to connect it with your
                                    SOUL account.
                                </p>
                            </div>

                            <div className="flex shrink-0 gap-2">

                                <button
                                    type="button"
                                    onClick={openLogin}
                                    className="
                                    h-9
                                    rounded-xl
                                    border
                                    border-white/[0.1]
                                    bg-white/[0.04]
                                    px-4
                                    text-xs
                                    font-medium
                                    text-white/75
                                    transition
                                    hover:bg-white/[0.08]
                                    hover:text-white
                                "
                                >
                                    Sign in
                                </button>

                                <button
                                    type="button"
                                    onClick={openRegister}
                                    className="
                                    h-9
                                    rounded-xl
                                    bg-white
                                    px-4
                                    text-xs
                                    font-medium
                                    text-black
                                    transition
                                    hover:bg-white/90
                                "
                                >
                                    Create account
                                </button>

                            </div>

                        </div>
                    </div>
                )}

                {/* FEEDBACK FORM */}
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
