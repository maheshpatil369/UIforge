import { openrouter } from "@/config/openrouter";
import { ScreenConfigTable } from "@/config/schema";
import { GENERATE_SCREEN_PROMPT } from "@/data/Prompt";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/config/db";
import { and, eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  const {
    projectId,
    screenId,
    ScreenName,
    purpose,
    screenDescription,
    code: existingCode,
  } = await req.json();

  const userInput = `
    screen Name is: ${ScreenName},
    screen Purpose: ${purpose},
    screen Description: ${screenDescription}
  `;

  try {
    const result = await openrouter.callModel({
      model: "openai/gpt-4o-mini",
      input: [
        {
          role: "system",
          content: GENERATE_SCREEN_PROMPT,
        },
        {
          role: "user",
          content: userInput,
        },
      ],
      text: {
        format: { type: "json_object" },
      },
    });

    const generatedCode = await result.getText();

    const updateResult = await db
      .update(ScreenConfigTable)
      .set({
        code: generatedCode as string,
      })
      .where(
        and(
          eq(ScreenConfigTable.projectId, projectId),
          eq(ScreenConfigTable.screenId, screenId),
        ),
      )
      .returning();

    return NextResponse.json(generatedCode);
  } catch (e) {
    return NextResponse.json({ msg: "Internal Server Error!" });
  }
}
