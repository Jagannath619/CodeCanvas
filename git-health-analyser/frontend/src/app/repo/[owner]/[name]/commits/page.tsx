"use client";

import { Card, CardTitle } from "@/components/ui/card";
import { mockCommitAnalytics } from "@/lib/mock-data";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function CommitsPage() {
  const data = mockCommitAnalytics;

  // Activity heatmap data (day x hour)
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Commit Analytics</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="text-xs text-muted-foreground">Total Commits</div>
          <div className="text-2xl font-bold mt-1">{data.total_commits.toLocaleString()}</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-muted-foreground">Commits/Week (Avg)</div>
          <div className="text-2xl font-bold mt-1">{data.commits_per_week_avg}</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-muted-foreground">Last Commit</div>
          <div className="text-2xl font-bold mt-1">{data.days_since_last_commit}d ago</div>
        </Card>
      </div>

      {/* Weekly Commit Chart */}
      <Card>
        <CardTitle>Weekly Commit Frequency</CardTitle>
        <div className="h-72 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.weekly_counts}>
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
              <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Activity Heatmap */}
      <Card>
        <CardTitle>Activity Heatmap</CardTitle>
        <div className="mt-4 overflow-x-auto">
          <div className="inline-grid gap-1" style={{ gridTemplateColumns: `auto repeat(24, 1fr)` }}>
            {/* Header */}
            <div />
            {hours.map((h) => (
              <div key={h} className="text-[10px] text-muted-foreground text-center w-5">
                {h}
              </div>
            ))}
            {/* Rows */}
            {days.map((day) => (
              <>
                <div key={`label-${day}`} className="text-xs text-muted-foreground pr-2 flex items-center">
                  {day}
                </div>
                {hours.map((h) => {
                  const value = data.hourly_distribution[h.toString()] || 0;
                  const max = Math.max(...Object.values(data.hourly_distribution));
                  const intensity = max > 0 ? value / max : 0;
                  return (
                    <div
                      key={`${day}-${h}`}
                      className="w-5 h-5 rounded-sm"
                      style={{
                        backgroundColor: `rgba(99, 102, 241, ${0.1 + intensity * 0.8})`,
                      }}
                      title={`${day} ${h}:00 - ${value} commits`}
                    />
                  );
                })}
              </>
            ))}
          </div>
        </div>
      </Card>

      {/* Daily Distribution */}
      <Card>
        <CardTitle>Commits by Day of Week</CardTitle>
        <div className="h-64 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={Object.entries(data.daily_distribution).map(([day, count]) => ({
                day,
                count,
              }))}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={12} />
              <YAxis stroke="var(--muted-foreground)" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="count" fill="#818cf8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
