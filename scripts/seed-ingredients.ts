import { db } from "../lib/db";
import { masterIngredients } from "../lib/db/schema";

const commonIngredients = [
  {
    canonicalKey: "potato",
    names: { en: "potato", nl: "aardappel" },
    synonyms: { en: ["potatoes", "russet potato", "yukon gold"], nl: ["aardappelen", "aardappeltjes"] },
    category: "Produce",
    defaultUnit: "piece",
  },
  {
    canonicalKey: "tomato",
    names: { en: "tomato", nl: "tomaat" },
    synonyms: { en: ["tomatoes", "cherry tomato", "roma tomato"], nl: ["tomaten", "cherrytomaat"] },
    category: "Produce",
    defaultUnit: "piece",
  },
  {
    canonicalKey: "onion",
    names: { en: "onion", nl: "ui" },
    synonyms: { en: ["onions", "yellow onion", "red onion"], nl: ["uien", "rode ui"] },
    category: "Produce",
    defaultUnit: "piece",
  },
  {
    canonicalKey: "garlic",
    names: { en: "garlic", nl: "knoflook" },
    synonyms: { en: ["garlic clove"], nl: ["knoflookteen"] },
    category: "Produce",
    defaultUnit: "clove",
  },
  {
    canonicalKey: "carrot",
    names: { en: "carrot", nl: "wortel" },
    synonyms: { en: ["carrots"], nl: ["wortels", "worteltjes"] },
    category: "Produce",
    defaultUnit: "piece",
  },
  {
    canonicalKey: "bell-pepper",
    names: { en: "bell pepper", nl: "paprika" },
    synonyms: { en: ["pepper", "red pepper", "green pepper"], nl: ["paprika's", "rode paprika"] },
    category: "Produce",
    defaultUnit: "piece",
  },
  {
    canonicalKey: "cucumber",
    names: { en: "cucumber", nl: "komkommer" },
    synonyms: { en: ["cucumbers"], nl: ["komkommers"] },
    category: "Produce",
    defaultUnit: "piece",
  },
  {
    canonicalKey: "lettuce",
    names: { en: "lettuce", nl: "sla" },
    synonyms: { en: ["salad", "romaine"], nl: ["kropsla", "ijsbergsla"] },
    category: "Produce",
    defaultUnit: "piece",
  },
  {
    canonicalKey: "mushroom",
    names: { en: "mushroom", nl: "champignon" },
    synonyms: { en: ["mushrooms", "button mushroom"], nl: ["champignons", "paddenstoelen"] },
    category: "Produce",
    defaultUnit: "g",
  },
  {
    canonicalKey: "broccoli",
    names: { en: "broccoli", nl: "broccoli" },
    synonyms: { en: [], nl: [] },
    category: "Produce",
    defaultUnit: "piece",
  },
  {
    canonicalKey: "cauliflower",
    names: { en: "cauliflower", nl: "bloemkool" },
    synonyms: { en: [], nl: [] },
    category: "Produce",
    defaultUnit: "piece",
  },
  {
    canonicalKey: "spinach",
    names: { en: "spinach", nl: "spinazie" },
    synonyms: { en: ["baby spinach"], nl: [] },
    category: "Produce",
    defaultUnit: "g",
  },
  {
    canonicalKey: "zucchini",
    names: { en: "zucchini", nl: "courgette" },
    synonyms: { en: ["courgette"], nl: ["courgettes"] },
    category: "Produce",
    defaultUnit: "piece",
  },
  {
    canonicalKey: "eggplant",
    names: { en: "eggplant", nl: "aubergine" },
    synonyms: { en: ["aubergine"], nl: ["aubergines"] },
    category: "Produce",
    defaultUnit: "piece",
  },
  {
    canonicalKey: "leek",
    names: { en: "leek", nl: "prei" },
    synonyms: { en: ["leeks"], nl: [] },
    category: "Produce",
    defaultUnit: "piece",
  },
  {
    canonicalKey: "celery",
    names: { en: "celery", nl: "selderij" },
    synonyms: { en: ["celery stalk"], nl: ["bleekselderij"] },
    category: "Produce",
    defaultUnit: "piece",
  },
  {
    canonicalKey: "apple",
    names: { en: "apple", nl: "appel" },
    synonyms: { en: ["apples"], nl: ["appels"] },
    category: "Produce",
    defaultUnit: "piece",
  },
  {
    canonicalKey: "banana",
    names: { en: "banana", nl: "banaan" },
    synonyms: { en: ["bananas"], nl: ["bananen"] },
    category: "Produce",
    defaultUnit: "piece",
  },
  {
    canonicalKey: "lemon",
    names: { en: "lemon", nl: "citroen" },
    synonyms: { en: ["lemons"], nl: ["citroenen"] },
    category: "Produce",
    defaultUnit: "piece",
  },
  {
    canonicalKey: "lime",
    names: { en: "lime", nl: "limoen" },
    synonyms: { en: ["limes"], nl: ["limoenen"] },
    category: "Produce",
    defaultUnit: "piece",
  },
  {
    canonicalKey: "orange",
    names: { en: "orange", nl: "sinaasappel" },
    synonyms: { en: ["oranges"], nl: ["sinaasappels"] },
    category: "Produce",
    defaultUnit: "piece",
  },
  {
    canonicalKey: "egg",
    names: { en: "egg", nl: "ei" },
    synonyms: { en: ["eggs"], nl: ["eieren"] },
    category: "Dairy",
    defaultUnit: "piece",
  },
  {
    canonicalKey: "milk",
    names: { en: "milk", nl: "melk" },
    synonyms: { en: ["whole milk", "skim milk"], nl: ["volle melk", "magere melk"] },
    category: "Dairy",
    defaultUnit: "ml",
  },
  {
    canonicalKey: "butter",
    names: { en: "butter", nl: "boter" },
    synonyms: { en: [], nl: [] },
    category: "Dairy",
    defaultUnit: "g",
  },
  {
    canonicalKey: "cheese",
    names: { en: "cheese", nl: "kaas" },
    synonyms: { en: ["cheddar", "mozzarella"], nl: ["goudse kaas"] },
    category: "Dairy",
    defaultUnit: "g",
  },
  {
    canonicalKey: "yogurt",
    names: { en: "yogurt", nl: "yoghurt" },
    synonyms: { en: ["greek yogurt"], nl: ["griekse yoghurt"] },
    category: "Dairy",
    defaultUnit: "g",
  },
  {
    canonicalKey: "cream",
    names: { en: "cream", nl: "room" },
    synonyms: { en: ["heavy cream", "whipping cream"], nl: ["slagroom", "kookroom"] },
    category: "Dairy",
    defaultUnit: "ml",
  },
  {
    canonicalKey: "chicken-breast",
    names: { en: "chicken breast", nl: "kipfilet" },
    synonyms: { en: ["chicken"], nl: ["kippenborst", "kip"] },
    category: "Meat & Fish",
    defaultUnit: "g",
  },
  {
    canonicalKey: "ground-beef",
    names: { en: "ground beef", nl: "gehakt" },
    synonyms: { en: ["minced beef"], nl: ["rundergehakt"] },
    category: "Meat & Fish",
    defaultUnit: "g",
  },
  {
    canonicalKey: "bacon",
    names: { en: "bacon", nl: "spek" },
    synonyms: { en: ["bacon strips"], nl: ["ontbijtspek"] },
    category: "Meat & Fish",
    defaultUnit: "g",
  },
  {
    canonicalKey: "salmon",
    names: { en: "salmon", nl: "zalm" },
    synonyms: { en: ["salmon fillet"], nl: ["zalmfilet"] },
    category: "Meat & Fish",
    defaultUnit: "g",
  },
  {
    canonicalKey: "tuna",
    names: { en: "tuna", nl: "tonijn" },
    synonyms: { en: ["canned tuna"], nl: ["tonijn in blik"] },
    category: "Meat & Fish",
    defaultUnit: "g",
  },
  {
    canonicalKey: "shrimp",
    names: { en: "shrimp", nl: "garnaal" },
    synonyms: { en: ["prawns"], nl: ["garnalen"] },
    category: "Meat & Fish",
    defaultUnit: "g",
  },
  {
    canonicalKey: "rice",
    names: { en: "rice", nl: "rijst" },
    synonyms: { en: ["white rice", "basmati rice"], nl: ["witte rijst", "basmati rijst"] },
    category: "Pantry",
    defaultUnit: "g",
  },
  {
    canonicalKey: "pasta",
    names: { en: "pasta", nl: "pasta" },
    synonyms: { en: ["spaghetti", "penne"], nl: ["spaghetti", "penne"] },
    category: "Pantry",
    defaultUnit: "g",
  },
  {
    canonicalKey: "flour",
    names: { en: "flour", nl: "bloem" },
    synonyms: { en: ["all-purpose flour"], nl: ["tarwebloem", "bakmeel"] },
    category: "Pantry",
    defaultUnit: "g",
  },
  {
    canonicalKey: "sugar",
    names: { en: "sugar", nl: "suiker" },
    synonyms: { en: ["white sugar", "granulated sugar"], nl: ["witte suiker", "kristalsuiker"] },
    category: "Pantry",
    defaultUnit: "g",
  },
  {
    canonicalKey: "salt",
    names: { en: "salt", nl: "zout" },
    synonyms: { en: ["sea salt"], nl: ["zeezout", "keukenzout"] },
    category: "Pantry",
    defaultUnit: "pinch",
  },
  {
    canonicalKey: "pepper",
    names: { en: "pepper", nl: "peper" },
    synonyms: { en: ["black pepper"], nl: ["zwarte peper"] },
    category: "Pantry",
    defaultUnit: "pinch",
  },
  {
    canonicalKey: "olive-oil",
    names: { en: "olive oil", nl: "olijfolie" },
    synonyms: { en: ["extra virgin olive oil"], nl: ["extra vergine olijfolie"] },
    category: "Pantry",
    defaultUnit: "ml",
  },
  {
    canonicalKey: "vegetable-oil",
    names: { en: "vegetable oil", nl: "plantaardige olie" },
    synonyms: { en: ["cooking oil"], nl: ["zonnebloemolie"] },
    category: "Pantry",
    defaultUnit: "ml",
  },
  {
    canonicalKey: "soy-sauce",
    names: { en: "soy sauce", nl: "sojasaus" },
    synonyms: { en: [], nl: [] },
    category: "Pantry",
    defaultUnit: "ml",
  },
  {
    canonicalKey: "vinegar",
    names: { en: "vinegar", nl: "azijn" },
    synonyms: { en: ["white vinegar", "balsamic vinegar"], nl: ["witte azijn", "balsamico"] },
    category: "Pantry",
    defaultUnit: "ml",
  },
  {
    canonicalKey: "honey",
    names: { en: "honey", nl: "honing" },
    synonyms: { en: [], nl: [] },
    category: "Pantry",
    defaultUnit: "ml",
  },
  {
    canonicalKey: "bread",
    names: { en: "bread", nl: "brood" },
    synonyms: { en: ["white bread", "whole wheat bread"], nl: ["wit brood", "volkoren brood"] },
    category: "Bakery",
    defaultUnit: "slice",
  },
  {
    canonicalKey: "basil",
    names: { en: "basil", nl: "basilicum" },
    synonyms: { en: ["fresh basil"], nl: ["verse basilicum"] },
    category: "Produce",
    defaultUnit: "handful",
  },
  {
    canonicalKey: "parsley",
    names: { en: "parsley", nl: "peterselie" },
    synonyms: { en: ["fresh parsley"], nl: ["verse peterselie"] },
    category: "Produce",
    defaultUnit: "handful",
  },
  {
    canonicalKey: "thyme",
    names: { en: "thyme", nl: "tijm" },
    synonyms: { en: ["fresh thyme"], nl: ["verse tijm"] },
    category: "Produce",
    defaultUnit: "handful",
  },
  {
    canonicalKey: "oregano",
    names: { en: "oregano", nl: "oregano" },
    synonyms: { en: [], nl: [] },
    category: "Pantry",
    defaultUnit: "tsp",
  },
  {
    canonicalKey: "paprika",
    names: { en: "paprika", nl: "paprikapoeder" },
    synonyms: { en: ["paprika powder"], nl: [] },
    category: "Pantry",
    defaultUnit: "tsp",
  },
  {
    canonicalKey: "cumin",
    names: { en: "cumin", nl: "komijn" },
    synonyms: { en: ["ground cumin"], nl: ["komijnpoeder"] },
    category: "Pantry",
    defaultUnit: "tsp",
  },
  {
    canonicalKey: "cinnamon",
    names: { en: "cinnamon", nl: "kaneel" },
    synonyms: { en: ["ground cinnamon"], nl: ["kaneelpoeder"] },
    category: "Pantry",
    defaultUnit: "tsp",
  },
  {
    canonicalKey: "ginger",
    names: { en: "ginger", nl: "gember" },
    synonyms: { en: ["fresh ginger"], nl: ["verse gember"] },
    category: "Produce",
    defaultUnit: "piece",
  },
];

async function seedIngredients() {
  console.log("Seeding master ingredients...");

  try {
    for (const ingredient of commonIngredients) {
      await db.insert(masterIngredients).values(ingredient).onConflictDoNothing();
      console.log(`✓ Added: ${ingredient.names.en} / ${ingredient.names.nl}`);
    }

    console.log(`\n✅ Successfully seeded ${commonIngredients.length} ingredients!`);
  } catch (error) {
    console.error("❌ Error seeding ingredients:", error);
    throw error;
  }
}

seedIngredients()
  .then(() => {
    console.log("Seed completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  });
