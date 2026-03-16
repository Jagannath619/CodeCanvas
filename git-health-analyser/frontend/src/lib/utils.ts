import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function gradeColor(grade: string): string {
  const map: Record<string, string> = {
    "A+": "grade-a-plus",
    A: "grade-a",
    B: "grade-b",
    C: "grade-c",
    D: "grade-d",
    F: "grade-f",
  };
  return map[grade] || "grade-f";
}

export function gradeBgColor(grade: string): string {
  return `bg-${gradeColor(grade)}`;
}

export function scoreColor(score: number): string {
  if (score >= 90) return "#22c55e";
  if (score >= 80) return "#22c55e";
  if (score >= 70) return "#84cc16";
  if (score >= 60) return "#eab308";
  if (score >= 40) return "#f97316";
  return "#ef4444";
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDuration(hours: number): string {
  if (hours < 1) return `${Math.round(hours * 60)}m`;
  if (hours < 24) return `${Math.round(hours)}h`;
  return `${Math.round(hours / 24)}d`;
}

export function trendIcon(delta: number | null): string {
  if (!delta) return "~";
  if (delta > 5) return "+";
  if (delta < -5) return "-";
  return "~";
}
