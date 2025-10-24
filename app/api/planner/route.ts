import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { plans } from "@/lib/db/schema";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.householdId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { householdId, weekStart, weekEnd, days } = body;

    const [plan] = await db
      .insert(plans)
      .values({
        householdId,
        weekStart: new Date(weekStart),
        weekEnd: new Date(weekEnd),
        days,
        status: "active",
      })
      .returning();

    return NextResponse.json({ plan });
  } catch (error) {
    console.error("Error creating plan:", error);
    return NextResponse.json({ error: "Failed to create plan" }, { status: 500 });
  }
}
