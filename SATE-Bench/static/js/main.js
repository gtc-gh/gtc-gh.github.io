/* SATE-Bench project page: interactive Active-setting demo and BibTeX copy. */
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
  }

  function renderQuestion() {
    taskChip.textContent = ex.kind === "teaser"
      ? `Figure 1 scene · ${ex.dataset} (illustration, not a benchmark question)`
      : `${ex.task} · ${ex.dataset} · Active question #${ex.index}`;
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

  function demoInView() {
    const r = el("demo").getBoundingClientRect();
    return r.top < window.innerHeight * 0.75 && r.bottom > window.innerHeight * 0.25;
  }

  if (examples.length && tabs) {
    renderTabs();
    leftBtn.addEventListener("click", () => move("X"));
    rightBtn.addEventListener("click", () => move("Y"));
    resetBtn.addEventListener("click", reset);
    document.addEventListener("keydown", (e) => {
      if (e.altKey || e.ctrlKey || e.metaKey || !demoInView()) return;
      if (e.key === "ArrowLeft") { move("X"); e.preventDefault(); }
      if (e.key === "ArrowRight") { move("Y"); e.preventDefault(); }
    });
    select(0);
  }

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
