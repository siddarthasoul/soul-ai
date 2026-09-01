export default function SoulBackground() {
    return (
        <div
            className="soul-background"
            aria-hidden="true"
        >
            {/* Main breathing light */}
            <div className="soul-orb-main" />

            {/* Floating soft lights */}
            <div className="soul-orb-one" />
            <div className="soul-orb-two" />

            {/* Color field */}
            <div className="soul-color-field">
                <div className="soul-color soul-color-violet" />
                <div className="soul-color soul-color-cyan" />
                <div className="soul-color soul-color-pink" />
            </div>

            {/* Liquid glow */}
            <div
                className="
                    soul-liquid-glow
                    soul-liquid-blue
                    left-[8%]
                    top-[15%]
                "
            />

            <div
                className="
                    soul-liquid-glow
                    soul-liquid-purple
                    right-[8%]
                    top-[35%]
                "
            />

            <div
                className="
                    soul-liquid-glow
                    soul-liquid-pink
                    left-[40%]
                    bottom-[-10%]
                "
            />

            {/* Stars / particles */}
            <div className="soul-stars">
                {Array.from({ length: 16 }).map(
                    (_, index) => (
                        <span key={index} />
                    )
                )}
            </div>

            {/* Dark edge vignette */}
            <div className="soul-vignette" />
        </div>
    );
}