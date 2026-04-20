"use client";

import { useTransition } from "react";
import { signOut } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";

export function SignOutButton() {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="destructive"
      onClick={() => startTransition(async () => { await signOut(); })}
      disabled={isPending}
    >
      {isPending ? "Signing out..." : "Sign Out"}
    </Button>
  );
}
