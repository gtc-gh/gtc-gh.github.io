/* SATE-Bench project page: interactive Active-setting demo, full-resolution view zoom and BibTeX copy. */
(function () {
  "use strict";

  const MAX_TURN = 8;     // maximum number of observed views, as in the benchmark
  const LAMBDA = 0.1;     // step penalty of the exploration reward
  const examples = window.SATE_DEMO || [];

  const el = (id) => document.getElementById(id);
  const tabs = el("demo-tabs");
  const img = el("demo-image");
  const viewLabel = el("demo-viewlabel");
  const ring = el("demo-ring");
  const meter = el("demo-meter");
  const taskChip = el("demo-task");
  const questionEl = el("demo-question");
  const optionsEl = el("demo-options");
  const resultEl = el("demo-result");
  const leftBtn = el("move-left");
  const rightBtn = el("move-right");
  const resetBtn = el("demo-reset");

  let ex = null;     // current example
  let state = null;  // { view, path, answered }

  function reward(steps) {
    return Math.exp(-LAMBDA * steps);
  }

  function preload(example) {
    example.images.forEach((src) => { const i = new Image(); i.src = src; });
  }

  function renderTabs() {
    examples.forEach((e, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "demo-tab";
      b.setAttribute("role", "tab");
      if (e.kind === "teaser") b.classList.add("is-teaser");
      b.textContent = e.kind === "teaser" ? `★ ${e.tab}` : e.tab;
      b.title = e.kind === "teaser" ? "The scene shown in Figure 1" : `${e.task} · ${e.dataset}`;
      b.addEventListener("click", () => select(i));
      tabs.appendChild(b);
    });
  }

  function renderRing() {
    const n = ex.numViews;
    const visited = new Set(state.path);
    let svg = '<circle class="scene" cx="60" cy="60" r="24"></circle>';
    for (let k = 1; k <= n; k++) {
      const a = (-90 + (k - 1) * 360 / n) * Math.PI / 180;  // views are ordered clockwise from the top
      const x = 60 + 46 * Math.cos(a);
      const y = 60 + 46 * Math.sin(a);
      const cls = k === state.view ? "cam current" : visited.has(k) ? "cam visited" : "cam";
      svg += `<circle class="${cls}" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="9"><title>View ${k}</title></circle>` +
             `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}">${k}</text>`;
    }
    ring.innerHTML = svg;
    ring.setAttribute("aria-label", `Camera layout: currently at view ${state.view} of ${n}; visited ${[...visited].join(", ")}`);
  }

  function renderView() {
    const n = ex.numViews;
    img.src = ex.images[state.view - 1];
    img.alt = `View ${state.view} of ${n} of the ${ex.dataset} scene`;
    viewLabel.textContent = `View ${state.view} / ${n}`;
    renderRing();

    const steps = state.path.length;
    const budgetLeft = MAX_TURN - steps;
    meter.innerHTML = `Views observed: <b>${steps}</b> / ${MAX_TURN} · reward if correct now: <b>${reward(steps).toFixed(2)}</b>`;
    const canMove = !state.answered && budgetLeft > 0;
    leftBtn.disabled = !canMove;
    rightBtn.disabled = !canMove;
    if (!state.answered && budgetLeft === 0) {
      meter.innerHTML += " · <b>exploration budget used, please answer</b>";
    }
    if (lbMode === "demo" && !lightbox.hidden) showDemoView();  // moved from inside the viewer
  }

  function renderQuestion() {
    taskChip.textContent = ex.kind === "teaser"
      ? "Figure 1 scene"
      : `${ex.task} · ${ex.dataset}`;
    questionEl.textContent = ex.question;
    optionsEl.innerHTML = "";
    Object.entries(ex.options).forEach(([letter, text]) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "option";
      b.dataset.letter = letter;
      b.innerHTML = `<b>${letter}</b><span></span>`;
      b.querySelector("span").textContent = text;
      b.addEventListener("click", () => answer(letter));
      optionsEl.appendChild(b);
    });
    resultEl.hidden = true;
    resultEl.innerHTML = "";
  }

  function move(direction) {
    if (state.answered || state.path.length >= MAX_TURN) return;
    const n = ex.numViews;
    // X: adjacent left (clockwise) = next view; Y: adjacent right (counter-clockwise) = previous view.
    state.view = direction === "X" ? (state.view % n) + 1 : ((state.view - 2 + n) % n) + 1;
    state.path.push(state.view);
    renderView();
  }

  function describeModel(m) {
    const steps = m.views.length;
    const path = `${steps === 1 ? "view" : "views"} ${m.views.join(" → ")}`;
    if (!m.answer) {
      return { path: `${path} · explored ${steps} views without giving an answer`, ok: m.correct };
    }
    const how = steps === 1 ? "from the initial view" : `after ${steps} views`;
    return { path: `${path} · answered ${m.answer} ${how}`, ok: m.correct };
  }

  function answer(letter) {
    if (state.answered) return;
    state.answered = true;
    const steps = state.path.length;
    const correct = letter === ex.answer;

    optionsEl.querySelectorAll(".option").forEach((b) => {
      b.disabled = true;
      if (b.dataset.letter === ex.answer) b.classList.add("correct");
      else if (b.dataset.letter === letter) b.classList.add("wrong");
    });

    const r = correct ? reward(steps) : 0;
    let comparison;
    if (ex.kind === "teaser") {
      const ref = ex.reference;
      comparison = `<p><b>In Figure 1</b>, the agent cannot see the person behind the TV, moves left twice ` +
        `(views ${ref.views.join(" → ")}), finds the woman with the book on the bed and answers ` +
        `${ex.options[ref.answer]} after ${ref.views.length} views (reward ${reward(ref.views.length).toFixed(2)}).</p>`;
    } else {
      comparison = `<p><b>What the models did</b> (recorded in our evaluation):</p><ul class="models">${modelList()}</ul>`;
    }

    resultEl.innerHTML =
      `<p class="verdict ${correct ? "good" : "bad"}">${correct ? "Correct!" : `Not quite: the answer is ${ex.answer}.`}</p>` +
      `<p>You observed ${steps} view${steps > 1 ? "s" : ""} (${state.path.join(" → ")}) · reward e<sup>−0.1×${steps}</sup> × ${correct ? 1 : 0} = <b>${r.toFixed(2)}</b></p>` +
      comparison;
    resultEl.hidden = false;
    renderView();
  }

  function modelList() {
    return ex.models.map((m) => {
      const d = describeModel(m);
      return `<li><span class="name">${m.name}</span><span class="tag ${d.ok ? "good" : "bad"}">${d.ok ? "correct" : "wrong"}</span>` +
             `<span class="path">${d.path}</span></li>`;
    }).join("");
  }

  function reset() {
    state = { view: ex.initView, path: [ex.initView], answered: false };
    renderQuestion();
    renderView();
  }

  function select(i) {
    ex = examples[i];
    [...tabs.children].forEach((t, j) => t.setAttribute("aria-selected", String(i === j)));
    const t = tabs.children[i];  // scroll only the selector row (never the page) on phones
    tabs.scrollTo({ left: t.offsetLeft - tabs.offsetLeft - (tabs.clientWidth - t.clientWidth) / 2, behavior: "smooth" });
    preload(ex);
    reset();
  }

  function demoInView() {  // any part of the demo section is on screen
    const r = el("demo").getBoundingClientRect();
    const h = window.innerHeight || document.documentElement.clientHeight;
    return r.top < h && r.bottom > 0;
  }

  /* ---------------- Full-resolution viewer (demo views and failure-case figures) ---------------- */
  const lightbox = el("lightbox");
  const stage = el("lightbox-stage");
  const lbImg = el("lightbox-image");
  const lbLabel = el("lightbox-label");
  const lbScale = el("lightbox-scale");
  const lbHint = el("lightbox-hint");
  const lbMoves = [...document.querySelectorAll(".lightbox-move")];
  const zoomBtn = el("demo-zoom");
  const MIN_SCALE = 1;
  const MAX_SCALE = 6;
  let zoom = { s: 1, x: 0, y: 0 };
  let lbMode = null;           // "demo": the current demo view, with moves; "figure": a static figure
  let lbReturnFocus = null;    // element that gets the focus back when the viewer closes
  const pointers = new Map();  // active pointers on the stage (two of them = pinch)
  let gesture = null;          // { kind: "pan" | "pinch", ... }
  let moved = false;
  let downOnImage = false;

  // The 1920-px version of every demo view sits next to it in an hd/ folder.
  const hdSource = (src) => src.replace(/([^/]+)$/, "hd/$1");

  function applyZoom() {
    // Keep the enlarged image covering the stage instead of drifting out of view.
    const maxX = (zoom.s - 1) * lbImg.offsetWidth / 2;
    const maxY = (zoom.s - 1) * lbImg.offsetHeight / 2;
    zoom.x = Math.max(-maxX, Math.min(maxX, zoom.x));
    zoom.y = Math.max(-maxY, Math.min(maxY, zoom.y));
    lbImg.style.transform = `translate(${zoom.x}px, ${zoom.y}px) scale(${zoom.s})`;
    lbScale.textContent = `${Math.round(zoom.s * 100)}%`;
  }

  // Zooms to scale s while keeping the image point under (clientX, clientY) in place.
  function zoomAt(clientX, clientY, s) {
    s = Math.max(MIN_SCALE, Math.min(MAX_SCALE, s));
    const r = stage.getBoundingClientRect();
    const px = clientX - (r.left + r.width / 2);
    const py = clientY - (r.top + r.height / 2);
    zoom.x = px - (s / zoom.s) * (px - zoom.x);
    zoom.y = py - (s / zoom.s) * (py - zoom.y);
    zoom.s = s;
    applyZoom();
  }

  function zoomCenter(s) {
    const r = stage.getBoundingClientRect();
    zoomAt(r.left + r.width / 2, r.top + r.height / 2, s);
  }

  // Shows the current demo view; moving keeps the zoom level so the same region can be compared.
  function showDemoView() {
    const src = img.getAttribute("src");
    lbImg.src = src;  // the cached preview appears at once; the sharper version replaces it when loaded
    lbImg.alt = img.alt;
    const steps = state.path.length;
    lbLabel.textContent = `View ${state.view} / ${ex.numViews} · ${steps} / ${MAX_TURN} views observed`;
    const canMove = !state.answered && steps < MAX_TURN;
    lbMoves.forEach((b) => { b.disabled = !canMove; });
    const hd = new Image();
    hd.onload = () => { if (lbMode === "demo" && !lightbox.hidden && img.getAttribute("src") === src) lbImg.src = hd.src; };
    hd.src = hdSource(src);
  }

  function openLightbox(mode, returnFocus) {
    lbMode = mode;
    lbReturnFocus = returnFocus;
    zoom = { s: 1, x: 0, y: 0 };
    lightbox.classList.toggle("is-demo", mode === "demo");
    lbHint.textContent = mode === "demo"
      ? "← → move to the adjacent view (counts as a view) · scroll or pinch to zoom · drag to pan · Esc to close"
      : "Scroll or pinch to zoom · drag to pan · double-click to zoom in · Esc to close";
    lightbox.hidden = false;
    document.body.classList.add("lightbox-open");
    applyZoom();
    el("lightbox-close").focus();
  }

  function openDemoView() {
    if (!img.getAttribute("src")) return;
    lbMode = "demo";
    showDemoView();
    openLightbox("demo", zoomBtn);
  }

  function openFigure(button) {
    const figImg = button.querySelector("img");
    lbMode = "figure";
    lbImg.src = figImg.currentSrc || figImg.src;
    lbImg.alt = figImg.alt;
    lbLabel.textContent = button.dataset.label || "";
    openLightbox("figure", button);
  }

  function closeLightbox() {
    lightbox.hidden = true;
    document.body.classList.remove("lightbox-open");
    pointers.clear();
    gesture = null;
    if (lbReturnFocus) lbReturnFocus.focus();
  }

  const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

  function startGesture() {
    const [a, b] = [...pointers.values()];
    gesture = b
      ? { kind: "pinch", d: distance(a, b), s: zoom.s }
      : { kind: "pan", x: a.x, y: a.y, zx: zoom.x, zy: zoom.y };
  }

  if (lightbox && zoomBtn) {
    zoomBtn.addEventListener("click", openDemoView);
    img.addEventListener("click", openDemoView);
    el("hint-zoom").addEventListener("click", openDemoView);
    document.querySelectorAll(".case-zoom").forEach((b) => b.addEventListener("click", () => openFigure(b)));
    lbMoves.forEach((b) => b.addEventListener("click", () => move(b.dataset.move)));
    el("lightbox-close").addEventListener("click", closeLightbox);
    lightbox.querySelectorAll("[data-zoom]").forEach((b) => b.addEventListener("click", () => {
      const k = b.dataset.zoom;
      if (k === "fit") { zoom = { s: 1, x: 0, y: 0 }; applyZoom(); }
      else zoomCenter(zoom.s * (k === "in" ? 1.5 : 1 / 1.5));
    }));

    stage.addEventListener("wheel", (e) => {
      e.preventDefault();
      zoomAt(e.clientX, e.clientY, zoom.s * Math.exp(-e.deltaY * 0.0015));
    }, { passive: false });

    stage.addEventListener("dblclick", (e) => {
      if (zoom.s < 1.5) zoomAt(e.clientX, e.clientY, 2.5);
      else { zoom = { s: 1, x: 0, y: 0 }; applyZoom(); }
    });

    stage.addEventListener("pointerdown", (e) => {
      stage.setPointerCapture(e.pointerId);
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pointers.size === 1) { moved = false; downOnImage = e.target === lbImg; }
      startGesture();
      stage.classList.add("is-dragging");
    });

    stage.addEventListener("pointermove", (e) => {
      if (!pointers.has(e.pointerId) || !gesture) return;
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      const [a, b] = [...pointers.values()];
      if (gesture.kind === "pinch" && b) {
        zoomAt((a.x + b.x) / 2, (a.y + b.y) / 2, gesture.s * distance(a, b) / gesture.d);
        moved = true;
      } else if (gesture.kind === "pan") {
        const dx = a.x - gesture.x, dy = a.y - gesture.y;
        if (Math.abs(dx) + Math.abs(dy) > 3) moved = true;
        zoom.x = gesture.zx + dx;
        zoom.y = gesture.zy + dy;
        applyZoom();
      }
    });

    const endPointer = (e) => {
      if (!pointers.delete(e.pointerId)) return;
      if (pointers.size) { startGesture(); return; }
      gesture = null;
      stage.classList.remove("is-dragging");
      // A plain click on the dark background (not on the image) closes the viewer.
      if (!moved && !downOnImage && e.type === "pointerup") closeLightbox();
    };
    stage.addEventListener("pointerup", endPointer);
    stage.addEventListener("pointercancel", endPointer);

    // Listen on the document: after dragging the image, focus is no longer inside the dialog.
    document.addEventListener("keydown", (e) => {
      if (lightbox.hidden) return;
      if (e.key === "Escape") { closeLightbox(); e.preventDefault(); }
      if (e.key === "+" || e.key === "=") { zoomCenter(zoom.s * 1.5); e.preventDefault(); }
      if (e.key === "-") { zoomCenter(zoom.s / 1.5); e.preventDefault(); }
      if (lbMode === "demo" && (e.key === "ArrowLeft" || e.key === "ArrowRight")) {
        move(e.key === "ArrowLeft" ? "X" : "Y");
        e.preventDefault();
      }
      if (e.key === "Tab") {  // keep keyboard focus inside the dialog
        const items = [...lightbox.querySelectorAll("button")].filter((b) => b.offsetParent !== null && !b.disabled);
        const i = items.indexOf(document.activeElement);
        const next = e.shiftKey ? (i <= 0 ? items.length - 1 : i - 1) : (i + 1) % items.length;
        items[next].focus();
        e.preventDefault();
      }
    });
    window.addEventListener("resize", () => { if (!lightbox.hidden) applyZoom(); });
  }

  if (examples.length && tabs) {
    renderTabs();
    leftBtn.addEventListener("click", () => move("X"));
    rightBtn.addEventListener("click", () => move("Y"));
    resetBtn.addEventListener("click", reset);
    document.addEventListener("keydown", (e) => {
      if (e.altKey || e.ctrlKey || e.metaKey || !demoInView() || !lightbox.hidden) return;
      if (e.key === "ArrowLeft") { move("X"); e.preventDefault(); }
      if (e.key === "ArrowRight") { move("Y"); e.preventDefault(); }
    });
    select(0);
  }

  /* ---------------- Keep at least two words on the last line of a paragraph ---------------- */
  // text-wrap: pretty usually avoids a lone last word, but not at every width; joining the last two
  // words with a no-break space guarantees it.
  document.querySelectorAll(".lead, figcaption, .cap-line, .card p, .table-note, .abstract p, .hint, .ack, .case-body p, .case-quote")
    .forEach((p) => {
      const walker = document.createTreeWalker(p, NodeFilter.SHOW_TEXT);
      let last = null;
      for (let n; (n = walker.nextNode());) if (n.data.trim()) last = n;
      if (!last) return;
      const text = last.data.trimEnd();
      const i = text.lastIndexOf(" ");
      if (i > 0) last.data = text.slice(0, i) + " " + text.slice(i + 1) + last.data.slice(text.length);
    });

  /* ---------------- Failure-case selector ---------------- */
  const caseTabs = [...document.querySelectorAll(".case-tab")];
  caseTabs.forEach((tab) => tab.addEventListener("click", () => {
    caseTabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute("aria-selected", String(on));
      el(t.getAttribute("aria-controls")).hidden = !on;
    });
  }));

  /* ---------------- Highlight the current section in the top navigation ---------------- */
  const navLinks = [...document.querySelectorAll(".topnav-links a")];
  const sections = navLinks.map((a) => document.querySelector(a.getAttribute("href"))).filter(Boolean);
  if ("IntersectionObserver" in window && sections.length) {
    const visible = new Map();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((en) => visible.set(en.target.id, en.isIntersecting ? en.intersectionRatio : 0));
      let best = null;
      sections.forEach((sec) => { if ((visible.get(sec.id) || 0) > 0 && best === null) best = sec.id; });
      navLinks.forEach((a) => a.classList.toggle("is-active", best !== null && a.getAttribute("href") === `#${best}`));
    }, { rootMargin: "-60px 0px -55% 0px", threshold: [0, 0.01] });
    sections.forEach((sec) => observer.observe(sec));
  }

  /* ---------------- BibTeX copy ---------------- */
  const copyBtn = el("copy-bibtex");
  if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
      const text = el("bibtex-text").textContent;
      try {
        await navigator.clipboard.writeText(text);
        copyBtn.textContent = "Copied!";
      } catch (err) {
        const range = document.createRange();
        range.selectNodeContents(el("bibtex-text"));
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        copyBtn.textContent = "Press Ctrl+C";
      }
      setTimeout(() => { copyBtn.textContent = "Copy"; }, 1600);
    });
  }
})();
