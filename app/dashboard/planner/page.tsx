import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { plans, recipes } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { WeekPlanner } from "@/components/week-planner";
import { startOfWeek, endOfWeek } from "date-fns";

export default async function PlannerPage() {
  const session = await auth();
  const householdId = session?.user?.householdId;

  if (!householdId) {
    return <div>Please set up your household first.</div>;
  }

  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

  const [currentPlan, allRecipes] = await Promise.all([
    db
      .select()
      .from(plans)
      .where(eq(plans.householdId, householdId))
      .orderBy(desc(plans.createdAt))
      .limit(1)
      .then((p) => p[0]),
    db.select().from(recipes).where(eq(recipes.householdId, householdId)),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Weekly Planner</h1>
        <p className="text-muted-foreground">
          Plan your meals for the week and generate shopping lists
        </p>
      </div>

      <WeekPlanner
        householdId={householdId}
        currentPlan={currentPlan}
        recipes={allRecipes}
        weekStart={weekStart}
        weekEnd={weekEnd}
      />
    </div>
  );
}
