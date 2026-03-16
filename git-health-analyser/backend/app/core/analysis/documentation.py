class DocumentationAnalyzer:
    """Analyze repository documentation completeness."""

    def analyze(self, repo_files: list[str]) -> dict:
        """Check for presence of standard documentation files."""
        filenames_lower = set()
        for f in repo_files:
            if isinstance(f, dict):
                filenames_lower.add(f.get("name", "").lower())
            else:
                filenames_lower.add(str(f).lower())

        has_readme = any(f.startswith("readme") for f in filenames_lower)
        has_contributing = any(f.startswith("contributing") for f in filenames_lower)
        has_license = "license" in filenames_lower or "license.md" in filenames_lower or "licence" in filenames_lower
        has_changelog = any(f.startswith("changelog") or f.startswith("changes") for f in filenames_lower)
        has_codeowners = "codeowners" in filenames_lower or ".github/codeowners" in filenames_lower
        has_ci = any(
            f in filenames_lower
            for f in [".github", ".gitlab-ci.yml", ".travis.yml", "jenkinsfile", ".circleci"]
        )
        has_issue_templates = ".github" in filenames_lower  # simplified check

        score = sum([
            30 if has_readme else 0,
            20 if has_contributing else 0,
            20 if has_license else 0,
            15 if has_changelog else 0,
            15 if has_codeowners else 0,
        ])

        return {
            "has_readme": has_readme,
            "has_contributing": has_contributing,
            "has_license": has_license,
            "has_changelog": has_changelog,
            "has_codeowners": has_codeowners,
            "has_ci_config": has_ci,
            "has_issue_templates": has_issue_templates,
            "documentation_score": score,
        }
