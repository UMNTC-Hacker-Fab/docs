/* =====================================================================
   Docs app: hash router, Markdown renderer, sidebar, outline, pager,
   search. No build step; content/*.md is fetched and rendered here.
   ===================================================================== */
(function () {
  "use strict";

  const REPO_EDIT = "https://github.com/UMNTC-Hacker-Fab/docs/edit/main/content/";
  const HOME = "home";
  const $ = (s, el = document) => el.querySelector(s);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const slug = (s) => s.toLowerCase().replace(/<[^>]+>/g, "").replace(/&[a-z]+;/g, "").replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-");

  /* ---------- nav model ---------- */
  const pages = [];        // reading order
  const byPath = {};       // path -> { title, path, trail[], hasChildren }
  (function walk(nodes, trail, section) {
    for (const n of nodes) {
      if (n.section) { walk(n.children, [{ title: n.section }], n.section); continue; }
      if (n.group) { walk(n.children, trail.concat({ title: n.group }), section); continue; }
      if (n.link) continue;   // sidebar alias: the real page is registered where it lives
      const entry = { title: n.title, path: n.path, icon: n.icon, trail, section, dir: !!n.dir || !!(n.children && n.children.length) };
      pages.push(entry); byPath[n.path] = entry;
      if (n.children) walk(n.children, trail.concat({ title: n.title, path: n.path }), section);
    }
  })(window.NAV, [], null);

  /* ---------- sidebar ---------- */
  const chevron = '<svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.6"><path d="m6 4 4 4-4 4"/></svg>';
  function renderList(nodes) {
    let html = '<ul class="nav-list">';
    for (const n of nodes) {
      if (n.group) {
        html += `<li class="nav-group"><div class="nav-group-title">${esc(n.group)}</div>${renderList(n.children)}</li>`;
        continue;
      }
      if (n.link) {
        const t = byPath[n.link] || {}, icon = n.icon || t.icon;
        html += `<li class="nav-item nav-alias" data-alias="${esc(n.link)}"><div class="nav-row">` +
          `<a class="nav-link" href="#/${esc(n.link)}" title="Lives at ${esc(n.link)}">${icon ? `<span class="nav-icon">${icon}</span>` : ""}<span>${esc(n.title || t.title)}</span><span class="nav-alias-mark" aria-hidden="true">↪</span></a>` +
          `</div></li>`;
        continue;
      }
      const kids = n.children && n.children.length;
      html += `<li class="nav-item" data-path="${esc(n.path)}"><div class="nav-row">` +
        `<a class="nav-link" href="#/${esc(n.path)}">${n.icon ? `<span class="nav-icon">${n.icon}</span>` : ""}<span>${esc(n.title)}</span></a>` +
        (kids ? `<button class="nav-toggle" aria-label="Expand ${esc(n.title)}">${chevron}</button>` : "") +
        `</div>${kids ? renderList(n.children) : ""}</li>`;
    }
    return html + "</ul>";
  }
  const sidebarNav = $("#sidebar-nav");
  sidebarNav.innerHTML = window.NAV.map((s) =>
    `<div class="nav-section"><div class="nav-section-title">${esc(s.section)}</div>${renderList(s.children)}</div>`).join("");
  sidebarNav.addEventListener("click", (e) => {
    const t = e.target.closest(".nav-toggle");
    if (t) { t.closest(".nav-item").classList.toggle("open"); return; }
    if (e.target.closest(".nav-link")) document.body.classList.remove("nav-open");
  });

  function syncSidebar(path) {
    sidebarNav.querySelectorAll(".nav-link.active").forEach((a) => a.classList.remove("active"));
    const item = sidebarNav.querySelector(`.nav-item[data-path="${CSS.escape(path)}"]`);
    if (!item) return;
    item.querySelector(":scope > .nav-row > .nav-link").classList.add("active");
    for (let el = item; el; el = el.parentElement.closest(".nav-item")) el.classList.add("open");
    const link = item.querySelector(".nav-link"), box = $("#sidebar"), r = link.getBoundingClientRect(), b = box.getBoundingClientRect();
    if (r.top < b.top || r.bottom > b.bottom) link.scrollIntoView({ block: "center" });
  }

  /* ---------- markdown ---------- */
  const ICONS = {
    note: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
    tip: '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.4 1 1.1 1 1.8V16h5v-.3c0-.7.4-1.4 1-1.8A6 6 0 0 0 12 3z"/>',
    warning: '<path d="M12 3 2 20h20L12 3z"/><path d="M12 10v4M12 17h.01"/>',
    danger: '<circle cx="12" cy="12" r="9"/><path d="m15 9-6 6M9 9l6 6"/>',
  };
  const renderer = new marked.Renderer();
  renderer.code = function (code, lang) {
    if (typeof code === "object") { lang = code.lang; code = code.text; }   // marked >= 13 signature
    if (lang === "cards") {
      const cards = code.split("\n").map((l) => l.trim()).filter(Boolean).map((l) => {
        const [title, desc, href] = l.split("|").map((x) => (x || "").trim());
        const target = byPath[(href || "").replace(/^#\//, "")];
        const icon = target && target.icon ? `<i class="card-icon">${target.icon}</i>` : "";
        return `<a class="card" href="${esc(href || "#")}">${icon}<b>${esc(title)}</b>${desc ? `<span>${esc(desc)}</span>` : ""}</a>`;
      });
      return `<div class="cards">${cards.join("")}</div>`;
    }
    if (lang === "timeline") return renderTimeline(code);
    if (lang === "mermaid") return `<div class="mermaid-wrap"><div class="mermaid" data-src="${esc(code)}">${esc(code)}</div></div>`;
    let body = esc(code);
    if (window.hljs && lang && hljs.getLanguage(lang)) body = hljs.highlight(code, { language: lang }).value;
    return `<pre><code class="hljs${lang ? " language-" + esc(lang) : ""}">${body}</code></pre>`;
  };
  marked.use({ renderer, gfm: true });

  /* ---------- milestone timeline (```timeline blocks) ----------
     Columns are the gaps between milestones, all the same width.
       @ 2026-11-23 | Funding | optional goal     milestone (a vertical line)
       # Group                                    group header row
       ## Row name | route                        row; label links to #/route
       done | line one / line two                 one cell per interval, in order
       + done | Phase / dates                     another block in the same interval: blocks stack as phases
     Cell status: done | active | planned | - (empty). See content/timeline.md. */
  const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const TL_STATUS = { done: "Done", active: "In progress", planned: "Planned" };
  const DAY = 864e5;
  function renderTimeline(src) {
    const ms = [], body = [];
    let row = null;
    for (const raw of src.split("\n")) {
      const l = raw.trim();
      if (!l) continue;
      if (l[0] === "@") {
        const [d, label, goal] = l.slice(1).split("|").map((s) => s.trim());
        const m = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(d);
        if (m) ms.push({ date: new Date(+m[1], m[2] - 1, +m[3]), label: label || "", goal: goal || "" });
      } else if (l.startsWith("##")) {
        const [name, route] = l.slice(2).split("|").map((s) => s.trim());
        body.push((row = { name, route: (route || "").replace(/^#?\/?/, ""), cells: [] }));
      } else if (l[0] === "#") {
        body.push({ group: l.slice(1).trim() });
        row = null;
      } else if (row) {
        const more = l[0] === "+" && row.cells.length;    // "+" adds a block to the previous interval
        const s = more ? l.slice(1).trim() : l, i = s.indexOf("|");
        const block = { status: (i < 0 ? s : s.slice(0, i)).trim().toLowerCase(), text: i < 0 ? "" : s.slice(i + 1).trim() };
        if (more) row.cells[row.cells.length - 1].push(block); else row.cells.push([block]);
      }
    }
    if (ms.length < 2) return `<pre><code>timeline: needs at least two "@ YYYY-MM-DD | label" lines</code></pre>`;
    ms.sort((a, b) => a.date - b.date);
    // machines: " / " separates several, one per line; pad every header to the same count so dates stay level
    ms.forEach((m) => { m.machines = m.goal ? m.goal.split(/\s+\/\s+/) : []; });
    const rows = Math.max(1, ...ms.map((m) => m.machines.length));

    const bare = !body.length;                           // milestones only: draw a track row instead of machine rows
    const noLabels = body.every((r) => r.group !== undefined || !r.name);   // no row names: drop the label column
    const n = ms.length - 1, end = (bare ? 1 : body.length) + 2;      // grid rows: 1 = header, 2.. = body
    const col = Array.from({ length: n + 1 }, (_, c) => c + 2);   // col[c] = grid column of interval c; col[n] = one past the end
    const at = (i) => (i < n ? `grid-column:${col[i]}` : `grid-column:${col[n] - 1}`);
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const first = ms[0].date, last = ms[n].date;
    let html = "", prevYear = null;

    ms.forEach((m, i) => {
      const y = m.date.getFullYear();
      const date = `${MON[m.date.getMonth()]} ${m.date.getDate()}${y !== prevYear ? ", " + y : ""}`;
      prevYear = y;
      const iso = `${y}-${String(m.date.getMonth() + 1).padStart(2, "0")}-${String(m.date.getDate()).padStart(2, "0")}`;
      const cls = (i === 0 ? " is-first" : "") + (i === n ? " is-end" : "");
      // header, top to bottom: process ("Patterning"), machines, date
      html += `<div class="tl-ms${cls}" style="grid-row:1;${at(i)}">` +
        (m.label ? `<b>${esc(m.label)}</b>` : "") +
        Array.from({ length: rows }, (_, k) => `<span>${m.machines[k] ? esc(m.machines[k]) : "&nbsp;"}</span>`).join("") +
        `<time datetime="${iso}">${esc(date)}</time></div>`;
      html += `<div class="tl-line${cls}" style="grid-row:1 / ${end};${at(i)}" aria-hidden="true"></div>`;
    });

    if (today >= first && today <= last) {
      let k = ms.findIndex((m, i) => i < n && today < ms[i + 1].date);
      if (k < 0) k = n - 1;
      const f = (today - ms[k].date) / (ms[k + 1].date - ms[k].date);
      html += `<div class="tl-today" style="grid-row:2 / ${end};grid-column:${col[k]} / ${col[k + 1]};left:${(f * 100).toFixed(3)}%"><span>Today</span></div>`;
    }

    if (bare) html += `<div class="tl-track" style="grid-row:2;grid-column:2 / ${col[n]}" aria-hidden="true"></div>`;

    body.forEach((r, ri) => {
      const gr = `grid-row:${ri + 2}`;
      if (r.group !== undefined) { html += `<div class="tl-group" style="${gr};grid-column:1 / -1"><span>${esc(r.group)}</span></div>`; return; }
      // hairline between two machines in the same category
      if (ri > 0 && body[ri - 1].group === undefined) html += `<div class="tl-sep" style="${gr};grid-column:1 / -1" aria-hidden="true"></div>`;
      if (r.name) html += `<div class="tl-label" style="${gr};grid-column:1">` +
        (r.route ? `<a href="#/${esc(r.route)}">${esc(r.name)}</a>` : `<span>${esc(r.name)}</span>`) + `</div>`;
      const tag = r.route ? "a" : "div", href = r.route ? ` href="#/${esc(r.route)}"` : "";   // cells link to the machine's page
      const phased = r.cells.some((cell) => cell.length > 1);
      for (let c = 0; c < n; c++) {
        const blocks = (r.cells[c] || []).filter((b) => TL_STATUS[b.status] && b.text);   // "-" or no text: nothing drawn, so there is no empty box to click
        if (!blocks.length) continue;
        const pos = `${gr};grid-column:${col[c]}`;
        if (blocks.length === 1 && !phased) {   // rows that use phases anywhere draw every block as a phase
          const parts = blocks[0].text ? blocks[0].text.split(/\s+\/\s+/) : [];
          const lines = parts.length > 2 ? [parts[0], parts.slice(1).join(" / ")] : parts;
          html += `<${tag} class="tl-cell s-${blocks[0].status}"${href} style="${pos}" title="${TL_STATUS[blocks[0].status]}">` +
            lines.map((t) => `<span>${esc(t)}</span>`).join("") + `</${tag}>`;
          continue;
        }
        // several blocks in one interval ("+" lines): phases stacked in the column, "name / dates" on one line each
        html += `<div class="tl-stack" style="${pos}">` + blocks.map((b) => {
          const [name, when] = b.text.split(/\s+\/\s+/);
          return `<${tag} class="tl-phase s-${b.status}"${href} title="${TL_STATUS[b.status]}"><b>${esc(name || "")}</b>${when ? `<span>${esc(when)}</span>` : ""}</${tag}>`;
        }).join("") + `</div>`;
      }
    });

    const legend = Object.entries(TL_STATUS).map(([k, v]) => `<span><i class="s-${k}"></i>${v}</span>`).join("");
    const showLegend = false;   // no Done / In progress / Planned legend
    const tracks = `repeat(${n}, minmax(var(--tl-col), 1fr))`;
    return `<div class="tl${bare ? " tl-bare" : ""}">${showLegend ? `<div class="tl-legend">${legend}</div>` : ""}<div class="tl-scroll">` +
      `<div class="tl-grid" style="grid-template-columns:${noLabels ? "calc(var(--tl-lw) / 2)" : "var(--tl-label)"} ${tracks}">${html}</div></div></div>`;
  }

  /* ---------- mermaid diagrams (```mermaid blocks) ----------
     Loaded only on pages that have a diagram. v11+ is needed for gantt
     compact mode and `vert` lines. securityLevel "loose" lets
     `click <id> href "..."` lines work. Re-renders on theme toggle. */
  const MERMAID_URL = "https://cdn.jsdelivr.net/npm/mermaid@11.17.2/dist/mermaid.esm.min.mjs";
  let mermaidLib = null;
  async function renderMermaid(root) {
    const nodes = [...root.querySelectorAll(".mermaid[data-src]")];
    if (!nodes.length) return;
    try {
      mermaidLib = mermaidLib || (await import(MERMAID_URL)).default;
      const dark = document.documentElement.dataset.theme === "dark";
      mermaidLib.initialize({ startOnLoad: false, securityLevel: "loose", theme: dark ? "dark" : "default", fontFamily: "IBM Plex Sans, sans-serif" });
      nodes.forEach((n) => { n.removeAttribute("data-processed"); n.textContent = n.dataset.src; });
      await mermaidLib.run({ nodes });
    } catch (e) {
      console.error("[docs] mermaid render failed", e);
    }
  }
  new MutationObserver(() => renderMermaid($("#doc"))).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

  function enhance(doc, file) {
    // lead paragraph
    const h1 = doc.querySelector("h1");
    if (h1 && h1.nextElementSibling && h1.nextElementSibling.tagName === "P") h1.nextElementSibling.classList.add("lead");
    const me = byPath[current];
    if (h1 && me && me.icon) h1.insertAdjacentHTML("afterbegin", `<span class="h1-icon">${me.icon}</span>`);

    // callouts: > [!NOTE] ...   and   > [!STATUS] In progress
    doc.querySelectorAll("blockquote").forEach((bq) => {
      const p = bq.firstElementChild;
      const m = p && p.tagName === "P" && p.innerHTML.match(/^\[!(NOTE|TIP|WARNING|DANGER|STATUS)\]\s*/i);
      if (!m) return;
      const kind = m[1].toLowerCase();
      p.innerHTML = p.innerHTML.slice(m[0].length);
      if (kind === "status") {
        const label = p.textContent.trim() || "Unknown";
        const s = document.createElement("div");
        s.className = "status s-" + slug(label);
        s.textContent = label;
        bq.replaceWith(s);
        return;
      }
      if (!p.innerHTML.trim()) p.remove();
      const box = document.createElement("div");
      box.className = "hint hint-" + kind;
      box.innerHTML = `<svg class="hint-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${ICONS[kind]}</svg>` +
        `<div class="hint-body"><span class="hint-title">${kind}</span>${bq.innerHTML}</div>`;
      bq.replaceWith(box);
    });

    // heading ids + anchors
    const seen = {};
    doc.querySelectorAll("h2, h3, h4").forEach((h) => {
      let id = slug(h.textContent) || "section";
      if (seen[id]) id += "-" + seen[id]++; else seen[id] = 1;
      h.id = id;
      const a = document.createElement("a");
      a.className = "anchor"; a.href = `#/${current}#${id}`; a.textContent = "#"; a.setAttribute("aria-hidden", "true");
      h.appendChild(a);
    });

    // tables scroll inside a frame
    doc.querySelectorAll("table").forEach((t) => {
      const w = document.createElement("div"); w.className = "table-wrap";
      t.replaceWith(w); w.appendChild(t);
    });

    // copy buttons
    doc.querySelectorAll("pre").forEach((pre) => {
      const b = document.createElement("button");
      b.className = "copy-btn"; b.textContent = "Copy";
      b.onclick = () => {
        const text = pre.querySelector("code").innerText;
        (navigator.clipboard ? navigator.clipboard.writeText(text) : Promise.reject()).then(
          () => { b.textContent = "Copied"; setTimeout(() => (b.textContent = "Copy"), 1200); }, () => {});
      };
      pre.appendChild(b);
    });

    // relative images / links resolve against the .md file's folder
    const base = "content/" + file.replace(/[^/]*$/, "");
    doc.querySelectorAll("img[src]").forEach((img) => {
      const s = img.getAttribute("src");
      if (!/^([a-z]+:|\/|#|data:)/i.test(s)) img.src = base + s;
    });
    doc.querySelectorAll("a[href]").forEach((a) => {
      const h = a.getAttribute("href");
      if (/^https?:/i.test(h)) { a.target = "_blank"; a.rel = "noopener"; }
    });
  }

  /* ---------- loading pages ---------- */
  const cache = {};
  async function fetchPage(path) {
    if (cache[path]) return cache[path];
    const tries = byPath[path] && byPath[path].dir ? [`${path}/index.md`, `${path}.md`] : [`${path}.md`, `${path}/index.md`];
    for (const f of tries) {
      try {
        const r = await fetch("content/" + f, { cache: "no-cache" });
        if (r.ok) return (cache[path] = { file: f, md: await r.text() });
      } catch (e) { /* try next */ }
    }
    return null;
  }

  /* ---------- outline (right rail) ---------- */
  let spy = null;
  function buildToc(doc) {
    const toc = $("#toc");
    const hs = [...doc.querySelectorAll("h2, h3")];
    if (spy) spy.disconnect();
    if (hs.length < 2) { toc.innerHTML = ""; return; }
    toc.innerHTML = `<p class="toc-title">On this page</p><nav>${hs.map((h) =>
      `<a class="${h.tagName.toLowerCase()}" href="#/${current}#${h.id}" data-id="${h.id}">${esc(h.firstChild.textContent)}</a>`).join("")}</nav>`;
    const links = Object.fromEntries([...toc.querySelectorAll("a")].map((a) => [a.dataset.id, a]));
    spy = new IntersectionObserver((entries) => {
      const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (!vis) return;
      toc.querySelectorAll("a.active").forEach((a) => a.classList.remove("active"));
      links[vis.target.id] && links[vis.target.id].classList.add("active");
    }, { rootMargin: "-72px 0px -70% 0px" });
    hs.forEach((h) => spy.observe(h));
  }

  /* ---------- crumbs + pager ---------- */
  function renderChrome(path, file) {
    const p = byPath[path];
    $("#crumbs").innerHTML = p ? p.trail.map((t) => (t.path ? `<a href="#/${esc(t.path)}">${esc(t.title)}</a>` : `<span>${esc(t.title)}</span>`))
      .join('<span class="sep">/</span>') : "";
    const i = pages.findIndex((x) => x.path === path);
    const prev = i > 0 ? pages[i - 1] : null, next = i >= 0 && i < pages.length - 1 ? pages[i + 1] : null;
    $("#pager").innerHTML =
      (prev ? `<a class="prev" href="#/${esc(prev.path)}"><span class="arrow">‹</span><div><small>Previous</small><b>${esc(prev.title)}</b></div></a>` : "") +
      (next ? `<a class="next" href="#/${esc(next.path)}"><div><small>Next</small><b>${esc(next.title)}</b></div><span class="arrow">›</span></a>` : "");
    $("#page-meta").innerHTML = file
      ? `<a href="${REPO_EDIT}${esc(file)}" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>Edit on GitHub</a>`
      : "";
  }

  /* ---------- router ---------- */
  let current = HOME;
  function parseHash() {
    const h = decodeURIComponent(location.hash.replace(/^#\/?/, ""));
    const [path, anchor] = h.split("#");
    return { path: (path || HOME).replace(/\/+$/, ""), anchor };
  }
  async function route() {
    const { path, anchor } = parseHash();
    if (path === current && $("#doc").dataset.loaded === path) { scrollToAnchor(anchor); return; }
    current = path;
    const doc = $("#doc");
    doc.dataset.loaded = "";
    let page = await fetchPage(path);
    let file = page && page.file;
    if (!page) page = (await fetchPage("404")) || { md: "# Page not found" };
    if (current !== path) return;   // a newer navigation won
    doc.innerHTML = marked.parse(page.md);
    enhance(doc, file || "404.md");
    doc.dataset.loaded = path;
    const h1 = doc.querySelector("h1");
    document.title = (h1 ? h1.textContent + " · " : "") + "UMN Hacker Fab Docs";
    syncSidebar(path);
    renderChrome(path, file);
    buildToc(doc);
    renderMermaid(doc);
    if (anchor) scrollToAnchor(anchor); else window.scrollTo(0, 0);
  }
  function scrollToAnchor(id) {
    const el = id && document.getElementById(id);
    if (el) el.scrollIntoView();
  }
  window.addEventListener("hashchange", route);
  if (!location.hash) history.replaceState(null, "", "#/" + HOME);
  route();

  /* ---------- theme toggle (setTheme lives in index.html <head>) ---------- */
  $("#theme-btn").addEventListener("click", () =>
    window.setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark", true));

  /* ---------- mobile nav ---------- */
  $("#menu-btn").addEventListener("click", () => document.body.classList.toggle("nav-open"));
  $("#scrim").addEventListener("click", () => document.body.classList.remove("nav-open"));

  /* ---------- search ---------- */
  const modal = $("#search-modal"), input = $("#search-input"), results = $("#search-results");
  let index = null, focusIdx = 0;
  async function buildIndex() {
    if (index) return index;
    index = await Promise.all(pages.map(async (p) => {
      const pg = await fetchPage(p.path);
      const md = pg ? pg.md : "";
      const text = md.replace(/```[\s\S]*?```/g, " ").replace(/[#>*_`|\[\]()-]/g, " ").replace(/\s+/g, " ").trim();
      const heads = (md.match(/^#{2,3} .+$/gm) || []).map((h) => h.replace(/^#+ /, ""));
      return { ...p, text, heads, crumb: p.trail.map((t) => t.title).join(" / ") };
    }));
    return index;
  }
  function openSearch() {
    modal.hidden = false; input.value = ""; results.innerHTML = ""; input.focus(); buildIndex();
  }
  function closeSearch() { modal.hidden = true; }
  const hl = (s, q) => esc(s).replace(new RegExp("(" + q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "ig"), "<mark>$1</mark>");
  async function runSearch() {
    const q = input.value.trim();
    if (!q) { results.innerHTML = ""; return; }
    const ql = q.toLowerCase(), idx = await buildIndex();
    const hits = idx.map((p) => {
      let score = 0, snip = "", href = p.path;
      if (p.title.toLowerCase().includes(ql)) score += 10;
      if (p.crumb.toLowerCase().includes(ql)) score += 3;
      const head = p.heads.find((h) => h.toLowerCase().includes(ql));
      if (head) { score += 4; snip = head; href = p.path + "#" + slug(head); }
      const at = p.text.toLowerCase().indexOf(ql);
      if (at >= 0) { score += 1; if (!snip) snip = (at > 40 ? "…" : "") + p.text.slice(Math.max(0, at - 40), at + 80); }
      return { p, score, snip, href };
    }).filter((h) => h.score).sort((a, b) => b.score - a.score).slice(0, 20);
    focusIdx = 0;
    results.innerHTML = hits.length ? hits.map((h, i) =>
      `<li class="${i === 0 ? "focus" : ""}"><a href="#/${esc(h.href)}"><span class="r-path">${esc(h.p.crumb)}</span>` +
      `<span class="r-title">${hl(h.p.title, q)}</span>${h.snip ? `<span class="r-snip">${hl(h.snip, q)}</span>` : ""}</a></li>`).join("")
      : `<li class="r-empty">No results for “${esc(q)}”</li>`;
  }
  input.addEventListener("input", runSearch);
  input.addEventListener("keydown", (e) => {
    const items = [...results.querySelectorAll("li a")];
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!items.length) return;
      focusIdx = (focusIdx + (e.key === "ArrowDown" ? 1 : -1) + items.length) % items.length;
      results.querySelectorAll("li").forEach((li, i) => li.classList.toggle("focus", i === focusIdx));
      items[focusIdx].scrollIntoView({ block: "nearest" });
    } else if (e.key === "Enter" && items[focusIdx]) {
      location.hash = items[focusIdx].getAttribute("href"); closeSearch();
    }
  });
  results.addEventListener("click", (e) => { if (e.target.closest("a")) closeSearch(); });
  modal.addEventListener("click", (e) => { if (e.target === modal) closeSearch(); });
  $("#search-btn").addEventListener("click", openSearch);
  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); modal.hidden ? openSearch() : closeSearch(); }
    else if (e.key === "/" && modal.hidden && !/input|textarea/i.test(document.activeElement.tagName)) { e.preventDefault(); openSearch(); }
    else if (e.key === "Escape" && !modal.hidden) closeSearch();
  });
})();
