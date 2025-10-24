import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "./schema";
import path from "path";
import { eq } from "drizzle-orm";

const dbPath = process.env.DATABASE_URL || path.join(process.cwd(), "local.db");

const sqlite = new Database(dbPath);
export const db = drizzle(sqlite, { schema });

function seedDemoDataSync() {
  try {
    const existingHousehold = db
      .select()
      .from(schema.households)
      .where(eq(schema.households.id, "demo-household-1"))
      .get();

    if (!existingHousehold) {
      db.insert(schema.households).values({
        id: "demo-household-1",
        name: "Demo Household",
        settings: {
          defaultView: "category",
          language: "en",
          varietyToggles: {
            cuisineDiversity: true,
            proteinRotation: true,
            starchRotation: true,
            prepTimeMix: true,
          },
        },
      }).run();

      db.insert(schema.users).values({
        id: "demo-user-1",
        name: "Demo User",
        email: "demo@example.com",
        householdId: "demo-household-1",
        role: "owner",
      }).run();

      console.log("✓ Demo data seeded");
    }
  } catch (error) {
    console.error("Error seeding demo data:", error);
  }
}

seedDemoDataSync();
