"use client";

import { useActionState } from "react";
import { updateProfile, type SettingsResult } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SettingsForm({
  profile,
  email,
}: {
  profile: { full_name: string; surgery_date: string; target_return_date: string; throw_hand: string };
  email: string;
}) {
  const [state, formAction, pending] = useActionState<SettingsResult, FormData>(
    (_prev, fd) => updateProfile(fd),
    {}
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="space-y-4">
          {state.error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{state.error}</div>
          )}
          {state.success && (
            <div className="rounded-md bg-green-500/10 p-3 text-sm text-green-700 dark:text-green-400">Saved!</div>
          )}
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={email} disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="full_name">Full Name</Label>
            <Input id="full_name" name="full_name" defaultValue={profile.full_name} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="surgery_date">Surgery Date</Label>
              <Input id="surgery_date" name="surgery_date" type="date" defaultValue={profile.surgery_date} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="target_return_date">Target Return Date</Label>
              <Input id="target_return_date" name="target_return_date" type="date" defaultValue={profile.target_return_date} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="throw_hand">Throw Hand</Label>
            <select
              id="throw_hand"
              name="throw_hand"
              defaultValue={profile.throw_hand}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
            >
              <option value="right">Right</option>
              <option value="left">Left</option>
            </select>
          </div>
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Saving..." : "Save Profile"}
          </Button>
        </CardContent>
      </form>
    </Card>
  );
}
