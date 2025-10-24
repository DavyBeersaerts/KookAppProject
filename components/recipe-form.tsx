"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Link as LinkIcon, Loader2 } from "lucide-react";
import { METRIC_UNITS } from "@/lib/constants";
import { useLanguage } from "@/lib/language-context";

interface Ingredient {
  quantity: number;
  unit: string;
  item: string;
  notes?: string;
}

export function RecipeForm() {
  const router = useRouter();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [importUrl, setImportUrl] = useState("");
  const [importing, setImporting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    servings: 2,
    prepTime: 0,
    cookTime: 0,
    cuisine: "",
    tags: [] as string[],
    ingredients: [{ quantity: 0, unit: "", item: "", notes: "" }] as Ingredient[],
    steps: [""],
    imageUrl: "",
  });

  const handleImportUrl = async () => {
    if (!importUrl) return;
    setImporting(true);
    try {
      const response = await fetch("/api/recipes/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: importUrl }),
      });
      const data = await response.json();
      if (data.recipe) {
        setFormData({
          title: data.recipe.title || "",
          description: data.recipe.description || "",
          servings: data.recipe.servings || 2,
          prepTime: data.recipe.prepTime || 0,
          cookTime: data.recipe.cookTime || 0,
          cuisine: data.recipe.cuisine || "",
          tags: data.recipe.tags || [],
          ingredients: data.recipe.ingredients?.map((ing: any) => ({
            quantity: ing.quantity || 0,
            unit: ing.unit || "",
            item: ing.item || "",
            notes: ing.notes || ""
          })) || [{ quantity: 0, unit: "", item: "", notes: "" }],
          steps: data.recipe.steps?.map((s: any) => s || "") || [""],
          imageUrl: data.recipe.imageUrl || "",
        });
      }
    } catch (error) {
      console.error("Import failed:", error);
    } finally {
      setImporting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server error:", errorData);
        alert(`Failed to save recipe: ${errorData.error || 'Unknown error'}`);
        return;
      }
      
      router.push("/dashboard/recipes");
      router.refresh();
    } catch (error) {
      console.error("Failed to create recipe:", error);
      alert("Failed to save recipe. Please check the console for details.");
    } finally {
      setLoading(false);
    }
  };

  const addIngredient = () => {
    setFormData({
      ...formData,
      ingredients: [...formData.ingredients, { quantity: 0, unit: "", item: "", notes: "" }],
    });
  };

  const removeIngredient = (index: number) => {
    setFormData({
      ...formData,
      ingredients: formData.ingredients.filter((_, i) => i !== index),
    });
  };

  const updateIngredient = (index: number, field: keyof Ingredient, value: any) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index] = { ...newIngredients[index], [field]: value };
    setFormData({ ...formData, ingredients: newIngredients });
  };

  const addStep = () => {
    setFormData({
      ...formData,
      steps: [...formData.steps, ""],
    });
  };

  const removeStep = (index: number) => {
    setFormData({
      ...formData,
      steps: formData.steps.filter((_, i) => i !== index),
    });
  };

  const updateStep = (index: number, value: string) => {
    const newSteps = [...formData.steps];
    newSteps[index] = value;
    setFormData({ ...formData, steps: newSteps });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="manual" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="import">{t.importFromUrl}</TabsTrigger>
          <TabsTrigger value="manual">{t.manualEntry}</TabsTrigger>
        </TabsList>

        <TabsContent value="import">
          <Card>
            <CardHeader>
              <CardTitle>{t.importFromUrl}</CardTitle>
              <CardDescription>
                {t.pasteRecipeUrl}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  placeholder="https://example.com/recipe"
                  value={importUrl}
                  onChange={(e) => setImportUrl(e.target.value)}
                />
                <Button type="button" onClick={handleImportUrl} disabled={importing}>
                  {importing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <LinkIcon className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manual">
          <div className="text-sm text-muted-foreground mb-4">
            {t.fillManually}
          </div>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>{t.basicInformation}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">{t.recipeTitle} *</Label>
            <Input
              id="title"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{t.description}</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="servings">{t.servings}</Label>
              <Input
                id="servings"
                type="number"
                value={formData.servings}
                onChange={(e) => setFormData({ ...formData, servings: parseInt(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="prepTime">{t.prepTime}</Label>
              <Input
                id="prepTime"
                type="number"
                value={formData.prepTime}
                onChange={(e) => setFormData({ ...formData, prepTime: parseInt(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cookTime">{t.cookTime}</Label>
              <Input
                id="cookTime"
                type="number"
                value={formData.cookTime}
                onChange={(e) => setFormData({ ...formData, cookTime: parseInt(e.target.value) })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cuisine">{t.cuisine}</Label>
            <Input
              id="cuisine"
              value={formData.cuisine}
              onChange={(e) => setFormData({ ...formData, cuisine: e.target.value })}
              placeholder="e.g., Italian, Belgian, Asian"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">{t.imageUrl}</Label>
            <Input
              id="imageUrl"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t.ingredients}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.ingredients.map((ingredient, index) => (
            <div key={index} className="flex gap-2 items-start">
              <Input
                type="number"
                placeholder={t.quantity}
                className="w-20"
                value={ingredient.quantity ?? ""}
                onChange={(e) =>
                  updateIngredient(
                    index,
                    "quantity",
                    e.target.value === "" ? "" : parseFloat(e.target.value)
                  )
                }
              />
              <Select
                value={ingredient.unit ?? ""}
                onValueChange={(value) => updateIngredient(index, "unit", value)}
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder={t.unit} />
                </SelectTrigger>
                <SelectContent>
                  {METRIC_UNITS.map((unit) => (
                    <SelectItem key={unit.value} value={unit.value}>
                      {unit.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder={t.ingredient}
                className="flex-1"
                value={ingredient.item ?? ""}
                onChange={(e) => updateIngredient(index, "item", e.target.value)}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeIngredient(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={addIngredient}>
            <Plus className="h-4 w-4 mr-2" />
            {t.addIngredient}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t.instructions}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.steps.map((step, index) => (
            <div key={index} className="flex gap-2 items-start">
              <span className="text-sm font-medium mt-2">{index + 1}.</span>
              <Textarea
                placeholder={t.stepDescription}
                className="flex-1"
                value={step || ""}
                onChange={(e) => updateStep(index, e.target.value)}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeStep(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={addStep}>
            <Plus className="h-4 w-4 mr-2" />
            {t.addStep}
          </Button>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button type="submit" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          {t.saveRecipe}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          {t.cancel}
        </Button>
      </div>
    </form>
  );
}