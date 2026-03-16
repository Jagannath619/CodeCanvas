import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground">
            GitHub Health Analyzer
          </h1>
          <Link href="/api/v1/auth/github">
            <Button size="sm">Sign in with GitHub</Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center">
        <h2 className="text-5xl font-bold text-foreground mb-6">
          Health scores for your
          <br />
          <span className="text-primary">GitHub repositories</span>
        </h2>
        <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
          Get a comprehensive health report for any GitHub repository.
          Understand activity, contributor patterns, CI/CD reliability,
          and risks — all in one dashboard.
        </p>
        <Link href="/api/v1/auth/github">
          <Button size="lg">Get Started with GitHub</Button>
        </Link>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <div className="text-3xl mb-3">100</div>
            <h3 className="text-lg font-semibold mb-2">Health Score</h3>
            <p className="text-sm text-muted-foreground">
              A single score (0-100) that captures the overall health of your
              project across 10 dimensions.
            </p>
          </Card>
          <Card>
            <div className="text-3xl mb-3">/\</div>
            <h3 className="text-lg font-semibold mb-2">Deep Analytics</h3>
            <p className="text-sm text-muted-foreground">
              Commit patterns, contributor activity, PR turnaround, issue
              resolution, CI/CD reliability, and more.
            </p>
          </Card>
          <Card>
            <div className="text-3xl mb-3">(!)</div>
            <h3 className="text-lg font-semibold mb-2">Risk Alerts</h3>
            <p className="text-sm text-muted-foreground">
              Automatic detection of bus factor risks, stale PRs, CI failures,
              dependency vulnerabilities, and more.
            </p>
          </Card>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-border py-24">
        <div className="max-w-4xl mx-auto px-6">
          <h3 className="text-3xl font-bold text-center mb-12">How It Works</h3>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { step: "1", title: "Connect", desc: "Sign in with GitHub" },
              { step: "2", title: "Analyze", desc: "Enter a repository URL" },
              { step: "3", title: "Insights", desc: "View health dashboard" },
              { step: "4", title: "Improve", desc: "Follow recommendations" },
            ].map((s) => (
              <div key={s.step}>
                <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center mx-auto mb-3 font-bold">
                  {s.step}
                </div>
                <h4 className="font-semibold mb-1">{s.title}</h4>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-6xl mx-auto px-6 text-center text-sm text-muted-foreground">
          GitHub Health Analyzer - Open Source Developer Tool
        </div>
      </footer>
    </div>
  );
}
