import { seedDemoData, seedManualRecipes } from "../lib/db/seed";

async function main() {
  const args = process.argv.slice(2);
  const useManual = args.includes("--manual");

  console.log("Seeding database...");
  
  if (useManual) {
    console.log("Using manual recipes only (no URL import)");
    await seedManualRecipes();
  } else {
    console.log("Attempting to import recipes from URLs");
    await seedDemoData();
  }
  
  console.log("Done!");
  process.exit(0);
}

main().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});