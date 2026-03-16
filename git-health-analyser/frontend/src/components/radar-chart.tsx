"use client";

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";

interface RadarChartProps {
  dimensions: Record<string, { score: number; label: string }>;
}

const dimensionLabels: Record<string, string> = {
  activity: "Activity",
  contributors: "Contributors",
  pr_process: "PR Process",
  issue_management: "Issues",
  code_stability: "Stability",
  knowledge_distribution: "Knowledge",
  cicd_reliability: "CI/CD",
  release_practice: "Releases",
  dependency_health: "Dependencies",
  documentation: "Docs",
};

export function DimensionRadarChart({ dimensions }: RadarChartProps) {
  const data = Object.entries(dimensions).map(([key, val]) => ({
    dimension: dimensionLabels[key] || key,
    score: val.score,
    fullMark: 100,
  }));

  return (
    <ResponsiveContainer width="100%" height={350}>
      <RadarChart data={data}>
        <PolarGrid stroke="var(--border)" />
        <PolarAngleAxis
          dataKey="dimension"
          tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
        />
        <PolarRadiusAxis
          angle={90}
          domain={[0, 100]}
          tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
        />
        <Radar
          name="Score"
          dataKey="score"
          stroke="#6366f1"
          fill="#6366f1"
          fillOpacity={0.25}
          strokeWidth={2}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
