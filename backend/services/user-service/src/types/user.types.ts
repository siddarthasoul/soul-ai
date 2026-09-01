export interface UserResponse {
    id: string;
    name: string;
    email: string;
    dob: Date;
    isEmailVerified: boolean;
    isSubscribed: boolean;
    isBlocked: boolean;
}

export interface LoginUser {
    id: string;
    name: string;
    email: string;
}

export interface LoginResult {
    user: LoginUser;
    sessionId: string;
}

export interface verifyEmailAndSubscribe {
    user: UserResponse;
    sessionId: string;
}

export interface RegisterResponse {
    message: string;
    email: string;
    requiresEmailVerification: boolean;
}