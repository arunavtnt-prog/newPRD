/**
 * Copy Generation API Route
 *
 * Handles AI-powered copy generation using OpenAI
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";
import OpenAI from "openai";

const generateSchema = z.object({
  purpose: z.enum([
    "HOMEPAGE_HERO",
    "HOMEPAGE_SUBTITLE",
    "ABOUT_STORY",
    "PRODUCT_HEADLINE",
    "PRODUCT_DESCRIPTION",
    "PRODUCT_FEATURES",
    "CTA_BUTTON",
    "EMAIL_SUBJECT",
    "EMAIL_PREVIEW",
    "SOCIAL_CAPTION",
    "AD_HEADLINE",
    "AD_DESCRIPTION",
    "SEO_TITLE",
    "META_DESCRIPTION",
  ]),
  context: z.string().min(1),
  targetLength: z.number().int().nullable().optional(),
  projectName: z.string(),
});

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generate copy variations using OpenAI GPT-4
 */
async function generateCopyVariations(
  purpose: string,
  context: string,
  projectName: string,
  targetLength: number,
  brandData?: any
): Promise<string[]> {
  // Create purpose-specific prompts
  const purposePrompts: Record<string, string> = {
    HOMEPAGE_HERO: `Write 3 compelling hero headlines for a ${brandData?.category || 'brand'} called ${projectName}. Each should be ${targetLength} characters or less, powerful, and immediately capture attention.`,
    HOMEPAGE_SUBTITLE: `Write 3 engaging subtitle/subheadlines that complement a hero section for ${projectName}. Keep each under ${targetLength} characters. They should expand on the value proposition.`,
    ABOUT_STORY: `Write 3 variations of an authentic brand story for ${projectName}. Each should be ${targetLength} characters, emotionally resonant, and explain why the brand exists.`,
    PRODUCT_HEADLINE: `Write 3 product headline variations for ${projectName}. Each should be ${targetLength} characters or less, benefit-focused, and make customers want to learn more.`,
    PRODUCT_DESCRIPTION: `Write 3 compelling product descriptions for ${projectName}. Each should be around ${targetLength} characters, highlight key benefits, and address customer pain points.`,
    PRODUCT_FEATURES: `Write 3 variations of product feature copy for ${projectName}. Each should be ${targetLength} characters or less, specific, and benefit-driven rather than just listing specs.`,
    CTA_BUTTON: `Write 3 action-oriented call-to-action button texts for ${projectName}. Keep each under ${targetLength} characters. Make them urgent and valuable.`,
    EMAIL_SUBJECT: `Write 3 email subject line variations for ${projectName}. Each must be under ${targetLength} characters, attention-grabbing, and encourage opens.`,
    EMAIL_PREVIEW: `Write 3 email preview text variations for ${projectName}. Keep each under ${targetLength} characters. They should complement the subject line and drive opens.`,
    SOCIAL_CAPTION: `Write 3 social media caption variations for ${projectName}. Each around ${targetLength} characters. Make them engaging, shareable, and include a subtle call-to-action.`,
    AD_HEADLINE: `Write 3 paid ad headline variations for ${projectName}. Each under ${targetLength} characters. Focus on stopping the scroll and sparking curiosity.`,
    AD_DESCRIPTION: `Write 3 paid ad description variations for ${projectName}. Each around ${targetLength} characters. Emphasize unique value and create urgency.`,
    SEO_TITLE: `Write 3 SEO-optimized page title variations for ${projectName}. Each under ${targetLength} characters. Include relevant keywords naturally while remaining compelling.`,
    META_DESCRIPTION: `Write 3 meta description variations for ${projectName}. Each around ${targetLength} characters. Optimize for click-through rate while including key terms.`,
  };

  const prompt = purposePrompts[purpose] || `Write 3 copywriting variations for ${projectName}.`;

  const fullPrompt = `${prompt}

Context: ${context}

${brandData?.brandVision ? `Brand Vision: ${brandData.brandVision}` : ''}
${brandData?.toneOfVoice ? `Tone of Voice: ${brandData.toneOfVoice}` : ''}
${brandData?.targetAudience ? `Target Audience: ${brandData.targetAudience}` : ''}

Requirements:
- Write exactly 3 distinct variations
- Each variation should be unique and approach the message differently
- Match the specified character length as closely as possible
- Align with the brand's tone and voice
- Be specific to the brand, not generic
- Format: Return only the 3 variations, numbered 1-3, one per line

Example format:
1. [First variation]
2. [Second variation]
3. [Third variation]`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are an expert copywriter specializing in direct-to-consumer brands. You create compelling, conversion-focused copy that resonates with target audiences and drives action.",
        },
        {
          role: "user",
          content: fullPrompt,
        },
      ],
      temperature: 0.8,
      max_tokens: 500,
    });

    const response = completion.choices[0]?.message?.content || "";

    // Parse the numbered variations
    const variations = response
      .split("\n")
      .filter((line) => /^\d\./.test(line.trim()))
      .map((line) => line.replace(/^\d\.\s*/, "").trim())
      .filter((line) => line.length > 0);

    // If we got fewer than 3, pad with generic ones
    while (variations.length < 3) {
      variations.push(`${projectName} - ${context.substring(0, 30)}...`);
    }

    return variations.slice(0, 3);
  } catch (error) {
    console.error("OpenAI API Error:", error);

    // Fallback to simple variations if OpenAI fails
    return [
      `${projectName}: ${context.substring(0, targetLength - projectName.length - 2)}`,
      `Discover ${projectName} - ${context.substring(0, targetLength - projectName.length - 13)}`,
      `${context.substring(0, targetLength - 10)} | ${projectName}`,
    ];
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const projectId = params.id;

    // Verify project exists and fetch brand data
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: {
        id: true,
        projectName: true,
        category: true,
        discovery: {
          select: {
            brandVision: true,
            brandMission: true,
            toneOfVoice: true,
            targetAgeRange: true,
            targetGender: true,
            targetIncome: true,
            audiencePainPoints: true,
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = generateSchema.parse(body);

    // Prepare brand data for AI context
    const brandData = {
      category: project.category,
      brandVision: project.discovery?.brandVision,
      toneOfVoice: project.discovery?.toneOfVoice,
      targetAudience: project.discovery
        ? `${project.discovery.targetGender}, ${project.discovery.targetAgeRange}, ${project.discovery.targetIncome}`
        : undefined,
    };

    // Generate copy variations using OpenAI
    const variations = await generateCopyVariations(
      validatedData.purpose,
      validatedData.context,
      validatedData.projectName,
      validatedData.targetLength || 100,
      brandData
    );

    // Create copy snippets for each variation
    const snippets = await Promise.all(
      variations.map((content, index) =>
        prisma.copySnippet.create({
          data: {
            projectId: projectId,
            purpose: validatedData.purpose,
            content: content,
            context: validatedData.context,
            targetLength: validatedData.targetLength,
            generatedBy: "AI",
            prompt: `Generate ${validatedData.purpose} copy: ${validatedData.context}`,
            variation: index + 1,
          },
        })
      )
    );

    // Create activity log
    await prisma.activity.create({
      data: {
        projectId: projectId,
        userId: session.user.id,
        actionType: "COPY_GENERATED",
        actionDescription: `Generated ${variations.length} ${validatedData.purpose.replace(/_/g, " ").toLowerCase()} variations`,
        metadata: JSON.stringify({
          purpose: validatedData.purpose,
          variationCount: variations.length,
        }),
      },
    });

    return NextResponse.json({ snippets }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error generating copy:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
