import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { recipes, ingredients } from "@/lib/db/schema";
import { NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.householdId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      description,
      servings,
      prepTime,
      cookTime,
      cuisine,
      tags,
      ingredients: recipeIngredients,
      steps,
      imageUrl,
      sourceUrl,
    } = body;

    const totalTime = (prepTime || 0) + (cookTime || 0);

    const processedIngredients = await Promise.all(
      recipeIngredients.map(async (ing: any) => {
        const existingIngredient = await db.query.ingredients.findFirst({
          where: and(
            eq(ingredients.householdId, session.user.householdId!),
            eq(ingredients.name, ing.item.toLowerCase().trim())
          ),
        });

        let ingredientId = existingIngredient?.id;

        if (!existingIngredient) {
          const [newIngredient] = await db
            .insert(ingredients)
            .values({
              householdId: session.user.householdId!,
              name: ing.item.toLowerCase().trim(),
              defaultUnit: ing.unit,
            })
            .returning();
          ingredientId = newIngredient.id;
        }

        return {
          ...ing,
          ingredientId,
        };
      })
    );

    const [recipe] = await db
      .insert(recipes)
      .values({
        householdId: session.user.householdId,
        title,
        description,
        servings,
        prepTime,
        cookTime,
        totalTime,
        cuisine,
        tags,
        ingredients: processedIngredients,
        steps,
        imageUrl,
        sourceUrl,
        createdBy: session.user.id,
      })
      .returning();

    return NextResponse.json({ recipe });
  } catch (error) {
    console.error("Error creating recipe:", error);
    return NextResponse.json({ error: "Failed to create recipe" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.householdId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const allRecipes = await db.query.recipes.findMany({
      where: (recipes, { eq }) => eq(recipes.householdId, session.user.householdId!),
      orderBy: (recipes, { desc }) => [desc(recipes.createdAt)],
    });

    return NextResponse.json({ recipes: allRecipes });
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return NextResponse.json({ error: "Failed to fetch recipes" }, { status: 500 });
  }
}
