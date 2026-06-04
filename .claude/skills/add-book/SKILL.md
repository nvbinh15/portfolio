---
name: add-book
description: Add a book to the reading list on nvbinh.com — finds a cover image, optimizes it, and inserts an HTML row into books.html. Use when the user says "add this book" or asks to update the reading list.
---

# Add Book to Reading List

The reading list lives in `books.html` as a single `<ul class="books-grid">` of `<li class="book">` rows. Each book has a cover image at `assets/img/books/<slug>.jpg`. The homepage (`index.html`) shows a hand-picked teaser of 8 favorites — do **not** auto-edit it.

## Inputs

Get from the user (ask if missing):
- **Title** (required)
- **Author** (strongly recommended — accuracy doubles)
- **Position** (optional; default: top of grid)

## Step 1 — Slug

ASCII, lowercase, hyphenated. Drop a leading "The/A/An". Keep it short.
- "The Almanack of Naval Ravikant" → `almanack-naval`
- "Designing Data-Intensive Applications" → `ddia` (or `data-intensive-apps`)
- "Chip War" → `chip-war`

Verify the slug doesn't collide with an existing file in `assets/img/books/`.

## Step 2 — Find a cover

Run the helper, which queries Open Library:

```bash
python3 .claude/skills/add-book/fetch_cover.py <slug> "<title>" "<author>"
```

Exit codes: `0` success, `2` not found, `3` placeholder (saved file < 1500 bytes, removed).

If it fails, try these fallbacks **in order**:

1. **Open Library ISBN cover** — `https://covers.openlibrary.org/b/isbn/<ISBN>-L.jpg`. WebSearch the ISBN if you don't know it.
2. **Google Books** — `https://www.googleapis.com/books/v1/volumes?q=<title>+<author>`. Use `volumeInfo.imageLinks.thumbnail` with `zoom=1` replaced by `zoom=0`. **Watch for HTTP 429** — wait 30+ seconds between calls and don't retry in tight loops.
3. **Publisher / Goodreads page** — WebSearch for "`<title>` `<author>` book cover", then WebFetch the top result and extract the `og:image` URL.
4. **Vietnamese / non-English titles** — Open Library and Google Books usually miss these. Skip straight to step 3 (Goodreads or Vietnamese book retailers like nhanam.vn, tiki.vn).

If everything fails, ask the user for a direct image URL rather than silently skipping.

## Step 3 — Optimize size

After download, if the cover is larger than ~80 KB or wider than 500 px, downscale with `sips` (built into macOS):

```bash
sips -Z 400 -s format jpeg -s formatOptions normal \
  assets/img/books/<slug>.jpg --out assets/img/books/<slug>.jpg
```

Target: 20–80 KB per cover. The page already carries ~20 covers; weight matters.

## Step 4 — Insert HTML row

Open `books.html` and insert this `<li>` inside `<ul class="books-grid">`. Default position is **right after the `<ul class="books-grid">` opening tag** (top of the grid = newest read first):

```html
          <li class="book">
            <img
              src="assets/img/books/<slug>.jpg"
              alt="<Title> by <Author>"
              title="<Title> &mdash; <Author>"
              loading="lazy"
            />
          </li>
```

Match the existing 10-space indentation. Escape any non-ASCII characters in the `title` attribute as HTML entities (the file already uses `&aacute;`, `&#7891;`, etc. for Vietnamese titles).

## Step 5 — Do not touch the homepage

`index.html` has 8 hand-picked covers under `books-grid--teaser`. Leave them alone unless the user explicitly says to swap. If you think the new book is a stronger fit than one currently shown, ask before editing.

## Step 6 — Verify and report

Briefly tell the user:
- Slug used
- Cover source (which fallback worked)
- File size after optimization
- Position in `books.html`

If a local dev server is running (`python3 -m http.server` in the repo root), the new cover will appear on `/books.html` immediately.

## Multiple books at once

If the user gives a list, loop steps 1–4 for each book. Process Open Library calls sequentially with a 2–3 second delay to avoid rate limits. Report a summary at the end (which succeeded, which failed).
