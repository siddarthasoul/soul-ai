export class ApiError extends Error {
    public readonly success: boolean = false;

    constructor(
        public readonly statusCode: number,
        message: string,
        public readonly isOperational = true
    ) {
        super(message);
        
        // Ensure the prototype is set correctly (fixes edge cases in some JS runtimes)
        Object.setPrototypeOf(this, new.target.prototype);

        // Capture the stack trace cleanly
        Error.captureStackTrace(this, this.constructor);
    }
}
