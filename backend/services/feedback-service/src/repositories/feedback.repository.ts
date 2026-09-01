
import FeedbackModel, {
    type FeedbackDocument,
} from "../models/feedback.model.js";

import type {
    CreateFeedbackInput,
    FeedbackStatus,
    FeedbackPriority,
    FeedbackType,
} from "../types/feedback.types.js";

export interface CreateFeedbackRepositoryInput
    extends CreateFeedbackInput {
    userId: string;
    overall: number;
}

class FeedbackRepository {
    /**
     * Create a new feedback document.
     */
    async create(
        data: CreateFeedbackRepositoryInput
    ): Promise<FeedbackDocument> {
        return FeedbackModel.create(data);
    }

    /**
     * Find feedback by ID.
     */
    async findById(
        feedbackId: string
    ): Promise<FeedbackDocument | null> {
        return FeedbackModel.findById(feedbackId);
    }

    /**
     * Find feedback by ID and user.
     *
     * Useful for ensuring a user can only access
     * their own feedback.
     */
    async findByIdForUser(
        feedbackId: string,
        userId: string
    ): Promise<FeedbackDocument | null> {
        return FeedbackModel.findOne({
            _id: feedbackId,
            userId,
        });
    }

    /**
     * Get all feedback submitted by a user.
     */
    async findByUserId(
        userId: string
    ): Promise<FeedbackDocument[]> {
        return FeedbackModel.find({
            userId,
        })
            .sort({ createdAt: -1 })
            .exec();
    }

    /**
     * Find feedback by type.
     *
     * Example:
     * - ai
     * - ui
     * - bug
     * - feature
     */
    async findByType(
        type: FeedbackType
    ): Promise<FeedbackDocument[]> {
        return FeedbackModel.find({
            type,
        })
            .sort({ createdAt: -1 })
            .exec();
    }


    async deleteById(
        feedbackId: string
    ): Promise<FeedbackDocument | null> {
        return FeedbackModel.findByIdAndDelete(
            feedbackId
        ).exec();
    }

    /**
     * Delete feedback belonging to a specific user.
     */
    async deleteByIdForUser(
        feedbackId: string,
        userId: string
    ): Promise<FeedbackDocument | null> {
        return FeedbackModel.findOneAndDelete({
            _id: feedbackId,
            userId,
        }).exec();
    }

    /**
     * Update feedback status.
     *
     * Admin operation.
     */
    async updateStatus(
        feedbackId: string,
        status: FeedbackStatus
    ): Promise<FeedbackDocument | null> {
        return FeedbackModel.findByIdAndUpdate(
            feedbackId,
            {
                $set: {
                    status,
                },
            },
            {
                new: true,
                runValidators: true,
            }
        ).exec();
    }

    /**
     * Update feedback priority.
     *
     * Admin operation.
     */
    async updatePriority(
        feedbackId: string,
        priority: FeedbackPriority
    ): Promise<FeedbackDocument | null> {
        return FeedbackModel.findByIdAndUpdate(
            feedbackId,
            {
                $set: {
                    priority,
                },
            },
            {
                new: true,
                runValidators: true,
            }
        ).exec();
    }

    /**
     * Add an internal admin note.
     */
    async updateInternalNotes(
        feedbackId: string,
        internalNotes: string
    ): Promise<FeedbackDocument | null> {
        return FeedbackModel.findByIdAndUpdate(
            feedbackId,
            {
                $set: {
                    internalNotes,
                },
            },
            {
                new: true,
                runValidators: true,
            }
        ).exec();
    }


    async count(): Promise<number> {
        return FeedbackModel.countDocuments().exec();
    }

    /**
     * Get average overall rating.
     */
    async getAverageOverall(): Promise<number | null> {
        const result = await FeedbackModel.aggregate<{
            average: number;
        }>([
            {
                $match: {
                    overall: {
                        $exists: true,
                    },
                },
            },
            {
                $group: {
                    _id: null,
                    average: {
                        $avg: "$overall",
                    },
                },
            },
        ]);

        if (result.length === 0) {
            return null;
        }

        return Number(
            result[0]?.average.toFixed(2)
        );
    }

    /**
     * Get feedback counts grouped by type.
     */
    async countByType(): Promise<
        Array<{
            _id: FeedbackType;
            count: number;
        }>
    > {
        return FeedbackModel.aggregate([
            {
                $group: {
                    _id: "$type",
                    count: {
                        $sum: 1,
                    },
                },
            },
            {
                $sort: {
                    count: -1,
                },
            },
        ]);
    }

    /**
     * Get average ratings for product analytics.
     */
    async getRatingAnalytics() {
        const result = await FeedbackModel.aggregate([
            {
                $group: {
                    _id: null,

                    overall: {
                        $avg: "$overall",
                    },

                    accuracy: {
                        $avg: "$ratings.accuracy",
                    },

                    relevance: {
                        $avg: "$ratings.relevance",
                    },

                    clarity: {
                        $avg: "$ratings.clarity",
                    },

                    completeness: {
                        $avg: "$ratings.completeness",
                    },

                    reasoning: {
                        $avg: "$ratings.reasoning",
                    },

                    formatting: {
                        $avg: "$ratings.formatting",
                    },

                    speed: {
                        $avg: "$ratings.speed",
                    },

                    conversationFlow: {
                        $avg: "$ratings.conversationFlow",
                    },

                    memory: {
                        $avg: "$ratings.memory",
                    },

                    streaming: {
                        $avg: "$ratings.streaming",
                    },

                    composer: {
                        $avg: "$ratings.composer",
                    },

                    design: {
                        $avg: "$ratings.design",
                    },

                    navigation: {
                        $avg: "$ratings.navigation",
                    },

                    easeOfUse: {
                        $avg: "$ratings.easeOfUse",
                    },

                    responsiveness: {
                        $avg: "$ratings.responsiveness",
                    },

                    animations: {
                        $avg: "$ratings.animations",
                    },

                    pageLoading: {
                        $avg: "$ratings.pageLoading",
                    },

                    stability: {
                        $avg: "$ratings.stability",
                    },
                },
            },
        ]);

        return result[0] ?? null;
    }
}

export default new FeedbackRepository();