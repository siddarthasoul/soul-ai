"use client";

import type { FeedbackType } from "@/src/types/feedback.types";

interface FeedbackCategoryProps {
    value: FeedbackType;
    onChange: (value: FeedbackType) => void;
}

const categories: {
    value: FeedbackType;
    label: string;
    description: string;
}[] = [
    {
        value: "general",
        label: "General",
        description: "Overall experience",
    },
    {
        value: "ai",
        label: "AI",
        description: "Response quality",
    },
    {
        value: "chat",
        label: "Chat",
        description: "Conversation experience",
    },
    {
        value: "ui",
        label: "Interface",
        description: "Design and usability",
    },
    {
        value: "performance",
        label: "Performance",
        description: "Speed and stability",
    },
    {
        value: "bug",
        label: "Bug",
        description: "Something isn't working",
    },
    {
        value: "feature",
        label: "Feature",
        description: "Suggest something new",
    },
];

export default function FeedbackCategory({
    value,
    onChange,
}: FeedbackCategoryProps) {
    return (
        <section>
            <div className="mb-4">
                <h2 className="text-sm font-semibold text-white/80">
                    What would you like to tell us about?
                </h2>

                <p className="mt-1 text-xs text-white/35">
                    Choose the area that best matches your
                    feedback.
                </p>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                {categories.map(category => {
                    const active =
                        value === category.value;

                    return (
                        <button
                            key={category.value}
                            type="button"
                            onClick={() =>
                                onChange(
                                    category.value
                                )
                            }
                            className={`
                                min-h-[82px]
                                rounded-2xl
                                border
                                px-3 py-3
                                text-left
                                transition
                                ${
                                    active
                                        ? "border-cyan-200/20 bg-cyan-200/[0.07] text-white"
                                        : "border-white/[0.07] bg-white/[0.025] text-white/45 hover:border-white/[0.12] hover:bg-white/[0.05] hover:text-white/75"
                                }
                            `}
                        >
                            <span className="block text-sm font-medium">
                                {category.label}
                            </span>

                            <span
                                className={`
                                    mt-1 block text-[11px]
                                    leading-4
                                    ${
                                        active
                                            ? "text-cyan-100/50"
                                            : "text-white/25"
                                    }
                                `}
                            >
                                {category.description}
                            </span>
                        </button>
                    );
                })}
            </div>
        </section>
    );
}