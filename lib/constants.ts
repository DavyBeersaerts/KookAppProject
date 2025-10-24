export const METRIC_UNITS = [
  { value: "g", label: "gram (g)" },
  { value: "kg", label: "kilogram (kg)" },
  { value: "ml", label: "milliliter (ml)" },
  { value: "l", label: "liter (l)" },
  { value: "tsp", label: "theelepel (tsp)" },
  { value: "tbsp", label: "eetlepel (tbsp)" },
  { value: "cup", label: "kop (cup)" },
  { value: "piece", label: "stuk" },
  { value: "pinch", label: "snufje" },
  { value: "handful", label: "handvol" },
  { value: "slice", label: "plak" },
  { value: "clove", label: "teen" },
  { value: "bunch", label: "bosje" },
  { value: "can", label: "blik" },
  { value: "package", label: "pakje" },
] as const;

export const TRANSLATIONS = {
  en: {
    language: "Language",
    dutch: "Dutch",
    english: "English",
    
    // Navigation
    dashboard: "Dashboard",
    recipes: "Recipes",
    planner: "Planner",
    shopping: "Shopping",
    settings: "Settings",
    signOut: "Sign Out",
    
    // Recipe Form
    quantity: "Quantity",
    unit: "Unit",
    ingredient: "Ingredient",
    notes: "Notes",
    addIngredient: "Add Ingredient",
    removeIngredient: "Remove",
    selectUnit: "Select unit",
    recipeTitle: "Recipe Title",
    description: "Description",
    servings: "Servings",
    prepTime: "Prep Time (min)",
    cookTime: "Cook Time (min)",
    cuisine: "Cuisine",
    imageUrl: "Image URL",
    ingredients: "Ingredients",
    instructions: "Instructions",
    saveRecipe: "Save Recipe",
    cancel: "Cancel",
    basicInformation: "Basic Information",
    addStep: "Add Step",
    stepDescription: "Step description",
    importFromUrl: "Import from URL",
    manualEntry: "Manual Entry",
    pasteRecipeUrl: "Paste recipe URL",
    fillManually: "Fill in the recipe details manually",
    
    // Recipes Page
    manageRecipes: "Manage your recipe collection",
    addRecipe: "Add Recipe",
    noRecipesYet: "No recipes yet",
    startBuilding: "Start building your collection by adding your first recipe",
    addFirstRecipe: "Add Your First Recipe",
    backToRecipes: "Back to Recipes",
    source: "Source",
    
    // Dashboard
    welcomeBack: "Welcome back",
    quickActions: "Quick Actions",
    recentRecipes: "Recent Recipes",
    thisWeeksPlan: "This Week's Plan",
    
    // Settings
    manageHousehold: "Manage your household and preferences",
    createHousehold: "Create Your Household",
    setupHousehold: "Set up your household to start planning meals together",
    householdName: "Household Name",
    createHouseholdBtn: "Create Household",
    householdInfo: "Household Information",
    yourHousehold: "Your household",
    householdId: "Household ID",
    languageSettings: "Language Settings",
    chooseLanguage: "Choose your preferred language",
    saveSettings: "Save Settings",
    
    // Planner
    weekPlanner: "Week Planner",
    planYourMeals: "Plan your meals for the week",
    
    // Shopping
    shoppingList: "Shopping List",
    manageShoppingList: "Manage your shopping list",
  },
  nl: {
    language: "Taal",
    dutch: "Nederlands",
    english: "Engels",
    
    // Navigation
    dashboard: "Dashboard",
    recipes: "Recepten",
    planner: "Planner",
    shopping: "Boodschappen",
    settings: "Instellingen",
    signOut: "Uitloggen",
    
    // Recipe Form
    quantity: "Hoeveelheid",
    unit: "Eenheid",
    ingredient: "Ingrediënt",
    notes: "Notities",
    addIngredient: "Ingrediënt toevoegen",
    removeIngredient: "Verwijderen",
    selectUnit: "Selecteer eenheid",
    recipeTitle: "Recept Titel",
    description: "Beschrijving",
    servings: "Porties",
    prepTime: "Voorbereidingstijd (min)",
    cookTime: "Kooktijd (min)",
    cuisine: "Keuken",
    imageUrl: "Afbeelding URL",
    ingredients: "Ingrediënten",
    instructions: "Instructies",
    saveRecipe: "Recept Opslaan",
    cancel: "Annuleren",
    basicInformation: "Basis Informatie",
    addStep: "Stap Toevoegen",
    stepDescription: "Stap beschrijving",
    importFromUrl: "Importeren van URL",
    manualEntry: "Handmatige Invoer",
    pasteRecipeUrl: "Plak recept URL",
    fillManually: "Vul de receptdetails handmatig in",
    
    // Recipes Page
    manageRecipes: "Beheer je receptenverzameling",
    addRecipe: "Recept Toevoegen",
    noRecipesYet: "Nog geen recepten",
    startBuilding: "Begin met het opbouwen van je verzameling door je eerste recept toe te voegen",
    addFirstRecipe: "Voeg Je Eerste Recept Toe",
    backToRecipes: "Terug naar Recepten",
    source: "Bron",
    
    // Dashboard
    welcomeBack: "Welkom terug",
    quickActions: "Snelle Acties",
    recentRecipes: "Recente Recepten",
    thisWeeksPlan: "Plan van Deze Week",
    
    // Settings
    manageHousehold: "Beheer je huishouden en voorkeuren",
    createHousehold: "Maak Je Huishouden Aan",
    setupHousehold: "Stel je huishouden in om samen maaltijden te plannen",
    householdName: "Huishoudnaam",
    createHouseholdBtn: "Huishouden Aanmaken",
    householdInfo: "Huishouden Informatie",
    yourHousehold: "Jouw huishouden",
    householdId: "Huishouden ID",
    languageSettings: "Taalinstellingen",
    chooseLanguage: "Kies je voorkeurstaal",
    saveSettings: "Instellingen Opslaan",
    
    // Planner
    weekPlanner: "Week Planner",
    planYourMeals: "Plan je maaltijden voor de week",
    
    // Shopping
    shoppingList: "Boodschappenlijst",
    manageShoppingList: "Beheer je boodschappenlijst",
  },
} as const;