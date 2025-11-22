/**
 * Client Signup Page
 * New client registration and onboarding
 */

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ClientSignupForm } from "./_components/client-signup-form";

export default async function ClientSignupPage() {
  // If already authenticated, redirect
  const session = await auth();

  if (session?.user) {
    if (session.user.role === "CLIENT") {
      redirect("/client/dashboard");
    } else {
      redirect("/dashboard");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4">
      <div className="w-full max-w-2xl">
        {/* Logo/Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="text-4xl">🌊</span>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              WaveLaunch
            </h1>
          </div>
          <p className="text-muted-foreground">
            Create your client account to get started
          </p>
        </div>

        {/* Signup Form Card */}
        <div className="bg-white rounded-lg shadow-xl border p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">Get Started</h2>
            <p className="text-sm text-muted-foreground">
              Fill in your details to create your account and start collaborating with our team
            </p>
          </div>

          <ClientSignupForm />

          {/* Help Text */}
          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>
              Already have an account?{" "}
              <a
                href="/client/auth/login"
                className="text-primary hover:underline font-medium"
              >
                Sign in here
              </a>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            Need help?{" "}
            <a href="mailto:support@wavelaunch.studio" className="hover:underline">
              support@wavelaunch.studio
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
