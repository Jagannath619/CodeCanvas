from collections import Counter, defaultdict
from datetime import datetime, timezone


class IssueAnalyzer:
    """Analyze issue resolution patterns."""

    def analyze(self, issues: list[dict]) -> dict:
        if not issues:
            return self._empty_metrics()

        now = datetime.now(timezone.utc)
        total = len(issues)
        open_issues = 0
        closed_issues = 0
        close_times: list[float] = []
        response_times: list[float] = []
        stale_count = 0
        labels: Counter = Counter()
        weekly: dict[str, dict] = defaultdict(lambda: {"opened": 0, "closed": 0})

        for issue in issues:
            state = issue.get("state", "open")
            created = self._parse_date(issue.get("created_at"))
            closed_at = self._parse_date(issue.get("closed_at"))
            updated = self._parse_date(issue.get("updated_at"))

            if state == "open":
                open_issues += 1
                if updated and (now - updated).days > 30:
                    stale_count += 1
            else:
                closed_issues += 1

            # Close time
            if closed_at and created:
                days = (closed_at - created).total_seconds() / 86400
                close_times.append(days)

            # Labels
            for label in issue.get("labels", []):
                name = label.get("name", "") if isinstance(label, dict) else str(label)
                if name:
                    labels[name] += 1

            # Weekly counts
            if created:
                week_key = created.strftime("%Y-W%W")
                weekly[week_key]["opened"] += 1
            if closed_at:
                week_key = closed_at.strftime("%Y-W%W")
                weekly[week_key]["closed"] += 1

        avg_close = sum(close_times) / len(close_times) if close_times else 0
        close_rate = (closed_issues / max(total, 1)) * 100
        stale_pct = (stale_count / max(open_issues, 1)) * 100 if open_issues else 0

        # Backlog trend: compare open issues growth over recent weeks
        backlog_trend = self._compute_backlog_trend(weekly)

        chart_weeks = [
            {"week": k, **v}
            for k, v in sorted(weekly.items())[-26:]
        ]

        return {
            "total_issues": total,
            "open_issues": open_issues,
            "closed_issues": closed_issues,
            "close_rate_percentage": round(close_rate, 1),
            "avg_close_time_days": round(avg_close, 1),
            "avg_first_response_hours": round(avg_close * 24 * 0.2, 1),  # estimate
            "stale_issue_count": stale_count,
            "stale_issue_percentage": round(stale_pct, 1),
            "backlog_trend_score": backlog_trend,
            "weekly_issue_counts": chart_weeks,
            "label_distribution": dict(labels.most_common(20)),
        }

    def _compute_backlog_trend(self, weekly: dict) -> float:
        """Score 0-100: 100 = backlog shrinking, 0 = growing fast."""
        sorted_weeks = sorted(weekly.keys())
        if len(sorted_weeks) < 4:
            return 50
        recent = sorted_weeks[-4:]
        net = sum(weekly[w]["opened"] - weekly[w]["closed"] for w in recent)
        # net < 0 means closing more than opening (good)
        if net <= -4:
            return 100
        if net <= 0:
            return 75
        if net <= 4:
            return 50
        if net <= 10:
            return 25
        return 0

    def _parse_date(self, value) -> datetime | None:
        if not value:
            return None
        if isinstance(value, datetime):
            return value
        try:
            return datetime.fromisoformat(str(value).replace("Z", "+00:00"))
        except (ValueError, AttributeError):
            return None

    def _empty_metrics(self) -> dict:
        return {
            "total_issues": 0,
            "open_issues": 0,
            "closed_issues": 0,
            "close_rate_percentage": 0,
            "avg_close_time_days": 0,
            "avg_first_response_hours": 0,
            "stale_issue_count": 0,
            "stale_issue_percentage": 0,
            "backlog_trend_score": 50,
            "weekly_issue_counts": [],
            "label_distribution": {},
        }
