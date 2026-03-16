"use client";

import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { mockCICDAnalytics } from "@/lib/mock-data";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function CICDPage() {
  const data = mockCICDAnalytics;

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">CI/CD Analytics</h2>

      {/* Summary */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-xs text-muted-foreground">Success Rate</div>
          <div className="text-2xl font-bold mt-1 text-green-400">{data.build_success_rate}%</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-muted-foreground">Total Runs</div>
          <div className="text-2xl font-bold mt-1">{data.total_runs.toLocaleString()}</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-muted-foreground">Avg Duration</div>
          <div className="text-2xl font-bold mt-1">{Math.round(data.avg_duration_seconds / 60)}m</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-muted-foreground">Workflows</div>
          <div className="text-2xl font-bold mt-1">{data.total_workflows}</div>
        </Card>
      </div>

      {/* Success Rate Gauge */}
      <Card>
        <CardTitle>Build Success Rate</CardTitle>
        <div className="flex items-center gap-8 mt-4">
          <div className="relative w-40 h-40">
            <svg width="160" height="160" className="-rotate-90">
              <circle cx="80" cy="80" r="70" fill="none" stroke="var(--muted)" strokeWidth="12" />
              <circle
                cx="80"
                cy="80"
                r="70"
                fill="none"
                stroke="#22c55e"
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 70}
                strokeDashoffset={2 * Math.PI * 70 * (1 - data.build_success_rate / 100)}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-bold text-green-400">{data.build_success_rate}%</span>
            </div>
          </div>
          <div className="flex-1">
            <p className="text-muted-foreground mb-4">
              Build success rate over the last 90 days across all workflows.
            </p>
            <Progress value={data.build_success_rate} showLabel />
          </div>
        </div>
      </Card>

      {/* Success Rate Trend */}
      <Card>
        <CardTitle>Weekly Success Rate</CardTitle>
        <div className="h-64 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.weekly_success_rates}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="week" stroke="var(--muted-foreground)" fontSize={12} />
              <YAxis domain={[90, 100]} stroke="var(--muted-foreground)" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                }}
              />
              <Line type="monotone" dataKey="rate" stroke="#22c55e" strokeWidth={2} name="Success Rate %" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Workflow Breakdown */}
      <Card>
        <CardTitle>Workflow Details</CardTitle>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted-foreground border-b border-border">
                <th className="pb-3 pr-4">Workflow</th>
                <th className="pb-3 pr-4 text-right">Success Rate</th>
                <th className="pb-3 pr-4 text-right">Avg Duration</th>
                <th className="pb-3 text-right">Total Runs</th>
              </tr>
            </thead>
            <tbody>
              {data.workflow_details.map((wf) => (
                <tr key={wf.name} className="border-b border-border/50">
                  <td className="py-3 pr-4 font-medium">{wf.name}</td>
                  <td className="py-3 pr-4 text-right">
                    <Badge variant={wf.success_rate >= 95 ? "success" : wf.success_rate >= 80 ? "warning" : "critical"}>
                      {wf.success_rate}%
                    </Badge>
                  </td>
                  <td className="py-3 pr-4 text-right text-muted-foreground">
                    {Math.round(wf.avg_duration_seconds / 60)}m
                  </td>
                  <td className="py-3 text-right text-muted-foreground">
                    {wf.total_runs.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
