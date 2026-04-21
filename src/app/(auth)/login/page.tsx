"use client";

import { useActionState } from "react";
import Link from "next/link";
import { login, type AuthResult } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState<AuthResult, FormData>(
    (_prev, formData) => login(formData),
    {}
  );

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">PitchBack</CardTitle>
        <CardDescription>Sign in to your account</CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="space-y-4">
          {state.error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {state.error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="you@example.com" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Signing in..." : "Sign In"}
          </Button>
          <div className="flex justify-between w-full text-sm">
            <Link href="/forgot-password" className="text-muted-foreground hover:underline">
              Forgot password?
            </Link>
            <Link href="/signup" className="text-muted-foreground hover:underline">
              Create account
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
