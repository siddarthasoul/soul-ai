
import SoulBackground from "./SoulBackground";
import Hero from "./Hero";

export default function LandingPage() {
    return (
        <main className="fixed inset-0 h-[100dvh] w-full overflow-hidden bg-black text-white">
            <div className="absolute inset-0 overflow-hidden">
                <SoulBackground />
            </div>

            <div className="relative z-10 h-full w-full overflow-hidden">
                <Hero />
            </div>
        </main>
    );
}
