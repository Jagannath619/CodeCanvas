from collections import Counter, defaultdict
from datetime import datetime, timedelta, timezone


class OwnershipAnalyzer:
    """Analyze code ownership and bus factor."""

    def analyze(self, commits: list[dict]) -> dict:
        if not commits:
            return self._empty_metrics()

        now = datetime.now(timezone.utc)

        # Map files/directories to contributors
        author_commits: Counter = Counter()
        dir_authors: dict[str, Counter] = defaultdict(Counter)

        for c in commits:
            login = self._get_author_login(c)
            if not login:
                continue
            author_commits[login] += 1

            # If commit has file info, track directory ownership
            files = c.get("files", [])
            if isinstance(files, list):
                for f in files:
                    filename = f.get("filename", "") if isinstance(f, dict) else str(f)
                    if filename:
                        directory = "/".join(filename.split("/")[:-1]) or "/"
                        dir_authors[directory][login] += 1

        # Bus factor: minimum contributors covering 50% of total commits
        bus_factor = self._compute_bus_factor(author_commits)

        # Shared ownership: directories with 2+ contributors
        dirs_with_multiple = sum(1 for authors in dir_authors.values() if len(authors) >= 2)
        total_dirs = max(len(dir_authors), 1)
        shared_pct = (dirs_with_multiple / total_dirs) * 100

        # Critical contributors
        total_commits = sum(author_commits.values())
        critical = []
        for login, count in author_commits.most_common(10):
            pct = (count / max(total_commits, 1)) * 100
            sole_dirs = [
                d for d, authors in dir_authors.items()
                if len(authors) == 1 and login in authors
            ]
            critical.append({
                "login": login,
                "ownership_pct": round(pct, 1),
                "is_sole_owner_of": sole_dirs[:10],
            })

        # Directory ownership
        dir_ownership = {}
        for directory, authors in list(dir_authors.items())[:50]:
            primary = authors.most_common(1)[0][0] if authors else None
            dir_ownership[directory] = {
                "primary_owner": primary,
                "contributor_count": len(authors),
            }

        # Orphan files (directories not touched in 180 days)
        orphan_pct = 0  # Would need file-level timestamps for accurate calculation

        return {
            "bus_factor": bus_factor,
            "shared_ownership_percentage": round(shared_pct, 1),
            "orphan_file_percentage": orphan_pct,
            "critical_contributors": critical,
            "directory_ownership": dir_ownership,
            "total_contributors": len(author_commits),
        }

    def _compute_bus_factor(self, author_commits: Counter) -> int:
        """Minimum contributors who account for 50%+ of commits."""
        total = sum(author_commits.values())
        if total == 0:
            return 0

        threshold = total * 0.5
        cumulative = 0
        for i, (_, count) in enumerate(author_commits.most_common()):
            cumulative += count
            if cumulative >= threshold:
                return i + 1
        return len(author_commits)

    def _get_author_login(self, commit: dict) -> str | None:
        if "author" in commit and isinstance(commit["author"], dict):
            return commit["author"].get("login")
        return commit.get("author_login")

    def _empty_metrics(self) -> dict:
        return {
            "bus_factor": 0,
            "shared_ownership_percentage": 0,
            "orphan_file_percentage": 0,
            "critical_contributors": [],
            "directory_ownership": {},
            "total_contributors": 0,
        }
