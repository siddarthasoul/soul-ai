interface ChatStatusProps {
    online: boolean;
    isStreaming: boolean;
    text: string;
}

export default function ChatStatus({
    online,
    isStreaming,
    text,
}: ChatStatusProps) {
    return (
        <div className="pointer-events-none absolute right-4 top-4 z-30 flex items-center gap-2 rounded-full border border-white/[0.08] bg-black/40 px-3 py-1.5 text-[10px] font-medium text-white/40 backdrop-blur-xl sm:right-6 sm:top-5">
            <span
                className={`size-1.5 rounded-full ${online
                        ? "bg-emerald-400 shadow-[0_0_9px_rgba(52,211,153,0.8)]"
                        : isStreaming
                            ? "bg-cyan-400 shadow-[0_0_9px_rgba(34,211,238,0.8)]"
                            : "bg-yellow-400"
                    }`}
            />

            {text}
        </div>
    );
}