import { Ollama } from "ollama";

import env from "../../../../packages/common/config/env.js";

import {
    ApiError,
} from "../../../../packages/common/utils/apiError.js";

import logger from "../../../../packages/common/utils/logger.js";

import type {
    ChatUsage,
} from "../types/chat.types.js";

import promptBuilderService
    from "../../../../packages/common/prompts/prompt-builder.service.js";

export type LLMRole =
    | "user"
    | "assistant";

export interface LLMMessage {
    role: LLMRole;
    content: string;
}

export interface LLMResponse {
    content: string;
    model: string;
}

export interface LLMStreamChunk {
    content: string;
    model: string;
    done: boolean;
    usage?: ChatUsage;
}

class LLMService {
    private readonly model =
        env.llm.model;

    private readonly timeout =
        env.llm.timeout;

    private readonly ollama =
        new Ollama({
            host: env.llm.host,
        });

    public getModel(): string {
        return this.model;
    }

    async *stream(
        messages: LLMMessage[]
    ): AsyncGenerator<
        LLMStreamChunk,
        void,
        unknown
    > {
        this.validateMessages(messages);

        // ---------------------------------------------
        // BUILD SOUL PROMPT
        // ---------------------------------------------

        const finalMessages =
            promptBuilderService.build(
                messages
            );

        let stream;

        // ---------------------------------------------
        // START OLLAMA
        // ---------------------------------------------

        try {
            stream =
                await this.ollama.chat({
                    model: this.model,
                    messages: finalMessages,
                    stream: true,
                    think: false,
                });
        } catch (error) {
            logger.error(
                "Failed to start LLM stream",
                error
            );

            throw new ApiError(
                502,
                "AI service is currently unavailable"
            );
        }

        // ---------------------------------------------
        // READ STREAM
        // ---------------------------------------------

        try {
            for await (
                const chunk of stream
            ) {
                const content =
                    chunk.message?.content ??
                    "";

                const model =
                    chunk.model ||
                    this.model;

                const done =
                    chunk.done === true;

                // -----------------------------------------
                // NORMAL STREAM CHUNK
                // -----------------------------------------

                if (content) {
                    yield {
                        content,
                        model,
                        done: false,
                    };
                }

                // -----------------------------------------
                // FINAL CHUNK
                // -----------------------------------------

                if (done) {
                    const promptTokens =
                        chunk.prompt_eval_count ??
                        null;

                    const completionTokens =
                        chunk.eval_count ??
                        null;

                    const totalTokens =
                        promptTokens !== null &&
                            completionTokens !== null
                            ? promptTokens +
                            completionTokens
                            : null;

                    const totalDurationMs =
                        chunk.total_duration !==
                            undefined
                            ? chunk.total_duration /
                            1_000_000
                            : null;

                    const loadDurationMs =
                        chunk.load_duration !==
                            undefined
                            ? chunk.load_duration /
                            1_000_000
                            : null;

                    const promptEvalDurationMs =
                        chunk.prompt_eval_duration !==
                            undefined
                            ? chunk.prompt_eval_duration /
                            1_000_000
                            : null;

                    const evalDurationMs =
                        chunk.eval_duration !==
                            undefined
                            ? chunk.eval_duration /
                            1_000_000
                            : null;

                    const tokensPerSecond =
                        completionTokens !== null &&
                            chunk.eval_duration !==
                            undefined &&
                            chunk.eval_duration > 0
                            ? completionTokens /
                            (
                                chunk.eval_duration /
                                1_000_000_000
                            )
                            : null;

                    const usage: ChatUsage = {
                        promptTokens,
                        completionTokens,
                        totalTokens,

                        totalDurationMs,
                        loadDurationMs,
                        promptEvalDurationMs,
                        evalDurationMs,

                        tokensPerSecond,
                    };

                    yield {
                        content: "",
                        model,
                        done: true,
                        usage,
                    };

                    break;
                }
            }
        } catch (error) {
            if (
                error instanceof ApiError
            ) {
                throw error;
            }

            logger.error(
                "LLM streaming failed",
                error
            );

            throw new ApiError(
                502,
                "AI streaming service is currently unavailable"
            );
        }
    }

    // ---------------------------------------------
    // HEALTH CHECK
    // ---------------------------------------------


    // ---------------------------------------------
    // GENERATE CONVERSATION TITLE
    // ---------------------------------------------

    async generateTitle(
        userMessage: string
    ): Promise<string> {

        if (!userMessage.trim()) {
            return "New conversation";
        }

        try {

            const response =
                await this.ollama.chat({
                    model: this.model,

                    messages: [
                        {
                            role: "system",
                            content:
                                "Generate a short title for this conversation. " +
                                "Use 3 to 6 words. " +
                                "Return ONLY the title. " +
                                "Do not use quotes, markdown, or punctuation.",
                        },
                        {
                            role: "user",
                            content: userMessage,
                        },
                    ],

                    stream: false,
                    think: false,
                });

            const title =
                response.message?.content
                    ?.trim()
                    .replace(/^["']|["']$/g, "")
                    .replace(/[.!?]+$/g, "")
                    .trim();

            if (!title) {
                return "New conversation";
            }

            return title.slice(0, 80);

        } catch (error) {

            logger.error(
                "Failed to generate conversation title",
                error
            );

            // Title generation should NEVER
            // break the actual chat.
            return "New conversation";
        }
    }



    async healthCheck(): Promise<boolean> {
        try {
            await this.ollama.list();

            return true;
        } catch (error) {
            logger.error(
                "LLM health check failed",
                error
            );

            return false;
        }
    }

    // ---------------------------------------------
    // VALIDATION
    // ---------------------------------------------

    private validateMessages(
        messages: LLMMessage[]
    ): void {
        if (
            messages.length === 0
        ) {
            throw new ApiError(
                400,
                "LLM messages cannot be empty"
            );
        }

        for (
            const message of messages
        ) {
            if (
                !message.content.trim()
            ) {
                throw new ApiError(
                    400,
                    "LLM message content cannot be empty"
                );
            }
        }
    }
}

const llmService =
    new LLMService();

export default llmService;