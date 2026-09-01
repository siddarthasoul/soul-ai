import type { Metadata } from "next";

import Navbar from "@/src/components/landing/Navbar";
import SoulBackground from "@/src/components/landing/SoulBackground";
import PageTransition from "@/src/components/ui/PageTransition";

import "./globals.css";

export const metadata: Metadata = {
    title: "SOUL",
    description: "Chat with SOUL",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="relative min-h-screen bg-black text-white">
                <SoulBackground />

                <div className="relative z-10 min-h-screen">
                    <Navbar />

                    <PageTransition>
                        {children}
                    </PageTransition>
                </div>
            </body>
        </html>
    );
}