"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

interface MessageContentProps {
    content: string;
}

export default function MessageContent({
    content,
}: MessageContentProps) {
    return (
        <div className="soul-markdown">
            <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeKatex]}
                components={{
                    h1: ({ children }) => (
                        <h1 className="mb-5 mt-2 text-2xl font-semibold text-white">
                            {children}
                        </h1>
                    ),

                    h2: ({ children }) => (
                        <h2 className="mb-4 mt-7 text-xl font-semibold text-white">
                            {children}
                        </h2>
                    ),

                    h3: ({ children }) => (
                        <h3 className="mb-3 mt-6 text-lg font-semibold text-cyan-100">
                            {children}
                        </h3>
                    ),

                    h4: ({ children }) => (
                        <h4 className="mb-2 mt-5 text-base font-semibold text-white/90">
                            {children}
                        </h4>
                    ),

                    p: ({ children }) => (
                        <p className="mb-4 leading-8 text-white/75 last:mb-0">
                            {children}
                        </p>
                    ),

                    strong: ({ children }) => (
                        <strong className="font-semibold text-white">
                            {children}
                        </strong>
                    ),

                    em: ({ children }) => (
                        <em className="text-white/80">
                            {children}
                        </em>
                    ),

                    ul: ({ children }) => (
                        <ul className="mb-5 ml-5 list-disc space-y-2 text-white/75">
                            {children}
                        </ul>
                    ),

                    ol: ({ children }) => (
                        <ol className="mb-5 ml-5 list-decimal space-y-2 text-white/75">
                            {children}
                        </ol>
                    ),

                    li: ({ children }) => (
                        <li className="pl-1 leading-7">
                            {children}
                        </li>
                    ),

                    blockquote: ({ children }) => (
                        <blockquote className="my-5 border-l-2 border-cyan-300/30 pl-4 italic text-white/60">
                            {children}
                        </blockquote>
                    ),

                    hr: () => (
                        <hr className="my-6 border-white/10" />
                    ),

                    code: ({
                        className,
                        children,
                        ...props
                    }) => {
                        const isBlock =
                            className?.includes("language-");

                        if (isBlock) {
                            return (
                                <code
                                    className="block overflow-x-auto rounded-2xl border border-white/10 bg-black/50 p-4 text-sm leading-6 text-white/80"
                                    {...props}
                                >
                                    {children}
                                </code>
                            );
                        }

                        return (
                            <code
                                className="rounded-md bg-white/10 px-1.5 py-0.5 text-[0.9em] text-cyan-100"
                                {...props}
                            >
                                {children}
                            </code>
                        );
                    },

                    pre: ({ children }) => (
                        <pre
                            className="
                                soul-code-scroll
                                my-5
                                overflow-x-auto
                                rounded-2xl
                                border
                                border-white/10
                                bg-black/50
                                p-1
                            "
                        >
                            {children}
                        </pre>
                    ),

                    a: ({ children, href }) => (
                        <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cyan-300 underline decoration-cyan-300/30 underline-offset-4 hover:text-cyan-200"
                        >
                            {children}
                        </a>
                    ),

                    table: ({ children }) => (
                        <div className="my-5 overflow-x-auto rounded-xl border border-white/10">
                            <table className="w-full text-left text-sm">
                                {children}
                            </table>
                        </div>
                    ),

                    th: ({ children }) => (
                        <th className="border-b border-white/10 bg-white/5 px-4 py-3 font-semibold text-white">
                            {children}
                        </th>
                    ),

                    td: ({ children }) => (
                        <td className="border-b border-white/5 px-4 py-3 text-white/70">
                            {children}
                        </td>
                    ),
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}