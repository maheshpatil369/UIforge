import { currentUser } from "@clerk/nextjs/server";
import { projectsTable, ScreenConfigTable } from "@/config/schema";
import { NextResponse, NextRequest } from "next/server";
import { db } from "@/config/db";
import { and, eq } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const { userInput, device, projectId } = await request.json();
    const user = await currentUser();

    if (!user?.primaryEmailAddress?.emailAddress) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const existing = await db
      .select()
      .from(projectsTable)
      .where(eq(projectsTable.projectId, projectId));

    if (existing.length > 0) {
      return NextResponse.json(existing[0]);
    }

    const result = await db
      .insert(projectsTable)
      .values({
        projectId,
        userId: user.primaryEmailAddress.emailAddress,
        device,
        userInput,
      })
      .returning();

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("POST /project error:", error);
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}


export async function GET(req: NextRequest) {
  try {
    const projectId = req.nextUrl.searchParams.get("projectId");
    const user = await currentUser();

    if (!projectId) {
      return NextResponse.json(
        { error: "projectId missing" },
        { status: 400 }
      );
    }

    if (!user?.primaryEmailAddress?.emailAddress) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const project = await db
      .select()
      .from(projectsTable)
      .where(
        and(
          eq(projectsTable.projectId, projectId),
          eq(
            projectsTable.userId,
            user.primaryEmailAddress.emailAddress
          )
        )
      );

    if (!project.length) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    const screenConfig = await db
      .select()
      .from(ScreenConfigTable)
      .where(eq(ScreenConfigTable.projectId, projectId));

    return NextResponse.json({
      projectDetail: project[0],
      screenConfig,
    });
  } catch (error) {
    console.error("GET /api/project ERROR:", error);
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}


