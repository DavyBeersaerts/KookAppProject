import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

// Using SQLite for local development with SSMS
// SQL Server migration will be handled separately for production

export const households = sqliteTable("households", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  settings: text("settings", { mode: "json" }).$type<{
    defaultView?: "category" | "recipe";
    language?: "en" | "nl";
    varietyToggles?: {
      cuisineDiversity?: boolean;
      proteinRotation?: boolean;
      starchRotation?: boolean;
      prepTimeMix?: boolean;
    };
  }>(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const users = sqliteTable("users", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "timestamp" }),
  image: text("image"),
  householdId: text("household_id").references(() => households.id, { onDelete: "cascade" }),
  role: text("role", { enum: ["owner", "member"] }).default("member"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const recipes = sqliteTable("recipes", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  householdId: text("household_id").notNull().references(() => households.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  servings: integer("servings").default(2),
  prepTime: integer("prep_time"),
  cookTime: integer("cook_time"),
  totalTime: integer("total_time"),
  cuisine: text("cuisine"),
  tags: text("tags", { mode: "json" }).$type<string[]>(),
  ingredients: text("ingredients", { mode: "json" }).$type<Array<{
    quantity: number;
    unit: string;
    item: string;
    ingredientId?: string;
    notes?: string;
  }>>().notNull(),
  steps: text("steps", { mode: "json" }).$type<string[]>().notNull(),
  imageUrl: text("image_url"),
  sourceUrl: text("source_url"),
  createdBy: text("created_by").references(() => users.id),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const plans = sqliteTable("plans", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  householdId: text("household_id").notNull().references(() => households.id, { onDelete: "cascade" }),
  weekStart: integer("week_start", { mode: "timestamp" }).notNull(),
  weekEnd: integer("week_end", { mode: "timestamp" }).notNull(),
  days: text("days", { mode: "json" }).$type<Array<{
    date: string;
    recipeId: string | null;
    notes?: string;
    locked?: boolean;
  }>>().notNull(),
  status: text("status", { enum: ["draft", "active", "completed"] }).default("draft"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const pantry = sqliteTable("pantry", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  householdId: text("household_id").notNull().references(() => households.id, { onDelete: "cascade" }),
  item: text("item").notNull(),
  quantity: integer("quantity"),
  unit: text("unit"),
  category: text("category"),
  lastUpdated: integer("last_updated", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const masterIngredients = sqliteTable("master_ingredients", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  canonicalKey: text("canonical_key").notNull().unique(),
  names: text("names", { mode: "json" }).$type<{
    en: string;
    nl: string;
  }>().notNull(),
  synonyms: text("synonyms", { mode: "json" }).$type<{
    en?: string[];
    nl?: string[];
  }>(),
  category: text("category"),
  defaultUnit: text("default_unit"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
}, (table) => ({
  canonicalKeyIdx: index("canonical_key_idx").on(table.canonicalKey),
}));

export const ingredients = sqliteTable("ingredients", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  householdId: text("household_id").notNull().references(() => households.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  category: text("category"),
  defaultUnit: text("default_unit"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const shoppingLists = sqliteTable("shopping_lists", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  householdId: text("household_id").notNull().references(() => households.id, { onDelete: "cascade" }),
  planId: text("plan_id").references(() => plans.id, { onDelete: "cascade" }),
  items: text("items", { mode: "json" }).$type<Array<{
    id: string;
    ingredient: string;
    quantity: number;
    unit: string;
    category: string;
    recipeRefs: Array<{ recipeId: string; recipeName: string }>;
    notes?: string;
    obtained: boolean;
  }>>().notNull(),
  status: text("status", { enum: ["active", "completed", "archived"] }).default("active"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const invites = sqliteTable("invites", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  householdId: text("household_id").notNull().references(() => households.id, { onDelete: "cascade" }),
  email: text("email").notNull(),
  token: text("token").notNull().unique(),
  invitedBy: text("invited_by").references(() => users.id),
  status: text("status", { enum: ["pending", "accepted", "expired"] }).default("pending"),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

 // Relations
export const householdsRelations = relations(households, ({ many }) => ({
  users: many(users),
  recipes: many(recipes),
  plans: many(plans),
  pantry: many(pantry),
  ingredients: many(ingredients),
  shoppingLists: many(shoppingLists),
  invites: many(invites),
}));

export const usersRelations = relations(users, ({ one, many }) => ({
  household: one(households, {
    fields: [users.householdId],
    references: [households.id],
  }),
  recipes: many(recipes),
}));

export const recipesRelations = relations(recipes, ({ one }) => ({
  household: one(households, {
    fields: [recipes.householdId],
    references: [households.id],
  }),
  creator: one(users, {
    fields: [recipes.createdBy],
    references: [users.id],
  }),
}));

export const plansRelations = relations(plans, ({ one, many }) => ({
  household: one(households, {
    fields: [plans.householdId],
    references: [households.id],
  }),
  shoppingLists: many(shoppingLists),
}));

export const shoppingListsRelations = relations(shoppingLists, ({ one }) => ({
  household: one(households, {
    fields: [shoppingLists.householdId],
    references: [households.id],
  }),
  plan: one(plans, {
    fields: [shoppingLists.planId],
    references: [plans.id],
  }),
}));

export const ingredientsRelations = relations(ingredients, ({ one }) => ({
  household: one(households, {
    fields: [ingredients.householdId],
    references: [households.id],
  }),
}));

export const invitesRelations = relations(invites, ({ one }) => ({
  household: one(households, {
    fields: [invites.householdId],
    references: [households.id],
  }),
  inviter: one(users, {
    fields: [invites.invitedBy],
    references: [users.id],
  }),
}));
