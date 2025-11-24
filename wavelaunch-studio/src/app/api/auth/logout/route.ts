/**
 * Logout API Route
 * Clears the current session
 */

import { signOut } from "@/lib/auth";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    await signOut({ redirect: true, redirectTo: "/client/auth/login" });
}
