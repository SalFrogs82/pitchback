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
      <CardHeader className="text-center space-y-3">
        {/* Mobile-only softball icon */}
        <div className="lg:hidden flex justify-center">
          <svg viewBox="0 0 100 100" className="w-14 h-14" fill="none">
            <circle cx="50" cy="50" r="46" fill="#f5a623" stroke="#e8941a" strokeWidth="2" />
            <path d="M30 20 C35 30, 35 40, 30 50 C25 60, 25 70, 30 80" stroke="#c82014" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M70 20 C65 30, 65 40, 70 50 C75 60, 75 70, 70 80" stroke="#c82014" strokeWidth="3" fill="none" strokeLinecap="round" />
          </svg>
        </div>
        <CardTitle className="text-2xl font-bold text-[#1a6b3c] dark:text-[#4ade80]">Welcome back</CardTitle>
        <CardDescription>Sign in to continue your journey</CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="space-y-4">
          {state.error && (
            <div className="rounded-lg bg-[#c82014]/10 p-3 text-sm text-[#c82014]">
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
            <Link href="/forgot-password" className="text-muted-foreground hover:text-[#22874a] transition-colors">
              Forgot password?
            </Link>
            <Link href="/signup" className="text-[#22874a] font-medium hover:underline">
              Create account
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
