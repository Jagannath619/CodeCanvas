class RiskDetector:
    """Detect health risks and generate actionable recommendations."""

    def detect_risks(self, metrics: dict) -> list[dict]:
        risks = []

        commit = metrics.get("commit", {})
        contributor = metrics.get("contributor", {})
        pr = metrics.get("pr", {})
        issue = metrics.get("issue", {})
        ownership = metrics.get("ownership", {})
        cicd = metrics.get("cicd", {})
        dependency = metrics.get("dependency", {})
        documentation = metrics.get("documentation", {})
        release = metrics.get("release", {})

        # Critical risks
        if ownership.get("bus_factor", 0) <= 1 and ownership.get("total_contributors", 0) > 0:
            risks.append({
                "severity": "critical",
                "category": "knowledge_distribution",
                "message": f"Bus factor is {ownership.get('bus_factor', 0)} — project depends on a single contributor",
                "recommendation": "Encourage pair programming and code reviews to distribute knowledge. Assign secondary owners for critical paths.",
            })

        if cicd.get("build_success_rate", 100) < 70:
            risks.append({
                "severity": "critical",
                "category": "cicd_reliability",
                "message": f"CI build success rate is {cicd.get('build_success_rate', 0):.0f}% (below 70% threshold)",
                "recommendation": "Investigate failing builds. Fix flaky tests and broken pipelines to restore confidence in CI.",
            })

        if commit.get("days_since_last_commit", 0) > 30:
            days = commit.get("days_since_last_commit", 0)
            risks.append({
                "severity": "critical",
                "category": "activity",
                "message": f"No commits in {days} days — project may be stagnant",
                "recommendation": "Check if the project is actively maintained. Consider archiving if abandoned.",
            })

        # Warning risks
        if pr.get("stale_pr_percentage", 0) > 30:
            risks.append({
                "severity": "warning",
                "category": "pr_process",
                "message": f"{pr.get('stale_pr_percentage', 0):.0f}% of open PRs are stale (no activity in 14+ days)",
                "recommendation": "Review and close or merge stale PRs. Set up PR review reminders.",
            })

        if issue.get("stale_issue_percentage", 0) > 40:
            risks.append({
                "severity": "warning",
                "category": "issue_management",
                "message": f"{issue.get('stale_issue_percentage', 0):.0f}% of open issues are stale (no activity in 30+ days)",
                "recommendation": "Triage stale issues: close invalid ones, label and prioritize the rest.",
            })

        if pr.get("avg_time_to_first_review_hours", 0) > 48:
            hours = pr.get("avg_time_to_first_review_hours", 0)
            risks.append({
                "severity": "warning",
                "category": "pr_process",
                "message": f"Average PR review time is {hours:.0f} hours (target: under 48h)",
                "recommendation": "Add more reviewers, set up CODEOWNERS, or establish review time SLAs.",
            })

        if not documentation.get("has_readme", False):
            risks.append({
                "severity": "warning",
                "category": "documentation",
                "message": "Repository is missing a README file",
                "recommendation": "Add a README with project overview, setup instructions, and usage examples.",
            })

        if dependency.get("vulnerability_count", 0) > 0:
            count = dependency.get("vulnerability_count", 0)
            risks.append({
                "severity": "warning",
                "category": "dependency_health",
                "message": f"{count} known vulnerabilities detected in dependencies",
                "recommendation": "Run dependency audit and update vulnerable packages.",
            })

        if release.get("hotfix_percentage", 0) > 30:
            risks.append({
                "severity": "warning",
                "category": "release_practice",
                "message": f"{release.get('hotfix_percentage', 0):.0f}% of releases are hotfixes",
                "recommendation": "Improve testing and staging processes to reduce emergency releases.",
            })

        # Info risks
        if contributor.get("active_contributors_30d", 0) < contributor.get("active_contributors_90d", 0) * 0.5:
            risks.append({
                "severity": "info",
                "category": "contributors",
                "message": "Contributor activity is declining — fewer active contributors recently",
                "recommendation": "Review team capacity. Consider onboarding new contributors.",
            })

        if not documentation.get("has_contributing", False):
            risks.append({
                "severity": "info",
                "category": "documentation",
                "message": "Missing CONTRIBUTING guide",
                "recommendation": "Add a CONTRIBUTING.md to help new contributors get started.",
            })

        if not documentation.get("has_codeowners", False):
            risks.append({
                "severity": "info",
                "category": "documentation",
                "message": "Missing CODEOWNERS file",
                "recommendation": "Add a CODEOWNERS file to automate review assignments.",
            })

        # Sort by severity
        severity_order = {"critical": 0, "warning": 1, "info": 2}
        risks.sort(key=lambda r: severity_order.get(r["severity"], 3))

        return risks
