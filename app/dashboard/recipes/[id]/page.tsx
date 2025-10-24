import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { recipes } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Clock, Users, ChefHat } from "lucide-react";
import { notFound } from "next/navigation";

export default async function RecipeDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();
  const householdId = session?.user?.householdId;

  if (!householdId) {
    return <div>Please set up your household first.</div>;
  }

  const recipe = await db.query.recipes.findFirst({
    where: and(
      eq(recipes.id, params.id),
      eq(recipes.householdId, householdId)
    ),
  });

  if (!recipe) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/recipes">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Recipes
          </Link>
        </Button>
      </div>

      <Card>
        {recipe.imageUrl && (
          <div className="relative h-64 w-full">
            <Image
              src={recipe.imageUrl}
              alt={recipe.title}
              fill
              className="object-cover rounded-t-lg"
            />
          </div>
        )}
        <CardHeader>
          <CardTitle className="text-3xl">{recipe.title}</CardTitle>
          {recipe.description && (
            <CardDescription className="text-base">
              {recipe.description}
            </CardDescription>
          )}
          <div className="flex items-center gap-6 text-sm text-muted-foreground pt-4">
            {recipe.totalTime && (
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span>{recipe.totalTime} min</span>
              </div>
            )}
            {recipe.servings && (
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <span>{recipe.servings} servings</span>
              </div>
            )}
            {recipe.cuisine && (
              <div className="flex items-center gap-2">
                <ChefHat className="h-5 w-5" />
                <span>{recipe.cuisine}</span>
              </div>
            )}
          </div>
          {recipe.tags && recipe.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {recipe.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-secondary text-secondary-foreground px-3 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ingredients</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>
                  {ingredient.quantity} {ingredient.unit} {ingredient.item}
                  {ingredient.notes && (
                    <span className="text-muted-foreground ml-2">
                      ({ingredient.notes})
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-4">
            {recipe.steps.map((step, index) => (
              <li key={index} className="flex gap-4">
                <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-semibold">
                  {index + 1}
                </span>
                <p className="flex-1 pt-1">{step}</p>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      {recipe.sourceUrl && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">
              Source:{" "}
              <a
                href={recipe.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {recipe.sourceUrl}
              </a>
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}