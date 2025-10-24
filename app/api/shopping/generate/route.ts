import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { shoppingLists, recipes } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { generateShoppingList } from "@/lib/ai/shopping-generator";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.householdId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { householdId, plan } = await request.json();

    const recipeIds = plan
      .map((day: any) => day.recipeId)
      .filter((id: string | null) => id !== null);

    if (recipeIds.length === 0) {
      return NextResponse.json(
        { error: "No recipes in plan" },
        { status: 400 }
      );
    }

    const planRecipes = await db
      .select()
      .from(recipes)
      .where(eq(recipes.householdId, householdId));

    const selectedRecipes = planRecipes.filter((r) =>
      recipeIds.includes(r.id)
    );

    // Map database recipes to the format expected by generateShoppingList
    const recipesForGenerator = selectedRecipes.map((r) => ({
      id: r.id,
      name: r.title,
      ingredients: r.ingredients,
    }));

    const items = await generateShoppingList(recipesForGenerator);

    const [list] = await db
      .insert(shoppingLists)
      .values({
        householdId,
        items,
        status: "active",
      })
      .returning();

    return NextResponse.json({ list: { ...list, items } });
  } catch (error) {
    console.error("Error generating shopping list:", error);
    return NextResponse.json(
      { error: "Failed to generate shopping list" },
      { status: 500 }
    );
  }
}
