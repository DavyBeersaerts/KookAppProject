 // Placeholder for AI planner - OpenAI integration coming in next update

interface Recipe {
  id: string;
  name: string;
  cuisine: string;
  difficulty: string;
  prepTime: number;
  cookTime: number;
}

export async function generateWeekPlan(
  recipes: Recipe[],
  preferences: {
    servings: number;
    dietaryRestrictions: string[];
    avoidIngredients: string[];
  },
  lockedMeals: Record<string, string>
) {
  console.log("AI Week planning coming in next update with preferences:", preferences);

  const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
  const plan: Record<string, string> = { ...lockedMeals };

  days.forEach((day) => {
    if (!plan[day] && recipes.length > 0) {
      const randomRecipe = recipes[Math.floor(Math.random() * recipes.length)];
      plan[day] = randomRecipe.id;
    }
  });

  return plan;
}

export async function generateDayMeal(
  recipes: Recipe[],
  preferences: {
    servings: number;
    dietaryRestrictions: string[];
    avoidIngredients: string[];
  },
  existingPlan: Record<string, string>
) {
  console.log("AI Day planning coming in next update with preferences:", preferences, "and plan:", existingPlan);

  if (recipes.length === 0) return null;

  const randomRecipe = recipes[Math.floor(Math.random() * recipes.length)];
  return randomRecipe.id;
}

export async function spinWeekPlan(recipes: any[], weekStartDate: Date) {
  console.log("Spinning week plan starting from:", weekStartDate);

  const days = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(weekStartDate);
    date.setDate(date.getDate() + i);

    const randomRecipe = recipes.length > 0
      ? recipes[Math.floor(Math.random() * recipes.length)]
      : null;

    days.push({
      date: date.toISOString(),
      recipeId: randomRecipe?.id || null,
      notes: "",
      locked: false,
    });
  }

  return days;
}
