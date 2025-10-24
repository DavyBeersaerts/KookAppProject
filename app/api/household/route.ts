import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { households, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, userId } = await request.json();

    const [household] = await db
      .insert(households)
      .values({ name })
      .returning();

    await db
      .update(users)
      .set({ householdId: household.id })
      .where(eq(users.id, userId));

    return NextResponse.json({ household });
  } catch (error) {
    console.error("Error creating household:", error);
    return NextResponse.json(
      { error: "Failed to create household" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.householdId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { householdId, settings } = await request.json();

    if (householdId !== session.user.householdId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await db
      .update(households)
      .set({ settings, updatedAt: new Date() })
      .where(eq(households.id, householdId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating household:", error);
    return NextResponse.json(
      { error: "Failed to update household" },
      { status: 500 }
    );
  }
}
