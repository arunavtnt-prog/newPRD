/**
 * Brand Name Generation API
 *
 * Uses AI to generate brand name suggestions based on keywords and style
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { keywords, industry, style, discoveryData } = body;

    if (!keywords || keywords.trim().length < 3) {
      return NextResponse.json(
        { error: "Keywords must be at least 3 characters" },
        { status: 400 }
      );
    }

    // Build AI prompt based on inputs
    const prompt = buildNamingPrompt(keywords, industry, style, discoveryData);

    // Call Claude AI for name generation
    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 2000,
      temperature: 0.9,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    // Parse the response
    const responseText = message.content[0].type === "text"
      ? message.content[0].text
      : "";

    const suggestions = parseNameSuggestions(responseText);

    // Check domain availability for each name
    const suggestionsWithAvailability = await Promise.all(
      suggestions.map(async (suggestion) => {
        const domainAvailable = await checkDomainAvailability(suggestion.name);
        return {
          ...suggestion,
          domainAvailable,
          trademarkStatus: "checking" as const,
          favorite: false,
        };
      })
    );

    return NextResponse.json({
      suggestions: suggestionsWithAvailability,
    });
  } catch (error) {
    console.error("Error generating brand names:", error);
    return NextResponse.json(
      { error: "Failed to generate names" },
      { status: 500 }
    );
  }
}

function buildNamingPrompt(
  keywords: string,
  industry: string,
  style: string,
  discoveryData?: any
): string {
  let prompt = `You are a professional brand naming consultant. Generate 10 unique, memorable brand names based on the following:

Keywords/Description: ${keywords}`;

  if (industry) {
    prompt += `\nIndustry: ${industry}`;
  }

  prompt += `\nNaming Style: ${style}`;

  if (discoveryData?.brandDescription) {
    prompt += `\nBrand Description: ${discoveryData.brandDescription}`;
  }

  if (discoveryData?.targetAudience) {
    prompt += `\nTarget Audience: ${discoveryData.targetAudience}`;
  }

  if (discoveryData?.toneOfVoice) {
    prompt += `\nTone of Voice: ${discoveryData.toneOfVoice}`;
  }

  prompt += `\n\nRequirements:
1. Each name should be memorable, unique, and easy to pronounce
2. Names should be 1-2 words maximum
3. Consider the ${style} style in your suggestions
4. Ensure names are suitable for a ${industry || "modern"} brand
5. Avoid generic or overly common words
6. Names should work well as domain names (.com)

Format your response as a JSON array with this structure:
[
  {
    "name": "BrandName",
    "description": "Brief explanation of the name's meaning and why it fits"
  }
]

Only return the JSON array, no additional text.`;

  return prompt;
}

function parseNameSuggestions(responseText: string): Array<{
  name: string;
  description: string;
}> {
  try {
    // Try to extract JSON from the response
    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error("No JSON array found in response");
    }

    const suggestions = JSON.parse(jsonMatch[0]);

    if (!Array.isArray(suggestions)) {
      throw new Error("Response is not an array");
    }

    return suggestions.map((s: any) => ({
      name: s.name || s.brandName || "Unnamed",
      description: s.description || s.rationale || "No description provided",
    }));
  } catch (error) {
    console.error("Error parsing name suggestions:", error);
    // Fallback: return dummy data
    return [
      {
        name: "BrandWave",
        description: "A modern, memorable name suggesting innovation and forward movement",
      },
      {
        name: "Lumina",
        description: "Derived from 'illuminate', suggesting clarity and brilliance",
      },
      {
        name: "Nexus",
        description: "Represents connection and centrality in your industry",
      },
      {
        name: "Zenith",
        description: "The highest point, suggesting excellence and peak performance",
      },
      {
        name: "Vibe",
        description: "Short, memorable, and captures positive energy",
      },
    ];
  }
}

async function checkDomainAvailability(name: string): Promise<boolean> {
  try {
    // Convert to domain format
    const domain = `${name.toLowerCase().replace(/\s+/g, "")}.com`;

    // Simple DNS lookup to check if domain resolves
    // In production, you'd use a proper domain availability API like:
    // - GoDaddy Domain Availability API
    // - Namecheap API
    // - Domain.com API

    // For now, we'll do a simple DNS check
    const response = await fetch(`https://dns.google/resolve?name=${domain}&type=A`);
    const data = await response.json();

    // If DNS returns NXDOMAIN or no answer, domain might be available
    // Note: This is not 100% accurate and should be replaced with a proper API
    return data.Status === 3 || !data.Answer;
  } catch (error) {
    console.error("Error checking domain availability:", error);
    // If check fails, assume not available to be safe
    return false;
  }
}
