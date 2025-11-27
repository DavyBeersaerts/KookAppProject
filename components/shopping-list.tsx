"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Download, Trash2, X } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { TRANSLATIONS } from "@/lib/constants";
import { useRouter } from "next/navigation";

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
  const { language } = useLanguage();
  const t = TRANSLATIONS[language];
  const router = useRouter();
  const [items, setItems] = useState<ShoppingItem[]>(list.items);
  const [view, setView] = useState<"category" | "recipe">("category");
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [deletedItems, setDeletedItems] = useState<ShoppingItem[]>([]);
  const [undoTimeout, setUndoTimeout] = useState<NodeJS.Timeout | null>(null);

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

  const removeItem = async (itemId: string) => {
    const itemToRemove = items.find((item) => item.id === itemId);
    if (!itemToRemove) return;

    const newItems = items.filter((item) => item.id !== itemId);
    setItems(newItems);
    setDeletedItems([itemToRemove]);

    if (undoTimeout) {
      clearTimeout(undoTimeout);
    }

    const timeout = setTimeout(async () => {
      await fetch(`/api/shopping/${list.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: newItems }),
      });
      setDeletedItems([]);
    }, 5000);

    setUndoTimeout(timeout);
  };

  const undoRemove = () => {
    if (undoTimeout) {
      clearTimeout(undoTimeout);
      setUndoTimeout(null);
    }
    setItems([...items, ...deletedItems]);
    setDeletedItems([]);
  };

  const clearList = async () => {
    try {
      const response = await fetch(`/api/shopping/${list.id}/clear`, {
        method: "POST",
      });

      if (response.ok) {
        setItems([]);
        setShowClearConfirm(false);
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to clear list:", error);
    }
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
      {deletedItems.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <p className="text-sm">{t.itemRemoved}</p>
              <Button onClick={undoRemove} variant="outline" size="sm">
                {t.undo}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {showClearConfirm && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-900">{t.clearListConfirm}</CardTitle>
            <CardDescription className="text-red-700">
              {t.clearListMessage}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button
                onClick={clearList}
                variant="destructive"
                size="sm"
              >
                {t.confirm}
              </Button>
              <Button
                onClick={() => setShowClearConfirm(false)}
                variant="outline"
                size="sm"
              >
                {t.cancel}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Progress</CardTitle>
              <CardDescription>
                {completedCount} of {totalCount} items {t.obtained.toLowerCase()}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button onClick={exportList} variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Button
                onClick={() => setShowClearConfirm(true)}
                variant="outline"
                size="sm"
                disabled={items.length === 0}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {t.clearList}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="w-full bg-secondary rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
            />
          </div>
        </CardContent>
      </Card>

      <Tabs value={view} onValueChange={(v) => setView(v as "category" | "recipe")}>
        <TabsList>
          <TabsTrigger value="category">By {t.category}</TabsTrigger>
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
                      className="flex items-start gap-3 p-2 rounded-md hover:bg-accent group"
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
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeItem(item.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
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
                  className="flex items-start gap-3 p-2 rounded-md hover:bg-accent group"
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
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeItem(item.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
