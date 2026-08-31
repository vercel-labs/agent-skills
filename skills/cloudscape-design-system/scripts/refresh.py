"""
Scrape https://cloudscape.design/ and write one Markdown file per page under
../references/, organized by URL section.

Cloudscape publishes pre-rendered Markdown for every documentation page at
`<page>/index.html.md` and lists them all in `/llms.txt`, so no headless
browser is required — we just fetch the list and download each .md file.

Pacing: polite serial fetches with 2 seconds between requests (per user
directive). Expect ~8 minutes for ~220 pages.

Run:
    python -m venv .venv && source .venv/bin/activate
    pip install -r requirements.txt
    python scripts/refresh.py
"""

from __future__ import annotations

import datetime as dt
import re
import sys
import time
from pathlib import Path
from urllib.parse import urlparse

import httpx
import yaml

# ------------------------------------------------------------------ Configuration

BASE_URL = "https://cloudscape.design"
LLMS_TXT_URL = f"{BASE_URL}/llms.txt"

SKILL_ROOT = Path(__file__).resolve().parent.parent
REFERENCES_DIR = SKILL_ROOT / "references"

PER_REQUEST_DELAY_SECS = 2.0
REQUEST_TIMEOUT_SECS = 30.0
MAX_PAGES = 500  # safety cap

# Sections we keep (anything outside these is ignored).
ALLOWED_SECTIONS: tuple[str, ...] = (
    "components",
    "patterns",
    "foundation",
    "get-started",
    "guidelines",
    "examples",
)

USER_AGENT = (
    "cloudscape-skill-refresh/0.1 "
    "(+https://github.com/vercel-labs/agent-skills; contact via repository issues)"
)


# ------------------------------------------------------------------ Helpers

MD_URL_RE = re.compile(r"https://cloudscape\.design/[^\s)]*index\.html\.md")


def fetch_llms_txt(client: httpx.Client) -> str:
    resp = client.get(LLMS_TXT_URL, timeout=REQUEST_TIMEOUT_SECS)
    resp.raise_for_status()
    return resp.text


def parse_md_urls(llms_txt: str) -> list[str]:
    return sorted({m.group(0) for m in MD_URL_RE.finditer(llms_txt)})


def url_to_relpath(url: str) -> Path | None:
    """Map https://cloudscape.design/<section>/<slug>/index.html.md → references/<section>/<slug>.md."""
    parsed = urlparse(url)
    parts = [p for p in parsed.path.split("/") if p]
    # Strip trailing 'index.html.md'.
    if parts and parts[-1] == "index.html.md":
        parts = parts[:-1]
    if not parts:
        return None
    section = parts[0]
    if section not in ALLOWED_SECTIONS:
        return None
    if len(parts) == 1:
        slug = "_overview"
    else:
        slug = "-".join(parts[1:]).replace("_", "-")
    slug = re.sub(r"[^a-z0-9\-]", "-", slug.lower()).strip("-") or "_overview"
    return Path(section) / f"{slug}.md"


def extract_title(markdown: str, fallback: str) -> str:
    for line in markdown.splitlines():
        line = line.strip()
        if line.startswith("# "):
            return line[2:].strip()
    return fallback


# ------------------------------------------------------------------ Main

def main() -> int:
    REFERENCES_DIR.mkdir(exist_ok=True)

    saved: list[Path] = []
    skipped_out_of_scope: list[str] = []
    skipped_empty: list[str] = []
    failed: dict[str, str] = {}

    headers = {"User-Agent": USER_AGENT, "Accept": "text/markdown, text/plain, */*"}
    with httpx.Client(headers=headers, follow_redirects=True, timeout=REQUEST_TIMEOUT_SECS) as client:
        print(f"[seeds] GET {LLMS_TXT_URL}")
        try:
            llms_body = fetch_llms_txt(client)
        except Exception as e:
            print(f"[fatal] could not fetch llms.txt: {e}")
            return 2

        urls = parse_md_urls(llms_body)
        print(f"[seeds] found {len(urls)} markdown URLs")
        if not urls:
            print("[fatal] no URLs parsed from llms.txt")
            return 2

        for idx, url in enumerate(urls, start=1):
            if len(saved) >= MAX_PAGES:
                print(f"[stop ] hit MAX_PAGES={MAX_PAGES}")
                break

            rel = url_to_relpath(url)
            if rel is None:
                skipped_out_of_scope.append(url)
                continue

            print(f"[{idx:>3}/{len(urls):>3}] GET {url}")
            try:
                resp = client.get(url)
            except Exception as e:
                failed[url] = f"exception: {e}"
                time.sleep(PER_REQUEST_DELAY_SECS)
                continue

            if resp.status_code != 200:
                failed[url] = f"status {resp.status_code}"
                time.sleep(PER_REQUEST_DELAY_SECS)
                continue

            body = resp.text.strip()
            if len(body) < 50:
                skipped_empty.append(url)
                time.sleep(PER_REQUEST_DELAY_SECS)
                continue

            title = extract_title(body, fallback=rel.stem.replace("-", " ").title())
            front = {
                "source_url": url,
                "title": title,
                "section": rel.parent.name,
                "scraped_at": dt.datetime.now(dt.timezone.utc).isoformat(timespec="seconds"),
            }
            dest = REFERENCES_DIR / rel
            dest.parent.mkdir(parents=True, exist_ok=True)
            dest.write_text(
                "---\n"
                + yaml.safe_dump(front, sort_keys=True, allow_unicode=True).rstrip()
                + "\n---\n\n"
                + body
                + "\n",
                encoding="utf-8",
            )
            saved.append(rel)
            time.sleep(PER_REQUEST_DELAY_SECS)

    # ------------------------------------------------------------------ index.md

    by_section: dict[str, list[Path]] = {}
    for rel in saved:
        by_section.setdefault(rel.parent.name, []).append(rel)

    index_lines = [
        "# Cloudscape Design System — reference index",
        "",
        "Auto-generated by `scripts/refresh.py` from `https://cloudscape.design/llms.txt`.",
        "Each link below points to a markdown file containing the scraped content of the",
        "corresponding page on https://cloudscape.design/.",
        "",
    ]
    for section in sorted(by_section):
        index_lines.append(f"## {section}")
        index_lines.append("")
        for path in sorted(by_section[section]):
            label = path.stem.replace("-", " ")
            index_lines.append(f"- [{label}]({path.as_posix()})")
        index_lines.append("")
    (REFERENCES_DIR / "index.md").write_text("\n".join(index_lines), encoding="utf-8")

    # ------------------------------------------------------------------ summary

    print()
    print(f"[done ] saved={len(saved)} "
          f"out_of_scope={len(skipped_out_of_scope)} "
          f"empty={len(skipped_empty)} "
          f"failed={len(failed)}")
    if failed:
        print("[fail ] first 10:")
        for url, reason in list(failed.items())[:10]:
            print(f"        - {url}: {reason}")

    return 0 if saved else 1


if __name__ == "__main__":
    sys.exit(main())
