"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus, Users, Globe } from "lucide-react";
import { useLanguage } from "@/lib/language-context";

interface HouseholdSettingsProps {
  userId: string;
  household: any;
  members: any[];
}

export function HouseholdSettings({
  userId,
  household,
  members,
}: HouseholdSettingsProps) {
  const router = useRouter();
  const { t } = useLanguage();
  const [householdName, setHouseholdName] = useState(household?.name || "");
  const [language, setLanguage] = useState(household?.settings?.language || "en");
  const [inviteEmail, setInviteEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateHousehold = async () => {
    if (!householdName.trim()) return;

    setLoading(true);
    try {
      const response = await fetch("/api/household", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: householdName, userId }),
      });

      if (response.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to create household:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async () => {
    if (!inviteEmail.trim()) return;

    setLoading(true);
    try {
      const response = await fetch("/api/household/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail, householdId: household.id }),
      });

      if (response.ok) {
        setInviteEmail("");
        alert("Invitation sent!");
      }
    } catch (error) {
      console.error("Failed to send invite:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSettings = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/household", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          householdId: household.id,
          settings: {
            ...household.settings,
            language,
          }
        }),
      });

      if (response.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to update settings:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!household) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t.createHousehold}</CardTitle>
          <CardDescription>
            {t.setupHousehold}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="household-name">{t.householdName}</Label>
            <Input
              id="household-name"
              placeholder="e.g., The Smiths"
              value={householdName}
              onChange={(e) => setHouseholdName(e.target.value)}
            />
          </div>
          <Button onClick={handleCreateHousehold} disabled={loading}>
            {t.createHouseholdBtn}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t.householdInfo}</CardTitle>
          <CardDescription>{t.yourHousehold}: {household.name}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label>{t.householdId}</Label>
              <p className="text-sm text-muted-foreground">{household.id}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            <Globe className="inline mr-2 h-5 w-5" />
            {t.languageSettings}
          </CardTitle>
          <CardDescription>
            {t.chooseLanguage}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="language">{t.language}</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger id="language">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">{t.english}</SelectItem>
                <SelectItem value="nl">{t.dutch}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleUpdateSettings} disabled={loading}>
            {t.saveSettings}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}