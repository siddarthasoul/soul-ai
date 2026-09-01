import { Router } from "express";

import chatController
    from "../controllers/chat.controller.js";

import {
    identityMiddleware,
} from "../../../../packages/common/middlewares/identity.middleware.js";

import {
    asyncHandler,
} from "../../../../packages/common/utils/asyncHandler.js";

import {
    validate,
} from "../../../../packages/common/middlewares/validation.middleware.js";

import {
    createConversationSchema,
    conversationIdSchema,
    messageFeedbackSchema,
    messageIdSchema,
} from "../validation/chat.validation.js";


const router = Router();


// ==========================================================
// CREATE CONVERSATION
// ==========================================================

router.post(
    "/conversations",

    identityMiddleware,

    validate({
        body: createConversationSchema,
    }),

    asyncHandler(
        chatController.createConversation.bind(
            chatController
        )
    )
);


// ==========================================================
// GET ALL CONVERSATIONS
// ==========================================================

router.get(
    "/conversations",

    identityMiddleware,

    asyncHandler(
        chatController.getConversations.bind(
            chatController
        )
    )
);


// ==========================================================
// GET CONVERSATION MESSAGES
// ==========================================================

router.get(
    "/conversations/:conversationId/messages",

    identityMiddleware,

    validate({
        params: conversationIdSchema,
    }),

    asyncHandler(
        chatController.getConversationMessages.bind(
            chatController
        )
    )
);


// ==========================================================
// MESSAGE FEEDBACK
// ==========================================================

router.post(
    "/messages/:messageId/feedback",

    identityMiddleware,

    validate({
        params: messageIdSchema,
        body: messageFeedbackSchema,
    }),

    asyncHandler(
        chatController.messageFeedback.bind(
            chatController
        )
    )
);


export default router;