import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { recipes } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.householdId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { householdId } = await request.json();

    const allRecipes = await db
      .select()
      .from(recipes)
      .where(eq(recipes.householdId, householdId));

    if (allRecipes.length === 0) {
      return NextResponse.json(
        { error: "No recipes available" },
        { status: 400 }
      );
    }

    const randomRecipe = allRecipes[Math.floor(Math.random() * allRecipes.length)];

    return NextResponse.json({ recipeId: randomRecipe.id });
  } catch (error) {
    console.error("Error spinning day:", error);
    return NextResponse.json({ error: "Failed to spin day" }, { status: 500 });
  }
}
