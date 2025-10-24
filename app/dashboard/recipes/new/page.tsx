import { RecipeForm } from "@/components/recipe-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewRecipePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Add New Recipe</h1>
        <p className="text-muted-foreground">
          Import from URL, use AI extraction, or enter manually
        </p>
      </div>

      <RecipeForm />
    </div>
  );
}
