// uiforge\app\api\generate-congif\route.tsx

import { NextRequest, NextResponse } from "next/server";
import { openrouter } from "@/config/openrouter";
import { APP_LAYOUT_CONFIG_PROMPT, GENERATE_SCREEN_PROMPT } from "@/data/Prompt";
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


// for (const screen of JSONaiResult.screens) {
//   const uiResult = await openrouter.callModel({
//     model: "openai/gpt-4o-mini",
//     input: [
//       { role: "system", content: GENERATE_SCREEN_PROMPT },
//       {
//         role: "user",
//         content: `
// Screen Name: ${screen.name}
// Purpose: ${screen.purpose}
// Description: ${screen.screenDescription}
//         `,
//       },
//     ],
//   });

//   let htmlCode = await uiResult.getText();
//   htmlCode = htmlCode?.replace(/```html|```/g, "").trim();

//   screensWithCode.push({
//     ...screen,
//     code: htmlCode,
//   });
// }



await Promise.all(
  JSONaiResult.screens.map((screen: any) =>
    db.insert(ScreenConfigTable).values({
      projectId,
      screenId: screen.id ?? screen.name.toLowerCase().replace(/\s+/g, "-"),
      screenName: screen.name,
      purpose: screen.purpose,
      screenDescription: screen.screenDescription,
      code: "", 
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

