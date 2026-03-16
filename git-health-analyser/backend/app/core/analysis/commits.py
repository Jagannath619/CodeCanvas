from collections import Counter, defaultdict
from datetime import datetime, timedelta, timezone


class CommitAnalyzer:
    """Analyze commit patterns and frequency."""

    def analyze(self, commits: list[dict]) -> dict:
        if not commits:
            return self._empty_metrics()

        dates = []
        for c in commits:
            dt = self._parse_date(c)
            if dt:
                dates.append(dt)

        if not dates:
            return self._empty_metrics()

        dates.sort()
        now = datetime.now(timezone.utc)
        days_since_last = (now - dates[-1]).days if dates else 365

        # Weekly commit counts
        weekly_counts = self._compute_weekly_counts(dates)
        weeks = [v for v in weekly_counts.values()]
        avg_per_week = sum(weeks) / max(len(weeks), 1)

        # Velocity trend: compare last 4 weeks to prior 4 weeks
        velocity_trend = self._compute_velocity_trend(weekly_counts, now)

        # Consistency: inverse of coefficient of variation
        consistency = self._compute_consistency(weeks)

        # Commit sizes
        sizes = [c.get("stats", {}).get("total", 0) if isinstance(c.get("stats"), dict) else 0 for c in commits]
        avg_size = sum(sizes) / max(len(sizes), 1)

        # Hourly distribution
        hourly = Counter()
        daily = Counter()
        for dt in dates:
            hourly[dt.hour] += 1
            daily[dt.strftime("%A")] += 1

        # Weekly counts for charting
        chart_weeks = [
            {"week": k, "count": v}
            for k, v in sorted(weekly_counts.items())[-52:]
        ]

        return {
            "total_commits": len(commits),
            "commits_per_week_avg": round(avg_per_week, 1),
            "days_since_last_commit": days_since_last,
            "velocity_trend_score": velocity_trend,
            "consistency_score": consistency,
            "commit_size_avg": round(avg_size, 1),
            "weekly_counts": chart_weeks,
            "hourly_distribution": dict(hourly),
            "daily_distribution": dict(daily),
            "first_commit_date": dates[0].isoformat() if dates else None,
            "last_commit_date": dates[-1].isoformat() if dates else None,
        }

    def _compute_weekly_counts(self, dates: list[datetime]) -> dict[str, int]:
        counts: dict[str, int] = defaultdict(int)
        for dt in dates:
            week_key = dt.strftime("%Y-W%W")
            counts[week_key] += 1
        return dict(counts)

    def _compute_velocity_trend(self, weekly_counts: dict, now: datetime) -> float:
        """Compare recent 4 weeks to prior 4 weeks. Returns 0-100."""
        recent_weeks = set()
        prior_weeks = set()
        for i in range(4):
            d = now - timedelta(weeks=i)
            recent_weeks.add(d.strftime("%Y-W%W"))
        for i in range(4, 8):
            d = now - timedelta(weeks=i)
            prior_weeks.add(d.strftime("%Y-W%W"))

        recent = sum(weekly_counts.get(w, 0) for w in recent_weeks)
        prior = sum(weekly_counts.get(w, 0) for w in prior_weeks)

        if prior == 0:
            return 75 if recent > 0 else 25
        ratio = recent / prior
        # ratio > 1 means improving, < 1 means declining
        return min(100, max(0, 50 + (ratio - 1) * 50))

    def _compute_consistency(self, weekly_values: list[int]) -> float:
        """Low variance = high consistency score."""
        if len(weekly_values) < 2:
            return 50
        mean = sum(weekly_values) / len(weekly_values)
        if mean == 0:
            return 0
        variance = sum((x - mean) ** 2 for x in weekly_values) / len(weekly_values)
        cv = (variance ** 0.5) / mean  # coefficient of variation
        # cv of 0 = 100, cv of 2+ = 0
        return max(0, min(100, (1 - cv / 2) * 100))

    def _parse_date(self, commit: dict) -> datetime | None:
        date_str = None
        if "commit" in commit and isinstance(commit["commit"], dict):
            author = commit["commit"].get("author", {})
            if isinstance(author, dict):
                date_str = author.get("date")
        if not date_str:
            date_str = commit.get("committed_at") or commit.get("created_at")
        if not date_str:
            return None
        try:
            return datetime.fromisoformat(date_str.replace("Z", "+00:00"))
        except (ValueError, AttributeError):
            return None

    def _empty_metrics(self) -> dict:
        return {
            "total_commits": 0,
            "commits_per_week_avg": 0,
            "days_since_last_commit": 365,
            "velocity_trend_score": 0,
            "consistency_score": 0,
            "commit_size_avg": 0,
            "weekly_counts": [],
            "hourly_distribution": {},
            "daily_distribution": {},
            "first_commit_date": None,
            "last_commit_date": None,
        }
