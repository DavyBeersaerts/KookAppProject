import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { recipes, households } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { Plus, Clock, Users } from "lucide-react";
import { TRANSLATIONS } from "@/lib/constants";

export default async function RecipesPage() {
  const session = await auth();
  const householdId = session?.user?.householdId;

  if (!householdId) {
    return <div>Please set up your household first.</div>;
  }

  const household = await db
    .select()
    .from(households)
    .where(eq(households.id, householdId))
    .then((h) => h[0]);

  const language = household?.settings?.language || "en";
  const t = TRANSLATIONS[language];

  const allRecipes = await db
    .select()
    .from(recipes)
    .where(eq(recipes.householdId, householdId))
    .orderBy(desc(recipes.createdAt));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t.recipes}</h1>
          <p className="text-muted-foreground">{t.manageRecipes}</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/recipes/new">
            <Plus className="mr-2 h-4 w-4" />
            {t.addRecipe}
          </Link>
        </Button>
      </div>

      {allRecipes.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>{t.noRecipesYet}</CardTitle>
            <CardDescription>
              {t.startBuilding}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/dashboard/recipes/new">
                <Plus className="mr-2 h-4 w-4" />
                {t.addFirstRecipe}
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {allRecipes.map((recipe) => (
            <Link key={recipe.id} href={`/dashboard/recipes/${recipe.id}`}>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
                {recipe.imageUrl && (
                  <div className="relative h-48 w-full">
                    <Image
                      src={recipe.imageUrl}
                      alt={recipe.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="line-clamp-1">{recipe.title}</CardTitle>
                  {recipe.description && (
                    <CardDescription className="line-clamp-2">
                      {recipe.description}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    {recipe.totalTime && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {recipe.totalTime} min
                      </div>
                    )}
                    {recipe.servings && (
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {recipe.servings} {language === "nl" ? "porties" : "servings"}
                      </div>
                    )}
                  </div>
                  {recipe.tags && recipe.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {recipe.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}