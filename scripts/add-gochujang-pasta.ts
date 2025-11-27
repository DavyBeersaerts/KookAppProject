import { db } from "../lib/db";
import { recipes } from "../lib/db/schema";

async function addRecipe() {
  console.log("Adding Baked Veg + Gochujang Pasta...");

  const householdId = "demo-household-1";
  const userId = "demo-user-1";

  const recipe = {
    householdId,
    createdBy: userId,
    title: "Baked Veg + Gochujang Pasta",
    description: "Roasted vegetables blended into a creamy gochujang sauce with pasta",
    servings: 6,
    prepTime: 15,
    cookTime: 35,
    totalTime: 50,
    cuisine: "Korean Fusion",
    tags: ["pasta", "vegetarian", "gochujang", "roasted vegetables", "korean fusion"],
    ingredients: [
      { quantity: 500, unit: "g", item: "pasta (rigatoni, fusilli, or pasta that grabs sauce)" },
      { quantity: 2, unit: "medium", item: "zucchini, chunked" },
      { quantity: 3, unit: "whole", item: "bell peppers (1 red, 1 yellow, 1 orange), chunked" },
      { quantity: 1, unit: "kg", item: "cherry tomatoes, halved" },
      { quantity: 250, unit: "g", item: "button mushrooms, halved" },
      { quantity: 2, unit: "small", item: "red onions, cut into wedges" },
      { quantity: 1, unit: "bulb", item: "garlic, cloves smashed" },
      { quantity: 4, unit: "tbsp", item: "olive oil" },
      { quantity: 3, unit: "tbsp", item: "balsamic vinegar" },
      { quantity: 3, unit: "tbsp", item: "tomato paste" },
      { quantity: 480, unit: "ml", item: "vegetable stock, warm" },
      { quantity: 120, unit: "ml", item: "heavy cream" },
      { quantity: 1, unit: "tbsp", item: "cornstarch" },
      { quantity: 2.5, unit: "tbsp", item: "gochujang (2 tbsp medium; 3 tbsp hot)" },
      { quantity: 1.25, unit: "tbsp", item: "soy sauce" },
      { quantity: 2, unit: "tsp", item: "rice vinegar" },
      { quantity: 1.5, unit: "tsp", item: "honey or sugar" },
      { quantity: 120, unit: "g", item: "Parmesan, finely grated, plus extra to serve" },
      { quantity: 2, unit: "tbsp", item: "butter (optional)" },
      { quantity: 1.5, unit: "tsp", item: "smoked paprika" },
      { quantity: 1, unit: "tsp", item: "fennel seeds, lightly crushed" },
      { quantity: 1.5, unit: "tsp", item: "black pepper, freshly ground" },
      { quantity: 1, unit: "tsp", item: "red pepper flakes (optional)" },
      { quantity: 0.5, unit: "tsp", item: "cumin" },
      { quantity: 1, unit: "tsp", item: "dried oregano" },
      { quantity: 0.5, unit: "tsp", item: "MSG (optional)" },
      { quantity: 1, unit: "to taste", item: "kosher salt" },
    ],
    steps: [
      "Heat oven to 190°C/375°F fan off (200°C if conventional). On 2 large sheet pans, toss zucchini, peppers, cherry tomatoes, mushrooms, onions, and garlic with olive oil, balsamic, 1.5 tsp salt, half the black pepper, and half the spice blend (smoked paprika, fennel, cumin, oregano, MSG). Spread in a single layer.",
      "Roast 25-30 minutes, tossing halfway, until edges are browned and tomatoes collapsed.",
      "Set aside 2 cups of the roasted veg for topping. To a blender add remaining roasted veg, warm veg stock, cream, tomato paste, cornstarch, gochujang, soy sauce, rice vinegar, honey/sugar, and the rest of the spice blend. Blend until very smooth and glossy. Taste and adjust salt/soy, acid, and heat.",
      "Cook pasta in aggressively salted water until 1-2 minutes shy of al dente. Reserve 500-700ml pasta water; drain.",
      "In a wide pot over medium heat, add the blended sauce and 250ml pasta water; bring to a gentle simmer. Add pasta and 2 tbsp butter (optional); toss vigorously 2-3 minutes, adding more pasta water as needed until the sauce is silky and clings to the pasta.",
      "Off heat, fold in most of the Parmesan. Adjust with a splash more pasta water if tight.",
      "Top with the reserved roasted veg. Shower with more Parmesan and black pepper. Drizzle good olive oil.",
    ],
    imageUrl: null,
  };

  await db.insert(recipes).values(recipe);
  console.log("✅ Recipe added successfully!");
}

addRecipe()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error adding recipe:", error);
    process.exit(1);
  });