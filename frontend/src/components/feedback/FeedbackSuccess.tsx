"use client";

interface FeedbackSuccessProps {
    onReset: () => void;
}

export default function FeedbackSuccess({
    onReset,
}: FeedbackSuccessProps) {
    return (
        <div
            className="
                relative overflow-hidden
                rounded-[28px]
                border border-white/[0.08]
                bg-white/[0.035]
                p-8
                text-center
                shadow-[0_30px_100px_rgba(0,0,0,0.25)]
                backdrop-blur-2xl
                sm:p-12
            "
        >
            {/* Soft glow */}
            <div
                className="
                    pointer-events-none absolute
                    left-1/2 top-0
                    size-48
                    -translate-x-1/2
                    -translate-y-1/2
                    rounded-full
                    bg-cyan-300/[0.07]
                    blur-3xl
                "
            />

            {/* Icon */}
            <div
                className="
                    relative mx-auto mb-6
                    flex size-16
                    items-center justify-center
                    rounded-full
                    border border-cyan-200/15
                    bg-cyan-200/[0.06]
                    text-2xl text-cyan-100/80
                "
            >
                ✓
            </div>

            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-cyan-200/40">
                FEEDBACK RECEIVED
            </p>

            <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                Thank you
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-white/40">
                Your feedback has been submitted
                successfully. It helps us make SOUL
                smarter, faster, and better.
            </p>

            <button
                type="button"
                onClick={onReset}
                className="
                    mt-8
                    rounded-full
                    border border-white/[0.10]
                    bg-white/[0.07]
                    px-6 py-3
                    text-sm font-medium
                    text-white/80
                    transition
                    hover:bg-white/[0.12]
                    hover:text-white
                "
            >
                Give more feedback
            </button>
        </div>
    );
}