import { db } from "./index";
import { households, users, recipes, ingredients } from "./schema";

const DEMO_RECIPE_URLS = [
  "https://dagelijksekost.vrt.be/gerechten/mosselen-tikka-masala-met-pilavrijst",
  "https://www.vincenzosplate.com/spaghetti-carbonara-recipe/",
  "https://www.vincenzosplate.com/bolognese-sauce/",
];

async function importRecipeFromUrl(url: string, householdId: string, userId: string) {
  try {
    console.log(`Importing recipe from: ${url}`);
    
    const response = await fetch("http://localhost:3000/api/recipes/import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      console.error(`Failed to import from ${url}: ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    
    if (!data.recipe) {
      console.error(`No recipe data returned from ${url}`);
      return null;
    }

    const recipe = data.recipe;

    const processedIngredients = await Promise.all(
      (recipe.ingredients || []).map(async (ing: any) => {
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

    const totalTime = (recipe.prepTime || 0) + (recipe.cookTime || 0);
    
    const [insertedRecipe] = await db
      .insert(recipes)
      .values({
        householdId,
        title: recipe.title,
        description: recipe.description,
        servings: recipe.servings || 4,
        prepTime: recipe.prepTime || 0,
        cookTime: recipe.cookTime || 0,
        totalTime,
        cuisine: recipe.cuisine || "",
        tags: recipe.tags || [],
        ingredients: processedIngredients,
        steps: recipe.steps || [],
        imageUrl: recipe.imageUrl || "",
        sourceUrl: url,
        createdBy: userId,
      })
      .returning();

    console.log(`✓ Successfully imported: ${recipe.title}`);
    return insertedRecipe;
  } catch (error) {
    console.error(`Error importing recipe from ${url}:`, error);
    return null;
  }
}

export async function seedDemoData() {
  console.log("Starting database seed...");

  let household = await db.query.households.findFirst({
    where: (households, { eq }) => eq(households.id, "demo-household-1"),
  });

  let user;

  if (!household) {
    console.log("Creating demo household...");
    [household] = await db
      .insert(households)
      .values({
        id: "demo-household-1",
        name: "Demo Household",
        settings: {
          language: "en",
          defaultView: "recipe",
          varietyToggles: {
            cuisineDiversity: true,
            proteinRotation: true,
            starchRotation: true,
            prepTimeMix: true,
          },
        },
      })
      .returning();
    console.log("✓ Household created");

    console.log("Creating demo user...");
    [user] = await db
      .insert(users)
      .values({
        id: "demo-user-1",
        name: "Demo User",
        email: "demo@example.com",
        householdId: household.id,
        role: "owner",
      })
      .returning();
    console.log("✓ User created");
  } else {
    console.log("Demo household already exists, using existing data");
    user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, "demo-user-1"),
    });
  }

  if (!user) {
    console.error("Demo user not found!");
    return;
  }

  const existingRecipes = await db.query.recipes.findMany({
    where: (recipes, { eq }) => eq(recipes.householdId, household.id),
  });

  console.log(`Found ${existingRecipes.length} existing recipes`);

  console.log("\nImporting recipes from URLs...");
  console.log("Note: This requires the dev server to be running on localhost:3000\n");

  let successCount = 0;
  for (const url of DEMO_RECIPE_URLS) {
    const existingRecipe = existingRecipes.find(r => r.sourceUrl === url);
    if (existingRecipe) {
      console.log(`⊘ Skipping (already exists): ${existingRecipe.title}`);
      continue;
    }

    const recipe = await importRecipeFromUrl(url, household.id, user.id);
    if (recipe) {
      successCount++;
    }
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  console.log(`\n✓ Successfully imported ${successCount} new recipes`);
  console.log("✓ Database seeded successfully!");
}

export async function seedManualRecipes() {
  console.log("Seeding with manual recipes...");

  const household = await db.query.households.findFirst({
    where: (households, { eq }) => eq(households.id, "demo-household-1"),
  });

  if (!household) {
    console.error("Demo household not found. Run seedDemoData first.");
    return;
  }

  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, "demo-user-1"),
  });

  if (!user) {
    console.error("Demo user not found. Run seedDemoData first.");
    return;
  }

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

  const existingRecipes = await db.query.recipes.findMany({
    where: (recipes, { eq }) => eq(recipes.householdId, household.id),
  });

  for (const recipeData of manualRecipes) {
    const exists = existingRecipes.find(r => r.title === recipeData.title);
    if (exists) {
      console.log(`⊘ Skipping (already exists): ${recipeData.title}`);
      continue;
    }

    const processedIngredients = await Promise.all(
      recipeData.ingredients.map(async (ing) => {
        const existingIngredient = await db.query.ingredients.findFirst({
          where: (ingredients, { eq, and }) => and(
            eq(ingredients.householdId, household.id),
            eq(ingredients.name, ing.item.toLowerCase().trim())
          ),
        });

        let ingredientId = existingIngredient?.id;

        if (!existingIngredient) {
          const [newIngredient] = await db
            .insert(ingredients)
            .values({
              householdId: household.id,
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
      householdId: household.id,
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
      createdBy: user.id,
    });

    console.log(`✓ Added: ${recipeData.title}`);
  }

  console.log("✓ Manual recipes seeded successfully!");
}