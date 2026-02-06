import { currentUser } from "@clerk/nextjs/server";
import { projectsTable } from "@/config/schema";
import { NextResponse } from "next/server";
import { db } from "@/config/db";

export async function post(request: Request) {
    const {userInput, device,projectId} = await request.json();
    const user = await currentUser();

    const result=await db.insert(projectsTable).values({
        projectId:projectId,
        userId:user?.primaryEmailAddress?.emailAddress as string,
        device:device,
        userInput:userInput
    }).returning();

    return NextResponse.json(result [0]);
}