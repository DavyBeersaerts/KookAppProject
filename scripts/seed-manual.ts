import { db } from "../lib/db";
import { recipes, ingredients } from "../lib/db/schema";

async function seedManual() {
  console.log("Seeding manual recipes to demo-household-1...");

  const householdId = "demo-household-1";
  const userId = "demo-user-1";

  const manualRecipes = [
    {
      title: "Classic Spaghetti Carbonara",
      description: "A traditional Italian pasta dish with eggs, cheese, and pancetta",
      servings: 4,
      prepTime: 10,
      cookTime: 20,
      cuisine: "Italian",
      tags: ["pasta", "quick", "italian"],
      ingredients: [
        { quantity: 400, unit: "g", item: "spaghetti" },
        { quantity: 200, unit: "g", item: "pancetta" },
        { quantity: 4, unit: "piece", item: "eggs" },
        { quantity: 100, unit: "g", item: "parmesan cheese" },
        { quantity: 1, unit: "pinch", item: "black pepper" },
      ],
      steps: [
        "Cook spaghetti according to package instructions",
        "Fry pancetta until crispy",
        "Beat eggs with grated parmesan",
        "Drain pasta, reserving some pasta water",
        "Mix hot pasta with pancetta, then remove from heat",
        "Add egg mixture, stirring quickly to create a creamy sauce",
        "Add pasta water if needed to adjust consistency",
        "Season with black pepper and serve immediately",
      ],
      imageUrl: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800",
    },
    {
      title: "Chicken Tikka Masala",
      description: "Tender chicken in a creamy, spiced tomato sauce",
      servings: 6,
      prepTime: 30,
      cookTime: 40,
      cuisine: "Indian",
      tags: ["chicken", "curry", "indian", "spicy"],
      ingredients: [
        { quantity: 800, unit: "g", item: "chicken breast" },
        { quantity: 400, unit: "ml", item: "coconut cream" },
        { quantity: 400, unit: "g", item: "crushed tomatoes" },
        { quantity: 2, unit: "piece", item: "onions" },
        { quantity: 4, unit: "clove", item: "garlic" },
        { quantity: 2, unit: "tbsp", item: "garam masala" },
        { quantity: 1, unit: "tbsp", item: "turmeric" },
        { quantity: 2, unit: "tbsp", item: "vegetable oil" },
      ],
      steps: [
        "Cut chicken into bite-sized pieces",
        "Marinate chicken with half the spices and yogurt for 30 minutes",
        "Dice onions and mince garlic",
        "Heat oil in a large pan and cook onions until soft",
        "Add garlic and remaining spices, cook for 1 minute",
        "Add chicken and cook until browned",
        "Add crushed tomatoes and simmer for 15 minutes",
        "Stir in coconut cream and simmer for another 10 minutes",
        "Serve with rice or naan bread",
      ],
      imageUrl: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800",
    },
    {
      title: "Belgian Beef Stew (Stoofvlees)",
      description: "Traditional Flemish beef stew cooked in beer",
      servings: 6,
      prepTime: 20,
      cookTime: 180,
      cuisine: "Belgian",
      tags: ["beef", "stew", "belgian", "comfort food"],
      ingredients: [
        { quantity: 1, unit: "kg", item: "beef chuck" },
        { quantity: 500, unit: "ml", item: "dark beer" },
        { quantity: 3, unit: "piece", item: "onions" },
        { quantity: 2, unit: "tbsp", item: "flour" },
        { quantity: 2, unit: "tbsp", item: "mustard" },
        { quantity: 2, unit: "piece", item: "bay leaves" },
        { quantity: 2, unit: "tbsp", item: "butter" },
      ],
      steps: [
        "Cut beef into large cubes",
        "Slice onions thinly",
        "Brown beef in butter in a heavy pot",
        "Remove beef and cook onions until caramelized",
        "Sprinkle flour over onions and stir",
        "Add beer, mustard, and bay leaves",
        "Return beef to pot and bring to a simmer",
        "Cover and cook on low heat for 3 hours",
        "Serve with fries or bread",
      ],
      imageUrl: "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=800",
    },
  ];

  for (const recipeData of manualRecipes) {
    console.log(`Adding: ${recipeData.title}`);

    const processedIngredients = await Promise.all(
      recipeData.ingredients.map(async (ing) => {
        const existingIngredient = await db.query.ingredients.findFirst({
          where: (ingredients, { eq, and }) => and(
            eq(ingredients.householdId, householdId),
            eq(ingredients.name, ing.item.toLowerCase().trim())
          ),
        });

        let ingredientId = existingIngredient?.id;

        if (!existingIngredient) {
          const [newIngredient] = await db
            .insert(ingredients)
            .values({
              householdId,
              name: ing.item.toLowerCase().trim(),
              defaultUnit: ing.unit,
            })
            .returning();
          ingredientId = newIngredient.id;
        }

        return {
          ...ing,
          ingredientId,
        };
      })
    );

    const totalTime = recipeData.prepTime + recipeData.cookTime;

    await db.insert(recipes).values({
      householdId,
      title: recipeData.title,
      description: recipeData.description,
      servings: recipeData.servings,
      prepTime: recipeData.prepTime,
      cookTime: recipeData.cookTime,
      totalTime,
      cuisine: recipeData.cuisine,
      tags: recipeData.tags,
      ingredients: processedIngredients,
      steps: recipeData.steps,
      imageUrl: recipeData.imageUrl,
      createdBy: userId,
    });

    console.log(`✓ Added: ${recipeData.title}`);
  }

  console.log("\n✓ Done!");
}

seedManual().then(() => process.exit(0)).catch(console.error);