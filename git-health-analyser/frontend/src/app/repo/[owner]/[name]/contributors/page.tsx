"use client";

import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockContributorAnalytics } from "@/lib/mock-data";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

export default function ContributorsPage() {
  const data = mockContributorAnalytics;

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Contributor Analytics</h2>

      {/* Summary */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-xs text-muted-foreground">Total Contributors</div>
          <div className="text-2xl font-bold mt-1">{data.total_contributors}</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-muted-foreground">Active (30d)</div>
          <div className="text-2xl font-bold mt-1">{data.active_contributors_30d}</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-muted-foreground">Active (90d)</div>
          <div className="text-2xl font-bold mt-1">{data.active_contributors_90d}</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-muted-foreground">Contribution Evenness</div>
          <div className="text-2xl font-bold mt-1">{data.contribution_evenness}%</div>
        </Card>
      </div>

      {/* Contributor Leaderboard */}
      <Card>
        <CardTitle>Top Contributors</CardTitle>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted-foreground border-b border-border">
                <th className="pb-3 pr-4">#</th>
                <th className="pb-3 pr-4">Contributor</th>
                <th className="pb-3 pr-4 text-right">Commits</th>
                <th className="pb-3 pr-4 text-right">PRs</th>
                <th className="pb-3 text-right">Last Active</th>
              </tr>
            </thead>
            <tbody>
              {data.top_contributors.map((c, i) => (
                <tr key={c.login} className="border-b border-border/50">
                  <td className="py-3 pr-4 text-muted-foreground">{i + 1}</td>
                  <td className="py-3 pr-4 font-medium">{c.login}</td>
                  <td className="py-3 pr-4 text-right">{c.commits.toLocaleString()}</td>
                  <td className="py-3 pr-4 text-right">{c.prs}</td>
                  <td className="py-3 text-right text-muted-foreground">{c.last_active}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Contribution Distribution */}
      <Card>
        <CardTitle>Contribution Distribution</CardTitle>
        <div className="h-64 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.top_contributors}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="login" stroke="var(--muted-foreground)" fontSize={12} />
              <YAxis stroke="var(--muted-foreground)" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="commits" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Activity Timeline */}
      <Card>
        <CardTitle>Weekly Active Contributors</CardTitle>
        <div className="h-64 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.activity_timeline}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="week" stroke="var(--muted-foreground)" fontSize={12} />
              <YAxis stroke="var(--muted-foreground)" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                }}
              />
              <Line type="monotone" dataKey="active_count" stroke="#6366f1" strokeWidth={2} name="Active" />
              <Line type="monotone" dataKey="new_count" stroke="#22c55e" strokeWidth={2} name="New" />
              <Line type="monotone" dataKey="churned_count" stroke="#ef4444" strokeWidth={2} name="Churned" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
