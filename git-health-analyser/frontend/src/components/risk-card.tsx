import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface RiskCardProps {
  risk: {
    severity: string;
    category: string;
    message: string;
    recommendation: string;
  };
}

const severityConfig: Record<string, { variant: "critical" | "warning" | "info"; icon: string }> = {
  critical: { variant: "critical", icon: "!!!" },
  warning: { variant: "warning", icon: "!!" },
  info: { variant: "info", icon: "i" },
};

export function RiskCard({ risk }: RiskCardProps) {
  const config = severityConfig[risk.severity] || severityConfig.info;

  return (
    <Card className="border-l-4" style={{
      borderLeftColor: risk.severity === "critical" ? "#ef4444" :
                       risk.severity === "warning" ? "#eab308" : "#3b82f6"
    }}>
      <div className="flex items-start gap-3">
        <Badge variant={config.variant} className="mt-0.5 shrink-0">
          {risk.severity.toUpperCase()}
        </Badge>
        <div className="flex-1">
          <p className="text-sm font-medium text-foreground">{risk.message}</p>
          <p className="text-xs text-muted-foreground mt-2">
            Recommendation: {risk.recommendation}
          </p>
        </div>
      </div>
    </Card>
  );
}
