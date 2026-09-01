import MessageContent from "./MessageContent";
import SoulCore from "./SoulCore";

interface StreamingMessageProps {
    content: string;
}

export default function StreamingMessage({
    content,
}: StreamingMessageProps) {
    return (
        <div className="flex max-w-[92%] items-start gap-3 animate-message-in sm:max-w-[82%] sm:gap-4">

            <div className="mt-1 shrink-0">
                <SoulCore />
            </div>

            <div className="min-w-0">
                <div className="mb-1.5 text-[11px] font-semibold tracking-[0.14em] text-cyan-200/40">
                    SOUL
                </div>

                {content ? (
                    <div className="text-[16px] leading-7 text-white/75 sm:text-[17px] sm:leading-8">
                        <MessageContent content={content} />

                        <span className="ml-1 inline-block h-4 w-[2px] animate-pulse bg-cyan-300/60 align-middle" />
                    </div>
                ) : (
                    <div className="flex items-center gap-1.5 pt-2">
                        <span className="size-1.5 animate-pulse rounded-full bg-white/40" />
                        <span className="size-1.5 animate-pulse rounded-full bg-white/40 [animation-delay:150ms]" />
                        <span className="size-1.5 animate-pulse rounded-full bg-white/40 [animation-delay:300ms]" />
                    </div>
                )}
            </div>

        </div>
    );
}