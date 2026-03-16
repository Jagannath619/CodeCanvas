import { scoreColor } from "@/lib/utils";

interface HealthScoreBadgeProps {
  score: number;
  grade: string;
  size?: "sm" | "md" | "lg";
  delta?: number | null;
}

const sizes = {
  sm: { outer: 64, inner: 52, font: "text-lg", ring: 4 },
  md: { outer: 96, inner: 80, font: "text-2xl", ring: 6 },
  lg: { outer: 128, inner: 108, font: "text-4xl", ring: 8 },
};

export function HealthScoreBadge({
  score,
  grade,
  size = "md",
  delta,
}: HealthScoreBadgeProps) {
  const color = scoreColor(score);
  const s = sizes[size];
  const circumference = 2 * Math.PI * (s.outer / 2 - s.ring);
  const progress = (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: s.outer, height: s.outer }}>
        <svg
          width={s.outer}
          height={s.outer}
          className="-rotate-90"
        >
          <circle
            cx={s.outer / 2}
            cy={s.outer / 2}
            r={s.outer / 2 - s.ring}
            fill="none"
            stroke="var(--muted)"
            strokeWidth={s.ring}
          />
          <circle
            cx={s.outer / 2}
            cy={s.outer / 2}
            r={s.outer / 2 - s.ring}
            fill="none"
            stroke={color}
            strokeWidth={s.ring}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            className="transition-all duration-700"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`${s.font} font-bold`} style={{ color }}>
            {grade}
          </span>
        </div>
      </div>
      <div className="text-center">
        <div className="text-sm font-medium text-foreground">
          {Math.round(score)}
        </div>
        {delta != null && delta !== 0 && (
          <div
            className={`text-xs ${delta > 0 ? "text-green-400" : "text-red-400"}`}
          >
            {delta > 0 ? "+" : ""}
            {delta.toFixed(1)}
          </div>
        )}
      </div>
    </div>
  );
}
