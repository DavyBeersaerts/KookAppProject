import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { shoppingLists } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(
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

    const [updated] = await db
      .update(shoppingLists)
      .set({ items: [], updatedAt: new Date() })
      .where(eq(shoppingLists.id, params.id))
      .returning();

    return NextResponse.json({ list: updated });
  } catch (error) {
    console.error("Error clearing shopping list:", error);
    return NextResponse.json(
      { error: "Failed to clear shopping list" },
      { status: 500 }
    );
  }
}
