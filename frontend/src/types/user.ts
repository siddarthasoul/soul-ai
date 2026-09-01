export interface User {
    id: string;
    name: string;
    email: string;
    dob: string;
    isEmailVerified: boolean;
    isSubscribed: boolean;
    isBlocked: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateUserInput {
    name: string;
    email: string;
    dob: string;
}

export interface VerifyEmailInput {
    email: string;
    otp: string;
}