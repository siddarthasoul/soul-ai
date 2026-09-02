
import SoulBackground from "./SoulBackground";
import Hero from "./Hero";

export default function LandingPage() {
    return (
        <main className="relative h-dvh w-full overflow-hidden bg-black text-white">
            {/* Fixed background layer */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <SoulBackground />
            </div>

            {/* Page content */}
            <div className="relative z-10 h-full min-h-0 w-full overflow-hidden">
                <Hero />
            </div>
        </main>
    );
}
