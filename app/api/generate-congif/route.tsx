import { NextRequest, NextResponse } from "next/server";
import { projectsTable, ScreenConfigTable } from "@/config/schema";
import { db } from "@/config/db";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  console.log("🟢 [API HIT] /api/generate-config");

  try {
    console.log("🟡 [STEP 1] Reading request body...");
    const { userInput, projectId } = await req.json();

    console.log("🟢 userInput:", userInput);
    console.log("🟢 projectId:", projectId);

    console.log("🟡 [STEP 2] Calling OpenRouter REST API...");

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://uixmaker.in",
          "X-Title": "UIForge",
        },
        body: JSON.stringify({
          model: "openai/gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: `
Return JSON only.
Theme MUST be exactly ONE of:
GOOGLE, NETFLIX, HOTSTAR, YOUTUBE, GITHUB, MICROSOFT, WHATSAPP, TELEGRAM

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
`,
            },
            {
              role: "user",
              content: userInput,
            },
          ],
          temperature: 0.2,
          stream: false,
        }),
      }
    );

    console.log("🟢 OpenRouter HTTP status:", response.status);

    console.log("🟡 [STEP 3] Reading OpenRouter response JSON...");
    const data = await response.json();

    console.log("🟢 OpenRouter raw response:", data);

    const text = data?.choices?.[0]?.message?.content;

    console.log("🟢 Extracted AI text:", text);

    if (!text) {
      throw new Error("Empty AI response from OpenRouter");
    }

    console.log("🟡 [STEP 4] Parsing AI JSON...");
    const JSONaiResult = JSON.parse(text);

    console.log("🟢 Parsed JSON:", JSONaiResult);

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

    console.log("🟢 [SUCCESS] All screens inserted");
    console.log("🟢 [SUCCESS] Returning response to client");

    return NextResponse.json(JSONaiResult);

  } catch (error: any) {
    console.error("🔴 [API ERROR] generate-config failed");
    console.error("🔴 Error message:", error?.message);
    console.error("🔴 Full error:", error);

    return NextResponse.json(
      { error: error?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
