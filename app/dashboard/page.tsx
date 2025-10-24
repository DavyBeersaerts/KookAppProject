import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { recipes, plans } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChefHat, Calendar, ShoppingCart, Plus } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();
  const householdId = session?.user?.householdId;

  if (!householdId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <h1 className="text-3xl font-bold">Welcome to Rox & Me!</h1>
        <p className="text-muted-foreground">Let's set up your household first.</p>
        <Button asChild>
          <Link href="/dashboard/settings">Set Up Household</Link>
        </Button>
      </div>
    );
  }

  const [recipeCount, recentRecipes, activePlan] = await Promise.all([
    db.select().from(recipes).where(eq(recipes.householdId, householdId)).then(r => r.length),
    db.select().from(recipes).where(eq(recipes.householdId, householdId)).orderBy(desc(recipes.createdAt)).limit(3),
    db.select().from(plans).where(eq(plans.householdId, householdId)).orderBy(desc(plans.createdAt)).limit(1).then(p => p[0]),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">Welcome back!</h1>
        <p className="text-muted-foreground mt-2">Plan your meals and manage your recipes</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Recipes</CardTitle>
            <ChefHat className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recipeCount}</div>
            <p className="text-xs text-muted-foreground">
              {recipeCount === 0 ? "Add your first recipe" : "In your collection"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {activePlan ? activePlan.days.filter((d: any) => d.recipeId).length : 0}
            </div>
            <p className="text-xs text-muted-foreground">Meals planned</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Shopping List</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Ready</div>
            <p className="text-xs text-muted-foreground">Generate from plan</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Get started with common tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild className="w-full justify-start" variant="outline">
              <Link href="/dashboard/recipes/new">
                <Plus className="mr-2 h-4 w-4" />
                Add New Recipe
              </Link>
            </Button>
            <Button asChild className="w-full justify-start" variant="outline">
              <Link href="/dashboard/planner">
                <Calendar className="mr-2 h-4 w-4" />
                Plan This Week
              </Link>
            </Button>
            <Button asChild className="w-full justify-start" variant="outline">
              <Link href="/dashboard/shopping">
                <ShoppingCart className="mr-2 h-4 w-4" />
                View Shopping List
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Recipes</CardTitle>
            <CardDescription>Your latest additions</CardDescription>
          </CardHeader>
          <CardContent>
            {recentRecipes.length === 0 ? (
              <p className="text-sm text-muted-foreground">No recipes yet. Add your first one!</p>
            ) : (
              <div className="space-y-2">
                {recentRecipes.map((recipe) => (
                  <Link
                    key={recipe.id}
                    href={`/dashboard/recipes/${recipe.id}`}
                    className="block p-2 rounded-md hover:bg-accent transition-colors"
                  >
                    <p className="font-medium">{recipe.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {recipe.totalTime ? `${recipe.totalTime} min` : "No time set"}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
