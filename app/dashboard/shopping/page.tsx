import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { shoppingLists } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { ShoppingList } from "@/components/shopping-list";

export default async function ShoppingPage() {
  const session = await auth();
  const householdId = session?.user?.householdId;

  if (!householdId) {
    return <div>Please set up your household first.</div>;
  }

  const activeList = await db
    .select()
    .from(shoppingLists)
    .where(eq(shoppingLists.householdId, householdId))
    .orderBy(desc(shoppingLists.createdAt))
    .limit(1)
    .then((lists) => lists[0]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Shopping List</h1>
        <p className="text-muted-foreground">
          Your consolidated shopping list grouped by category
        </p>
      </div>

      {activeList ? (
        <ShoppingList list={activeList} householdId={householdId} />
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No shopping list yet. Generate one from your weekly plan.
          </p>
        </div>
      )}
    </div>
  );
}
