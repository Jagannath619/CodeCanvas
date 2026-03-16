"use client";

import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RiskCard } from "@/components/risk-card";
import { mockRisks } from "@/lib/mock-data";

export default function RisksPage() {
  const critical = mockRisks.filter((r) => r.severity === "critical");
  const warnings = mockRisks.filter((r) => r.severity === "warning");
  const info = mockRisks.filter((r) => r.severity === "info");

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Risk Alerts</h2>
        <div className="flex gap-2">
          {critical.length > 0 && (
            <Badge variant="critical">{critical.length} Critical</Badge>
          )}
          {warnings.length > 0 && (
            <Badge variant="warning">{warnings.length} Warnings</Badge>
          )}
          {info.length > 0 && (
            <Badge variant="info">{info.length} Info</Badge>
          )}
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4 border-l-4 border-l-red-500">
          <div className="text-xs text-muted-foreground">Critical</div>
          <div className="text-3xl font-bold mt-1 text-red-400">{critical.length}</div>
        </Card>
        <Card className="p-4 border-l-4 border-l-yellow-500">
          <div className="text-xs text-muted-foreground">Warnings</div>
          <div className="text-3xl font-bold mt-1 text-yellow-400">{warnings.length}</div>
        </Card>
        <Card className="p-4 border-l-4 border-l-blue-500">
          <div className="text-xs text-muted-foreground">Informational</div>
          <div className="text-3xl font-bold mt-1 text-blue-400">{info.length}</div>
        </Card>
      </div>

      {/* Critical */}
      {critical.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-red-400 mb-3">Critical Issues</h3>
          <div className="space-y-3">
            {critical.map((risk, i) => (
              <RiskCard key={i} risk={risk} />
            ))}
          </div>
        </div>
      )}

      {/* Warnings */}
      {warnings.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-yellow-400 mb-3">Warnings</h3>
          <div className="space-y-3">
            {warnings.map((risk, i) => (
              <RiskCard key={i} risk={risk} />
            ))}
          </div>
        </div>
      )}

      {/* Info */}
      {info.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-blue-400 mb-3">Informational</h3>
          <div className="space-y-3">
            {info.map((risk, i) => (
              <RiskCard key={i} risk={risk} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
