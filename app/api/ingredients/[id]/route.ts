import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { masterIngredients } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [ingredient] = await db
      .select()
      .from(masterIngredients)
      .where(eq(masterIngredients.id, params.id))
      .limit(1);

    if (!ingredient) {
      return NextResponse.json({ error: "Ingredient not found" }, { status: 404 });
    }

    return NextResponse.json({ ingredient });
  } catch (error) {
    console.error("Failed to fetch ingredient:", error);
    return NextResponse.json(
      { error: "Failed to fetch ingredient" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { names, synonyms, category, defaultUnit } = body;

    const [ingredient] = await db
      .update(masterIngredients)
      .set({
        names,
        synonyms,
        category,
        defaultUnit,
        updatedAt: new Date(),
      })
      .where(eq(masterIngredients.id, params.id))
      .returning();

    if (!ingredient) {
      return NextResponse.json({ error: "Ingredient not found" }, { status: 404 });
    }

    return NextResponse.json({ ingredient });
  } catch (error) {
    console.error("Failed to update ingredient:", error);
    return NextResponse.json(
      { error: "Failed to update ingredient" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await db
      .delete(masterIngredients)
      .where(eq(masterIngredients.id, params.id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete ingredient:", error);
    return NextResponse.json(
      { error: "Failed to delete ingredient" },
      { status: 500 }
    );
  }
}
