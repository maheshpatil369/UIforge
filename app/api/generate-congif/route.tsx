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
      content: `
Return JSON only.

Structure:
{
  "projectName": string,
  "theme": string,
  "screens": [
    {
      "id": string,
      "name": string,
      "purpose": string,
      "screenDescription": string,
      "features": string[]
    }
  ]
}

screenDescription must be a short paragraph explaining the screen.
`
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
        theme: JSONaiResult.theme ?? null,
        config: JSONaiResult,
      })
      .where(eq(projectsTable.projectId, projectId));

await Promise.all(
  (JSONaiResult.screens || []).map((screen: any, index: number) =>
    db.insert(ScreenConfigTable).values({
      projectId,
      screenId: screen.id ?? `screen-${index + 1}`,
      screenName: screen.name ?? "Untitled Screen",
      purpose: screen.purpose ?? "",
      screenDescription:
        screen.screenDescription ??
        screen.description ??
        screen.layoutDescription ??
        "",
      code: screen.code ?? "",
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

