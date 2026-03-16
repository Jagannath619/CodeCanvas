"use client";

import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { HealthScoreBadge } from "@/components/health-score-badge";
import { DimensionRadarChart } from "@/components/radar-chart";
import { RiskCard } from "@/components/risk-card";
import { mockHealthScore, mockScoreHistory } from "@/lib/mock-data";
import { formatDuration } from "@/lib/utils";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function RepoOverviewPage() {
  const health = mockHealthScore;

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="flex items-center gap-8">
        <HealthScoreBadge
          score={health.health_score}
          grade={health.grade}
          size="lg"
          delta={health.score_delta}
        />
        <div>
          <h2 className="text-2xl font-bold">{health.repository}</h2>
          <p className="text-muted-foreground mt-1">
            Health Score: {health.health_score} / 100 — Grade{" "}
            <span className="font-semibold">{health.grade}</span>
          </p>
          <Badge variant="success" className="mt-2">
            {health.trend}
          </Badge>
        </div>
      </div>

      {/* Radar Chart + Key Metrics */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardTitle>Score Breakdown</CardTitle>
          <DimensionRadarChart dimensions={health.dimensions} />
        </Card>
        <div className="space-y-4">
          <CardTitle>Key Metrics</CardTitle>
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4">
              <div className="text-xs text-muted-foreground">Commits/week</div>
              <div className="text-xl font-bold mt-1">{health.key_metrics.commits_per_week}</div>
            </Card>
            <Card className="p-4">
              <div className="text-xs text-muted-foreground">Active Contributors</div>
              <div className="text-xl font-bold mt-1">{health.key_metrics.active_contributors_30d}</div>
            </Card>
            <Card className="p-4">
              <div className="text-xs text-muted-foreground">PR Merge Time</div>
              <div className="text-xl font-bold mt-1">{formatDuration(health.key_metrics.avg_pr_merge_hours)}</div>
            </Card>
            <Card className="p-4">
              <div className="text-xs text-muted-foreground">Issue Close Time</div>
              <div className="text-xl font-bold mt-1">{health.key_metrics.avg_issue_close_days}d</div>
            </Card>
            <Card className="p-4">
              <div className="text-xs text-muted-foreground">CI Success Rate</div>
              <div className="text-xl font-bold mt-1">{health.key_metrics.ci_success_rate}%</div>
            </Card>
            <Card className="p-4">
              <div className="text-xs text-muted-foreground">Bus Factor</div>
              <div className="text-xl font-bold mt-1">{health.key_metrics.bus_factor}</div>
            </Card>
          </div>
        </div>
      </div>

      {/* Dimension Scores */}
      <Card>
        <CardTitle>Dimension Scores</CardTitle>
        <div className="space-y-3 mt-4">
          {Object.entries(health.dimensions).map(([key, dim]) => (
            <div key={key} className="flex items-center gap-4">
              <span className="text-sm w-36 text-muted-foreground capitalize">
                {key.replace(/_/g, " ")}
              </span>
              <Progress value={dim.score} className="flex-1" />
              <span className="text-sm w-8 text-right">{dim.score}</span>
              <Badge
                variant={dim.score >= 80 ? "success" : dim.score >= 60 ? "warning" : "critical"}
                className="w-20 justify-center"
              >
                {dim.label}
              </Badge>
            </div>
          ))}
        </div>
      </Card>

      {/* Score History */}
      <Card>
        <CardTitle>Score History</CardTitle>
        <div className="h-64 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockScoreHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="week" stroke="var(--muted-foreground)" fontSize={12} />
              <YAxis domain={[0, 100]} stroke="var(--muted-foreground)" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                }}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#6366f1"
                strokeWidth={2}
                dot={{ fill: "#6366f1", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Top Risks */}
      <div>
        <CardTitle>Top Risks</CardTitle>
        <div className="space-y-3 mt-4">
          {health.top_risks.map((risk, i) => (
            <RiskCard key={i} risk={risk} />
          ))}
        </div>
      </div>
    </div>
  );
}
