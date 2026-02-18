import { ScreenConfigTable } from "@/config/schema";
import { GENERATE_SCREEN_PROMPT } from "@/data/Prompt";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/config/db";
import { and, eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  console.log("🟢 [API HIT] /api/generate-screen-ui");

  try {
    console.log("🟡 [STEP 1] Parsing request body...");
    const {
      projectId,
      screenId,
      ScreenName,
      purpose,
      screenDescription,
    } = await req.json();

    console.log("🟢 projectId:", projectId);
    console.log("🟢 screenId:", screenId);
    console.log("🟢 ScreenName:", ScreenName);
    console.log("🟢 purpose:", purpose);
    console.log("🟢 screenDescription:", screenDescription);

    const userInput = `
screen Name: ${ScreenName}
screen Purpose: ${purpose}
screen Description: ${screenDescription}
`;

    console.log("🟡 [STEP 2] Calling OpenRouter REST API for screen UI...");
    console.log("🧠 Abort signal present:", !!req.signal);

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        signal: req.signal, // 🔥 IMPORTANT: allows abort from client
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://uixmaker.in",
          "X-Title": "UIForge",
        },
        body: JSON.stringify({
          model: "openai/gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: GENERATE_SCREEN_PROMPT,
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

    console.log("🟢 OpenRouter raw response received");

    const generatedCode =
      data?.choices?.[0]?.message?.content ?? "";

    console.log("🟢 Generated UI code length:", generatedCode.length);

    if (!generatedCode || typeof generatedCode !== "string") {
      throw new Error("Empty or invalid UI code from OpenRouter");
    }

    console.log("🟡 [STEP 4] Updating screen code in DB...");

    await db
      .update(ScreenConfigTable)
      .set({ code: generatedCode })
      .where(
        and(
          eq(ScreenConfigTable.projectId, projectId),
          eq(ScreenConfigTable.screenId, screenId)
        )
      );

    console.log("🟢 [SUCCESS] Screen UI saved to DB");

    return NextResponse.json({ code: generatedCode });

  } catch (error: any) {
    // 🔥 VERY IMPORTANT: detect abort vs real error
    if (error?.name === "AbortError") {
      console.warn("🛑 [ABORTED] Screen generation request cancelled by client");

      return NextResponse.json(
        { msg: "Generation aborted by user" },
        { status: 499 } // Client Closed Request (semantic)
      );
    }

    console.error("🔴 [API ERROR] generate-screen-ui failed");
    console.error("🔴 Error message:", error?.message);
    console.error("🔴 Full error:", error);

    return NextResponse.json(
      { msg: "Internal Server Error!" },
      { status: 500 }
    );
  }
}
