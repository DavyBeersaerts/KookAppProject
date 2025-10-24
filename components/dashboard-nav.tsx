"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChefHat, Calendar, ShoppingCart, Settings, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { useLanguage } from "@/lib/language-context";

export function DashboardNav() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const navItems = [
    { href: "/dashboard", label: t.dashboard, icon: ChefHat },
    { href: "/dashboard/recipes", label: t.recipes, icon: ChefHat },
    { href: "/dashboard/planner", label: t.planner, icon: Calendar },
    { href: "/dashboard/shopping", label: t.shopping, icon: ShoppingCart },
    { href: "/dashboard/settings", label: t.settings, icon: Settings },
  ];

  return (
    <nav className="border-b bg-card">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <ChefHat className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">Rox & Me</span>
            </Link>
            <div className="hidden md:flex space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      size="sm"
                      className={cn("gap-2", isActive && "bg-secondary")}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => signOut({ callbackUrl: "/auth/signin" })}
          >
            <LogOut className="h-4 w-4 mr-2" />
            {t.signOut}
          </Button>
        </div>
      </div>
    </nav>
  );
}