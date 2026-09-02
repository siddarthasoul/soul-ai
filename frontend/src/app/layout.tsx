import type { Metadata } from "next";

import Navbar from "@/src/components/landing/Navbar";
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
            <body className="bg-black text-white">
                <Navbar />

                <PageTransition>
                    {children}
                </PageTransition>
            </body>
        </html>
    );
}