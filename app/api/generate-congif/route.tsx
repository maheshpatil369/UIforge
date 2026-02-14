import { NextRequest, NextResponse } from "next/server";
import { openrouter } from "@/config/openrouter";
import { APP_LAYOUT_CONFIG_PROMPT } from "@/data/Prompt";
import { projectsTable, ScreenConfigTable } from "@/config/schema";
import { db } from "@/config/db";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const { userInput, projectId } = await req.json();

    const result = await openrouter.callModel({
      model: "openai/gpt-4o-mini",
      input: [
        {
          role: "system",
          content:
            "Return JSON only with keys: projectName, theme, screens[]",
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

    const text = await result.getText();
    if (!text) throw new Error("Empty GPT response");

    const JSONaiResult = JSON.parse(text);

    await db
      .update(projectsTable)
      .set({
        projectName: JSONaiResult.projectName,
        theme: JSONaiResult.theme,
        config: JSONaiResult,
      })
      .where(eq(projectsTable.projectId, projectId));

    await Promise.all(
      (JSONaiResult.screens || []).map((screen: any) =>
        db.insert(ScreenConfigTable).values({
          projectId,
          screenId: screen.id,
          screenName: screen.name,
          purpose: screen.purpose,
          screenDescription: screen.layoutDescription,
          code: screen.code,
        })
      )
    );

    return NextResponse.json(JSONaiResult);
  } catch (error) {
    console.error("GPT API ERROR:", error);

    return NextResponse.json(
      { msg: "Error", error: String(error) },
      { status: 500 }
    );
  }
}

