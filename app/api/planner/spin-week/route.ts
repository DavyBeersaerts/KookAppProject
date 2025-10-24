import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { recipes } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { spinWeekPlan } from "@/lib/ai/planner";
import { format, addDays } from "date-fns";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.householdId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { householdId, weekStart, weekEnd } = await request.json();

    const allRecipes = await db
      .select()
      .from(recipes)
      .where(eq(recipes.householdId, householdId));

    if (allRecipes.length === 0) {
      return NextResponse.json(
        { error: "No recipes available. Add some recipes first." },
        { status: 400 }
      );
    }

    const weekStartDate = new Date(weekStart);
    const days = await spinWeekPlan(allRecipes, weekStartDate);

    const plan = {
      householdId,
      weekStart: weekStartDate,
      weekEnd: new Date(weekEnd),
      days,
      status: "draft",
    };

    return NextResponse.json({ plan });
  } catch (error) {
    console.error("Error spinning week:", error);
    return NextResponse.json({ error: "Failed to spin week" }, { status: 500 });
  }
}
