from collections import Counter, defaultdict
from datetime import datetime, timedelta, timezone


class ContributorAnalyzer:
    """Analyze contributor activity and distribution."""

    def analyze(self, commits: list[dict], pull_requests: list[dict]) -> dict:
        if not commits and not pull_requests:
            return self._empty_metrics()

        now = datetime.now(timezone.utc)
        contributor_commits: dict[str, list[datetime]] = defaultdict(list)
        contributor_prs: Counter = Counter()

        # Parse commits
        for c in commits:
            login = self._get_author_login(c)
            if not login:
                continue
            dt = self._parse_date(c)
            if dt:
                contributor_commits[login].append(dt)

        # Parse PRs
        for pr in pull_requests:
            login = pr.get("user", {}).get("login") if isinstance(pr.get("user"), dict) else pr.get("author_login")
            if login:
                contributor_prs[login] += 1

        all_logins = set(contributor_commits.keys()) | set(contributor_prs.keys())
        total = len(all_logins)

        # Active contributors by time window
        active_30d = set()
        active_90d = set()
        for login, dates in contributor_commits.items():
            for dt in dates:
                if (now - dt).days <= 30:
                    active_30d.add(login)
                if (now - dt).days <= 90:
                    active_90d.add(login)

        # Contribution distribution (Gini-based evenness)
        commit_counts = [len(dates) for dates in contributor_commits.values()]
        evenness = self._compute_evenness(commit_counts)

        # Growth score
        growth_score = self._compute_growth_score(contributor_commits, now)

        # Top contributors
        top = []
        for login in all_logins:
            dates = contributor_commits.get(login, [])
            top.append({
                "login": login,
                "commits": len(dates),
                "prs": contributor_prs.get(login, 0),
                "last_active": max(dates).isoformat() if dates else None,
            })
        top.sort(key=lambda x: x["commits"], reverse=True)

        # Activity timeline (weekly)
        timeline = self._compute_timeline(contributor_commits, now)

        return {
            "total_contributors": total,
            "active_contributors_30d": len(active_30d),
            "active_contributors_90d": len(active_90d),
            "contributor_growth_score": growth_score,
            "contribution_evenness": evenness,
            "top_contributors": top[:20],
            "activity_timeline": timeline,
        }

    def _compute_evenness(self, values: list[int]) -> float:
        """Compute evenness as (1 - Gini coefficient) * 100."""
        if not values or len(values) < 2:
            return 50
        sorted_vals = sorted(values)
        n = len(sorted_vals)
        total = sum(sorted_vals)
        if total == 0:
            return 0
        cumulative = 0
        gini_sum = 0
        for i, v in enumerate(sorted_vals):
            cumulative += v
            gini_sum += (2 * (i + 1) - n - 1) * v
        gini = gini_sum / (n * total)
        return round(max(0, (1 - gini) * 100), 1)

    def _compute_growth_score(self, contributor_commits: dict, now: datetime) -> float:
        """Compare new contributors in last 90d vs prior 90d."""
        recent_new = set()
        prior_new = set()
        for login, dates in contributor_commits.items():
            first = min(dates)
            days_ago = (now - first).days
            if days_ago <= 90:
                recent_new.add(login)
            elif days_ago <= 180:
                prior_new.add(login)

        recent = len(recent_new)
        prior = len(prior_new)
        if prior == 0:
            return 75 if recent > 0 else 25
        ratio = recent / prior
        return min(100, max(0, 50 + (ratio - 1) * 50))

    def _compute_timeline(self, contributor_commits: dict, now: datetime) -> list[dict]:
        """Weekly active/new/churned contributor counts for last 12 weeks."""
        timeline = []
        for weeks_ago in range(11, -1, -1):
            week_start = now - timedelta(weeks=weeks_ago + 1)
            week_end = now - timedelta(weeks=weeks_ago)
            prev_start = week_start - timedelta(weeks=1)

            active = set()
            prev_active = set()
            for login, dates in contributor_commits.items():
                for dt in dates:
                    if week_start <= dt < week_end:
                        active.add(login)
                    if prev_start <= dt < week_start:
                        prev_active.add(login)

            new = active - prev_active
            churned = prev_active - active

            timeline.append({
                "week": week_end.strftime("%Y-W%W"),
                "active_count": len(active),
                "new_count": len(new),
                "churned_count": len(churned),
            })
        return timeline

    def _get_author_login(self, commit: dict) -> str | None:
        if "author" in commit and isinstance(commit["author"], dict):
            return commit["author"].get("login")
        return commit.get("author_login")

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
            "total_contributors": 0,
            "active_contributors_30d": 0,
            "active_contributors_90d": 0,
            "contributor_growth_score": 0,
            "contribution_evenness": 0,
            "top_contributors": [],
            "activity_timeline": [],
        }
