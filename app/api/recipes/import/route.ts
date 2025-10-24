import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { extractRecipeFromUrl } from "@/lib/ai/recipe-extractor";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const recipe = await extractRecipeFromUrl(url);

    return NextResponse.json({ recipe });
  } catch (error) {
    console.error("Error importing recipe:", error);
    return NextResponse.json(
      { error: "Failed to import recipe" },
      { status: 500 }
    );
  }
}
