"use client";

import type { ReactNode } from "react";

import SoulBackground from "@/src/components/landing/SoulBackground";

interface AuthShellProps {
    children: ReactNode;
}

export default function AuthShell({
    children,
}: AuthShellProps) {
    return (
        <main
            className="
                relative
                min-h-dvh
                overflow-hidden
                bg-black
            "
        >
            {/* Shared SOUL background */}
            <SoulBackground />

            {/* Auth content */}
            <div
                className="
                    relative
                    z-10
                    flex
                    min-h-dvh
                    items-center
                    justify-center
                    px-4
                    py-8
                "
            >
                {children}
            </div>
        </main>
    );
}