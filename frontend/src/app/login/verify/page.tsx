
import { Suspense } from "react";

import AuthShell from "@/src/components/auth/AuthShell";
import AuthCard from "@/src/components/auth/AuthCard";
import AuthHeader from "@/src/components/auth/AuthHeader";
import LoginVerifyForm from "@/src/components/auth/LoginVerifyForm";

export default function LoginVerifyPage() {
    return (
        <AuthShell>
            <AuthCard>
                <AuthHeader
                    title="Enter your code"
                    description="Enter the verification code sent to your email."
                />

                <Suspense
                    fallback={
                        <div className="py-6 text-center text-sm text-white/40">
                            Loading verification...
                        </div>
                    }
                >
                    <LoginVerifyForm />
                </Suspense>
            </AuthCard>
        </AuthShell>
    );
}
