# GitHub Project Health Analyzer — Complete Product Design

---

## 1. Product Overview

**GitHub Project Health Analyzer** is a SaaS web application that connects to any public or private GitHub repository and generates a comprehensive health report. It evaluates code activity, contributor patterns, CI/CD reliability, dependency risks, and development velocity — then distills everything into a single **Project Health Score (0–100)**.

Think of it as a **credit score for software projects**. Just as a credit score aggregates financial behavior into a single number, the Health Score aggregates engineering signals into one actionable metric.

**Core value proposition:** Make invisible engineering health visible — in 30 seconds, not 30 hours of manual investigation.

### How It Works

1. User authenticates via GitHub OAuth.
2. User enters a repository URL or selects from their repos.
3. The system queues a background analysis job.
4. The analysis engine pulls data from GitHub APIs (commits, PRs, issues, workflows, releases, contributors).
5. A metrics engine computes ~15 health dimensions.
6. A scoring engine produces the composite Health Score.
7. The dashboard renders interactive visualizations and risk alerts.
8. Reports can be exported, shared, or scheduled for periodic re-analysis.

---

## 2. Problems It Solves

| Stakeholder | Problem | How We Solve It |
|---|---|---|
| **Engineering Managers** | No unified view of project health across repos; rely on gut feeling | Single dashboard with quantified metrics and trends |
| **Tech Leads** | Hard to spot bottlenecks — slow PR reviews, abandoned issues, single points of failure | Automated detection of bus factor, PR bottlenecks, stale issues |
| **Open Source Maintainers** | Can't demonstrate project vitality to sponsors/users | Shareable health badge and public report page |
| **Recruiters / Hiring Managers** | Evaluating candidate contributions is manual and error-prone | Contributor-level analytics showing commit quality, review activity, consistency |
| **DevOps Teams** | CI/CD failures and flaky pipelines are invisible until they block a release | CI/CD health metrics, failure rate trends, build duration tracking |
| **Investors / Due Diligence** | Assessing engineering quality of acquisition targets requires expensive audits | Automated technical health report as a starting point |
| **Security Teams** | Dependency vulnerabilities and stale dependencies go unnoticed | Dependency age analysis, known vulnerability flagging |

### Key Challenges Addressed

- **Information fragmentation**: GitHub Insights is limited; useful data is spread across commits, PRs, issues, Actions, and releases with no unified view.
- **Metric overload**: Raw numbers (1,247 commits!) mean nothing without context (is that good for a 3-year-old project with 12 contributors?).
- **Trend blindness**: Point-in-time snapshots hide degradation. A project can look healthy today while slowly dying.
- **Bus factor ignorance**: Most teams don't know their bus factor until someone leaves.
- **PR review bottlenecks**: Slow reviews compound into merge conflicts, developer frustration, and feature delays.

---

## 3. Target Users

### Primary Users

| Persona | Use Case | Key Metric They Care About |
|---|---|---|
| **Engineering Manager** | Weekly health check across 10–50 repos | Health Score trend, velocity, risk alerts |
| **Tech Lead** | Sprint retrospective data, identify bottlenecks | PR turnaround, code ownership, code churn |
| **Open Source Maintainer** | Show project health to community, attract contributors | Activity score, contributor growth, issue responsiveness |

### Secondary Users

| Persona | Use Case | Key Metric They Care About |
|---|---|---|
| **Recruiter / Hiring Manager** | Evaluate candidate's GitHub contributions | Commit consistency, code review participation, quality signals |
| **DevOps Engineer** | Monitor CI/CD pipeline health | Build success rate, deploy frequency, pipeline duration |
| **Security Engineer** | Dependency and supply chain risk assessment | Dependency freshness, vulnerability count, update cadence |
| **VP of Engineering** | Portfolio-level view across an organization | Aggregated health scores, team comparisons, trend reports |
| **Investor / Acquirer** | Technical due diligence | Overall health score, contributor distribution, maintenance trajectory |

---

## 4. Core Features

### 4.1 Commit Frequency Analysis

- **Daily / weekly / monthly commit counts** with trend lines
- **Commit velocity**: rolling 30-day average vs. historical baseline
- **Activity heatmap**: GitHub-style contribution grid per repo
- **Working hours analysis**: when are commits happening (detect off-hours/weekend work as a burnout signal)
- **Commit size distribution**: histogram of lines changed per commit (large commits = risk)

### 4.2 Contributor Activity

- **Active contributors**: count over rolling windows (7d, 30d, 90d)
- **Contributor growth/churn rate**: new contributors joining vs. going inactive
- **Contribution distribution**: Gini coefficient — is work spread evenly or concentrated?
- **Top contributors by**: commits, lines changed, PRs merged, reviews given
- **Contributor timeline**: when each person was active (Gantt-style)

### 4.3 Pull Request Turnaround Time

- **Time to first review**: from PR opened → first review comment
- **Time to merge**: from PR opened → merged
- **Review depth**: average comments per PR, approval rate
- **PR size analysis**: correlation between PR size and review time
- **Stale PRs**: open PRs with no activity in 14+ days
- **PR rejection rate**: % of PRs closed without merge

### 4.4 Issue Resolution Metrics

- **Mean time to close**: overall and by label (bug, feature, etc.)
- **Issue backlog growth**: open rate vs. close rate
- **Stale issues**: open issues with no activity in 30+ days
- **Issue responsiveness**: time to first comment from a maintainer
- **Label distribution**: breakdown by type, priority, component
- **Issue close rate**: % of issues eventually resolved

### 4.5 Code Churn

- **Churn rate**: % of lines that are modified within 14 days of being written
- **Hotspot files**: files with the highest churn (likely problematic areas)
- **Refactor ratio**: ratio of lines deleted to lines added (healthy projects refactor)
- **New code vs. churn**: distinguish new feature work from rework

### 4.6 Code Ownership Analysis

- **File ownership matrix**: who "owns" each directory/file (by commit volume)
- **Shared ownership score**: % of files touched by 2+ contributors
- **Orphan files**: files not touched in 6+ months by anyone active
- **Knowledge silos**: directories where only 1 person has committed

### 4.7 Bus Factor Detection

- **Bus factor score**: minimum number of people who, if they left, would leave a component with no knowledgeable contributor
- **Critical contributor identification**: people whose departure would cause the most damage
- **Knowledge distribution heatmap**: visual map of who knows what
- **Risk level**: HIGH (bus factor = 1), MEDIUM (2–3), LOW (4+)

### 4.8 Dependency Risk Analysis

- **Dependency count**: direct and transitive
- **Dependency freshness**: how far behind latest versions
- **Known vulnerabilities**: cross-reference with GitHub Advisory Database / OSV
- **Dependency age**: identify ancient or unmaintained dependencies
- **License risk**: flag copyleft or restrictive licenses in the dependency tree
- **Lock file health**: is the lock file committed and up to date?

### 4.9 CI/CD Health Analysis

- **Build success rate**: % of workflow runs that pass (7d, 30d, 90d)
- **Mean build duration**: with trend (increasing = growing tech debt)
- **Flaky test detection**: tests that fail intermittently
- **Workflow count and structure**: number of CI workflows, their triggers
- **Deploy frequency**: how often releases/deploys happen
- **Time from commit to deploy**: full cycle time

### 4.10 Release Stability Metrics

- **Release cadence**: time between releases (regular = healthy)
- **Release frequency trend**: accelerating or slowing down
- **Hotfix ratio**: % of releases that are hotfixes / patches
- **Release size**: commits per release (smaller = safer)
- **Pre-release usage**: whether alpha/beta/RC process exists
- **Changelog quality**: whether releases have descriptions

---

## 5. Repository Health Score System

### 5.1 Scoring Philosophy

The Health Score is a **weighted composite** of normalized sub-scores. Each metric is scored 0–100, then weighted by importance. The final score is the weighted average.

Design principles:
- **Contextual**: a 10-person team and a solo project have different healthy baselines
- **Trend-aware**: a declining metric penalizes more than a static low metric
- **Configurable**: users can adjust weights for their context

### 5.2 Health Dimensions & Weights

| Dimension | Weight | What It Measures |
|---|---|---|
| **Activity** | 15% | Commit frequency, recency of last commit, velocity trend |
| **Contributor Health** | 12% | Active contributor count, distribution, growth/churn |
| **PR Process** | 12% | Review turnaround, merge time, review depth, stale PRs |
| **Issue Management** | 10% | Resolution time, backlog growth, responsiveness, stale ratio |
| **Code Stability** | 10% | Churn rate, hotspot concentration, refactor ratio |
| **Knowledge Distribution** | 10% | Bus factor, code ownership spread, orphan files |
| **CI/CD Reliability** | 10% | Build success rate, duration trend, workflow coverage |
| **Release Practice** | 8% | Release cadence, regularity, hotfix ratio |
| **Dependency Health** | 8% | Freshness, vulnerability count, license risk |
| **Documentation** | 5% | README exists, contributing guide, license, changelog |

**Total: 100%**

### 5.3 Sub-Score Calculation Examples

#### Activity Score (0–100)

```
activity_score = (
    recency_score * 0.3 +       # Days since last commit (0 days=100, 365+ days=0)
    frequency_score * 0.3 +      # Commits/week vs. historical baseline
    velocity_trend * 0.2 +       # Is velocity increasing (100) or decreasing (0)?
    consistency_score * 0.2       # Standard deviation of weekly commits (low variance = high score)
)
```

#### Bus Factor Score (0–100)

```
if bus_factor >= 5:    score = 100
elif bus_factor == 4:  score = 85
elif bus_factor == 3:  score = 70
elif bus_factor == 2:  score = 45
elif bus_factor == 1:  score = 15
else:                  score = 0   # No contributors

# Apply modifier for knowledge distribution evenness
score *= gini_modifier  # 1.0 if perfectly even, 0.5 if extremely concentrated
```

#### CI/CD Score (0–100)

```
cicd_score = (
    success_rate * 0.4 +          # 100% pass = 100, <50% = 0
    duration_trend_score * 0.2 +   # Stable or improving = 100, growing = penalty
    coverage_score * 0.2 +         # % of branches/PRs with CI configured
    deploy_frequency_score * 0.2   # Regular deploys = high score
)
```

### 5.4 Score Interpretation

| Score | Grade | Label | Meaning |
|---|---|---|---|
| 90–100 | A+ | Excellent | Thriving project with strong practices |
| 80–89 | A | Healthy | Well-maintained with minor areas to improve |
| 70–79 | B | Good | Solid foundation, some risks emerging |
| 60–69 | C | Fair | Notable issues need attention |
| 40–59 | D | At Risk | Multiple health concerns, intervention needed |
| 0–39 | F | Critical | Project is stagnant, abandoned, or severely unhealthy |

### 5.5 Trend Scoring

Every re-analysis compares against the previous score. A **trend indicator** is shown:

- **Improving** (+5 or more since last analysis)
- **Stable** (within ±5)
- **Declining** (-5 or more since last analysis)

---

## 6. Frontend Architecture

### 6.1 Technology Stack

| Layer | Choice | Rationale |
|---|---|---|
| Framework | **Next.js 14 (App Router)** | SSR for SEO on public reports, RSC for performance, great DX |
| Styling | **Tailwind CSS + shadcn/ui** | Consistent design system, rapid development |
| Charts | **Recharts + D3.js** | Recharts for standard charts, D3 for custom visualizations |
| State | **TanStack Query (React Query)** | Server state management, caching, background refetching |
| Auth | **NextAuth.js** | GitHub OAuth integration built-in |
| Deployment | **Vercel** | Zero-config Next.js hosting |

### 6.2 Page Structure

```
/                           → Landing page (marketing)
/login                      → GitHub OAuth login
/dashboard                  → User's analyzed repos overview
/repo/:owner/:name          → Repository health overview
/repo/:owner/:name/commits  → Commit analytics
/repo/:owner/:name/contributors → Contributor analytics
/repo/:owner/:name/prs      → Pull request analytics
/repo/:owner/:name/issues   → Issue analytics
/repo/:owner/:name/cicd     → CI/CD health
/repo/:owner/:name/deps     → Dependency analysis
/repo/:owner/:name/risks    → Risk alerts & recommendations
/repo/:owner/:name/report   → Full exportable report
/repo/:owner/:name/history  → Score history over time
/settings                   → User preferences, API tokens
/public/:owner/:name        → Public shareable report (read-only)
```

### 6.3 Page Details

#### Dashboard (`/dashboard`)

The main landing page after login. Shows all analyzed repositories at a glance.

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  [+ Analyze New Repo]              [Search repos...]     │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │ repo-a   │  │ repo-b   │  │ repo-c   │              │
│  │ Score:87 │  │ Score:64 │  │ Score:92 │              │
│  │ ▲ +3     │  │ ▼ -8     │  │ ─ 0      │              │
│  │ Grade: A │  │ Grade: C │  │ Grade:A+ │              │
│  │ Last:2d  │  │ Last:14d │  │ Last:1d  │              │
│  └──────────┘  └──────────┘  └──────────┘              │
│                                                          │
│  Portfolio Summary:                                      │
│  ┌────────────────────────────────────────┐              │
│  │ Avg Score: 81  │ Repos: 12 │ Alerts: 3│              │
│  └────────────────────────────────────────┘              │
│                                                          │
│  Recent Alerts:                                          │
│  ⚠ repo-b: Bus factor dropped to 1                      │
│  ⚠ repo-d: CI success rate below 70%                    │
│  ⚠ repo-b: 23 stale issues (no activity 30+ days)       │
└─────────────────────────────────────────────────────────┘
```

**Components:**
- Repo cards with health score, grade badge, trend arrow
- Portfolio-level aggregated metrics
- Alert feed showing recent risk detections
- Filter/sort repos by score, name, last analyzed date
- "Analyze New Repo" CTA with URL input

#### Repository Overview (`/repo/:owner/:name`)

The central hub for a single repository's health.

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  owner/repo-name                              [Re-analyze]│
│  ★ Health Score: 78 (Grade B) ▲ +4 from last week        │
├──────────┬──────────────────────────────────────────────┤
│ Nav      │                                               │
│ Overview │  Score Breakdown (radar chart):               │
│ Commits  │       Activity: 85                            │
│ Contribs │    Contributors: 72                           │
│ PRs      │       PR Process: 68                          │
│ Issues   │         Issues: 81                            │
│ CI/CD    │      Stability: 75                            │
│ Deps     │     Knowledge: 60                             │
│ Risks    │         CI/CD: 90                             │
│          │       Release: 82                             │
│          │          Deps: 70                             │
│          │          Docs: 55                             │
│          │                                               │
│          │  Key Metrics (card grid):                     │
│          │  ┌─────────┬─────────┬─────────┬─────────┐   │
│          │  │Commits  │Active   │PR Merge │Issue     │   │
│          │  │/week:23 │Contribs │Time:8h  │Close:3d  │   │
│          │  │▲ +12%   │: 8      │▼ +2h    │▲ -1d     │   │
│          │  └─────────┴─────────┴─────────┴─────────┘   │
│          │                                               │
│          │  Score History (line chart, last 12 weeks)    │
│          │                                               │
│          │  Top Risks:                                   │
│          │  🔴 Bus factor is 1 for /src/payments/        │
│          │  🟡 3 dependencies have known vulnerabilities  │
│          │  🟡 PR review time increased 40% this month   │
└──────────┴──────────────────────────────────────────────┘
```

**Components:**
- Hero section with score, grade, trend
- Radar/spider chart showing all dimension scores
- Key metrics cards with sparklines
- Score history line chart
- Top risks/recommendations list
- Quick links to detailed sub-pages

#### Contributor Analytics (`/repo/:owner/:name/contributors`)

- **Contributor leaderboard**: sortable table (commits, reviews, lines, PRs)
- **Contribution distribution chart**: Pareto chart showing concentration
- **Activity timeline**: horizontal Gantt chart of when each contributor was active
- **Contributor heatmap**: grid of contributors × weeks, cell color = activity level
- **New vs. churned contributors**: trend chart over time
- **Bus factor visualization**: which people are critical for which parts

#### Commit Analytics (`/repo/:owner/:name/commits`)

- **Commit frequency chart**: bar chart (daily/weekly/monthly toggle)
- **Activity heatmap**: day-of-week × hour-of-day heat grid
- **Commit size distribution**: histogram of lines changed
- **Code churn overlay**: lines added vs. deleted vs. churned
- **Hotspot treemap**: file/directory treemap colored by churn rate
- **Commit message quality**: word cloud, average length, conventional commit adherence

#### Issue Analytics (`/repo/:owner/:name/issues`)

- **Issue flow chart**: opened vs. closed per week (area chart)
- **Backlog trend**: cumulative open issues over time
- **Resolution time distribution**: box plot by label/type
- **Stale issues list**: sortable table of issues with no recent activity
- **Label breakdown**: donut chart of issue categories
- **Responsiveness chart**: time to first maintainer comment distribution

#### CI/CD Analysis (`/repo/:owner/:name/cicd`)

- **Build success rate**: gauge chart + trend line
- **Build duration chart**: line chart with trend (increasing = bad)
- **Failure analysis**: most common failure reasons (categorized)
- **Workflow overview**: list of all GitHub Actions workflows with pass/fail rates
- **Deploy frequency**: bar chart of deployments per week
- **Pipeline diagram**: visual representation of CI/CD stages

#### Risk Alerts Page (`/repo/:owner/:name/risks`)

- **Risk cards**: categorized (Critical / Warning / Info)
- **Each card includes**: what the risk is, why it matters, recommended action
- **Risk trend**: are risks increasing or decreasing over time?
- **Actionable recommendations**: specific steps to improve score

Example risk cards:
```
🔴 CRITICAL: Bus Factor = 1 for src/payments/
   Only @alice has committed to the payments module in 6 months.
   → Recommendation: Schedule knowledge transfer sessions.
     Assign a second reviewer for all payments PRs.

🟡 WARNING: PR Review Time Increasing
   Average time to first review: 26 hours (was 12 hours 30 days ago).
   → Recommendation: Consider adding reviewers or setting
     review time SLAs via CODEOWNERS.

🟢 INFO: Good release cadence
   Releasing every 1.2 weeks on average. Consistent with last quarter.
```

---

## 7. Backend Architecture (Python)

### 7.1 Technology Stack

| Component | Choice | Rationale |
|---|---|---|
| Framework | **FastAPI** | Async-native, automatic OpenAPI docs, high performance |
| Task Queue | **Celery** | Battle-tested distributed task queue |
| Message Broker | **Redis** | Fast, serves as both broker and cache |
| Database | **PostgreSQL** | Relational integrity for structured metrics data |
| ORM | **SQLAlchemy 2.0 + Alembic** | Async support, mature migration tooling |
| GitHub Client | **githubkit** (async) | Modern async GitHub API client |
| HTTP Client | **httpx** | Async HTTP for additional API calls |
| Validation | **Pydantic v2** | Data validation (built into FastAPI) |

### 7.2 Project Structure

```
backend/
├── app/
│   ├── main.py                 # FastAPI app factory
│   ├── config.py               # Settings (pydantic-settings)
│   ├── dependencies.py         # Dependency injection
│   │
│   ├── api/                    # API layer
│   │   ├── v1/
│   │   │   ├── router.py       # API router aggregation
│   │   │   ├── repos.py        # Repository endpoints
│   │   │   ├── analytics.py    # Analytics endpoints
│   │   │   ├── health.py       # Health score endpoints
│   │   │   ├── contributors.py # Contributor endpoints
│   │   │   ├── webhooks.py     # GitHub webhook handlers
│   │   │   └── auth.py         # Auth endpoints
│   │   └── deps.py             # Route dependencies
│   │
│   ├── core/                   # Core business logic
│   │   ├── github/
│   │   │   ├── client.py       # GitHub API wrapper
│   │   │   ├── fetchers.py     # Data fetchers (commits, PRs, issues)
│   │   │   └── rate_limiter.py # Rate limit handling
│   │   │
│   │   ├── analysis/           # Analysis engines
│   │   │   ├── pipeline.py     # Orchestrates full analysis
│   │   │   ├── commits.py      # Commit analysis
│   │   │   ├── contributors.py # Contributor analysis
│   │   │   ├── pull_requests.py# PR analysis
│   │   │   ├── issues.py       # Issue analysis
│   │   │   ├── code_churn.py   # Code churn analysis
│   │   │   ├── ownership.py    # Code ownership & bus factor
│   │   │   ├── cicd.py         # CI/CD analysis
│   │   │   ├── releases.py     # Release analysis
│   │   │   ├── dependencies.py # Dependency analysis
│   │   │   └── documentation.py# Docs analysis
│   │   │
│   │   ├── scoring/            # Health scoring
│   │   │   ├── engine.py       # Main scoring engine
│   │   │   ├── dimensions.py   # Individual dimension scorers
│   │   │   ├── normalizers.py  # Metric normalization functions
│   │   │   └── weights.py      # Weight configuration
│   │   │
│   │   └── ai/                 # AI features
│   │       ├── risk_predictor.py
│   │       ├── commit_quality.py
│   │       └── summarizer.py
│   │
│   ├── models/                 # SQLAlchemy models
│   │   ├── base.py
│   │   ├── repository.py
│   │   ├── contributor.py
│   │   ├── commit.py
│   │   ├── pull_request.py
│   │   ├── issue.py
│   │   ├── health_metric.py
│   │   ├── analysis_report.py
│   │   └── user.py
│   │
│   ├── schemas/                # Pydantic schemas
│   │   ├── repos.py
│   │   ├── analytics.py
│   │   ├── health.py
│   │   └── common.py
│   │
│   ├── workers/                # Celery tasks
│   │   ├── celery_app.py       # Celery configuration
│   │   ├── analysis_tasks.py   # Repository analysis tasks
│   │   └── scheduled_tasks.py  # Periodic re-analysis
│   │
│   └── db/
│       ├── session.py          # Database session management
│       └── migrations/         # Alembic migrations
│
├── tests/
├── alembic.ini
├── pyproject.toml
└── Dockerfile
```

### 7.3 Data Processing Pipeline

The analysis pipeline is the core of the system. It runs as a Celery task and follows this flow:

```
┌──────────────┐
│ User triggers │
│ /analyze-repo │
└──────┬───────┘
       │
       ▼
┌──────────────┐     ┌──────────────┐
│ API validates │────▶│ Queue Celery │
│ request       │     │ task         │
└──────────────┘     └──────┬───────┘
                            │
                            ▼
                  ┌─────────────────┐
                  │ Analysis Worker │
                  │                 │
                  │ 1. Fetch Phase  │
                  │    ├─ Commits   │◄──── GitHub API
                  │    ├─ PRs       │      (paginated,
                  │    ├─ Issues    │       rate-limited)
                  │    ├─ Workflows │
                  │    ├─ Releases  │
                  │    └─ Contribs  │
                  │                 │
                  │ 2. Store Phase  │
                  │    └─ Upsert ──▶│──── PostgreSQL
                  │                 │
                  │ 3. Analyze Phase│
                  │    ├─ Commit    │
                  │    │  metrics   │
                  │    ├─ PR metrics│
                  │    ├─ Issue     │
                  │    │  metrics   │
                  │    ├─ Churn     │
                  │    ├─ Ownership │
                  │    ├─ Bus factor│
                  │    ├─ CI/CD     │
                  │    ├─ Release   │
                  │    ├─ Deps      │
                  │    └─ Docs      │
                  │                 │
                  │ 4. Score Phase  │
                  │    └─ Compute ──▶│──── Health Score
                  │       composite │
                  │                 │
                  │ 5. Report Phase │
                  │    └─ Generate  │
                  │       report +  │
                  │       alerts    │
                  └─────────────────┘
                            │
                            ▼
                  ┌─────────────────┐
                  │ Notify user     │
                  │ (WebSocket/SSE) │
                  └─────────────────┘
```

### 7.4 Key Implementation: GitHub Client with Rate Limiting

```python
# app/core/github/client.py

import asyncio
from datetime import datetime, timezone
from githubkit import GitHub
from app.config import settings

class GitHubClient:
    """Wraps GitHub API with automatic rate limit handling and pagination."""

    def __init__(self, token: str):
        self.gh = GitHub(token)
        self._rate_limit_remaining = 5000
        self._rate_limit_reset = datetime.now(timezone.utc)

    async def _check_rate_limit(self):
        """Pause if we're close to hitting the rate limit."""
        if self._rate_limit_remaining < 100:
            wait_seconds = (self._rate_limit_reset - datetime.now(timezone.utc)).total_seconds()
            if wait_seconds > 0:
                await asyncio.sleep(min(wait_seconds + 1, 3600))

    async def fetch_all_commits(self, owner: str, repo: str, since: datetime | None = None):
        """Fetch all commits with automatic pagination."""
        await self._check_rate_limit()
        commits = []
        params = {"per_page": 100}
        if since:
            params["since"] = since.isoformat()

        async for page in self.gh.paginate(
            self.gh.rest.repos.async_list_commits,
            owner=owner, repo=repo, **params
        ):
            commits.extend(page)
            # Update rate limit from response headers
            self._update_rate_limit(page)

        return commits

    async def fetch_all_pull_requests(self, owner: str, repo: str, state: str = "all"):
        """Fetch all PRs with automatic pagination."""
        await self._check_rate_limit()
        prs = []
        async for page in self.gh.paginate(
            self.gh.rest.pulls.async_list,
            owner=owner, repo=repo, state=state, per_page=100
        ):
            prs.extend(page)
        return prs

    async def fetch_all_issues(self, owner: str, repo: str, state: str = "all"):
        await self._check_rate_limit()
        issues = []
        async for page in self.gh.paginate(
            self.gh.rest.issues.async_list_for_repo,
            owner=owner, repo=repo, state=state, per_page=100
        ):
            # Filter out pull requests (GitHub API returns PRs as issues too)
            issues.extend([i for i in page if not hasattr(i, 'pull_request')])
        return issues

    async def fetch_workflows(self, owner: str, repo: str):
        await self._check_rate_limit()
        return await self.gh.rest.actions.async_list_repo_workflows(owner=owner, repo=repo)

    async def fetch_workflow_runs(self, owner: str, repo: str, workflow_id: int):
        await self._check_rate_limit()
        runs = []
        async for page in self.gh.paginate(
            self.gh.rest.actions.async_list_workflow_runs,
            owner=owner, repo=repo, workflow_id=workflow_id, per_page=100
        ):
            runs.extend(page)
        return runs

    async def fetch_releases(self, owner: str, repo: str):
        await self._check_rate_limit()
        releases = []
        async for page in self.gh.paginate(
            self.gh.rest.repos.async_list_releases,
            owner=owner, repo=repo, per_page=100
        ):
            releases.extend(page)
        return releases
```

### 7.5 Key Implementation: Analysis Pipeline

```python
# app/core/analysis/pipeline.py

from dataclasses import dataclass
from app.core.github.client import GitHubClient
from app.core.analysis import commits, contributors, pull_requests, issues
from app.core.analysis import code_churn, ownership, cicd, releases, dependencies
from app.core.scoring.engine import ScoringEngine
from app.models.analysis_report import AnalysisReport

@dataclass
class AnalysisResult:
    commit_metrics: dict
    contributor_metrics: dict
    pr_metrics: dict
    issue_metrics: dict
    churn_metrics: dict
    ownership_metrics: dict
    cicd_metrics: dict
    release_metrics: dict
    dependency_metrics: dict
    documentation_metrics: dict
    health_score: float
    dimension_scores: dict
    risks: list[dict]

async def run_full_analysis(owner: str, repo: str, token: str) -> AnalysisResult:
    """Orchestrate complete repository analysis."""
    client = GitHubClient(token)

    # Phase 1: Fetch data concurrently
    raw_commits, raw_prs, raw_issues, raw_workflows, raw_releases = (
        await asyncio.gather(
            client.fetch_all_commits(owner, repo),
            client.fetch_all_pull_requests(owner, repo),
            client.fetch_all_issues(owner, repo),
            client.fetch_workflows(owner, repo),
            client.fetch_releases(owner, repo),
        )
    )

    # Phase 2: Run analysis engines concurrently
    (
        commit_metrics,
        contributor_metrics,
        pr_metrics,
        issue_metrics,
        churn_metrics,
        ownership_metrics,
        cicd_metrics,
        release_metrics,
        dep_metrics,
        doc_metrics,
    ) = await asyncio.gather(
        commits.analyze(raw_commits),
        contributors.analyze(raw_commits, raw_prs),
        pull_requests.analyze(raw_prs),
        issues.analyze(raw_issues),
        code_churn.analyze(raw_commits),
        ownership.analyze(raw_commits),
        cicd.analyze(raw_workflows, client, owner, repo),
        releases.analyze(raw_releases, raw_commits),
        dependencies.analyze(client, owner, repo),
        documentation.analyze(client, owner, repo),
    )

    # Phase 3: Compute health score
    scoring_engine = ScoringEngine()
    health_score, dimension_scores = scoring_engine.compute(
        commit_metrics=commit_metrics,
        contributor_metrics=contributor_metrics,
        pr_metrics=pr_metrics,
        issue_metrics=issue_metrics,
        churn_metrics=churn_metrics,
        ownership_metrics=ownership_metrics,
        cicd_metrics=cicd_metrics,
        release_metrics=release_metrics,
        dependency_metrics=dep_metrics,
        documentation_metrics=doc_metrics,
    )

    # Phase 4: Generate risk alerts
    risks = generate_risk_alerts(
        commit_metrics, contributor_metrics, pr_metrics,
        issue_metrics, ownership_metrics, cicd_metrics, dep_metrics
    )

    return AnalysisResult(
        commit_metrics=commit_metrics,
        contributor_metrics=contributor_metrics,
        pr_metrics=pr_metrics,
        issue_metrics=issue_metrics,
        churn_metrics=churn_metrics,
        ownership_metrics=ownership_metrics,
        cicd_metrics=cicd_metrics,
        release_metrics=release_metrics,
        dependency_metrics=dep_metrics,
        documentation_metrics=doc_metrics,
        health_score=health_score,
        dimension_scores=dimension_scores,
        risks=risks,
    )
```

### 7.6 Key Implementation: Scoring Engine

```python
# app/core/scoring/engine.py

from dataclasses import dataclass

DEFAULT_WEIGHTS = {
    "activity": 0.15,
    "contributors": 0.12,
    "pr_process": 0.12,
    "issue_management": 0.10,
    "code_stability": 0.10,
    "knowledge_distribution": 0.10,
    "cicd_reliability": 0.10,
    "release_practice": 0.08,
    "dependency_health": 0.08,
    "documentation": 0.05,
}

class ScoringEngine:
    def __init__(self, weights: dict | None = None):
        self.weights = weights or DEFAULT_WEIGHTS

    def compute(self, **metrics) -> tuple[float, dict]:
        """Compute composite health score and individual dimension scores."""

        dimension_scores = {
            "activity": self._score_activity(metrics["commit_metrics"]),
            "contributors": self._score_contributors(metrics["contributor_metrics"]),
            "pr_process": self._score_prs(metrics["pr_metrics"]),
            "issue_management": self._score_issues(metrics["issue_metrics"]),
            "code_stability": self._score_stability(metrics["churn_metrics"]),
            "knowledge_distribution": self._score_knowledge(metrics["ownership_metrics"]),
            "cicd_reliability": self._score_cicd(metrics["cicd_metrics"]),
            "release_practice": self._score_releases(metrics["release_metrics"]),
            "dependency_health": self._score_dependencies(metrics["dependency_metrics"]),
            "documentation": self._score_docs(metrics["documentation_metrics"]),
        }

        # Weighted average
        health_score = sum(
            dimension_scores[dim] * self.weights[dim]
            for dim in dimension_scores
        )

        return round(health_score, 1), dimension_scores

    def _score_activity(self, m: dict) -> float:
        recency = self._normalize_recency(m.get("days_since_last_commit", 365))
        frequency = min(m.get("commits_per_week_avg", 0) / 10 * 100, 100)
        trend = m.get("velocity_trend_score", 50)
        consistency = m.get("consistency_score", 50)
        return recency * 0.3 + frequency * 0.3 + trend * 0.2 + consistency * 0.2

    def _score_contributors(self, m: dict) -> float:
        active_count = min(m.get("active_contributors_30d", 0) / 8 * 100, 100)
        distribution = m.get("contribution_evenness", 50)  # Gini-based
        growth = m.get("contributor_growth_score", 50)
        return active_count * 0.4 + distribution * 0.3 + growth * 0.3

    def _score_prs(self, m: dict) -> float:
        review_time = self._normalize_hours(m.get("avg_time_to_first_review_hours", 168), 4, 72)
        merge_time = self._normalize_hours(m.get("avg_time_to_merge_hours", 336), 8, 168)
        stale_ratio = max(0, 100 - m.get("stale_pr_percentage", 0) * 5)
        review_depth = min(m.get("avg_comments_per_pr", 0) / 3 * 100, 100)
        return review_time * 0.3 + merge_time * 0.3 + stale_ratio * 0.2 + review_depth * 0.2

    def _score_issues(self, m: dict) -> float:
        close_rate = m.get("close_rate_percentage", 0)
        responsiveness = self._normalize_hours(m.get("avg_first_response_hours", 168), 2, 48)
        stale_ratio = max(0, 100 - m.get("stale_issue_percentage", 0) * 3)
        backlog_trend = m.get("backlog_trend_score", 50)
        return close_rate * 0.3 + responsiveness * 0.3 + stale_ratio * 0.2 + backlog_trend * 0.2

    def _score_stability(self, m: dict) -> float:
        churn = max(0, 100 - m.get("churn_rate_percentage", 0) * 5)
        hotspot = max(0, 100 - m.get("hotspot_concentration", 0))
        return churn * 0.6 + hotspot * 0.4

    def _score_knowledge(self, m: dict) -> float:
        bus_factor = m.get("bus_factor", 0)
        bf_score = {0: 0, 1: 15, 2: 45, 3: 70, 4: 85}.get(bus_factor, 100)
        shared_ownership = m.get("shared_ownership_percentage", 0)
        orphan_penalty = max(0, 100 - m.get("orphan_file_percentage", 0) * 3)
        return bf_score * 0.5 + shared_ownership * 0.3 + orphan_penalty * 0.2

    def _score_cicd(self, m: dict) -> float:
        success_rate = m.get("build_success_rate", 0)
        duration_trend = m.get("duration_trend_score", 50)
        coverage = m.get("workflow_coverage_score", 0)
        return success_rate * 0.5 + duration_trend * 0.25 + coverage * 0.25

    def _score_releases(self, m: dict) -> float:
        cadence = m.get("release_regularity_score", 0)
        frequency = min(m.get("releases_per_month", 0) / 2 * 100, 100)
        hotfix_ratio = max(0, 100 - m.get("hotfix_percentage", 0) * 2)
        return cadence * 0.4 + frequency * 0.3 + hotfix_ratio * 0.3

    def _score_dependencies(self, m: dict) -> float:
        freshness = m.get("dependency_freshness_score", 50)
        vuln_penalty = max(0, 100 - m.get("vulnerability_count", 0) * 15)
        license_score = m.get("license_risk_score", 100)
        return freshness * 0.4 + vuln_penalty * 0.4 + license_score * 0.2

    def _score_docs(self, m: dict) -> float:
        has_readme = 30 if m.get("has_readme") else 0
        has_contributing = 20 if m.get("has_contributing") else 0
        has_license = 20 if m.get("has_license") else 0
        has_changelog = 15 if m.get("has_changelog") else 0
        has_codeowners = 15 if m.get("has_codeowners") else 0
        return has_readme + has_contributing + has_license + has_changelog + has_codeowners

    @staticmethod
    def _normalize_recency(days: int) -> float:
        """0 days → 100, 30 days → 70, 180 days → 20, 365+ → 0."""
        if days <= 0: return 100
        if days >= 365: return 0
        return max(0, 100 - (days / 365) * 100)

    @staticmethod
    def _normalize_hours(hours: float, ideal: float, bad: float) -> float:
        """Normalize an hours metric where lower is better."""
        if hours <= ideal: return 100
        if hours >= bad: return 0
        return 100 - ((hours - ideal) / (bad - ideal)) * 100
```

---

## 8. Database Design

### 8.1 Entity-Relationship Diagram

```
┌──────────┐     ┌──────────────┐     ┌────────────┐
│  users   │────▶│ repositories │────▶│  commits   │
└──────────┘  1:N└──────────────┘  1:N└────────────┘
                        │                     │
                        │ 1:N                 │ N:1
                        ▼                     ▼
                  ┌──────────────┐     ┌──────────────┐
                  │pull_requests │     │ contributors │
                  └──────────────┘     └──────────────┘
                        │
                        │ 1:N
                  ┌──────────────┐
                  │    issues    │
                  └──────────────┘

┌──────────────┐     ┌──────────────────┐     ┌──────────────────┐
│repositories  │────▶│ health_metrics   │────▶│ analysis_reports │
└──────────────┘ 1:N └──────────────────┘ N:1 └──────────────────┘
```

### 8.2 Table Schemas

```sql
-- Users (authenticated via GitHub OAuth)
CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    github_id       BIGINT UNIQUE NOT NULL,
    github_login    VARCHAR(255) NOT NULL,
    display_name    VARCHAR(255),
    avatar_url      TEXT,
    access_token    TEXT NOT NULL,  -- encrypted at rest
    refresh_token   TEXT,           -- encrypted at rest
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Repositories being tracked
CREATE TABLE repositories (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    github_id       BIGINT NOT NULL,
    owner           VARCHAR(255) NOT NULL,
    name            VARCHAR(255) NOT NULL,
    full_name       VARCHAR(511) NOT NULL,  -- owner/name
    description     TEXT,
    default_branch  VARCHAR(255) DEFAULT 'main',
    is_private      BOOLEAN DEFAULT FALSE,
    stars_count     INTEGER DEFAULT 0,
    forks_count     INTEGER DEFAULT 0,
    language        VARCHAR(100),
    last_analyzed   TIMESTAMPTZ,
    analysis_status VARCHAR(50) DEFAULT 'pending',  -- pending, running, completed, failed
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, github_id)
);
CREATE INDEX idx_repos_user ON repositories(user_id);
CREATE INDEX idx_repos_full_name ON repositories(full_name);

-- Contributors (denormalized from commit/PR data)
CREATE TABLE contributors (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    repository_id   UUID NOT NULL REFERENCES repositories(id) ON DELETE CASCADE,
    github_login    VARCHAR(255) NOT NULL,
    github_id       BIGINT,
    avatar_url      TEXT,
    total_commits   INTEGER DEFAULT 0,
    total_prs       INTEGER DEFAULT 0,
    total_reviews   INTEGER DEFAULT 0,
    lines_added     BIGINT DEFAULT 0,
    lines_deleted   BIGINT DEFAULT 0,
    first_commit_at TIMESTAMPTZ,
    last_commit_at  TIMESTAMPTZ,
    is_active       BOOLEAN DEFAULT TRUE,  -- active in last 90 days
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(repository_id, github_login)
);
CREATE INDEX idx_contributors_repo ON contributors(repository_id);

-- Commits
CREATE TABLE commits (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    repository_id   UUID NOT NULL REFERENCES repositories(id) ON DELETE CASCADE,
    sha             VARCHAR(40) NOT NULL,
    author_login    VARCHAR(255),
    author_email    VARCHAR(255),
    message         TEXT,
    committed_at    TIMESTAMPTZ NOT NULL,
    additions       INTEGER DEFAULT 0,
    deletions       INTEGER DEFAULT 0,
    files_changed   INTEGER DEFAULT 0,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(repository_id, sha)
);
CREATE INDEX idx_commits_repo_date ON commits(repository_id, committed_at DESC);
CREATE INDEX idx_commits_author ON commits(repository_id, author_login);

-- Pull Requests
CREATE TABLE pull_requests (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    repository_id       UUID NOT NULL REFERENCES repositories(id) ON DELETE CASCADE,
    github_number       INTEGER NOT NULL,
    title               TEXT,
    state               VARCHAR(20) NOT NULL,  -- open, closed, merged
    author_login        VARCHAR(255),
    created_at_gh       TIMESTAMPTZ NOT NULL,
    merged_at           TIMESTAMPTZ,
    closed_at           TIMESTAMPTZ,
    first_review_at     TIMESTAMPTZ,
    additions           INTEGER DEFAULT 0,
    deletions           INTEGER DEFAULT 0,
    files_changed       INTEGER DEFAULT 0,
    comments_count      INTEGER DEFAULT 0,
    review_comments     INTEGER DEFAULT 0,
    requested_reviewers JSONB DEFAULT '[]',
    labels              JSONB DEFAULT '[]',
    created_at          TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(repository_id, github_number)
);
CREATE INDEX idx_prs_repo_state ON pull_requests(repository_id, state);
CREATE INDEX idx_prs_repo_created ON pull_requests(repository_id, created_at_gh DESC);

-- Issues (excluding PRs)
CREATE TABLE issues (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    repository_id       UUID NOT NULL REFERENCES repositories(id) ON DELETE CASCADE,
    github_number       INTEGER NOT NULL,
    title               TEXT,
    state               VARCHAR(20) NOT NULL,  -- open, closed
    author_login        VARCHAR(255),
    created_at_gh       TIMESTAMPTZ NOT NULL,
    closed_at           TIMESTAMPTZ,
    first_response_at   TIMESTAMPTZ,
    comments_count      INTEGER DEFAULT 0,
    labels              JSONB DEFAULT '[]',
    is_stale            BOOLEAN DEFAULT FALSE,  -- no activity 30+ days
    created_at          TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(repository_id, github_number)
);
CREATE INDEX idx_issues_repo_state ON issues(repository_id, state);

-- Health Metrics (per analysis run, per dimension)
CREATE TABLE health_metrics (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id       UUID NOT NULL REFERENCES analysis_reports(id) ON DELETE CASCADE,
    repository_id   UUID NOT NULL REFERENCES repositories(id) ON DELETE CASCADE,
    dimension       VARCHAR(50) NOT NULL,  -- activity, contributors, pr_process, etc.
    score           FLOAT NOT NULL,        -- 0-100
    raw_metrics     JSONB NOT NULL,        -- all computed metrics for this dimension
    created_at      TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_health_repo_dim ON health_metrics(repository_id, dimension);

-- Analysis Reports (one per analysis run)
CREATE TABLE analysis_reports (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    repository_id   UUID NOT NULL REFERENCES repositories(id) ON DELETE CASCADE,
    health_score    FLOAT NOT NULL,             -- composite 0-100
    grade           VARCHAR(2) NOT NULL,        -- A+, A, B, C, D, F
    dimension_scores JSONB NOT NULL,            -- {activity: 85, contributors: 72, ...}
    risks           JSONB DEFAULT '[]',         -- [{severity, category, message, recommendation}]
    summary         TEXT,                       -- AI-generated summary
    previous_score  FLOAT,                      -- for trend calculation
    score_delta     FLOAT,                      -- change from previous
    analysis_duration_seconds FLOAT,
    data_fetched_at TIMESTAMPTZ,                -- when GitHub data was fetched
    created_at      TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_reports_repo ON analysis_reports(repository_id, created_at DESC);

-- Scheduled Analyses (for recurring analysis)
CREATE TABLE scheduled_analyses (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    repository_id   UUID NOT NULL REFERENCES repositories(id) ON DELETE CASCADE,
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    frequency       VARCHAR(20) NOT NULL,  -- daily, weekly, monthly
    next_run_at     TIMESTAMPTZ NOT NULL,
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 9. API Design

### 9.1 REST API Endpoints

#### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/auth/github` | Initiate GitHub OAuth flow |
| GET | `/api/v1/auth/github/callback` | OAuth callback handler |
| POST | `/api/v1/auth/logout` | Logout / revoke session |
| GET | `/api/v1/auth/me` | Get current user info |

#### Repository Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/repos/analyze` | Trigger analysis for a repository |
| GET | `/api/v1/repos` | List user's tracked repositories |
| GET | `/api/v1/repos/{owner}/{name}` | Get repository overview |
| DELETE | `/api/v1/repos/{owner}/{name}` | Remove repo from tracking |
| GET | `/api/v1/repos/{owner}/{name}/status` | Get analysis job status |

#### Health Score

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/repos/{owner}/{name}/health` | Get latest health score + dimensions |
| GET | `/api/v1/repos/{owner}/{name}/health/history` | Score history over time |
| GET | `/api/v1/repos/{owner}/{name}/health/compare` | Compare two snapshots |

#### Analytics

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/repos/{owner}/{name}/commits` | Commit analytics |
| GET | `/api/v1/repos/{owner}/{name}/contributors` | Contributor analytics |
| GET | `/api/v1/repos/{owner}/{name}/pull-requests` | PR analytics |
| GET | `/api/v1/repos/{owner}/{name}/issues` | Issue analytics |
| GET | `/api/v1/repos/{owner}/{name}/cicd` | CI/CD analytics |
| GET | `/api/v1/repos/{owner}/{name}/releases` | Release analytics |
| GET | `/api/v1/repos/{owner}/{name}/dependencies` | Dependency analysis |
| GET | `/api/v1/repos/{owner}/{name}/ownership` | Code ownership map |
| GET | `/api/v1/repos/{owner}/{name}/risks` | Risk alerts |

#### Reports

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/repos/{owner}/{name}/report` | Full analysis report |
| GET | `/api/v1/repos/{owner}/{name}/report/export` | Export as PDF/JSON |
| GET | `/api/v1/public/{owner}/{name}` | Public shareable report |

#### Webhooks

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/webhooks/github` | Receive GitHub webhook events |

### 9.2 Example Request/Response

#### POST `/api/v1/repos/analyze`

**Request:**
```json
{
  "repository_url": "https://github.com/fastapi/fastapi",
  "options": {
    "depth": "full",
    "include_dependencies": true
  }
}
```

**Response (202 Accepted):**
```json
{
  "analysis_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "repository": "fastapi/fastapi",
  "status": "queued",
  "estimated_duration_seconds": 120,
  "status_url": "/api/v1/repos/fastapi/fastapi/status"
}
```

#### GET `/api/v1/repos/fastapi/fastapi/health`

**Response:**
```json
{
  "repository": "fastapi/fastapi",
  "health_score": 87.3,
  "grade": "A",
  "trend": "improving",
  "score_delta": +3.2,
  "analyzed_at": "2026-03-16T10:30:00Z",
  "dimensions": {
    "activity":               { "score": 95, "label": "Excellent" },
    "contributors":           { "score": 82, "label": "Healthy" },
    "pr_process":             { "score": 78, "label": "Good" },
    "issue_management":       { "score": 85, "label": "Healthy" },
    "code_stability":         { "score": 88, "label": "Healthy" },
    "knowledge_distribution": { "score": 72, "label": "Good" },
    "cicd_reliability":       { "score": 96, "label": "Excellent" },
    "release_practice":       { "score": 90, "label": "Excellent" },
    "dependency_health":      { "score": 80, "label": "Healthy" },
    "documentation":          { "score": 100, "label": "Excellent" }
  },
  "top_risks": [
    {
      "severity": "warning",
      "category": "knowledge_distribution",
      "message": "Bus factor is 2 for /fastapi/routing/",
      "recommendation": "Encourage more contributors to review routing changes"
    }
  ],
  "key_metrics": {
    "commits_per_week": 28,
    "active_contributors_30d": 15,
    "avg_pr_merge_hours": 18.5,
    "avg_issue_close_days": 4.2,
    "ci_success_rate": 97.3,
    "bus_factor": 3
  }
}
```

#### GET `/api/v1/repos/fastapi/fastapi/contributors`

**Response:**
```json
{
  "repository": "fastapi/fastapi",
  "total_contributors": 547,
  "active_contributors_30d": 15,
  "active_contributors_90d": 38,
  "bus_factor": 3,
  "contribution_gini": 0.72,
  "top_contributors": [
    {
      "login": "tiangolo",
      "commits": 1823,
      "prs_merged": 342,
      "reviews_given": 890,
      "lines_added": 145000,
      "lines_deleted": 62000,
      "ownership_percentage": 34.2,
      "last_active": "2026-03-15T08:00:00Z"
    }
  ],
  "contributor_growth": {
    "new_last_30d": 5,
    "churned_last_30d": 2,
    "net_growth": 3
  },
  "activity_timeline": [
    { "week": "2026-W10", "active": 12, "new": 1, "churned": 0 },
    { "week": "2026-W11", "active": 14, "new": 3, "churned": 1 }
  ]
}
```

---

## 10. GitHub API Integration

### 10.1 Authentication

```
┌─────────┐      ┌──────────┐      ┌──────────┐
│  User   │─────▶│ Our App  │─────▶│ GitHub   │
│ Browser │      │ Backend  │      │ OAuth    │
└─────────┘      └──────────┘      └──────────┘
     │                │                   │
     │  1. Click      │                   │
     │  "Login with   │                   │
     │   GitHub"      │                   │
     │───────────────▶│                   │
     │                │  2. Redirect to   │
     │                │  GitHub /authorize│
     │                │──────────────────▶│
     │                │                   │
     │  3. User authorizes app            │
     │◀───────────────────────────────────│
     │                │                   │
     │  4. Redirect   │                   │
     │  with code     │                   │
     │───────────────▶│                   │
     │                │  5. Exchange code │
     │                │  for access token │
     │                │──────────────────▶│
     │                │                   │
     │                │  6. Token returned│
     │                │◀──────────────────│
     │                │                   │
     │  7. Session    │  8. Store token   │
     │  created       │  (encrypted)      │
     │◀───────────────│                   │
```

**OAuth Scopes Required:**
- `repo` — access private repos (if user opts in)
- `read:org` — read organization membership
- `read:user` — read user profile

**Implementation:**
```python
# app/api/v1/auth.py
from fastapi import APIRouter, Request
from fastapi.responses import RedirectResponse
from app.config import settings

router = APIRouter(prefix="/auth", tags=["auth"])

@router.get("/github")
async def github_login():
    """Redirect to GitHub OAuth authorization page."""
    params = {
        "client_id": settings.github_client_id,
        "redirect_uri": settings.github_redirect_uri,
        "scope": "repo read:org read:user",
        "state": generate_csrf_token(),
    }
    return RedirectResponse(
        f"https://github.com/login/oauth/authorize?{urlencode(params)}"
    )

@router.get("/github/callback")
async def github_callback(code: str, state: str, db: AsyncSession = Depends(get_db)):
    """Handle OAuth callback, exchange code for token, create session."""
    verify_csrf_token(state)
    token_data = await exchange_code_for_token(code)
    user_info = await fetch_github_user(token_data["access_token"])

    user = await upsert_user(db, user_info, token_data)
    session_token = create_session(user)

    response = RedirectResponse("/dashboard")
    response.set_cookie("session", session_token, httponly=True, secure=True, samesite="lax")
    return response
```

### 10.2 Rate Limit Handling

GitHub API allows **5,000 requests/hour** for authenticated users. A full analysis of a large repo can consume 500–2,000 requests.

**Strategy:**

1. **Proactive checking**: Before each API call, check `X-RateLimit-Remaining` from the last response
2. **Conditional requests**: Use `If-Modified-Since` / `If-None-Match` (ETags) to avoid consuming rate limit on unchanged data
3. **Incremental fetching**: On re-analysis, only fetch data since the last analysis timestamp
4. **Backoff**: If remaining < 100, pause until the `X-RateLimit-Reset` timestamp
5. **GitHub Apps**: For higher limits (15,000/hour), allow installation as a GitHub App
6. **GraphQL API**: For complex queries, use GraphQL to reduce request count (1 GraphQL call = many REST calls)

```python
# app/core/github/rate_limiter.py
import asyncio
import time

class RateLimitManager:
    def __init__(self):
        self.remaining = 5000
        self.reset_at = 0
        self.lock = asyncio.Lock()

    async def acquire(self):
        """Wait if necessary before making an API call."""
        async with self.lock:
            if self.remaining < 50:
                wait = max(0, self.reset_at - time.time()) + 1
                if wait > 0:
                    await asyncio.sleep(wait)

    def update_from_headers(self, headers: dict):
        """Update limits from GitHub response headers."""
        self.remaining = int(headers.get("X-RateLimit-Remaining", self.remaining))
        self.reset_at = int(headers.get("X-RateLimit-Reset", self.reset_at))
```

### 10.3 Webhook Support

Webhooks enable **real-time re-analysis** when repository events occur, instead of relying solely on manual or scheduled triggers.

**Events to subscribe to:**
- `push` — new commits pushed
- `pull_request` — PR opened, closed, merged
- `issues` — issue opened, closed
- `workflow_run` — CI/CD completed
- `release` — new release published

```python
# app/api/v1/webhooks.py
import hmac
import hashlib
from fastapi import APIRouter, Request, HTTPException

router = APIRouter(prefix="/webhooks", tags=["webhooks"])

@router.post("/github")
async def github_webhook(request: Request):
    """Process incoming GitHub webhook events."""
    # Verify webhook signature
    signature = request.headers.get("X-Hub-Signature-256")
    body = await request.body()
    if not verify_signature(body, signature, settings.github_webhook_secret):
        raise HTTPException(status_code=401, detail="Invalid signature")

    event = request.headers.get("X-GitHub-Event")
    payload = await request.json()

    repo_full_name = payload.get("repository", {}).get("full_name")

    # Queue incremental re-analysis for relevant events
    if event in ("push", "pull_request", "issues", "workflow_run", "release"):
        queue_incremental_analysis.delay(repo_full_name, event, payload)

    return {"status": "ok"}

def verify_signature(payload: bytes, signature: str, secret: str) -> bool:
    expected = "sha256=" + hmac.new(
        secret.encode(), payload, hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(expected, signature)
```

---

## 11. Visualization Ideas

### 11.1 Activity Graphs

**Commit Heatmap (GitHub-style contribution grid)**
```
       Mon  ░░▓▓░░▓▓▓▓░░░░▓▓▓▓▓▓░░░░░░▓▓▓▓░░░░▓▓
       Tue  ▓▓▓▓░░▓▓▓▓▓▓▓▓░░▓▓▓▓▓▓░░▓▓▓▓▓▓▓▓░░▓▓
       Wed  ▓▓▓▓▓▓▓▓░░▓▓▓▓▓▓▓▓░░▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
       Thu  ░░▓▓▓▓▓▓▓▓▓▓▓▓░░▓▓▓▓▓▓▓▓▓▓░░▓▓▓▓▓▓▓▓
       Fri  ▓▓▓▓▓▓░░▓▓▓▓▓▓▓▓░░▓▓▓▓▓▓░░▓▓▓▓▓▓░░░░
       Sat  ░░░░░░░░░░▓▓░░░░░░░░░░░░░░░░░░░░░░░░░░
       Sun  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
             ← 12 weeks ago                  this week →
```

**Implementation**: D3.js calendar heatmap, data from commit timestamps bucketed by day/hour.

### 11.2 Contributor Heatmaps

**Contributors × Weeks Activity Matrix**

A grid where rows are contributors and columns are weeks. Cell intensity = number of commits/events that week. Instantly reveals:
- Who is active and when
- Contributors dropping off
- New contributors ramping up

**Implementation**: Recharts `ScatterChart` or D3.js matrix visualization.

### 11.3 Commit Timelines

**Commit Volume Over Time (area chart)**

Stacked area chart with:
- Total commits (filled area)
- Lines added (green fill)
- Lines deleted (red fill, below axis)
- Moving average overlay

**Implementation**: Recharts `AreaChart` with dual y-axis.

### 11.4 Issue Resolution Charts

**Issue Flow (opened vs. closed)**

```
  Issues ▲
    40   │     ╭──╮
    30   │  ╭──╯  ╰──╮    Opened (red)
    20   │╭─╯        ╰──╮
    10   ││              ╰──────
     0   │╰──╮
   -10   │   ╰──╮          Closed (green)
   -20   │      ╰──╮
   -30   │         ╰──────────
         └──────────────────────▶ Weeks
```

**Backlog burndown**: Cumulative open issues over time. Rising = growing debt. Flat or declining = healthy.

**Issue Resolution Time Distribution**: Box plot by label, showing median, quartiles, outliers.

### 11.5 Risk Dashboards

**Risk Matrix (Severity × Likelihood)**

```
         High │ ● Bus Factor    │ ● Dep Vulns   │
    Severity  │   (payments)    │               │
              │─────────────────┼───────────────│
         Med  │ ● Stale Issues  │ ● CI Flakiness│
              │                 │               │
              │─────────────────┼───────────────│
         Low  │ ● Missing Docs  │               │
              │                 │               │
              └─────────────────┴───────────────┘
                   High              Low
                      ← Likelihood →
```

### 11.6 Additional Visualizations

| Visualization | Type | Library | Use Case |
|---|---|---|---|
| Health Score Gauge | Radial gauge | D3.js | Hero metric on overview page |
| Radar/Spider Chart | Radar | Recharts | Show all dimension scores at once |
| File Treemap | Treemap | D3.js | Code ownership and hotspot visualization |
| PR Funnel | Funnel chart | Recharts | Opened → Reviewed → Approved → Merged |
| Build Duration Trend | Line chart | Recharts | CI/CD duration over time |
| Dependency Tree | Force-directed graph | D3.js | Dependency relationships |
| Contributor Network | Network graph | D3.js | Who reviews whose code |

---

## 12. AI Features (Advanced)

### 12.1 Abandoned Repository Detection

**Approach**: Train a classifier on historical signals:

| Signal | Weight | Threshold |
|---|---|---|
| Days since last commit | High | > 180 days |
| Active contributors trend | High | Declining to 0 |
| Open issues without response | Medium | > 50% unanswered |
| CI/CD still running | Medium | No runs in 90 days |
| Dependency update cadence | Low | No updates in 6 months |

**Output**: Probability score (0–1) that the project is abandoned, with explanatory factors.

### 12.2 Project Risk Prediction

Use time-series analysis to predict future health score based on trends:

- **Linear regression** on weekly health scores → predict score 4 weeks out
- **Alert if predicted score** drops below a threshold
- **Feature importance**: which dimension is driving the predicted decline

```python
# app/core/ai/risk_predictor.py
from sklearn.linear_model import LinearRegression
import numpy as np

def predict_health_trend(score_history: list[dict]) -> dict:
    """Predict future health score based on historical trend."""
    if len(score_history) < 4:
        return {"prediction": None, "confidence": "low"}

    weeks = np.array([i for i in range(len(score_history))]).reshape(-1, 1)
    scores = np.array([s["score"] for s in score_history])

    model = LinearRegression()
    model.fit(weeks, scores)

    future_week = len(score_history) + 4
    predicted_score = model.predict([[future_week]])[0]
    slope = model.coef_[0]

    return {
        "predicted_score_4w": round(max(0, min(100, predicted_score)), 1),
        "trend_direction": "declining" if slope < -0.5 else "improving" if slope > 0.5 else "stable",
        "weekly_change_rate": round(slope, 2),
        "confidence": "high" if len(score_history) >= 12 else "medium",
    }
```

### 12.3 Commit Message Quality Analysis

Use an LLM (Claude API) to evaluate commit message quality:

- **Conventional Commits adherence**: does it follow `type(scope): description`?
- **Descriptiveness**: is the message meaningful or just "fix" / "update"?
- **Linked issues**: does it reference issue numbers?

```python
# app/core/ai/commit_quality.py

def analyze_commit_messages(messages: list[str]) -> dict:
    """Analyze commit message quality without LLM (rule-based)."""
    conventional_pattern = r'^(feat|fix|docs|style|refactor|test|chore|build|ci|perf)(\(.+\))?: .+'

    results = {
        "total": len(messages),
        "conventional_commits_pct": 0,
        "avg_length": 0,
        "has_issue_reference_pct": 0,
        "low_quality_examples": [],
    }

    conventional_count = sum(1 for m in messages if re.match(conventional_pattern, m))
    issue_ref_count = sum(1 for m in messages if re.search(r'#\d+', m))
    avg_length = sum(len(m) for m in messages) / max(len(messages), 1)
    low_quality = [m for m in messages if len(m) < 10 or m.lower() in ("fix", "update", "wip", "test")]

    results["conventional_commits_pct"] = round(conventional_count / max(len(messages), 1) * 100, 1)
    results["has_issue_reference_pct"] = round(issue_ref_count / max(len(messages), 1) * 100, 1)
    results["avg_length"] = round(avg_length, 1)
    results["low_quality_examples"] = low_quality[:10]

    return results
```

### 12.4 AI-Powered Health Summary

Use Claude API to generate a natural language summary of the analysis:

```python
# app/core/ai/summarizer.py
import anthropic

async def generate_health_summary(analysis_result: dict) -> str:
    """Generate a human-readable summary of repository health."""
    client = anthropic.AsyncAnthropic()

    prompt = f"""Analyze this repository health data and write a 3-4 sentence summary
    for an engineering manager. Be specific about strengths and concerns.

    Health Score: {analysis_result['health_score']}/100
    Dimensions: {json.dumps(analysis_result['dimension_scores'])}
    Key Metrics: {json.dumps(analysis_result['key_metrics'])}
    Risks: {json.dumps(analysis_result['risks'])}
    """

    response = await client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=300,
        messages=[{"role": "user", "content": prompt}]
    )
    return response.content[0].text
```

---

## 13. Security Considerations

### 13.1 Authentication & Authorization

```
┌─────────────────────────────────────────────────────────┐
│                  Security Architecture                   │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Browser ──── HTTPS ────▶ Next.js (Frontend)            │
│                              │                           │
│                          httpOnly                        │
│                          cookie                          │
│                              │                           │
│                              ▼                           │
│                         FastAPI (Backend)                │
│                              │                           │
│                    ┌─────────┼─────────┐                │
│                    ▼         ▼         ▼                │
│               Session    GitHub     Rate                │
│               Validation Token      Limiter             │
│                    │      (AES      (per-user)          │
│                    │    encrypted)                       │
│                    ▼                                     │
│              PostgreSQL                                  │
│              (encrypted at rest)                         │
└─────────────────────────────────────────────────────────┘
```

**Key security measures:**

1. **GitHub OAuth**: No password storage. Users authenticate via GitHub.
2. **Session management**: httpOnly, Secure, SameSite=Lax cookies. No tokens in localStorage.
3. **CSRF protection**: State parameter in OAuth flow + CSRF tokens on state-changing requests.
4. **Access control**: Users can only view repos they have access to on GitHub. We verify permissions on every request.

### 13.2 Secure Token Storage

GitHub access tokens are **encrypted at rest** using AES-256-GCM:

```python
# app/core/security/encryption.py
from cryptography.fernet import Fernet
from app.config import settings

_fernet = Fernet(settings.encryption_key)  # 32-byte key from env var

def encrypt_token(token: str) -> str:
    return _fernet.encrypt(token.encode()).decode()

def decrypt_token(encrypted: str) -> str:
    return _fernet.decrypt(encrypted.encode()).decode()
```

- Encryption key is stored as an environment variable, never in code or config files
- Tokens are decrypted only in-memory, only when needed for API calls
- Token refresh is handled automatically; old tokens are destroyed

### 13.3 Rate Limiting

```python
# app/api/deps.py
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

# Applied per-endpoint:
# - /analyze-repo: 10/hour (expensive operation)
# - /api/v1/*: 100/minute
# - /auth/*: 20/minute
```

### 13.4 Additional Security Measures

| Concern | Mitigation |
|---|---|
| SQL Injection | SQLAlchemy ORM with parameterized queries |
| XSS | Next.js auto-escapes; CSP headers configured |
| SSRF | Validate repository URLs against GitHub domains only |
| Webhook tampering | HMAC-SHA256 signature verification |
| Data exposure | Users can only access repos they own or have GitHub access to |
| Dependency vulnerabilities | Automated Dependabot / renovate on our own repo |
| Secrets in logs | Structured logging with token redaction |
| DDoS | Cloudflare in front, rate limiting at application layer |

---

## 14. Deployment Architecture

```
                    ┌──────────────────────────────┐
                    │         Cloudflare            │
                    │    (DNS, CDN, DDoS protection)│
                    └──────────┬───────────────────┘
                               │
              ┌────────────────┼────────────────┐
              ▼                                 ▼
    ┌──────────────────┐              ┌──────────────────┐
    │   Vercel          │              │  Cloud Run        │
    │   (Frontend)      │              │  (Backend API)    │
    │                   │              │                   │
    │   Next.js SSR     │◀────────────│  FastAPI           │
    │   Static assets   │  REST API   │  Auto-scaling      │
    │   Edge caching    │             │  0 → N instances   │
    └──────────────────┘              └────────┬──────────┘
                                               │
                              ┌────────────────┼────────────────┐
                              ▼                ▼                ▼
                    ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
                    │  Cloud SQL    │  │  Redis        │  │  Celery       │
                    │  (PostgreSQL) │  │  (Memorystore)│  │  Workers      │
                    │               │  │               │  │  (Cloud Run   │
                    │  Primary +    │  │  Cache +      │  │   Jobs)       │
                    │  Read replica │  │  Broker       │  │               │
                    └──────────────┘  └──────────────┘  └──────────────┘
```

### Component Details

| Component | Service | Spec | Rationale |
|---|---|---|---|
| **Frontend** | Vercel | Hobby → Pro | Zero-config Next.js, edge caching, preview deploys |
| **Backend API** | Google Cloud Run | 1–10 instances, 1 vCPU, 512MB | Auto-scales to zero, pay-per-request |
| **Workers** | Cloud Run Jobs | 1–5 instances, 2 vCPU, 2GB | Long-running analysis tasks, auto-scales |
| **Database** | Cloud SQL (PostgreSQL 16) | db-f1-micro → db-g1-small | Managed, automated backups, read replicas |
| **Cache/Broker** | Memorystore (Redis) | 1GB | Celery broker + response caching |
| **DNS/CDN** | Cloudflare | Free → Pro | DDoS protection, edge caching, SSL |
| **Secrets** | Google Secret Manager | — | Encrypted secret storage |
| **Monitoring** | Google Cloud Monitoring + Sentry | — | Error tracking, performance monitoring |
| **CI/CD** | GitHub Actions | — | Build, test, deploy on push |

### Estimated Monthly Cost (MVP)

| Component | Cost |
|---|---|
| Vercel (Hobby) | $0 |
| Cloud Run (API) | $5–15 |
| Cloud Run (Workers) | $5–20 |
| Cloud SQL (db-f1-micro) | $10 |
| Memorystore (1GB) | $35 |
| Cloudflare (Free) | $0 |
| **Total** | **~$55–80/month** |

---

## 15. MVP Development Plan

### Phase 1: Foundation (Weeks 1–2)

| Task | Details | Deliverable |
|---|---|---|
| Project setup | FastAPI project, Next.js app, Docker Compose for local dev | Runnable dev environment |
| Database schema | Alembic migrations for core tables | PostgreSQL schema live |
| GitHub OAuth | Login flow, token storage, session management | Users can log in |
| GitHub API client | Basic client with rate limiting and pagination | Can fetch repo data |

### Phase 2: Core Analysis (Weeks 3–4)

| Task | Details | Deliverable |
|---|---|---|
| Celery setup | Worker configuration, Redis broker | Background jobs work |
| Data fetchers | Commit, PR, issue, workflow fetchers | All raw data collected |
| Analysis engines | Commit, contributor, PR, issue metrics | Metrics computed |
| Scoring engine | Health score calculation (v1 weights) | Score generated |
| `/analyze-repo` API | Trigger analysis, poll for status | End-to-end analysis works |

### Phase 3: Frontend (Weeks 5–6)

| Task | Details | Deliverable |
|---|---|---|
| Dashboard page | Repo cards, add repo flow | Users see their repos |
| Repository overview | Health score, radar chart, key metrics | Main repo view |
| Commit analytics | Charts, heatmap | Commit insights |
| PR analytics | Turnaround charts, stale PRs | PR insights |
| Issue analytics | Flow charts, backlog trend | Issue insights |

### Phase 4: Polish & Ship (Week 7–8)

| Task | Details | Deliverable |
|---|---|---|
| Risk alerts | Risk detection, alert cards | Actionable recommendations |
| Score history | Store and display trend | Users see improvement over time |
| Public reports | Shareable read-only URL | OSS maintainers can share |
| Deployment | Set up Cloud Run, Cloud SQL, Vercel | Production environment |
| Testing | Unit tests, integration tests, E2E | Confidence to ship |
| Launch | Product Hunt, Hacker News, Twitter | First users |

### Phase 5: Post-MVP (Weeks 9–12)

- CI/CD analysis page
- Dependency analysis
- Code ownership / bus factor visualization
- Scheduled re-analysis
- PDF report export
- Webhook-triggered analysis

---

## 16. Advanced Future Features

### Tier 1 (3–6 months post-launch)

| Feature | Description | Value |
|---|---|---|
| **Organization-wide analytics** | Aggregate health scores across all repos in a GitHub org | VP/Director-level dashboard |
| **Developer productivity insights** | Per-developer metrics (tactfully presented — focus on team health, not surveillance) | Team leads optimize workflows |
| **Slack / Teams alerts** | Notify channels when health score drops or risks emerge | Proactive awareness |
| **Custom scoring weights** | Let users adjust dimension weights for their context | Personalized health definition |
| **API & embeddable badges** | `![Health Score](healthanalyzer.dev/badge/owner/repo)` | OSS project READMEs |

### Tier 2 (6–12 months post-launch)

| Feature | Description | Value |
|---|---|---|
| **Automated code quality scanning** | Integrate with SonarQube, CodeClimate, or build our own lint analysis | Deeper code health signals |
| **Jira / Linear integration** | Correlate issue tracker data with GitHub data | Full development lifecycle view |
| **Benchmark comparisons** | "Your repo is healthier than 78% of similar-sized Python projects" | Context for scores |
| **Team health dashboard** | Map contributors to teams, show per-team metrics | Engineering management tool |
| **AI recommendations** | Claude-powered specific improvement suggestions | Actionable next steps |

### Tier 3 (12+ months)

| Feature | Description | Value |
|---|---|---|
| **GitLab / Bitbucket support** | Expand beyond GitHub | Larger market |
| **Compliance reporting** | SOC 2, HIPAA-relevant development practice metrics | Enterprise sales |
| **Custom dashboards** | Drag-and-drop dashboard builder | Power users |
| **Predictive analytics** | ML models predicting project failure, contributor churn | Early warning system |
| **Marketplace** | Third-party analysis plugins | Extensibility |

### Monetization Strategy

| Tier | Price | Features |
|---|---|---|
| **Free** | $0 | 3 public repos, basic health score, 1 analysis/week |
| **Pro** | $12/month | Unlimited repos (public + private), full analytics, daily analysis, PDF export |
| **Team** | $8/user/month | Org-wide dashboard, team analytics, Slack integration, API access |
| **Enterprise** | Custom | SSO, on-prem, SLA, compliance reports, dedicated support |

---

## Summary

The GitHub Project Health Analyzer transforms scattered GitHub signals into a single, actionable health score. It serves engineering leaders who need visibility into their projects without manually digging through dashboards.

**Key architectural decisions:**
- **FastAPI + Celery**: Async API for responsiveness, background workers for heavy analysis
- **PostgreSQL**: Relational model for structured metrics with JSONB for flexible raw data
- **Next.js + Recharts/D3**: Server-rendered frontend with rich, interactive visualizations
- **Incremental analysis**: Only fetch new data on re-analysis, respecting GitHub rate limits
- **Pluggable scoring**: Configurable weights let different users define "healthy" differently

The MVP can be built in 8 weeks by a small team, with a clear path to monetization through tiered pricing. The product creates a new category — **engineering health observability** — that sits between code quality tools (SonarQube) and project management tools (Jira), filling a gap that currently requires manual investigation.
