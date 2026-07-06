# Kernel Journal

A log of learning kernel programming for ML systems. 
Plain HTML/CSS/JS, no build step, deployed on GitHub Pages.

## Adding a week's post

Everything content-related lives in `data.js`. When you publish week *n*:

1. Open `data.js`, find the entry with `n: <week>`.
2. Set its `post` field:
   ```js
   post: { url: "https://your-blog.com/posts/week-06-raw-cuda", date: "2026-07-20" }
   ```
3. Commit and push — the card automatically switches from "not published yet"
   to a live "Read post →" link, and the strip cell brightens once you also
   check it off as done (that checkbox state is stored per-browser in
   `localStorage`, not in the repo, so it's just for your own tracking while
   working on the site).

If your posts live in this same repo (e.g. as Markdown under `/posts`), point
`url` at the relative path instead of an external blog.

## Editing the roadmap itself

`data.js` also holds `MONTHS`, `TRACKS`, `READING_LIST`, and
`RESEARCH_IDENTITIES` — edit any of these directly; `index.html` and
`script.js` don't need to change for content edits. Only touch `script.js` if
you want to change *how* things render.

## Local preview

No build step needed. Either open `index.html` directly in a browser, or run
a tiny local server so `fetch`/relative paths behave exactly like production:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```
