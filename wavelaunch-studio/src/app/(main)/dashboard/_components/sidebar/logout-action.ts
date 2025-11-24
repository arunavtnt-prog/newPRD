/**
 * Logout Server Action
 * Signs out the current user
 */

"use server";

import { signOut } from "@/lib/auth";

export async function logout() {
    await signOut({ redirectTo: "/auth/v2/login" });
}
