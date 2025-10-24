// Placeholder for AI features - OpenAI integration coming in next update

export async function extractRecipeFromUrl(url: string) {
  console.log("AI Recipe extraction coming in next update for:", url);

  // Return mock data for now
  return {
    name: "Imported Recipe",
    description: "Recipe imported from URL - AI extraction coming soon",
    cuisine: "Unknown",
    difficulty: "medium" as const,
    prepTime: 30,
    cookTime: 30,
    servings: 4,
    ingredients: [
      { item: "Ingredient 1", quantity: 1, unit: "cup" },
      { item: "Ingredient 2", quantity: 2, unit: "tbsp" },
    ],
    instructions: [
      "Step 1: AI extraction coming in next update",
      "Step 2: Please add recipe details manually for now",
    ],
    tags: ["imported"],
    imageUrl: null,
  };
}

export async function extractRecipeFromImage(imageData: string) {
  console.log("AI Image extraction coming in next update");

  return {
    name: "Recipe from Image",
    description: "Recipe extracted from image - AI coming soon",
    cuisine: "Unknown",
    difficulty: "medium" as const,
    prepTime: 30,
    cookTime: 30,
    servings: 4,
    ingredients: [],
    instructions: ["AI extraction coming in next update"],
    tags: ["image-import"],
    imageUrl: imageData,
  };
}
