"use client";

import { useRouter } from "next/navigation";

import Logo from "@/src/components/ui/Logo";

export default function Navbar() {
    const router = useRouter();

    const handleLogoClick = () => {
        router.push("/");
    };

    return (
        <header
            className="
                pointer-events-none
                fixed
                left-0
                top-0
                z-50
                px-5
                py-5
                sm:px-8
                sm:py-7
            "
        >
            <div className="pointer-events-auto">
                <button
                    type="button"
                    onClick={handleLogoClick}
                    aria-label="Go to SOUL home"
                    className="
                        cursor-pointer
                        rounded-full
                        outline-none
                        transition-opacity
                        hover:opacity-80
                        focus-visible:ring-2
                        focus-visible:ring-cyan-300/40
                    "
                >
                    <Logo
                        size="md"
                        showText
                        animated
                    />
                </button>
            </div>
        </header>
    );
}