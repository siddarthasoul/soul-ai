import { ApiError } from "../utils/apiError.js";
import logger from "../utils/logger.js";
// Example 1: Unauthorized access
try {
    throw new ApiError(401, "Invalid credentials or user does not exist");
} catch (error) {
    if (error instanceof ApiError) {
        logger.warn(`Caught API Error Safely [${error.statusCode}]: ${error.message}`);
        console.log("Metadata Check:", {
            success: error.success,
            isOperational: error.isOperational
        });
    } else {
        logger.error("Unknown error type occurred", error);
    }
}