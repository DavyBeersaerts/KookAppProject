"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format, addDays } from "date-fns";
import { Calendar, Shuffle, Lock, Unlock, ShoppingCart } from "lucide-react";

interface Recipe {
  id: string;
  title: string;
  totalTime: number | null;
  cuisine: string | null;
}

interface DayPlan {
  date: string;
  recipeId: string | null;
  notes?: string;
  locked?: boolean;
}

interface WeekPlannerProps {
  householdId: string;
  currentPlan: any;
  recipes: Recipe[];
  weekStart: Date;
  weekEnd: Date;
}

export function WeekPlanner({
  householdId,
  currentPlan,
  recipes,
  weekStart,
  weekEnd,
}: WeekPlannerProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<DayPlan[]>(
    currentPlan?.days || Array.from({ length: 7 }, (_, i) => ({
      date: format(addDays(weekStart, i), "yyyy-MM-dd"),
      recipeId: null,
      locked: false,
    }))
  );

  const handleSpinWeek = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/planner/spin-week", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ householdId, weekStart, weekEnd }),
      });
      const data = await response.json();
      if (data.plan) {
        setPlan(data.plan.days);
      }
    } catch (error) {
      console.error("Failed to spin week:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSpinDay = async (dayIndex: number) => {
    setLoading(true);
    try {
      const response = await fetch("/api/planner/spin-day", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ householdId }),
      });
      const data = await response.json();
      if (data.recipeId) {
        const newPlan = [...plan];
        newPlan[dayIndex].recipeId = data.recipeId;
        setPlan(newPlan);
      }
    } catch (error) {
      console.error("Failed to spin day:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleLock = (dayIndex: number) => {
    const newPlan = [...plan];
    newPlan[dayIndex].locked = !newPlan[dayIndex].locked;
    setPlan(newPlan);
  };

  const handleSavePlan = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/planner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          householdId,
          weekStart,
          weekEnd,
          days: plan,
        }),
      });
      if (response.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to save plan:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateList = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/shopping/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ householdId, plan }),
      });
      if (response.ok) {
        router.push("/dashboard/shopping");
      }
    } catch (error) {
      console.error("Failed to generate list:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRecipeById = (id: string | null) => {
    if (!id) return null;
    return recipes.find((r) => r.id === id);
  };

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <Button onClick={handleSpinWeek} disabled={loading}>
          <Shuffle className="mr-2 h-4 w-4" />
          Spin Full Week
        </Button>
        <Button onClick={handleSavePlan} disabled={loading} variant="secondary">
          <Calendar className="mr-2 h-4 w-4" />
          Save Plan
        </Button>
        <Button onClick={handleGenerateList} disabled={loading} variant="outline">
          <ShoppingCart className="mr-2 h-4 w-4" />
          Generate Shopping List
        </Button>
      </div>

      <div className="grid gap-4">
        {plan.map((day, index) => {
          const recipe = getRecipeById(day.recipeId);
          const date = addDays(weekStart, index);

          return (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{daysOfWeek[index]}</CardTitle>
                    <CardDescription>{format(date, "MMMM d, yyyy")}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => toggleLock(index)}
                      disabled={!day.recipeId}
                    >
                      {day.locked ? (
                        <Lock className="h-4 w-4" />
                      ) : (
                        <Unlock className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => handleSpinDay(index)}
                      disabled={loading || day.locked}
                    >
                      <Shuffle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {recipe ? (
                  <div>
                    <p className="font-medium">{recipe.title}</p>
                    <div className="flex gap-4 text-sm text-muted-foreground mt-1">
                      {recipe.cuisine && <span>{recipe.cuisine}</span>}
                      {recipe.totalTime && <span>{recipe.totalTime} min</span>}
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground">No meal planned</p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
