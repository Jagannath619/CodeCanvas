import hashlib
import hmac

from fastapi import APIRouter, HTTPException, Request

from app.config import settings

router = APIRouter(prefix="/webhooks", tags=["Webhooks"])


@router.post("/github")
async def github_webhook(request: Request):
    """Receive and process GitHub webhook events."""
    # Verify signature
    signature = request.headers.get("X-Hub-Signature-256", "")
    body = await request.body()

    if settings.github_webhook_secret:
        expected = "sha256=" + hmac.new(
            settings.github_webhook_secret.encode(),
            body,
            hashlib.sha256,
        ).hexdigest()
        if not hmac.compare_digest(expected, signature):
            raise HTTPException(status_code=401, detail="Invalid webhook signature")

    event = request.headers.get("X-GitHub-Event", "")
    payload = await request.json()
    repo_name = payload.get("repository", {}).get("full_name", "")

    # For now, log the event. In production, queue incremental analysis.
    return {
        "status": "received",
        "event": event,
        "repository": repo_name,
    }
