import SoulBackground from "./SoulBackground";
import Hero from "./Hero";

export default function LandingPage() {
    return (
        <main className="relative min-h-dvh overflow-hidden bg-black text-white">
            <SoulBackground />

            <div className="relative z-10">
                <Hero />
            </div>
        </main>
    );
}