import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { recipes, plans, shoppingLists } from "@/lib/db/schema";
import { NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.householdId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const recipe = await db.query.recipes.findFirst({
      where: and(
        eq(recipes.id, params.id),
        eq(recipes.householdId, session.user.householdId)
      ),
    });

    if (!recipe) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }

    return NextResponse.json({ recipe });
  } catch (error) {
    console.error("Error fetching recipe:", error);
    return NextResponse.json({ error: "Failed to fetch recipe" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.householdId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const existingRecipe = await db.query.recipes.findFirst({
      where: and(
        eq(recipes.id, params.id),
        eq(recipes.householdId, session.user.householdId)
      ),
    });

    if (!existingRecipe) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }

    if (existingRecipe.createdBy !== session.user.id) {
      return NextResponse.json(
        { error: "You can only edit recipes you created" },
        { status: 403 }
      );
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

    const [updatedRecipe] = await db
      .update(recipes)
      .set({
        title,
        description,
        servings,
        prepTime,
        cookTime,
        totalTime,
        cuisine,
        tags,
        ingredients: recipeIngredients,
        steps,
        imageUrl,
        sourceUrl,
        updatedAt: new Date(),
      })
      .where(eq(recipes.id, params.id))
      .returning();

    return NextResponse.json({ recipe: updatedRecipe });
  } catch (error) {
    console.error("Error updating recipe:", error);
    return NextResponse.json({ error: "Failed to update recipe" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.householdId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const existingRecipe = await db.query.recipes.findFirst({
      where: and(
        eq(recipes.id, params.id),
        eq(recipes.householdId, session.user.householdId)
      ),
    });

    if (!existingRecipe) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }

    if (existingRecipe.createdBy !== session.user.id) {
      return NextResponse.json(
        { error: "You can only delete recipes you created" },
        { status: 403 }
      );
    }

    const householdPlans = await db.query.plans.findMany({
      where: eq(plans.householdId, session.user.householdId),
    });

    for (const plan of householdPlans) {
      const updatedDays = plan.days.map((day) => ({
        ...day,
        recipeId: day.recipeId === params.id ? null : day.recipeId,
      }));

      if (JSON.stringify(updatedDays) !== JSON.stringify(plan.days)) {
        await db
          .update(plans)
          .set({ days: updatedDays, updatedAt: new Date() })
          .where(eq(plans.id, plan.id));
      }
    }

    const householdShoppingLists = await db.query.shoppingLists.findMany({
      where: eq(shoppingLists.householdId, session.user.householdId),
    });

    for (const list of householdShoppingLists) {
      const updatedItems = list.items.map((item) => ({
        ...item,
        recipeRefs: item.recipeRefs.filter((ref) => ref.recipeId !== params.id),
      })).filter((item) => item.recipeRefs.length > 0);

      if (JSON.stringify(updatedItems) !== JSON.stringify(list.items)) {
        await db
          .update(shoppingLists)
          .set({ items: updatedItems, updatedAt: new Date() })
          .where(eq(shoppingLists.id, list.id));
      }
    }

    await db.delete(recipes).where(eq(recipes.id, params.id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting recipe:", error);
    return NextResponse.json({ error: "Failed to delete recipe" }, { status: 500 });
  }
}
