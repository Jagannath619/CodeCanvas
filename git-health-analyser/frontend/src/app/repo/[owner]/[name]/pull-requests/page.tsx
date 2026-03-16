"use client";

import { Card, CardTitle } from "@/components/ui/card";
import { mockPRAnalytics } from "@/lib/mock-data";
import { formatDuration } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#6366f1", "#818cf8", "#a5b4fc", "#c7d2fe"];

export default function PullRequestsPage() {
  const data = mockPRAnalytics;

  const sizeData = Object.entries(data.size_distribution).map(([key, value]) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    value,
  }));

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Pull Request Analytics</h2>

      {/* Summary */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-xs text-muted-foreground">Total PRs</div>
          <div className="text-2xl font-bold mt-1">{data.total_prs.toLocaleString()}</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-muted-foreground">Merge Rate</div>
          <div className="text-2xl font-bold mt-1">{data.merge_rate_percentage}%</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-muted-foreground">Avg Merge Time</div>
          <div className="text-2xl font-bold mt-1">{formatDuration(data.avg_time_to_merge_hours)}</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-muted-foreground">Avg Review Time</div>
          <div className="text-2xl font-bold mt-1">{formatDuration(data.avg_time_to_first_review_hours)}</div>
        </Card>
      </div>

      {/* PR Flow */}
      <Card>
        <CardTitle>PR Flow (Weekly)</CardTitle>
        <div className="h-72 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.weekly_pr_counts}>
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
              <Legend />
              <Bar dataKey="opened" fill="#6366f1" radius={[2, 2, 0, 0]} name="Opened" />
              <Bar dataKey="merged" fill="#22c55e" radius={[2, 2, 0, 0]} name="Merged" />
              <Bar dataKey="closed" fill="#ef4444" radius={[2, 2, 0, 0]} name="Closed" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* PR Size Distribution */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardTitle>PR Size Distribution</CardTitle>
          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sizeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {sizeData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <CardTitle>PR Stats</CardTitle>
          <div className="space-y-4 mt-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Open PRs</span>
              <span className="font-medium">{data.open_prs}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Merged PRs</span>
              <span className="font-medium">{data.merged_prs.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Closed (unmerged)</span>
              <span className="font-medium">{data.closed_without_merge}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Avg Comments/PR</span>
              <span className="font-medium">{data.avg_comments_per_pr}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Stale PRs</span>
              <span className="font-medium text-yellow-400">
                {data.stale_pr_count} ({data.stale_pr_percentage}%)
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
