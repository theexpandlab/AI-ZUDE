"""
Minimal Meta (Facebook) Marketing API client — standard library only.

No third-party dependencies (uses urllib) so the skill runs anywhere Python 3.8+
is available. Honors HTTPS_PROXY and a custom CA bundle via the usual env vars
(SSL_CERT_FILE / REQUESTS_CA_BUNDLE), so it works both on a normal machine and
behind a proxy.

Credentials are read from environment variables — never hard-code tokens.

    META_ACCESS_TOKEN      (required) long-lived user or system-user token
    META_AD_ACCOUNT_ID     e.g. act_1234567890  (may be overridden per brief)
    META_PAGE_ID           Facebook Page the ads run under
    META_INSTAGRAM_ACTOR_ID  (optional) IG account id for IG placements
    META_API_VERSION       (optional) defaults to v21.0
"""

from __future__ import annotations

import json
import os
import ssl
import urllib.error
import urllib.parse
import urllib.request

DEFAULT_API_VERSION = "v21.0"
GRAPH_BASE = "https://graph.facebook.com"


class MetaApiError(RuntimeError):
    """Raised when the Graph API returns an error payload."""

    def __init__(self, status, payload):
        self.status = status
        self.payload = payload
        err = {}
        if isinstance(payload, dict):
            err = payload.get("error", {}) or {}
        self.code = err.get("code")
        self.subcode = err.get("error_subcode")
        self.fbtrace_id = err.get("fbtrace_id")
        message = err.get("message") or json.dumps(payload)
        super().__init__(f"[HTTP {status}] {message}")


def _ssl_context() -> ssl.SSLContext:
    """Build an SSL context that also trusts a custom CA bundle if configured."""
    ctx = ssl.create_default_context()
    ca = (
        os.environ.get("SSL_CERT_FILE")
        or os.environ.get("REQUESTS_CA_BUNDLE")
        or os.environ.get("META_CA_BUNDLE")
    )
    if not ca and os.path.exists("/root/.ccr/ca-bundle.crt"):
        ca = "/root/.ccr/ca-bundle.crt"
    if ca and os.path.exists(ca):
        try:
            ctx.load_verify_locations(ca)
        except Exception:
            pass
    return ctx


class MetaClient:
    def __init__(
        self,
        access_token: str | None = None,
        ad_account_id: str | None = None,
        page_id: str | None = None,
        instagram_actor_id: str | None = None,
        api_version: str | None = None,
    ):
        self.access_token = access_token or os.environ.get("META_ACCESS_TOKEN")
        if not self.access_token:
            raise ValueError(
                "META_ACCESS_TOKEN is not set. Export a valid Marketing API "
                "access token before running (see the skill's .env.example)."
            )
        self.ad_account_id = self._normalize_account(
            ad_account_id or os.environ.get("META_AD_ACCOUNT_ID")
        )
        self.page_id = page_id or os.environ.get("META_PAGE_ID")
        self.instagram_actor_id = instagram_actor_id or os.environ.get(
            "META_INSTAGRAM_ACTOR_ID"
        )
        self.api_version = (
            api_version or os.environ.get("META_API_VERSION") or DEFAULT_API_VERSION
        )
        self._ctx = _ssl_context()

        # urllib picks up HTTPS_PROXY automatically via getproxies(); build an
        # opener that also verifies TLS with our context.
        handlers = [urllib.request.HTTPSHandler(context=self._ctx)]
        proxies = urllib.request.getproxies()
        if proxies:
            handlers.append(urllib.request.ProxyHandler(proxies))
        self._opener = urllib.request.build_opener(*handlers)

    @staticmethod
    def _normalize_account(acct: str | None) -> str | None:
        if not acct:
            return None
        acct = str(acct).strip()
        return acct if acct.startswith("act_") else f"act_{acct}"

    # ── low-level HTTP ────────────────────────────────────────────────
    def _request(self, method: str, path: str, params: dict | None = None) -> dict:
        params = dict(params or {})
        params.setdefault("access_token", self.access_token)

        url = f"{GRAPH_BASE}/{self.api_version}/{path.lstrip('/')}"
        data = None
        if method == "GET":
            url = f"{url}?{urllib.parse.urlencode(params)}"
        else:
            data = urllib.parse.urlencode(params).encode("utf-8")

        req = urllib.request.Request(url, data=data, method=method)
        try:
            with self._opener.open(req, timeout=60) as resp:
                body = resp.read().decode("utf-8")
                return json.loads(body) if body else {}
        except urllib.error.HTTPError as e:
            raw = e.read().decode("utf-8", "replace")
            try:
                payload = json.loads(raw)
            except json.JSONDecodeError:
                payload = {"error": {"message": raw}}
            raise MetaApiError(e.code, payload) from None
        except urllib.error.URLError as e:
            raise RuntimeError(f"Network error calling Meta API: {e.reason}") from None

    def get(self, path: str, params: dict | None = None) -> dict:
        return self._request("GET", path, params)

    def post(self, path: str, params: dict | None = None) -> dict:
        return self._request("POST", path, params)

    # ── convenience ───────────────────────────────────────────────────
    def me(self) -> dict:
        return self.get("me", {"fields": "id,name"})

    def list_ad_accounts(self) -> list[dict]:
        res = self.get(
            "me/adaccounts",
            {"fields": "id,account_id,name,account_status,currency,timezone_name", "limit": 100},
        )
        return res.get("data", [])

    def list_pages(self) -> list[dict]:
        res = self.get(
            "me/accounts",
            {"fields": "id,name,instagram_business_account{id,username}", "limit": 100},
        )
        return res.get("data", [])

    def account_path(self, sub: str = "") -> str:
        if not self.ad_account_id:
            raise ValueError(
                "No ad account id configured. Set META_AD_ACCOUNT_ID or put "
                "account.ad_account_id in the brief."
            )
        return f"{self.ad_account_id}/{sub}".rstrip("/")

    # ── ad object creation ────────────────────────────────────────────
    def create_campaign(self, **fields) -> dict:
        return self.post(self.account_path("campaigns"), fields)

    def create_ad_set(self, **fields) -> dict:
        return self.post(self.account_path("adsets"), fields)

    def create_ad_creative(self, **fields) -> dict:
        return self.post(self.account_path("adcreatives"), fields)

    def create_ad(self, **fields) -> dict:
        return self.post(self.account_path("ads"), fields)

    def set_status(self, object_id: str, status: str) -> dict:
        return self.post(object_id, {"status": status})
