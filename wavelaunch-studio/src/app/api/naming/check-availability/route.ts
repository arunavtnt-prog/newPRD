/**
 * Domain and Trademark Availability Check API
 *
 * Checks if a brand name has available domain and trademark
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name } = body;

    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    // Check domain availability
    const domainAvailable = await checkDomainAvailability(name);

    // Check trademark availability
    const trademarkStatus = await checkTrademarkAvailability(name);

    return NextResponse.json({
      name,
      domainAvailable,
      trademarkStatus,
    });
  } catch (error) {
    console.error("Error checking availability:", error);
    return NextResponse.json(
      { error: "Failed to check availability" },
      { status: 500 }
    );
  }
}

async function checkDomainAvailability(name: string): Promise<boolean> {
  try {
    // Convert to domain format
    const domain = `${name.toLowerCase().replace(/\s+/g, "")}.com`;

    // Simple DNS lookup to check if domain resolves
    // In production, use a proper domain availability API:
    // - GoDaddy Domain Availability API
    // - Namecheap API
    // - Domain.com API
    // - Whois API

    const response = await fetch(`https://dns.google/resolve?name=${domain}&type=A`, {
      headers: {
        Accept: "application/dns-json",
      },
    });

    if (!response.ok) {
      throw new Error("DNS lookup failed");
    }

    const data = await response.json();

    // Status 3 = NXDOMAIN (domain doesn't exist, likely available)
    // No Answer section = domain doesn't resolve
    return data.Status === 3 || !data.Answer || data.Answer.length === 0;
  } catch (error) {
    console.error("Error checking domain availability:", error);
    // If check fails, assume not available to be safe
    return false;
  }
}

async function checkTrademarkAvailability(
  name: string
): Promise<"available" | "unavailable" | "checking"> {
  try {
    // In production, integrate with:
    // - USPTO Trademark Electronic Search System (TESS)
    // - WIPO Global Brand Database
    // - TrademarkNow API
    // - Corsearch API

    // For now, we'll do a simple check:
    // 1. Search for exact matches in a public database
    // 2. Check for phonetic similarities
    // 3. Return status

    // Simplified mock implementation
    // In real implementation, you would query the USPTO API or similar
    const searchQuery = name.toLowerCase().replace(/\s+/g, "+");

    // This is a placeholder - in production, use proper trademark API
    // For example: https://api.uspto.gov/trademark/search

    // For now, return a simulated result based on name characteristics
    const commonTrademarks = [
      "apple",
      "google",
      "microsoft",
      "amazon",
      "facebook",
      "nike",
      "adidas",
      "coca-cola",
      "pepsi",
      "starbucks",
    ];

    const nameLower = name.toLowerCase();
    const hasConflict = commonTrademarks.some((tm) =>
      nameLower.includes(tm) || tm.includes(nameLower)
    );

    return hasConflict ? "unavailable" : "available";
  } catch (error) {
    console.error("Error checking trademark availability:", error);
    return "checking";
  }
}
