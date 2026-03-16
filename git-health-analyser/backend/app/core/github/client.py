import logging
from urllib.parse import parse_qs, urlparse

import httpx

from app.core.github.rate_limiter import RateLimitManager

logger = logging.getLogger(__name__)


class GitHubClient:
    """Async GitHub REST API client with pagination and rate limiting."""

    BASE_URL = "https://api.github.com"

    def __init__(self, access_token: str):
        self.token = access_token
        self.rate_limiter = RateLimitManager()
        self._client = httpx.AsyncClient(
            base_url=self.BASE_URL,
            headers={
                "Authorization": f"Bearer {access_token}",
                "Accept": "application/vnd.github+json",
                "X-GitHub-Api-Version": "2022-11-28",
            },
            timeout=30.0,
        )

    async def close(self):
        await self._client.aclose()

    async def _request(self, method: str, url: str, **kwargs) -> httpx.Response:
        await self.rate_limiter.acquire()
        response = await self._client.request(method, url, **kwargs)
        self.rate_limiter.update_from_headers(dict(response.headers))
        response.raise_for_status()
        return response

    async def _paginate(self, url: str, params: dict | None = None, max_pages: int = 50) -> list[dict]:
        """Fetch all pages of a paginated endpoint."""
        params = params or {}
        params.setdefault("per_page", 100)
        all_items = []

        for _ in range(max_pages):
            response = await self._request("GET", url, params=params)
            data = response.json()

            if isinstance(data, list):
                all_items.extend(data)
            elif isinstance(data, dict) and "items" in data:
                all_items.extend(data["items"])
            else:
                return [data] if data else []

            # Check for next page via Link header
            link_header = response.headers.get("Link", "")
            next_url = self._parse_next_link(link_header)
            if not next_url:
                break

            # Parse the next URL to get new params
            parsed = urlparse(next_url)
            params = {k: v[0] for k, v in parse_qs(parsed.query).items()}
            url = parsed.path

        return all_items

    @staticmethod
    def _parse_next_link(link_header: str) -> str | None:
        """Parse the 'next' URL from a GitHub Link header."""
        if not link_header:
            return None
        for part in link_header.split(","):
            if 'rel="next"' in part:
                url = part.split(";")[0].strip().strip("<>")
                return url
        return None

    async def fetch_repo_info(self, owner: str, repo: str) -> dict:
        response = await self._request("GET", f"/repos/{owner}/{repo}")
        return response.json()

    async def fetch_commits(self, owner: str, repo: str, since: str | None = None) -> list[dict]:
        params = {}
        if since:
            params["since"] = since
        return await self._paginate(f"/repos/{owner}/{repo}/commits", params)

    async def fetch_pull_requests(self, owner: str, repo: str, state: str = "all") -> list[dict]:
        return await self._paginate(f"/repos/{owner}/{repo}/pulls", {"state": state})

    async def fetch_issues(self, owner: str, repo: str, state: str = "all") -> list[dict]:
        """Fetch issues, excluding pull requests."""
        raw = await self._paginate(f"/repos/{owner}/{repo}/issues", {"state": state})
        return [i for i in raw if "pull_request" not in i]

    async def fetch_contributors(self, owner: str, repo: str) -> list[dict]:
        return await self._paginate(f"/repos/{owner}/{repo}/contributors")

    async def fetch_workflows(self, owner: str, repo: str) -> list[dict]:
        response = await self._request("GET", f"/repos/{owner}/{repo}/actions/workflows")
        data = response.json()
        return data.get("workflows", [])

    async def fetch_workflow_runs(self, owner: str, repo: str, workflow_id: int, max_pages: int = 5) -> list[dict]:
        all_runs = []
        params = {"per_page": 100}
        for _ in range(max_pages):
            response = await self._request(
                "GET",
                f"/repos/{owner}/{repo}/actions/workflows/{workflow_id}/runs",
                params=params,
            )
            data = response.json()
            runs = data.get("workflow_runs", [])
            all_runs.extend(runs)
            if len(runs) < 100:
                break
            params["page"] = params.get("page", 1) + 1
        return all_runs

    async def fetch_releases(self, owner: str, repo: str) -> list[dict]:
        return await self._paginate(f"/repos/{owner}/{repo}/releases")

    async def fetch_repo_contents(self, owner: str, repo: str, path: str = "") -> list[dict]:
        try:
            response = await self._request("GET", f"/repos/{owner}/{repo}/contents/{path}")
            data = response.json()
            return data if isinstance(data, list) else [data]
        except httpx.HTTPStatusError:
            return []

    async def fetch_community_profile(self, owner: str, repo: str) -> dict:
        try:
            response = await self._request("GET", f"/repos/{owner}/{repo}/community/profile")
            return response.json()
        except httpx.HTTPStatusError:
            return {}
