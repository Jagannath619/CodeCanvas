"use client";

import { Card, CardTitle } from "@/components/ui/card";
import { mockIssueAnalytics } from "@/lib/mock-data";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function IssuesPage() {
  const data = mockIssueAnalytics;

  const labelData = Object.entries(data.label_distribution)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Issue Analytics</h2>

      {/* Summary */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-xs text-muted-foreground">Total Issues</div>
          <div className="text-2xl font-bold mt-1">{data.total_issues.toLocaleString()}</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-muted-foreground">Close Rate</div>
          <div className="text-2xl font-bold mt-1">{data.close_rate_percentage}%</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-muted-foreground">Avg Close Time</div>
          <div className="text-2xl font-bold mt-1">{data.avg_close_time_days}d</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-muted-foreground">Stale Issues</div>
          <div className="text-2xl font-bold mt-1 text-yellow-400">{data.stale_issue_count}</div>
        </Card>
      </div>

      {/* Issue Flow */}
      <Card>
        <CardTitle>Issue Flow (Opened vs Closed)</CardTitle>
        <div className="h-72 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.weekly_issue_counts}>
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
              <Area type="monotone" dataKey="opened" stroke="#ef4444" fill="#ef4444" fillOpacity={0.15} name="Opened" />
              <Area type="monotone" dataKey="closed" stroke="#22c55e" fill="#22c55e" fillOpacity={0.15} name="Closed" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Label Distribution */}
      <Card>
        <CardTitle>Issue Labels</CardTitle>
        <div className="h-64 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={labelData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis type="number" stroke="var(--muted-foreground)" fontSize={12} />
              <YAxis dataKey="name" type="category" stroke="var(--muted-foreground)" fontSize={12} width={120} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="count" fill="#818cf8" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardTitle>Issue Breakdown</CardTitle>
          <div className="space-y-3 mt-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Open</span>
              <span className="font-medium">{data.open_issues}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Closed</span>
              <span className="font-medium">{data.closed_issues.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Avg First Response</span>
              <span className="font-medium">{data.avg_first_response_hours}h</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Stale %</span>
              <span className="font-medium text-yellow-400">{data.stale_issue_percentage}%</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
