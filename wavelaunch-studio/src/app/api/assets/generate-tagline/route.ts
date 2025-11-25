/**
 * Tagline Generation API
 *
 * Generates brand taglines using AI (Claude)
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
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
    const { projectId } = body;

    if (!projectId) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 }
      );
    }

    // Get project with discovery data
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        OR: [
          { leadStrategistId: session.user.id },
          {
            projectUsers: {
              some: {
                userId: session.user.id,
              },
            },
          },
        ],
      },
      include: {
        discovery: true,
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found or access denied" },
        { status: 404 }
      );
    }

    if (!project.discovery) {
      return NextResponse.json(
        { error: "Project must complete Discovery phase first" },
        { status: 400 }
      );
    }

    // Generate taglines using AI
    const taglines = await generateTaglinesWithAI(project, project.discovery);

    // Save taglines to database
    const savedTaglines = await Promise.all(
      taglines.map(async (tagline) => {
        return await prisma.tagline.create({
          data: {
            projectId: project.id,
            taglineText: tagline.text,
            explanation: tagline.explanation,
            status: "PENDING",
          },
        });
      })
    );

    // Create activity log
    await prisma.activity.create({
      data: {
        projectId: project.id,
        userId: session.user.id,
        activityType: "ASSET_GENERATED",
        description: `Generated ${savedTaglines.length} tagline option(s) using AI`,
      },
    });

    return NextResponse.json({
      success: true,
      taglines: savedTaglines.map((t) => ({
        id: t.id,
        text: t.taglineText,
        explanation: t.explanation,
        status: t.status,
      })),
      message: `Generated ${savedTaglines.length} tagline options successfully`,
    });
  } catch (error) {
    console.error("Error generating taglines:", error);
    return NextResponse.json(
      { error: "Failed to generate taglines" },
      { status: 500 }
    );
  }
}

async function generateTaglinesWithAI(
  project: any,
  discovery: any
): Promise<Array<{ text: string; explanation: string }>> {
  try {
    // Build AI prompt from discovery data
    const prompt = buildTaglinePrompt(project, discovery);

    // Call Claude AI
    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1500,
      temperature: 0.8,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    // Parse response
    const responseText = message.content[0].type === "text"
      ? message.content[0].text
      : "";

    return parseTaglines(responseText);
  } catch (error) {
    console.error("Error calling AI for taglines:", error);
    throw new Error("Failed to generate taglines with AI");
  }
}

function buildTaglinePrompt(project: any, discovery: any): string {
  let prompt = `You are a professional brand copywriter. Generate 8 unique, memorable taglines for the following brand:

Brand Name: ${project.projectName}`;

  if (discovery.brandDescription) {
    prompt += `\nBrand Description: ${discovery.brandDescription}`;
  }

  if (discovery.brandPersonality) {
    prompt += `\nBrand Personality: ${discovery.brandPersonality}`;
  }

  if (discovery.targetAudience) {
    prompt += `\nTarget Audience: ${discovery.targetAudience}`;
  }

  if (discovery.uniqueValue) {
    prompt += `\nUnique Value Proposition: ${discovery.uniqueValue}`;
  }

  if (discovery.toneOfVoice) {
    prompt += `\nTone of Voice: ${discovery.toneOfVoice}`;
  }

  prompt += `\n\nRequirements:
1. Each tagline should be under 8 words
2. Taglines should capture the brand essence and appeal to the target audience
3. Make them memorable, unique, and impactful
4. Consider the tone of voice in your suggestions
5. Avoid clichés and generic phrases
6. Each tagline should communicate a clear brand benefit or positioning

Format your response as a JSON array with this structure:
[
  {
    "text": "The tagline text",
    "explanation": "Brief explanation of why this tagline works for the brand"
  }
]

Only return the JSON array, no additional text.`;

  return prompt;
}

function parseTaglines(responseText: string): Array<{ text: string; explanation: string }> {
  try {
    // Extract JSON from response
    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error("No JSON array found in response");
    }

    const taglines = JSON.parse(jsonMatch[0]);

    if (!Array.isArray(taglines)) {
      throw new Error("Response is not an array");
    }

    return taglines.map((t: any) => ({
      text: t.text || t.tagline || "Untitled",
      explanation: t.explanation || t.rationale || "No explanation provided",
    }));
  } catch (error) {
    console.error("Error parsing taglines:", error);
    // Fallback taglines
    return [
      {
        text: "Innovation meets simplicity",
        explanation: "Positions the brand as forward-thinking yet accessible",
      },
      {
        text: "Where quality lives",
        explanation: "Emphasizes commitment to excellence",
      },
      {
        text: "Your story, our passion",
        explanation: "Creates personal connection with customers",
      },
      {
        text: "Designed for life",
        explanation: "Suggests practical, everyday relevance",
      },
      {
        text: "Beyond expectations",
        explanation: "Promises to exceed customer needs",
      },
      {
        text: "Make it matter",
        explanation: "Empowers customers with purpose",
      },
      {
        text: "Crafted with care",
        explanation: "Highlights attention to detail and quality",
      },
      {
        text: "The difference is clear",
        explanation: "Emphasizes unique value proposition",
      },
    ];
  }
}
