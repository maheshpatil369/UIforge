//routes.tsx
import { usersTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/config/db";



export async function POST(req: NextRequest) {
    const user = await currentUser();
if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    

    const users = await db.select().from(usersTable)
    .where(eq(usersTable.email, user?.primaryEmailAddress?.emailAddress!));

    if(users?.length === 0) {

   const data ={
    name: user?.fullName ?? '',
    email: user?.primaryEmailAddress?.emailAddress as string,
   }
    const result=await db.insert(usersTable).values({
        ...data
    }).returning();

    return NextResponse.json(result);
}

return NextResponse.json(users[0] ?? {});

}