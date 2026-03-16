import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HealthScoreBadge } from "@/components/health-score-badge";
import { formatDate } from "@/lib/utils";

interface RepoCardProps {
  repo: {
    owner: string;
    name: string;
    full_name: string;
    description?: string;
    language?: string;
    stars_count: number;
    health_score?: number;
    grade?: string;
    score_delta?: number;
    last_analyzed?: string;
    analysis_status: string;
  };
}

export function RepoCard({ repo }: RepoCardProps) {
  const isAnalyzed = repo.analysis_status === "completed" && repo.health_score;

  return (
    <Link href={`/repo/${repo.owner}/${repo.name}`}>
      <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate">
              {repo.full_name}
            </h3>
            {repo.description && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {repo.description}
              </p>
            )}
            <div className="flex items-center gap-3 mt-3">
              {repo.language && (
                <Badge>{repo.language}</Badge>
              )}
              <span className="text-xs text-muted-foreground">
                {repo.stars_count.toLocaleString()} stars
              </span>
            </div>
          </div>
          {isAnalyzed && (
            <HealthScoreBadge
              score={repo.health_score!}
              grade={repo.grade!}
              size="sm"
              delta={repo.score_delta}
            />
          )}
        </div>
        <div className="mt-4 flex items-center justify-between">
          {repo.analysis_status === "running" && (
            <Badge variant="warning">Analyzing...</Badge>
          )}
          {repo.analysis_status === "queued" && (
            <Badge variant="info">Queued</Badge>
          )}
          {repo.analysis_status === "failed" && (
            <Badge variant="critical">Failed</Badge>
          )}
          {repo.last_analyzed && (
            <span className="text-xs text-muted-foreground">
              Analyzed {formatDate(repo.last_analyzed)}
            </span>
          )}
        </div>
      </Card>
    </Link>
  );
}
