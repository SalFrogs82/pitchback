import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { SettingsForm } from "./settings-form";
import { SignOutButton } from "./sign-out-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <div className="space-y-6 max-w-xl">
      <SettingsForm
        profile={{
          full_name: profile?.full_name ?? "",
          surgery_date: profile?.surgery_date ?? "",
          target_return_date: profile?.target_return_date ?? "",
          throw_hand: (profile?.throw_hand as "left" | "right") ?? "right",
        }}
        email={user.email ?? ""}
      />

      <Card>
        <CardHeader>
          <CardTitle>Theme</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">
            Toggle dark mode by adding/removing the &ldquo;dark&rdquo; class on the html element.
          </p>
          <ThemeToggle />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">{user.email}</p>
          <SignOutButton />
        </CardContent>
      </Card>
    </div>
  );
}

function ThemeToggle() {
  return <ThemeToggleClient />;
}

import { ThemeToggleClient } from "./theme-toggle";
