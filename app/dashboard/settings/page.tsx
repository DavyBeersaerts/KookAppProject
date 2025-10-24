import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { households, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { HouseholdSettings } from "@/components/household-settings";
import { TRANSLATIONS } from "@/lib/constants";

export default async function SettingsPage() {
  const session = await auth();
  const userId = session?.user?.id;
  const householdId = session?.user?.householdId;

  if (!userId) {
    return <div>Please sign in.</div>;
  }

  let household = null;
  let members: any[] = [];

  if (householdId) {
    household = await db
      .select()
      .from(households)
      .where(eq(households.id, householdId))
      .then((h) => h[0]);

    members = await db
      .select()
      .from(users)
      .where(eq(users.householdId, householdId));
  }

  const language = household?.settings?.language || "en";
  const t = TRANSLATIONS[language];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t.settings}</h1>
        <p className="text-muted-foreground">
          {t.manageHousehold}
        </p>
      </div>

      <HouseholdSettings
        userId={userId}
        household={household}
        members={members}
      />
    </div>
  );
}