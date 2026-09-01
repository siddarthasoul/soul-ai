"use client";

import AuthShell from "@/src/components/auth/AuthShell";
import AuthCard from "@/src/components/auth/AuthCard";
import AuthHeader from "@/src/components/auth/AuthHeader";
import RegisterForm from "@/src/components/auth/RegisterForm";

export default function RegisterPage() {
    return (
        <AuthShell>
            <AuthCard>
                <AuthHeader
                    title="Create your account"
                    description="Enter your details to continue with Soul."
                />

                <RegisterForm />
            </AuthCard>
        </AuthShell>
    );
}