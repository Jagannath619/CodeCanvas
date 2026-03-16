import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md mx-4 text-center">
        <h1 className="text-2xl font-bold mb-2">Sign In</h1>
        <p className="text-muted-foreground mb-6">
          Connect your GitHub account to analyze repositories.
        </p>
        <Link href="/api/v1/auth/github">
          <Button size="lg" className="w-full">
            Continue with GitHub
          </Button>
        </Link>
        <p className="text-xs text-muted-foreground mt-4">
          We request read access to your repositories, organizations, and profile.
          Your data is encrypted and never shared.
        </p>
      </Card>
    </div>
  );
}
