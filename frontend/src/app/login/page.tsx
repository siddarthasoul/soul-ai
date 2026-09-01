"use client";

import AuthShell from "@/src/components/auth/AuthShell";
import AuthCard from "@/src/components/auth/AuthCard";
import AuthHeader from "@/src/components/auth/AuthHeader";
import LoginForm from "@/src/components/auth/LoginForm";

export default function LoginPage() {
    return (
        <AuthShell>
            <AuthCard>
                <AuthHeader
                    title="Welcome back"
                    description="Sign in with your email to continue with Soul."
                />

                <LoginForm />
            </AuthCard>
        </AuthShell>
    );
}