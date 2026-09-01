
import { Suspense } from "react";

import AuthShell from "@/src/components/auth/AuthShell";
import AuthCard from "@/src/components/auth/AuthCard";
import AuthHeader from "@/src/components/auth/AuthHeader";
import VerifyForm from "@/src/components/auth/VerifyForm";

export default function VerifyPage() {
    return (
        <AuthShell>
            <AuthCard>
                <AuthHeader
                    title="Verify your email"
                    description="Enter the verification code sent to your email."
                />

                <Suspense
                    fallback={
                        <div className="py-6 text-center text-sm text-white/40">
                            Loading verification...
                        </div>
                    }
                >
                    <VerifyForm />
                </Suspense>
            </AuthCard>
        </AuthShell>
    );
}
