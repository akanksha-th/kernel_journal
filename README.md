# Kernel Journal

A 16-week log of learning kernel programming for ML systems — NumPy → PyTorch →
CUDA → Triton → JAX/Pallas — told through parallel image and audio case studies.
Plain HTML/CSS/JS, no build step, deployed on GitHub Pages. The homepage is a
map: sixteen stops across four regions, one per week.

## Repo structure

Each week is its own folder under `weeks/`, holding everything for that
week — notebook, data/images/audio, and a **`README.md` that is the blog
post itself**. The site never stores your writing; it fetches that file
straight from the folder and renders it in the panel when someone clicks
the corresponding stop on the map.

```
weeks/
  week-01-image-strides-memory-layout/
    README.md          <- the post ("What a 4-channel image taught me about memory")
    strides.ipynb
    rgba_sample.png
    strides_plot.png
  week-02-audio-sampling-quantization-layout/
    README.md
    bass_clip.wav
    ...
```

A real example is already scaffolded at
`weeks/week-01-image-strides-memory-layout/README.md` — open it to see the
expected shape (one `# Title`, then whatever sections you want).

## Deploy it

1. Create a new GitHub repo (e.g. `kernel-journal`) and set `GITHUB_REPO_URL`
   at the top of `data.js` to its URL.
2. Push everything — `index.html`, `style.css`, `data.js`, `script.js`, and
   the `weeks/` folder — to the `main` branch, root of the repo.
3. On GitHub: **Settings → Pages → Build and deployment → Source: Deploy
   from a branch → Branch: `main` / root**.
4. Live in about a minute at `https://<your-username>.github.io/kernel-journal/`.

## Publishing a week

1. Create (or fill in) `weeks/<slug>/README.md` with the real post, and drop
   in whatever notebook/data/images it references.
2. In `data.js`, find that week's entry and flip `published: false` to
   `published: true`.
3. Commit and push. The map marker fills in as "dug up," the plain-list
   fallback drops the "(not written yet)" tag, and clicking the stop now
   shows a working **"Dig it up →"** button that fetches and renders that
   README in the panel.

If a slug in `data.js` doesn't match the actual folder name, the dig button
will fail with a small inline error telling you so — that's the signal to
fix the path.

## Editing the roadmap itself

`data.js` also holds `MONTHS` (the four map regions), `TRACKS`, the map
`STOP_POINTS`/`ZONES` geometry lives in `script.js`, and `READING_LIST` /
`RESEARCH_IDENTITIES` for the cross-cutting section. Content edits (titles,
clues, notes, published flags) only ever touch `data.js` — `index.html` and
`script.js` don't need to change.

## Local preview

`fetch()` needs a real HTTP server (not `file://`) to load the README files,
so:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```
