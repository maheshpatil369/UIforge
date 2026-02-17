import { NextRequest, NextResponse } from "next/server";
import { openrouter } from "@/config/openrouter";
import { APP_LAYOUT_CONFIG_PROMPT, GENERATE_SCREEN_PROMPT } from "@/data/Prompt";
import { projectsTable, ScreenConfigTable } from "@/config/schema";
import { db } from "@/config/db";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  console.log("🟢 [API] /generate-config HIT");

  try {
    console.log("🟡 [STEP 1] Parsing request body...");
    const { userInput, projectId } = await req.json();

    console.log("🟢 userInput:", userInput);
    console.log("🟢 projectId:", projectId);

    console.log("🟡 [STEP 2] Calling OpenRouter model...");
    const result = await openrouter.callModel({
      model: "openai/gpt-4o-mini",
      input: [
        {
          role: "system",
          content: `
Return JSON only.
Theme MUST be exactly ONE of:
GOOGLE, NETFLIX, HOTSTAR, YOUTUBE, GITHUB, MICROSOFT, WHATSAPP, TELEGRAM

Choose the best match based on the product style.
Return ONLY the selected theme key.

Structure:
{
  "projectName": string,
  "theme": "GOOGLE" | "NETFLIX" | "HOTSTAR" | "YOUTUBE" | "GITHUB" | "MICROSOFT" | "WHATSAPP" | "TELEGRAM",
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

console.log("🟡 [STEP 3] Reading AI response output...");

console.log("🟡 [STEP 3] Reading AI response text...");

let text: string;

try {
  text = await result.getText();
} catch (e) {
  console.error("🔴 getText() failed, raw result:", result);
  throw new Error("Unexpected response type from OpenRouter");
}

console.log("🟢 Raw AI text:", text);

if (!text) {
  throw new Error("Empty GPT response");
}

console.log("🟢 Extracted AI text:", text);

    console.log("🟡 [STEP 4] Parsing AI JSON...");
    const JSONaiResult = JSON.parse(text);

    console.log("🟢 Parsed AI JSON:", JSONaiResult);

    console.log("🟡 [STEP 5] Updating project table...");
    await db
      .update(projectsTable)
      .set({
        projectName: JSONaiResult.projectName,
        theme: JSONaiResult.theme ?? null,
        config: JSONaiResult,
      })
      .where(eq(projectsTable.projectId, projectId));

    console.log("🟢 Project table updated");

    console.log("🟡 [STEP 6] Inserting screens...");
    console.log("🟢 Screens count:", JSONaiResult.screens?.length);

    await Promise.all(
      JSONaiResult.screens.map((screen: any) => {
        console.log("➡️ Inserting screen:", screen.name);

        return db.insert(ScreenConfigTable).values({
          projectId,
          screenId:
            screen.id ?? screen.name.toLowerCase().replace(/\s+/g, "-"),
          screenName: screen.name,
          purpose: screen.purpose,
          screenDescription: screen.screenDescription,
          code: "",
        });
      })
    );

    console.log("🟢 All screens inserted successfully");

    console.log("🟢 [SUCCESS] Returning response");
    return NextResponse.json(JSONaiResult);

  } catch (error: any) {
    console.error("🔴 [API ERROR] generate-config FAILED");
    console.error("🔴 Error message:", error?.message);
    console.error("🔴 Full error:", error);

    return NextResponse.json(
      { msg: "Error", error: String(error?.message || error) },
      { status: 500 }
    );
  }
}
