#!/usr/bin/env python3
"""Fetch a book cover from Open Library and save it under assets/img/books/.

Usage:
    python3 .claude/skills/add-book/fetch_cover.py <slug> "<title>" "<author>"

Exit codes:
    0 — saved
    1 — bad usage
    2 — book not found on Open Library
    3 — Open Library returned a placeholder cover (removed)
    4 — network error
"""

import json
import os
import sys
import urllib.parse
import urllib.request

OUT_DIR = "assets/img/books"


def main() -> int:
    if len(sys.argv) != 4:
        print("Usage: fetch_cover.py <slug> <title> <author>", file=sys.stderr)
        return 1

    slug, title, author = sys.argv[1], sys.argv[2], sys.argv[3]
    os.makedirs(OUT_DIR, exist_ok=True)

    query = urllib.parse.urlencode({"title": title, "author": author, "limit": 1})
    search_url = f"https://openlibrary.org/search.json?{query}"

    try:
        with urllib.request.urlopen(search_url, timeout=25) as r:
            data = json.load(r)
    except Exception as e:
        print(f"NETWORK ERROR: {e}", file=sys.stderr)
        return 4

    docs = data.get("docs", [])
    if not docs:
        print(f"NOT FOUND on Open Library: {title} by {author}", file=sys.stderr)
        return 2

    cover_i = docs[0].get("cover_i")
    if cover_i:
        cover_url = f"https://covers.openlibrary.org/b/id/{cover_i}-L.jpg"
    else:
        isbns = docs[0].get("isbn") or []
        if not isbns:
            print(f"NO COVER, NO ISBN: {title}", file=sys.stderr)
            return 2
        cover_url = f"https://covers.openlibrary.org/b/isbn/{isbns[0]}-L.jpg"

    path = os.path.join(OUT_DIR, f"{slug}.jpg")
    try:
        urllib.request.urlretrieve(cover_url, path)
    except Exception as e:
        print(f"DOWNLOAD ERROR: {e}", file=sys.stderr)
        return 4

    size = os.path.getsize(path)
    if size < 1500:
        os.remove(path)
        print(f"PLACEHOLDER ({size} bytes), removed: {title}", file=sys.stderr)
        return 3

    print(f"OK: {path} ({size} bytes) from {cover_url}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
