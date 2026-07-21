#!/usr/bin/env python3
"""
Create a complete Meta ad campaign from a JSON brief — Campaign → Ad Set →
Ad Creative(s) → Ad(s).

SAFETY MODEL
------------
Everything is created PAUSED. Nothing spends money until you review it in
Ads Manager and explicitly activate. There are three modes:

  --dry-run     Validate the brief and print the exact payloads. No API calls.
  (default)     Create everything, left PAUSED. Safe to run — no spend.
  --activate    After creating, flip Campaign + Ad Sets + Ads to ACTIVE.
                Requires typing the confirmation phrase (or --yes).

USAGE
    python3 scripts/create_campaign.py brief.json --dry-run
    python3 scripts/create_campaign.py brief.json
    python3 scripts/create_campaign.py brief.json --activate

Credentials come from environment variables (see .env.example). Values in the
brief's "account" block override the env vars.
"""

from __future__ import annotations

import argparse
import json
import sys

from meta_client import MetaApiError, MetaClient

# Objectives valid on the current (ODAX) Marketing API.
VALID_OBJECTIVES = {
    "OUTCOME_TRAFFIC",
    "OUTCOME_LEADS",
    "OUTCOME_ENGAGEMENT",
    "OUTCOME_SALES",
    "OUTCOME_AWARENESS",
    "OUTCOME_APP_PROMOTION",
}

# A small allow-list of common CTAs. Meta accepts many more; these cover ads
# that drive to a landing page / lead magnet.
COMMON_CTAS = {
    "LEARN_MORE", "SIGN_UP", "GET_OFFER", "DOWNLOAD", "SUBSCRIBE",
    "BOOK_TRAVEL", "GET_QUOTE", "CONTACT_US", "APPLY_NOW", "SEE_MORE",
    "GET_STARTED", "REGISTER_NOW", "SHOP_NOW",
}


class BriefError(ValueError):
    pass


def _require(obj: dict, key: str, where: str):
    if key not in obj or obj[key] in (None, "", [], {}):
        raise BriefError(f"Missing required field '{key}' in {where}.")
    return obj[key]


def validate_brief(brief: dict) -> None:
    campaign = _require(brief, "campaign", "brief")
    obj = _require(campaign, "objective", "campaign")
    if obj not in VALID_OBJECTIVES:
        raise BriefError(
            f"campaign.objective '{obj}' is not valid. Use one of: "
            + ", ".join(sorted(VALID_OBJECTIVES))
        )
    _require(campaign, "name", "campaign")

    ad_set = _require(brief, "ad_set", "brief")
    _require(ad_set, "name", "ad_set")
    if not ad_set.get("daily_budget") and not ad_set.get("lifetime_budget"):
        raise BriefError(
            "ad_set needs either daily_budget or lifetime_budget "
            "(in the account's minor units, e.g. cents: 2000 = $20.00)."
        )
    if ad_set.get("lifetime_budget") and not (
        ad_set.get("start_time") and ad_set.get("end_time")
    ):
        raise BriefError("A lifetime_budget requires both start_time and end_time.")
    _require(ad_set, "destination_url", "ad_set")
    _require(ad_set, "targeting", "ad_set")

    creatives = _require(brief, "creatives", "brief")
    if not isinstance(creatives, list) or not creatives:
        raise BriefError("brief.creatives must be a non-empty list.")
    for i, c in enumerate(creatives):
        where = f"creatives[{i}]"
        _require(c, "primary_text", where)
        _require(c, "headline", where)
        cta = c.get("call_to_action", "LEARN_MORE")
        if cta not in COMMON_CTAS:
            print(
                f"  ⚠ {where}: call_to_action '{cta}' is uncommon — Meta may reject "
                f"it. Common values: {', '.join(sorted(COMMON_CTAS))}",
                file=sys.stderr,
            )


def build_client(brief: dict) -> MetaClient:
    acct = brief.get("account", {}) or {}
    meta = brief.get("meta", {}) or {}
    return MetaClient(
        ad_account_id=acct.get("ad_account_id"),
        page_id=acct.get("page_id"),
        instagram_actor_id=acct.get("instagram_actor_id"),
        api_version=meta.get("api_version"),
    )


def campaign_payload(brief: dict) -> dict:
    c = brief["campaign"]
    return {
        "name": c["name"],
        "objective": c["objective"],
        "status": "PAUSED",
        "special_ad_categories": json.dumps(c.get("special_ad_categories", [])),
        "buying_type": c.get("buying_type", "AUCTION"),
    }


def ad_set_payload(brief: dict, campaign_id: str) -> dict:
    a = brief["ad_set"]
    payload = {
        "name": a["name"],
        "campaign_id": campaign_id,
        "status": "PAUSED",
        "billing_event": a.get("billing_event", "IMPRESSIONS"),
        "optimization_goal": a.get("optimization_goal", "LANDING_PAGE_VIEWS"),
        "bid_strategy": a.get("bid_strategy", "LOWEST_COST_WITHOUT_CAP"),
        "targeting": json.dumps(a["targeting"]),
    }
    if a.get("daily_budget"):
        payload["daily_budget"] = int(a["daily_budget"])
    if a.get("lifetime_budget"):
        payload["lifetime_budget"] = int(a["lifetime_budget"])
    if a.get("start_time"):
        payload["start_time"] = a["start_time"]
    if a.get("end_time"):
        payload["end_time"] = a["end_time"]
    if a.get("bid_amount"):
        payload["bid_amount"] = int(a["bid_amount"])
    return payload


def creative_payload(brief: dict, creative: dict, client: MetaClient, preview: bool = False) -> dict:
    page_id = brief.get("account", {}).get("page_id") or client.page_id
    if not page_id:
        if preview:
            page_id = "<META_PAGE_ID>"
        else:
            raise BriefError(
                "No Page id — set META_PAGE_ID or account.page_id (ads must run "
                "under a Facebook Page)."
            )
    link = brief["ad_set"]["destination_url"]

    link_data: dict = {
        "message": creative["primary_text"],
        "link": link,
        "name": creative["headline"],
    }
    if creative.get("description"):
        link_data["description"] = creative["description"]
    if creative.get("image_url"):
        link_data["picture"] = creative["image_url"]
    link_data["call_to_action"] = {
        "type": creative.get("call_to_action", "LEARN_MORE"),
        "value": {"link": link},
    }

    story_spec: dict = {"page_id": str(page_id), "link_data": link_data}
    ig = brief.get("account", {}).get("instagram_actor_id") or client.instagram_actor_id
    if ig:
        story_spec["instagram_actor_id"] = str(ig)

    return {
        "name": creative.get("name", creative["headline"]),
        "object_story_spec": json.dumps(story_spec),
    }


def print_plan(brief: dict, client: MetaClient) -> None:
    print("── DRY RUN — nothing will be created ─────────────────────────────")
    print(f"Ad account: {client.ad_account_id}")
    print(f"API version: {client.api_version}\n")
    print("1) CAMPAIGN")
    print(json.dumps(campaign_payload(brief), indent=2))
    print("\n2) AD SET")
    print(json.dumps(ad_set_payload(brief, "<campaign_id>"), indent=2))
    for i, c in enumerate(brief["creatives"]):
        print(f"\n3.{i + 1}) AD CREATIVE + AD")
        print(json.dumps(creative_payload(brief, c, client, preview=True), indent=2))
    print("\nAll objects would be created with status=PAUSED.")


def confirm_activation(assume_yes: bool) -> bool:
    if assume_yes:
        return True
    phrase = "ACTIVATE"
    print(
        "\n⚠ --activate will set the campaign LIVE and it WILL begin spending "
        f"budget.\n  Type {phrase!r} to confirm (anything else aborts activation): ",
        end="",
    )
    try:
        return input().strip() == phrase
    except EOFError:
        return False


def main() -> int:
    ap = argparse.ArgumentParser(description="Create a Meta ad campaign from a JSON brief.")
    ap.add_argument("brief", help="Path to the campaign brief JSON file.")
    ap.add_argument("--dry-run", action="store_true", help="Validate + print payloads; no API calls.")
    ap.add_argument("--activate", action="store_true", help="Set everything ACTIVE after creating (spends money).")
    ap.add_argument("--yes", action="store_true", help="Skip the interactive activation confirmation.")
    args = ap.parse_args()

    try:
        with open(args.brief, encoding="utf-8") as f:
            brief = json.load(f)
    except FileNotFoundError:
        print(f"✗ Brief not found: {args.brief}", file=sys.stderr)
        return 2
    except json.JSONDecodeError as e:
        print(f"✗ Brief is not valid JSON: {e}", file=sys.stderr)
        return 2

    try:
        validate_brief(brief)
    except BriefError as e:
        print(f"✗ Invalid brief: {e}", file=sys.stderr)
        return 2

    if args.dry_run:
        # Build a client only to resolve account/version; tolerate missing token.
        try:
            client = build_client(brief)
        except ValueError:
            class _Stub:
                ad_account_id = (brief.get("account", {}) or {}).get("ad_account_id", "<META_AD_ACCOUNT_ID>")
                api_version = (brief.get("meta", {}) or {}).get("api_version", "v21.0")
                page_id = (brief.get("account", {}) or {}).get("page_id")
                instagram_actor_id = (brief.get("account", {}) or {}).get("instagram_actor_id")
            client = _Stub()
        try:
            print_plan(brief, client)
        except BriefError as e:
            print(f"✗ {e}", file=sys.stderr)
            return 2
        return 0

    try:
        client = build_client(brief)
    except ValueError as e:
        print(f"✗ {e}", file=sys.stderr)
        return 2

    created: dict = {"campaign": None, "ad_set": None, "ads": []}
    try:
        print(f"→ Creating campaign in {client.ad_account_id} (all PAUSED)…")
        camp = client.create_campaign(**campaign_payload(brief))
        campaign_id = camp["id"]
        created["campaign"] = campaign_id
        print(f"  ✓ Campaign: {campaign_id}")

        adset = client.create_ad_set(**ad_set_payload(brief, campaign_id))
        adset_id = adset["id"]
        created["ad_set"] = adset_id
        print(f"  ✓ Ad set:  {adset_id}")

        for i, c in enumerate(brief["creatives"]):
            cr = client.create_ad_creative(**creative_payload(brief, c, client))
            creative_id = cr["id"]
            ad = client.create_ad(
                name=c.get("name", c["headline"]),
                adset_id=adset_id,
                creative=json.dumps({"creative_id": creative_id}),
                status="PAUSED",
            )
            created["ads"].append({"creative_id": creative_id, "ad_id": ad["id"]})
            print(f"  ✓ Ad {i + 1}:    {ad['id']}  (creative {creative_id})")

    except (MetaApiError, RuntimeError, BriefError) as e:
        print(f"\n✗ Failed partway through: {e}", file=sys.stderr)
        if created["campaign"]:
            print(
                f"  Partial objects were created and left PAUSED. Campaign "
                f"{created['campaign']} — review/delete it in Ads Manager.",
                file=sys.stderr,
            )
        return 1

    acct_num = client.ad_account_id.replace("act_", "")
    print("\n✓ Done. Everything is PAUSED (no spend).")
    print(
        f"  Review it here: https://adsmanager.facebook.com/adsmanager/manage/"
        f"campaigns?act={acct_num}&selected_campaign_ids={created['campaign']}"
    )

    if args.activate:
        if confirm_activation(args.yes):
            print("\n→ Activating…")
            client.set_status(created["campaign"], "ACTIVE")
            client.set_status(created["ad_set"], "ACTIVE")
            for ad in created["ads"]:
                client.set_status(ad["ad_id"], "ACTIVE")
            print("  ✓ Campaign, ad set, and ads set to ACTIVE. Ads are now live.")
        else:
            print("  Activation cancelled — everything remains PAUSED.")
    else:
        print("  To go live: review in Ads Manager, then re-run with --activate "
              "(or flip the toggle in Ads Manager).")

    print("\n" + json.dumps(created, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
