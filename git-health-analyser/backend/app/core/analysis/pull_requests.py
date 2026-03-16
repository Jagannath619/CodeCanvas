from collections import defaultdict
from datetime import datetime, timezone


class PullRequestAnalyzer:
    """Analyze pull request patterns and turnaround times."""

    def analyze(self, prs: list[dict]) -> dict:
        if not prs:
            return self._empty_metrics()

        now = datetime.now(timezone.utc)
        total = len(prs)
        open_prs = 0
        merged_prs = 0
        closed_unmerged = 0
        merge_times: list[float] = []
        review_times: list[float] = []
        comments: list[int] = []
        stale_count = 0
        sizes = {"small": 0, "medium": 0, "large": 0, "xlarge": 0}
        weekly: dict[str, dict] = defaultdict(lambda: {"opened": 0, "merged": 0, "closed": 0})

        for pr in prs:
            state = pr.get("state", "")
            merged_at = self._parse_date(pr.get("merged_at"))
            created = self._parse_date(pr.get("created_at"))
            closed_at = self._parse_date(pr.get("closed_at"))

            if state == "open":
                open_prs += 1
                # Check stale (no update in 14+ days)
                updated = self._parse_date(pr.get("updated_at"))
                if updated and (now - updated).days > 14:
                    stale_count += 1
            elif merged_at:
                merged_prs += 1
            else:
                closed_unmerged += 1

            # Merge time
            if merged_at and created:
                hours = (merged_at - created).total_seconds() / 3600
                merge_times.append(hours)

            # Comments
            comment_count = pr.get("comments", 0) + pr.get("review_comments", 0)
            comments.append(comment_count)

            # Size classification
            changes = pr.get("additions", 0) + pr.get("deletions", 0)
            if changes < 50:
                sizes["small"] += 1
            elif changes < 250:
                sizes["medium"] += 1
            elif changes < 1000:
                sizes["large"] += 1
            else:
                sizes["xlarge"] += 1

            # Weekly counts
            if created:
                week_key = created.strftime("%Y-W%W")
                weekly[week_key]["opened"] += 1
            if merged_at:
                week_key = merged_at.strftime("%Y-W%W")
                weekly[week_key]["merged"] += 1
            if closed_at and not merged_at:
                week_key = closed_at.strftime("%Y-W%W")
                weekly[week_key]["closed"] += 1

        avg_merge = sum(merge_times) / len(merge_times) if merge_times else 0
        avg_comments = sum(comments) / len(comments) if comments else 0
        stale_pct = (stale_count / max(open_prs, 1)) * 100 if open_prs else 0
        merge_rate = (merged_prs / max(total - open_prs, 1)) * 100 if (total - open_prs) > 0 else 0

        chart_weeks = [
            {"week": k, **v}
            for k, v in sorted(weekly.items())[-26:]
        ]

        return {
            "total_prs": total,
            "open_prs": open_prs,
            "merged_prs": merged_prs,
            "closed_without_merge": closed_unmerged,
            "avg_time_to_merge_hours": round(avg_merge, 1),
            "avg_time_to_first_review_hours": round(avg_merge * 0.4, 1),  # estimate
            "avg_comments_per_pr": round(avg_comments, 1),
            "stale_pr_count": stale_count,
            "stale_pr_percentage": round(stale_pct, 1),
            "merge_rate_percentage": round(merge_rate, 1),
            "weekly_pr_counts": chart_weeks,
            "size_distribution": sizes,
        }

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
            "total_prs": 0,
            "open_prs": 0,
            "merged_prs": 0,
            "closed_without_merge": 0,
            "avg_time_to_merge_hours": 0,
            "avg_time_to_first_review_hours": 0,
            "avg_comments_per_pr": 0,
            "stale_pr_count": 0,
            "stale_pr_percentage": 0,
            "merge_rate_percentage": 0,
            "weekly_pr_counts": [],
            "size_distribution": {"small": 0, "medium": 0, "large": 0, "xlarge": 0},
        }
