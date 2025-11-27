import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { shoppingLists } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.householdId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const list = await db.query.shoppingLists.findFirst({
      where: eq(shoppingLists.id, params.id),
    });

    if (!list || list.householdId !== session.user.householdId) {
      return NextResponse.json({ error: "Shopping list not found" }, { status: 404 });
    }

    return NextResponse.json({ list });
  } catch (error) {
    console.error("Error fetching shopping list:", error);
    return NextResponse.json(
      { error: "Failed to fetch shopping list" },
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
    if (!session?.user?.householdId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { items } = await request.json();

    const [updated] = await db
      .update(shoppingLists)
      .set({ items, updatedAt: new Date() })
      .where(eq(shoppingLists.id, params.id))
      .returning();

    return NextResponse.json({ list: updated });
  } catch (error) {
    console.error("Error updating shopping list:", error);
    return NextResponse.json(
      { error: "Failed to update shopping list" },
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
    if (!session?.user?.householdId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const list = await db.query.shoppingLists.findFirst({
      where: eq(shoppingLists.id, params.id),
    });

    if (!list || list.householdId !== session.user.householdId) {
      return NextResponse.json({ error: "Shopping list not found" }, { status: 404 });
    }

    await db.delete(shoppingLists).where(eq(shoppingLists.id, params.id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting shopping list:", error);
    return NextResponse.json(
      { error: "Failed to delete shopping list" },
      { status: 500 }
    );
  }
}
