import {
    SOUL_IDENTITY_PROMPT,
} from "./index.js";

class PromptBuilderService {
    build(messages: {
        role: "user" | "assistant";
        content: string;
    }[]) {
        return [
            {
                role: "system" as const,
                content: SOUL_IDENTITY_PROMPT,
            },
            ...messages,
        ];
    }
}

export default new PromptBuilderService();