
import { io } from "socket.io-client";

const GUEST_ID =
    "33cca888-2ce4-4b6b-87c8-9ea8bc6e15be";

const CONVERSATION_ID =
    "6a897b365c7845b93ae9f4cf";

const QUESTION =
    "Why does a transformer use self-attention, and what problem does it solve?";

const socket = io("http://localhost", {
    transports: ["polling", "websocket"],
    withCredentials: true,

    // Node.js test client:
    // manually send the guest cookie.
    extraHeaders: {
        Cookie: `guestId=${GUEST_ID}`,
    },
});

socket.on("connect", () => {
    console.log("\n[Client] Connected:", socket.id);

    console.log(
        "[Client] Guest ID:",
        GUEST_ID
    );

    console.log(
        "[Client] Joining conversation:",
        CONVERSATION_ID
    );

    socket.emit(
        "join_conversation",
        CONVERSATION_ID
    );
});

socket.on("chat_start", (data) => {
    console.log(
        "\n[Chat] Conversation joined:",
        data.conversationId
    );

    console.log(
        "[Chat] Sending:",
        QUESTION
    );

    console.log("\n[AI] ");

    socket.emit("send_message", {
        conversationId:
            data.conversationId,

        content:
            QUESTION,
    });
});

socket.on("chat_chunk", (data) => {
    console.log(data.content);
});

socket.on("chat_complete", (data) => {
    console.log(
        "\n\n[Chat] Complete"
    );

    console.log(
        "[Chat] Message ID:",
        data.messageId
    );

    // Keep connection alive.
    // Do not disconnect during testing.
});

socket.on("chat_error", (data) => {
    console.error(
        "\n[Chat] Error:",
        data.message
    );
});

socket.on("connect_error", (error) => {
    console.error(
        "\n[Client] Connection error:",
        error.message
    );
});

socket.on("disconnect", (reason) => {
    console.log(
        "\n[Client] Disconnected:",
        reason
    );
});
