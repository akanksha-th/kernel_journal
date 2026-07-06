(function () {
  const STORE_KEY = "kernel-journal:done-weeks";

  function getDone() {
    try {
      return new Set(JSON.parse(localStorage.getItem(STORE_KEY) || "[]"));
    } catch (e) {
      return new Set();
    }
  }

  function setDone(doneSet) {
    localStorage.setItem(STORE_KEY, JSON.stringify([...doneSet]));
  }

  function weekById(n) {
    return WEEKS.find((w) => w.n === n);
  }

  function renderStrip(done) {
    const ruler = document.getElementById("strip-ruler");
    const strip = document.getElementById("memory-strip");
    ruler.innerHTML = "";
    strip.innerHTML = "";

    WEEKS.forEach((w) => {
      const tick = document.createElement("span");
      tick.textContent = String(w.n).padStart(2, "0");
      if (w.n % 4 !== 1) tick.style.opacity = "0"; // label every 4th, keep spacing
      ruler.appendChild(tick);

      const cell = document.createElement("div");
      cell.className = "cell" + (done.has(w.n) ? " done" : "");
      cell.dataset.track = w.track;
      cell.setAttribute("role", "listitem");
      cell.setAttribute("tabindex", "0");
      cell.title = `Week ${w.n}: ${w.title}`;
      cell.addEventListener("click", () => {
        const el = document.getElementById("week-" + w.n);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
          el.classList.add("flash");
          setTimeout(() => el.classList.remove("flash"), 800);
        }
      });
      cell.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); cell.click(); }
      });
      strip.appendChild(cell);
    });

    updateProgressCount(done);
  }

  function updateProgressCount(done) {
    const el = document.getElementById("progress-count");
    el.innerHTML = `<strong>${done.size}</strong> / ${WEEKS.length} weeks done`;
  }

  function renderMonths(done) {
    const root = document.getElementById("months");
    root.innerHTML = "";

    MONTHS.forEach((month) => {
      const section = document.createElement("div");
      section.style.marginBottom = "40px";

      const head = document.createElement("div");
      head.className = "section-head";
      head.style.marginTop = "36px";
      head.innerHTML = `
        <span class="section-index">Month ${String(month.number).padStart(2, "0")}</span>
        <h3 class="section-title" style="font-size:17px;">${month.title}</h3>
        <span class="section-range">${month.range}</span>
      `;
      section.appendChild(head);

      const grid = document.createElement("div");
      grid.className = "week-grid";

      month.weeks.forEach((n) => {
        grid.appendChild(renderWeekCard(weekById(n), done));
      });

      section.appendChild(grid);
      root.appendChild(section);
    });
  }

  function renderWeekCard(w, done) {
    const track = TRACKS[w.track];
    const card = document.createElement("article");
    card.className = "week-card" + (w.capstone ? " capstone" : "");
    card.id = "week-" + w.n;
    card.style.setProperty("--track-color", track.color);

    const isDone = done.has(w.n);
    const hasPost = !!w.post;

    card.innerHTML = `
      <div class="week-card-head">
        <span class="week-num">W${String(w.n).padStart(2, "0")}</span>
        <h4 class="week-title">${w.title}</h4>
        <span class="track-pill">${track.label}</span>
      </div>
      <div class="week-body">
        <dl>
          <dt>Study</dt><dd>${w.study}</dd>
          <dt>Project</dt><dd>${w.project}</dd>
        </dl>
        ${w.note ? `<div class="week-note">${w.note}</div>` : ""}
      </div>
      <div class="week-footer">
        <label class="done-toggle">
          <input type="checkbox" ${isDone ? "checked" : ""} data-week="${w.n}">
          done
        </label>
        ${
          hasPost
            ? `<a class="post-link live" href="${w.post.url}">Read post →</a>`
            : `<span class="post-link pending" title="${w.postTitle}">not published yet</span>`
        }
      </div>
    `;

    const checkbox = card.querySelector('input[type="checkbox"]');
    checkbox.addEventListener("change", (e) => {
      const d = getDone();
      if (e.target.checked) d.add(w.n); else d.delete(w.n);
      setDone(d);
      renderStrip(d);
    });

    return card;
  }

  function renderReadingList() {
    const ul = document.getElementById("reading-list");
    ul.innerHTML = READING_LIST.map((item) => `<li>${item}</li>`).join("");
  }

  function renderTags() {
    const el = document.getElementById("tags");
    el.innerHTML = RESEARCH_IDENTITIES.map((t) => `<span class="tag">${t}</span>`).join("");
  }

  function initV2Toggle() {
    const toggle = document.getElementById("v2-note-toggle");
    const note = document.getElementById("v2-note");
    toggle.addEventListener("click", () => {
      const open = note.style.display !== "none";
      note.style.display = open ? "none" : "block";
      toggle.textContent = open ? "What changed since v1 →" : "Hide changelog";
    });
  }

  function init() {
    const done = getDone();
    renderStrip(done);
    renderMonths(done);
    renderReadingList();
    renderTags();
    initV2Toggle();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
