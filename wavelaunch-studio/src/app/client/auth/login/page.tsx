/**
 * Client Login Page
 * Separate login for clients (external users)
 */

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ClientLoginForm } from "./_components/client-login-form";

export default async function ClientLoginPage() {
  // If already authenticated, redirect to appropriate dashboard
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
      <div className="w-full max-w-md">
        {/* Logo/Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="text-4xl">🌊</span>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              WaveLaunch
            </h1>
          </div>
          <p className="text-muted-foreground">
            Client Portal - Access your brand launch projects
          </p>
        </div>

        {/* Login Form Card */}
        <div className="bg-white rounded-lg shadow-xl border p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">Welcome Back</h2>
            <p className="text-sm text-muted-foreground">
              Sign in to view your projects and collaborate with our team
            </p>
          </div>

          <ClientLoginForm />

          {/* Help Text */}
          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>
              Don't have an account?{" "}
              <a
                href="/client/auth/signup"
                className="text-primary hover:underline font-medium"
              >
                Contact us to get started
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
