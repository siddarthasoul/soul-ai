import type {
    Request,
    Response,
} from "express";

import chatService
    from "../services/chat.service.js";

import {
    ApiResponse,
} from "../../../../packages/common/utils/apiResponse.js";

import {
    ApiError,
} from "../../../../packages/common/utils/apiError.js";


class ChatController {

    // ======================================================
    // CREATE CONVERSATION
    // ======================================================

    async createConversation(
        req: Request,
        res: Response
    ): Promise<Response> {

        const identity = req.identity;

        if (!identity) {
            throw new ApiError(
                500,
                "Identity could not be established"
            );
        }

        const result =
            await chatService.createConversation(
                identity,
                req.body.title
            );

        return res.status(201).json(
            new ApiResponse(
                201,
                "Conversation created successfully",
                result
            )
        );
    }


    // ======================================================
    // GET ALL CONVERSATIONS
    // ======================================================

    async getConversations(
        req: Request,
        res: Response
    ): Promise<Response> {

        const identity = req.identity;

        if (!identity) {
            throw new ApiError(
                500,
                "Identity could not be established"
            );
        }

        const conversations =
            await chatService.getConversations(
                identity
            );

        return res.status(200).json(
            new ApiResponse(
                200,
                "Conversations fetched successfully",
                conversations
            )
        );
    }


    // ======================================================
    // GET CONVERSATION MESSAGES
    // ======================================================

    async getConversationMessages(
        req: Request,
        res: Response
    ): Promise<Response> {

        const identity = req.identity;

        if (!identity) {
            throw new ApiError(
                500,
                "Identity could not be established"
            );
        }

        const conversationId =
            req.params.conversationId;

        if (
            typeof conversationId !== "string"
        ) {
            throw new ApiError(
                400,
                "Invalid conversation ID"
            );
        }

        const result =
            await chatService.getConversationMessages(
                conversationId,
                identity
            );

        return res.status(200).json(
            new ApiResponse(
                200,
                "Conversation messages fetched successfully",
                result
            )
        );
    }


    async messageFeedback(
        req: Request,
        res: Response
    ): Promise<Response> {

        const identity = req.identity;

        if (!identity) {
            throw new ApiError(
                500,
                "Identity could not be established"
            );
        }

        const messageId =
            req.params.messageId;

        if (
            typeof messageId !== "string" ||
            !messageId.trim()
        ) {
            throw new ApiError(
                400,
                "Message ID is required"
            );
        }

        const result =
            await chatService.messageFeedback(
                messageId,
                req.body
            );

        return ApiResponse.success(
            res,
            result,
            "Message feedback saved successfully"
        );
    }
}


const chatController =
    new ChatController();

export default chatController;