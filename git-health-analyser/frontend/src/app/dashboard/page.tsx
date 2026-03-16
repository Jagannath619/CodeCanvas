"use client";

import { useState } from "react";
import { RepoCard } from "@/components/repo-card";
import { AnalyzeDialog } from "@/components/analyze-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { mockRepos, mockRisks } from "@/lib/mock-data";

export default function DashboardPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [search, setSearch] = useState("");

  const repos = mockRepos.filter(
    (r) =>
      r.full_name.toLowerCase().includes(search.toLowerCase()) ||
      (r.description || "").toLowerCase().includes(search.toLowerCase())
  );

  const avgScore =
    repos.reduce((sum, r) => sum + (r.health_score || 0), 0) / repos.length;
  const alertCount = mockRisks.filter((r) => r.severity === "critical" || r.severity === "warning").length;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">GitHub Health Analyzer</h1>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-primary/20" />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Your Repositories</h2>
          <Button onClick={() => setDialogOpen(true)}>
            + Analyze New Repo
          </Button>
        </div>

        {/* Search */}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search repositories..."
          className="w-full max-w-md px-4 py-2 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 mb-8"
        />

        {/* Portfolio Summary */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card>
            <div className="text-sm text-muted-foreground">Average Score</div>
            <div className="text-2xl font-bold mt-1">{avgScore.toFixed(1)}</div>
          </Card>
          <Card>
            <div className="text-sm text-muted-foreground">Repositories</div>
            <div className="text-2xl font-bold mt-1">{repos.length}</div>
          </Card>
          <Card>
            <div className="text-sm text-muted-foreground">Active Alerts</div>
            <div className="text-2xl font-bold mt-1">{alertCount}</div>
          </Card>
        </div>

        {/* Repo Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {repos.map((repo) => (
            <RepoCard key={repo.id} repo={repo} />
          ))}
        </div>

        {/* Recent Alerts */}
        <h3 className="text-lg font-semibold mb-4">Recent Alerts</h3>
        <div className="space-y-3">
          {mockRisks.slice(0, 3).map((risk, i) => (
            <Card key={i} className="py-3 px-4">
              <div className="flex items-center gap-3">
                <Badge variant={risk.severity === "critical" ? "critical" : risk.severity === "warning" ? "warning" : "info"}>
                  {risk.severity}
                </Badge>
                <span className="text-sm">{risk.message}</span>
              </div>
            </Card>
          ))}
        </div>
      </main>

      <AnalyzeDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={(url) => {
          console.log("Analyzing:", url);
          // In production: call analyzeRepo(url)
        }}
      />
    </div>
  );
}
