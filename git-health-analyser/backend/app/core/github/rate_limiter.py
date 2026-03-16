import asyncio
import time


class RateLimitManager:
    """Manages GitHub API rate limiting."""

    def __init__(self):
        self.remaining: int = 5000
        self.reset_at: float = 0
        self._lock = asyncio.Lock()

    async def acquire(self):
        """Wait if we're close to the rate limit."""
        async with self._lock:
            if self.remaining < 50:
                wait = max(0, self.reset_at - time.time()) + 1
                if wait > 0:
                    await asyncio.sleep(min(wait, 3600))

    def update_from_headers(self, headers: dict):
        """Update rate limit info from GitHub response headers."""
        if "X-RateLimit-Remaining" in headers:
            self.remaining = int(headers["X-RateLimit-Remaining"])
        if "X-RateLimit-Reset" in headers:
            self.reset_at = float(headers["X-RateLimit-Reset"])

    @property
    def is_near_limit(self) -> bool:
        return self.remaining < 100
