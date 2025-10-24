"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Download } from "lucide-react";

interface ShoppingItem {
  id: string;
  ingredient: string;
  quantity: number;
  unit: string;
  category: string;
  recipeRefs: Array<{ recipeId: string; recipeName: string }>;
  notes?: string;
  obtained: boolean;
}

interface ShoppingListProps {
  list: {
    id: string;
    items: ShoppingItem[];
  };
  householdId: string;
}

const BELGIAN_CATEGORIES = [
  "Produce",
  "Bakery",
  "Charcuterie",
  "Dairy",
  "Meat & Fish",
  "Frozen",
  "Pantry",
  "Beverages",
  "Household",
  "Personal Care",
];

export function ShoppingList({ list }: ShoppingListProps) {
  const [items, setItems] = useState<ShoppingItem[]>(list.items);
  const [view, setView] = useState<"category" | "recipe">("category");

  const toggleObtained = async (itemId: string) => {
    const newItems = items.map((item) =>
      item.id === itemId ? { ...item, obtained: !item.obtained } : item
    );
    setItems(newItems);

    await fetch(`/api/shopping/${list.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: newItems }),
    });
  };

  const exportList = () => {
    const text = items
      .map(
        (item) =>
          `${item.quantity} ${item.unit} ${item.ingredient} - ${item.category}`
      )
      .join("\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "shopping-list.txt";
    a.click();
  };

  const itemsByCategory = BELGIAN_CATEGORIES.reduce((acc, category) => {
    acc[category] = items.filter((item) => item.category === category);
    return acc;
  }, {} as Record<string, ShoppingItem[]>);

  const uncategorized = items.filter(
    (item) => !BELGIAN_CATEGORIES.includes(item.category)
  );
  if (uncategorized.length > 0) {
    itemsByCategory["Other"] = uncategorized;
  }

  const completedCount = items.filter((item) => item.obtained).length;
  const totalCount = items.length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Progress</CardTitle>
              <CardDescription>
                {completedCount} of {totalCount} items obtained
              </CardDescription>
            </div>
            <Button onClick={exportList} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="w-full bg-secondary rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${(completedCount / totalCount) * 100}%` }}
            />
          </div>
        </CardContent>
      </Card>

      <Tabs value={view} onValueChange={(v) => setView(v as "category" | "recipe")}>
        <TabsList>
          <TabsTrigger value="category">By Category</TabsTrigger>
          <TabsTrigger value="recipe">By Recipe</TabsTrigger>
        </TabsList>

        <TabsContent value="category" className="space-y-4">
          {Object.entries(itemsByCategory).map(([category, categoryItems]) => {
            if (categoryItems.length === 0) return null;
            return (
              <Card key={category}>
                <CardHeader>
                  <CardTitle className="text-lg">{category}</CardTitle>
                  <CardDescription>
                    {categoryItems.length} item{categoryItems.length !== 1 ? "s" : ""}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {categoryItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start gap-3 p-2 rounded-md hover:bg-accent"
                    >
                      <Checkbox
                        checked={item.obtained}
                        onCheckedChange={() => toggleObtained(item.id)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <p
                          className={`font-medium ${
                            item.obtained ? "line-through text-muted-foreground" : ""
                          }`}
                        >
                          {item.quantity} {item.unit} {item.ingredient}
                        </p>
                        {item.recipeRefs.length > 0 && (
                          <p className="text-xs text-muted-foreground">
                            For: {item.recipeRefs.map((r) => r.recipeName).join(", ")}
                          </p>
                        )}
                        {item.notes && (
                          <p className="text-xs text-muted-foreground italic">
                            {item.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        <TabsContent value="recipe" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-3 p-2 rounded-md hover:bg-accent"
                >
                  <Checkbox
                    checked={item.obtained}
                    onCheckedChange={() => toggleObtained(item.id)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <p
                      className={`font-medium ${
                        item.obtained ? "line-through text-muted-foreground" : ""
                      }`}
                    >
                      {item.quantity} {item.unit} {item.ingredient}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.category}
                      {item.recipeRefs.length > 0 &&
                        ` • ${item.recipeRefs.map((r) => r.recipeName).join(", ")}`}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
