import { currentUser } from "@clerk/nextjs/server";
import { projectsTable, ScreenConfigTable } from "@/config/schema";
import { NextResponse, NextRequest } from "next/server";
import { db } from "@/config/db";
import { and, eq } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const { userInput, device, projectId } = await request.json();
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await db
      .insert(projectsTable)
      .values({
        projectId: projectId,
        userId: user?.primaryEmailAddress?.emailAddress as string,
        device: device,
        userInput: userInput,
      })
      .returning();

    return NextResponse.json(result[0]);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  const projectId = await req.nextUrl.searchParams.get("projectId");
  const user = await currentUser();

  try {
    const result = await db
      .select()
      .from(projectsTable)
      .where(
        and(
          eq(projectsTable.projectId, projectId as string),
          eq(
            projectsTable.userId,
            user?.primaryEmailAddress?.emailAddress as string,
          ),
        ),
      );

    const screenConfig = await db
      .select()
      .from(ScreenConfigTable)
      .where(eq(ScreenConfigTable.projectId, projectId as string));

    return NextResponse.json({
      projectDetail: result[0],
      screenConfig: screenConfig,
    });
  } catch (e) {
    return NextResponse.json({ msg: "Error" });
  }
}
