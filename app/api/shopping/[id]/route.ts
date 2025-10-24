import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { shoppingLists } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

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
      .set({ items })
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
