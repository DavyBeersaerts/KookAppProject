import { db } from "../lib/db";

async function checkDatabase() {
  console.log("Checking database...\n");

  const households = await db.query.households.findMany();
  console.log(`Households (${households.length}):`);
  households.forEach(h => console.log(`  - ${h.id}: ${h.name}`));

  const users = await db.query.users.findMany();
  console.log(`\nUsers (${users.length}):`);
  users.forEach(u => console.log(`  - ${u.id}: ${u.email} (household: ${u.householdId})`));

  const recipes = await db.query.recipes.findMany();
  console.log(`\nRecipes (${recipes.length}):`);
  recipes.forEach(r => console.log(`  - ${r.id}: ${r.title} (household: ${r.householdId})`));
}

checkDatabase().then(() => process.exit(0)).catch(console.error);