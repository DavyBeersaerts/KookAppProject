// Placeholder for AI shopping list generator - OpenAI integration coming in next update

interface Recipe {
  id: string;
  name: string;
  ingredients: Array<{
    item: string;
    quantity: number;
    unit: string;
  }>;
}

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

const CATEGORY_MAP: Record<string, string> = {
  tomato: "Produce",
  onion: "Produce",
  garlic: "Produce",
  potato: "Produce",
  carrot: "Produce",
  bread: "Bakery",
  flour: "Bakery",
  cheese: "Dairy",
  milk: "Dairy",
  butter: "Dairy",
  chicken: "Meat & Fish",
  beef: "Meat & Fish",
  fish: "Meat & Fish",
  pasta: "Pantry",
  rice: "Pantry",
  oil: "Pantry",
  salt: "Pantry",
  pepper: "Pantry",
};

export async function generateShoppingList(
  recipes: Recipe[],
  pantryItems: string[] = []
): Promise<ShoppingItem[]> {
  console.log("AI Shopping list generation coming in next update");

  const itemsMap = new Map<string, ShoppingItem>();

  recipes.forEach((recipe) => {
    recipe.ingredients.forEach((ingredient) => {
      const key = ingredient.item.toLowerCase();
      
      // Skip if in pantry
      if (pantryItems.includes(key)) return;

      if (itemsMap.has(key)) {
        const existing = itemsMap.get(key)!;
        existing.quantity += ingredient.quantity;
        existing.recipeRefs.push({
          recipeId: recipe.id,
          recipeName: recipe.name,
        });
      } else {
        const category = getCategoryForIngredient(ingredient.item);
        itemsMap.set(key, {
          id: `item-${Date.now()}-${Math.random()}`,
          ingredient: ingredient.item,
          quantity: ingredient.quantity,
          unit: ingredient.unit,
          category,
          recipeRefs: [
            {
              recipeId: recipe.id,
              recipeName: recipe.name,
            },
          ],
          obtained: false,
        });
      }
    });
  });

  return Array.from(itemsMap.values());
}

function getCategoryForIngredient(ingredient: string): string {
  const lower = ingredient.toLowerCase();
  
  for (const [key, category] of Object.entries(CATEGORY_MAP)) {
    if (lower.includes(key)) {
      return category;
    }
  }
  
  return "Pantry";
}
