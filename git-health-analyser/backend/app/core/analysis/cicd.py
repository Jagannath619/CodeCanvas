from collections import defaultdict
from datetime import datetime, timezone


class CICDAnalyzer:
    """Analyze CI/CD workflow health."""

    def analyze(self, workflows: list[dict], workflow_runs: dict[int, list[dict]]) -> dict:
        if not workflows:
            return self._empty_metrics()

        total_workflows = len(workflows)
        all_runs = []
        workflow_details = []

        for wf in workflows:
            wf_id = wf.get("id")
            runs = workflow_runs.get(wf_id, [])
            all_runs.extend(runs)

            success = sum(1 for r in runs if r.get("conclusion") == "success")
            total = len(runs)
            rate = (success / total * 100) if total else 0

            # Average duration
            durations = []
            for r in runs:
                created = self._parse_date(r.get("created_at"))
                updated = self._parse_date(r.get("updated_at"))
                if created and updated:
                    dur = (updated - created).total_seconds()
                    if dur > 0:
                        durations.append(dur)

            avg_dur = sum(durations) / len(durations) if durations else 0

            workflow_details.append({
                "name": wf.get("name", "Unknown"),
                "success_rate": round(rate, 1),
                "avg_duration_seconds": round(avg_dur, 1),
                "total_runs": total,
            })

        # Overall metrics
        total_runs = len(all_runs)
        overall_success = sum(1 for r in all_runs if r.get("conclusion") == "success")
        success_rate = (overall_success / total_runs * 100) if total_runs else 0

        # Duration trend
        duration_trend = self._compute_duration_trend(all_runs)

        # Weekly success rates
        weekly = self._compute_weekly_rates(all_runs)

        # All durations for average
        all_durations = []
        for r in all_runs:
            created = self._parse_date(r.get("created_at"))
            updated = self._parse_date(r.get("updated_at"))
            if created and updated:
                dur = (updated - created).total_seconds()
                if dur > 0:
                    all_durations.append(dur)

        avg_duration = sum(all_durations) / len(all_durations) if all_durations else 0

        return {
            "total_workflows": total_workflows,
            "total_runs": total_runs,
            "build_success_rate": round(success_rate, 1),
            "avg_duration_seconds": round(avg_duration, 1),
            "duration_trend_score": duration_trend,
            "workflow_coverage_score": min(total_workflows * 25, 100),
            "weekly_success_rates": weekly,
            "workflow_details": workflow_details,
        }

    def _compute_duration_trend(self, runs: list[dict]) -> float:
        """Compare recent build durations to older ones. Stable/improving = high score."""
        if len(runs) < 10:
            return 50

        sorted_runs = sorted(runs, key=lambda r: r.get("created_at", ""))
        mid = len(sorted_runs) // 2
        old_runs = sorted_runs[:mid]
        new_runs = sorted_runs[mid:]

        old_durs = self._avg_duration(old_runs)
        new_durs = self._avg_duration(new_runs)

        if old_durs == 0:
            return 50
        ratio = new_durs / old_durs
        # ratio < 1 = improving (faster), > 1 = degrading (slower)
        if ratio <= 0.8:
            return 100
        if ratio <= 1.0:
            return 80
        if ratio <= 1.2:
            return 60
        if ratio <= 1.5:
            return 40
        return 20

    def _avg_duration(self, runs: list[dict]) -> float:
        durations = []
        for r in runs:
            created = self._parse_date(r.get("created_at"))
            updated = self._parse_date(r.get("updated_at"))
            if created and updated:
                dur = (updated - created).total_seconds()
                if dur > 0:
                    durations.append(dur)
        return sum(durations) / len(durations) if durations else 0

    def _compute_weekly_rates(self, runs: list[dict]) -> list[dict]:
        weekly: dict[str, dict] = defaultdict(lambda: {"success": 0, "total": 0})
        for r in runs:
            created = self._parse_date(r.get("created_at"))
            if not created:
                continue
            week = created.strftime("%Y-W%W")
            weekly[week]["total"] += 1
            if r.get("conclusion") == "success":
                weekly[week]["success"] += 1

        return [
            {
                "week": k,
                "rate": round(v["success"] / v["total"] * 100, 1) if v["total"] else 0,
                "total_runs": v["total"],
            }
            for k, v in sorted(weekly.items())[-12:]
        ]

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
            "total_workflows": 0,
            "total_runs": 0,
            "build_success_rate": 0,
            "avg_duration_seconds": 0,
            "duration_trend_score": 50,
            "workflow_coverage_score": 0,
            "weekly_success_rates": [],
            "workflow_details": [],
        }
