import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { masterIngredients } from "@/lib/db/schema";
import { eq, or, like, sql } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q");
    const locale = searchParams.get("locale") || "en";

    if (!query) {
      const allIngredients = await db.select().from(masterIngredients).limit(100);
      return NextResponse.json({ ingredients: allIngredients });
    }

    const searchTerm = `%${query.toLowerCase()}%`;
    
    const ingredients = await db
      .select()
      .from(masterIngredients)
      .where(
        or(
          sql`lower(json_extract(${masterIngredients.names}, '$.en')) LIKE ${searchTerm}`,
          sql`lower(json_extract(${masterIngredients.names}, '$.nl')) LIKE ${searchTerm}`,
          sql`lower(${masterIngredients.canonicalKey}) LIKE ${searchTerm}`,
          sql`EXISTS (
            SELECT 1 FROM json_each(${masterIngredients.synonyms}, '$.en')
            WHERE lower(value) LIKE ${searchTerm}
          )`,
          sql`EXISTS (
            SELECT 1 FROM json_each(${masterIngredients.synonyms}, '$.nl')
            WHERE lower(value) LIKE ${searchTerm}
          )`
        )
      )
      .limit(20);

    return NextResponse.json({ ingredients });
  } catch (error) {
    console.error("Failed to search ingredients:", error);
    return NextResponse.json(
      { error: "Failed to search ingredients" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { canonicalKey, names, synonyms, category, defaultUnit } = body;

    if (!canonicalKey || !names?.en) {
      return NextResponse.json(
        { error: "Canonical key and English name are required" },
        { status: 400 }
      );
    }

    const existing = await db
      .select()
      .from(masterIngredients)
      .where(eq(masterIngredients.canonicalKey, canonicalKey))
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json(
        { error: "Ingredient already exists" },
        { status: 409 }
      );
    }

    const [ingredient] = await db
      .insert(masterIngredients)
      .values({
        canonicalKey,
        names: {
          en: names.en,
          nl: names.nl || names.en,
        },
        synonyms: synonyms || {},
        category,
        defaultUnit,
      })
      .returning();

    return NextResponse.json({ ingredient }, { status: 201 });
  } catch (error) {
    console.error("Failed to create ingredient:", error);
    return NextResponse.json(
      { error: "Failed to create ingredient" },
      { status: 500 }
    );
  }
}
