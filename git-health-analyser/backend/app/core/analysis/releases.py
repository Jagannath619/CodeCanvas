import re
from datetime import datetime, timezone


class ReleaseAnalyzer:
    """Analyze release patterns and stability."""

    def analyze(self, releases: list[dict], commits: list[dict]) -> dict:
        if not releases:
            return self._empty_metrics()

        sorted_releases = sorted(releases, key=lambda r: r.get("published_at", r.get("created_at", "")))
        total = len(sorted_releases)

        # Parse dates
        dates = []
        for r in sorted_releases:
            dt = self._parse_date(r.get("published_at") or r.get("created_at"))
            if dt:
                dates.append(dt)

        # Releases per month
        if len(dates) >= 2:
            span_months = max((dates[-1] - dates[0]).days / 30, 1)
            per_month = total / span_months
        else:
            per_month = 0

        # Release regularity (low variance in intervals = high score)
        regularity = self._compute_regularity(dates)

        # Hotfix detection
        hotfix_count = sum(
            1 for r in sorted_releases
            if self._is_hotfix(r.get("tag_name", ""), r.get("name", ""))
        )
        hotfix_pct = (hotfix_count / max(total, 1)) * 100

        # Prerelease count
        prerelease_count = sum(1 for r in sorted_releases if r.get("prerelease", False))

        # Release timeline
        timeline = []
        for i, r in enumerate(sorted_releases[-20:]):
            dt = self._parse_date(r.get("published_at") or r.get("created_at"))
            timeline.append({
                "tag": r.get("tag_name", ""),
                "date": dt.isoformat() if dt else None,
                "is_prerelease": r.get("prerelease", False),
                "name": r.get("name", ""),
            })

        return {
            "total_releases": total,
            "releases_per_month": round(per_month, 1),
            "release_regularity_score": regularity,
            "hotfix_percentage": round(hotfix_pct, 1),
            "prerelease_count": prerelease_count,
            "release_timeline": timeline,
        }

    def _compute_regularity(self, dates: list[datetime]) -> float:
        """Score based on how regular release intervals are."""
        if len(dates) < 3:
            return 50

        intervals = [(dates[i + 1] - dates[i]).days for i in range(len(dates) - 1)]
        mean = sum(intervals) / len(intervals)
        if mean == 0:
            return 50

        variance = sum((x - mean) ** 2 for x in intervals) / len(intervals)
        cv = (variance ** 0.5) / mean
        # cv of 0 = perfectly regular = 100
        return max(0, min(100, (1 - cv) * 100))

    def _is_hotfix(self, tag: str, name: str) -> bool:
        combined = f"{tag} {name}".lower()
        hotfix_patterns = ["hotfix", "patch", ".0.1", "urgent", "emergency"]
        if any(p in combined for p in hotfix_patterns):
            return True
        # Check semantic version patch bump (x.y.Z where Z > 0)
        match = re.search(r"v?\d+\.\d+\.(\d+)", tag)
        if match and int(match.group(1)) > 0:
            return True
        return False

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
            "total_releases": 0,
            "releases_per_month": 0,
            "release_regularity_score": 0,
            "hotfix_percentage": 0,
            "prerelease_count": 0,
            "release_timeline": [],
        }
