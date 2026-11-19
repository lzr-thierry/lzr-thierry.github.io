#!/usr/bin/env python3
"""Fetch the "Latest News" and "Upcoming Events" lists from The Combustion Institute homepage.

Writes data/ci-news.js, which the SSCI home page reads to show "Latest News and Events from CI".
Run automatically every day by .github/workflows/static.yml, or by hand:

    python3 scripts/fetch_ci_news.py

The CI homepage lists have no dates and are maintained by CI, so the first MAX_ITEMS
entries of each list are used. SSCI's own events are skipped in the events list because
the home page already shows them in the "Latest Event from SSCI" block. If the page cannot be fetched or no news items
are found, the existing data/ci-news.js is left unchanged and the script exits
with an error (the workflow ignores that and keeps the previous list). If only the events
list cannot be read, the previous events are kept. The workflow saves every changed list
back to the repository, so "previous" means the last list that was fetched successfully.

For testing against a saved copy of the page:  python3 scripts/fetch_ci_news.py --from-file page.html
"""
import datetime
import json
import re
import sys
import urllib.parse
import urllib.request
from html.parser import HTMLParser
from pathlib import Path

SOURCE_URL = "https://www.combustioninstitute.org/index.php"
ARCHIVE_URL = "https://members.combustioninstitute.org/news_archive_headlines.php?org_id=CMBI"
CALENDAR_URL = "https://members.combustioninstitute.org/members/calendar6c_responsive.php?org_id=CMBI"
ALLOWED_DOMAIN = "combustioninstitute.org"
MAX_ITEMS = 8  # kept in the data file; the home page shows the first 6 of each list
# Entries in the CI events list whose title contains one of these (case-insensitive) are skipped.
EXCLUDE_EVENT_TITLES = ("singapore section of the combustion institute",)
OUT_FILE = Path(__file__).resolve().parent.parent / "data" / "ci-news.js"


class AnchorCollector(HTMLParser):
    """Collect (href, text) for every <a> inside the given HTML fragment."""

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.items = []
        self._href = None
        self._text = []

    def handle_starttag(self, tag, attrs):
        if tag == "a":
            self._href = dict(attrs).get("href")
            self._text = []

    def handle_data(self, data):
        if self._href is not None:
            self._text.append(data)

    def handle_endtag(self, tag):
        if tag == "a" and self._href is not None:
            text = re.sub(r"\s+", " ", "".join(self._text).replace("\xa0", " ")).strip()
            if text:
                self.items.append((self._href, text))
            self._href = None


def is_allowed(url):
    """Only https links on the Combustion Institute's own domain are kept."""
    p = urllib.parse.urlparse(url)
    host = (p.hostname or "").lower()
    return p.scheme == "https" and (host == ALLOWED_DOMAIN or host.endswith("." + ALLOWED_DOMAIN))


def parse_list(page_html, heading):
    """Return [{"title", "url"}] for the first <ul> after an <h3> with the given heading."""
    m = re.search(r"<h3>\s*" + re.escape(heading) + r"\s*</h3>", page_html, re.I)
    if not m:
        raise ValueError("'%s' heading not found; the CI page layout may have changed" % heading)
    ul = re.search(r"<ul>.*?</ul>", page_html[m.end():], re.S | re.I)
    if not ul:
        raise ValueError("list not found after the '%s' heading" % heading)
    collector = AnchorCollector()
    collector.feed(ul.group(0))
    items, seen = [], set()
    for href, text in collector.items:
        url = urllib.parse.urljoin(SOURCE_URL, href.strip())
        if not is_allowed(url) or (text, url) in seen:
            continue
        seen.add((text, url))
        items.append({"title": text[:200], "url": url})
    if not items:
        raise ValueError("no items found under '%s'" % heading)
    return items


def parse_news(page_html):
    return parse_list(page_html, "Latest News")[:MAX_ITEMS]


def parse_events(page_html):
    events = parse_list(page_html, "Upcoming Events")
    kept = [e for e in events if not any(x in e["title"].lower() for x in EXCLUDE_EVENT_TITLES)]
    return kept[:MAX_ITEMS]


def load_previous():
    """Return the data currently in data/ci-news.js, or {} if it is missing or unreadable."""
    try:
        text = OUT_FILE.read_text(encoding="utf-8")
        return json.loads(text[text.index("{"):text.rindex("}") + 1])
    except Exception:
        return {}


def main():
    if "--from-file" in sys.argv:
        page = Path(sys.argv[sys.argv.index("--from-file") + 1]).read_text(encoding="utf-8", errors="ignore")
    else:
        req = urllib.request.Request(SOURCE_URL, headers={"User-Agent": "Mozilla/5.0 (compatible; SSCI-website-news-feed)"})
        with urllib.request.urlopen(req, timeout=30) as resp:
            page = resp.read().decode("utf-8", errors="ignore")
    news = parse_news(page)
    try:
        events = parse_events(page)
    except ValueError as exc:  # could not read the events list: keep the previous events
        print("events not updated, keeping the previous list:", exc, file=sys.stderr)
        events = load_previous().get("events", [])
    data = {
        "updated": datetime.date.today().isoformat(),
        "source": SOURCE_URL,
        "archive": ARCHIVE_URL,
        "calendar": CALENDAR_URL,
        "news": news,
        "events": events,
    }
    OUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    OUT_FILE.write_text(
        "// Generated by scripts/fetch_ci_news.py. Do not edit by hand.\n"
        "window.CI_NEWS = " + json.dumps(data, ensure_ascii=True, indent=2) + ";\n",
        encoding="utf-8",
    )
    print(f"Wrote {len(news)} news and {len(events)} events to {OUT_FILE}")
    for label, group in (("news", news), ("event", events)):
        for i in group:
            print(f" - [{label}] {i['title']}")


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:  # keep the previous file on any failure
        print("CI news not updated:", exc, file=sys.stderr)
        sys.exit(1)
