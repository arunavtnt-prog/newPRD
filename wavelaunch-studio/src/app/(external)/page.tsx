import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function Home() {
  // Check authentication
  const session = await auth();

  if (!session?.user) {
    // Not logged in - redirect to login
    redirect("/auth/v2/login");
  }

  // Logged in - redirect to appropriate dashboard based on role
  if (session.user.role === "CREATOR") {
    redirect("/client/dashboard");
  } else {
    redirect("/dashboard");
  }
}
