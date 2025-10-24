const { db } = require("./lib/db/index.ts");
const { households, users } = require("./lib/db/schema.ts");
const { eq } = require("drizzle-orm");

async function seedDemoData() {
  try {
    const existingHousehold = await db.query.households.findFirst({
      where: eq(households.id, "demo-household-1"),
    });

    if (!existingHousehold) {
      await db.insert(households).values({
        id: "demo-household-1",
        name: "Demo Household",
        settings: {
          defaultView: "category",
          varietyToggles: {
            cuisineDiversity: true,
            proteinRotation: true,
            starchRotation: true,
            prepTimeMix: true,
          },
        },
      });
      console.log("✓ Demo household created");
    }

    const existingUser = await db.query.users.findFirst({
      where: eq(users.id, "demo-user-1"),
    });

    if (!existingUser) {
      await db.insert(users).values({
        id: "demo-user-1",
        name: "Demo User",
        email: "demo@example.com",
        householdId: "demo-household-1",
        role: "owner",
      });
      console.log("✓ Demo user created");
    }

    console.log("✓ Database seeded successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}

async function main() {
  console.log("Seeding database...");
  await seedDemoData();
  console.log("Done!");
  process.exit(0);
}

main().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
