import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 p-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">PitchBack</h1>
        <p className="text-lg text-muted-foreground max-w-md">
          Softball pitching rehab &amp; performance tracking.
          Your comeback starts here.
        </p>
      </div>
      <div className="flex gap-4">
        <Button asChild>
          <Link href="/login">Sign In</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/signup">Create Account</Link>
        </Button>
      </div>
    </div>
  );
}
