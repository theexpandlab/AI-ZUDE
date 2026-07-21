#!/usr/bin/env python3
"""
Verify Meta Marketing API credentials and list the ad accounts, Pages, and
Instagram accounts the token can use.

Run this FIRST, before creating any campaign, so you can grab the exact
ad_account_id / page_id / instagram_actor_id to put in a brief.

    python3 scripts/preflight.py

Reads credentials from environment variables (see .env.example).
"""

from __future__ import annotations

import sys

from meta_client import MetaApiError, MetaClient


def main() -> int:
    try:
        client = MetaClient()
    except ValueError as e:
        print(f"✗ {e}", file=sys.stderr)
        return 2

    try:
        me = client.me()
        print(f"✓ Token valid — authenticated as: {me.get('name')} (id {me.get('id')})")
        print(f"  API version: {client.api_version}\n")

        accounts = client.list_ad_accounts()
        if accounts:
            print("Ad accounts you can use (put one in account.ad_account_id):")
            for a in accounts:
                status = a.get("account_status")
                flag = "ACTIVE" if status == 1 else f"status={status}"
                print(
                    f"  • {a.get('id')}  {a.get('name')!r}  "
                    f"[{a.get('currency')}, {a.get('timezone_name')}, {flag}]"
                )
        else:
            print("  (no ad accounts returned — token may lack ads_management scope)")
        print()

        pages = client.list_pages()
        if pages:
            print("Pages you manage (put one id in account.page_id):")
            for p in pages:
                line = f"  • {p.get('id')}  {p.get('name')!r}"
                ig = p.get("instagram_business_account")
                if ig:
                    line += (
                        f"   ↳ Instagram: {ig.get('id')} "
                        f"(@{ig.get('username')})  ← instagram_actor_id"
                    )
                print(line)
        else:
            print("  (no Pages returned — token may lack pages/business scope)")

        print("\n✓ Preflight complete.")
        return 0
    except MetaApiError as e:
        print(f"✗ Meta API error: {e}", file=sys.stderr)
        if e.code == 190:
            print("  → Token is invalid or expired. Generate a new one.", file=sys.stderr)
        return 1
    except RuntimeError as e:
        print(f"✗ {e}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
