export interface RequestLoginOtpInput {
    email: string;
}

export interface VerifyLoginOtpInput {
    email: string;
    otp: string;
}