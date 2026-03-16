class DependencyAnalyzer:
    """Analyze dependency health from repository files."""

    PACKAGE_MANAGERS = {
        "package.json": "npm",
        "package-lock.json": "npm",
        "yarn.lock": "yarn",
        "pnpm-lock.yaml": "pnpm",
        "requirements.txt": "pip",
        "Pipfile": "pipenv",
        "Pipfile.lock": "pipenv",
        "pyproject.toml": "python",
        "poetry.lock": "poetry",
        "Gemfile": "bundler",
        "Gemfile.lock": "bundler",
        "go.mod": "go",
        "go.sum": "go",
        "Cargo.toml": "cargo",
        "Cargo.lock": "cargo",
        "composer.json": "composer",
        "pom.xml": "maven",
        "build.gradle": "gradle",
    }

    LOCK_FILES = {
        "package-lock.json", "yarn.lock", "pnpm-lock.yaml",
        "Pipfile.lock", "poetry.lock", "Gemfile.lock",
        "go.sum", "Cargo.lock", "composer.lock",
    }

    def analyze(self, repo_files: list[str]) -> dict:
        """Analyze dependencies from list of file names in repo root."""
        if not repo_files:
            return self._empty_metrics()

        filenames = set()
        for f in repo_files:
            if isinstance(f, dict):
                filenames.add(f.get("name", ""))
            else:
                filenames.add(str(f))

        # Detect package managers
        detected = set()
        for filename in filenames:
            if filename in self.PACKAGE_MANAGERS:
                detected.add(self.PACKAGE_MANAGERS[filename])

        # Check for lock files
        has_lock = bool(filenames & self.LOCK_FILES)

        # Dependency freshness and vulnerability are placeholders
        # (would need to parse files and check version APIs)
        freshness_score = 70 if detected else 0
        vuln_count = 0
        license_risk = 100  # default: no risk detected

        return {
            "detected_package_managers": sorted(detected),
            "total_dependencies": 0,  # Would need to parse manifest files
            "has_lock_file": has_lock,
            "dependency_freshness_score": freshness_score,
            "vulnerability_count": vuln_count,
            "license_risk_score": license_risk,
        }

    def _empty_metrics(self) -> dict:
        return {
            "detected_package_managers": [],
            "total_dependencies": 0,
            "has_lock_file": False,
            "dependency_freshness_score": 0,
            "vulnerability_count": 0,
            "license_risk_score": 0,
        }
