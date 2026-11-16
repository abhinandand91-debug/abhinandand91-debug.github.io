/* ═══════════════════════════════════════════════════════════
   Game layer: XP + achievements, quest log, frame-drop mini-game,
   console, character sheet / skill nodes, arcade.
   Progress is saved in this visitor's browser only.
   ═══════════════════════════════════════════════════════════ */
(() => {
  const C = window.CONTENT;
  const $ = (s) => document.querySelector(s);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ── save state ── */
  const KEY = "pf-game-v1";
  const fresh = () => ({ xp: 0, ach: {}, seen: {}, skills: {}, best: 0 });
  let S = fresh();
  try { S = Object.assign(fresh(), JSON.parse(localStorage.getItem(KEY)) || {}); } catch (e) {}
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} };

  /* ── achievements ── */
  const ACH = {
    joined:     { name: "Player Joined",     desc: "Loaded the portfolio",               xp: 10 },
    explorer:   { name: "Explorer",          desc: "Visited every section",              xp: 50 },
    scout:      { name: "Scout",             desc: "Used a project filter",              xp: 20 },
    source:     { name: "Source Diver",      desc: "Opened a GitHub repo",               xp: 20 },
    playerone:  { name: "Player One",        desc: "Opened a game on itch.io",           xp: 30 },
    arcade:     { name: "Insert Coin",       desc: "Played a game in the arcade",        xp: 40 },
    framefixer: { name: "Frame Fixer",       desc: "Played the frame-drop mini-game",    xp: 30 },
    smooth:     { name: "Butter Smooth",     desc: "Got an S rank in the mini-game",     xp: 80 },
    skills:     { name: "Skill Collector",   desc: "Inspected 8 skills",                 xp: 30 },
    hacker:     { name: "Hacker Voice",      desc: "Opened the console",                 xp: 30 },
    root:       { name: "Root Access",       desc: "Ran sudo hire",                      xp: 50 },
    loot:       { name: "Legendary Loot",    desc: "Downloaded the CV",                  xp: 40 },
    comms:      { name: "Comms Online",      desc: "Copied the email or opened mail",    xp: 40 },
    konami:     { name: "↑↑↓↓←→←→BA",        desc: "Entered the secret code",            xp: 60 },
    mainquest:  { name: "Quest Complete",    desc: "Finished the main quest",            xp: 100 },
  };
  const QUESTS = [
    { id: "projects", text: "Inspect the project archive", done: () => S.seen.projects },
    { id: "experience", text: "Read the experience log", done: () => S.seen.experience },
    { id: "cv", text: "Collect the legendary loot (CV)", done: () => S.ach.loot },
    { id: "contact", text: "Open a comms channel (email)", done: () => S.ach.comms },
  ];
  const TITLES = ["VISITOR", "SCOUT", "RECRUITER", "TALENT HUNTER", "HIRING MANAGER", "LEGEND"];
  const level = () => Math.min(TITLES.length, 1 + Math.floor(S.xp / 120));

  function unlock(id) {
    if (S.ach[id] || !ACH[id]) return;
    S.ach[id] = Date.now();
    const before = level();
    S.xp += ACH[id].xp;
    save();
    toast("ACHIEVEMENT UNLOCKED", ACH[id].name, ACH[id].desc, `+${ACH[id].xp} XP`);
    if (level() > before) setTimeout(() => toast("LEVEL UP", `LV ${level()} · ${TITLES[level() - 1]}`, "Keep exploring for more XP", "", "level"), 700);
    renderHud();
    checkQuests();
  }
  function checkQuests() {
    if (!S.ach.mainquest && QUESTS.every((q) => q.done())) setTimeout(() => unlock("mainquest"), 900);
  }

  /* ── HUD: XP bar, quest button, panel ── */
  function renderHud() {
    const lv = level();
    $("#xp-lv").textContent = `LV ${lv}`;
    $("#xp-title").textContent = TITLES[lv - 1];
    $("#xp-fill").style.width = lv >= TITLES.length ? "100%" : `${(S.xp % 120) / 1.2}%`;
    const xpEl = $("#xp");
    xpEl.classList.remove("bump"); void xpEl.offsetWidth; xpEl.classList.add("bump");
    const qd = QUESTS.filter((q) => q.done()).length;
    $("#quest-count").textContent = `${qd}/${QUESTS.length}`;
    $("#ach-count").textContent = `${Object.keys(S.ach).length}/${Object.keys(ACH).length}`;
    $("#quest-list").innerHTML = QUESTS.map((q) => `<li class="${q.done() ? "done" : ""}">${esc(q.text)}</li>`).join("");
    $("#ach-grid").innerHTML = Object.entries(ACH).map(([id, a]) => S.ach[id]
      ? `<div class="ach got"><b>${esc(a.name)}</b>${esc(a.desc)}</div>`
      : `<div class="ach"><b>???</b>${esc(a.desc)}</div>`).join("");
  }
  const panel = $("#quest-panel");
  const togglePanel = (open = panel.hidden) => { panel.hidden = !open; };
  $("#quest-btn").addEventListener("click", () => togglePanel());
  $("#xp").addEventListener("click", () => togglePanel(true));
  $("#qp-close").addEventListener("click", () => togglePanel(false));
  $("#qp-reset").addEventListener("click", () => { S = fresh(); save(); document.querySelectorAll(".skill.got").forEach((n) => n.classList.remove("got")); renderHud(); updateBest(); });

  /* ── toasts ── */
  function toast(kicker, title, sub, reward = "", cls = "") {
    const t = document.createElement("div");
    t.className = `toast ${cls}`;
    t.innerHTML = `<small>${esc(kicker)}</small>${reward ? `<em>${esc(reward)}</em>` : ""}<b>${esc(title)}</b><span>${esc(sub)}</span>`;
    $("#toasts").appendChild(t);
    setTimeout(() => { t.classList.add("out"); setTimeout(() => t.remove(), 300); }, 3200);
    $("#quest-btn").classList.remove("pulse"); void $("#quest-btn").offsetWidth; $("#quest-btn").classList.add("pulse");
  }

  /* ── triggers ── */
  document.addEventListener("click", (e) => {
    const a = e.target.closest("a, button");
    if (!a) return;
    const href = a.getAttribute("href") || "";
    if (a.classList.contains("cv-link")) unlock("loot");
    else if (a.id === "copy" || href.startsWith("mailto:")) unlock("comms");
    else if (href.includes("itch.io")) unlock("playerone");
    else if (href.includes("github.com")) unlock("source");
    else if (a.classList.contains("chip") || a.classList.contains("dir")) unlock("scout");
    if (a.classList.contains("cv-link") || a.id === "copy" || href.startsWith("mailto:")) renderHud();
  });

  const SECTIONS = ["profile", "projects", "experience", "stack", "education", "arcade", "contact"];
  const secIO = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    const id = e.target.id;
    if (!S.seen[id]) { S.seen[id] = true; save(); renderHud(); checkQuests(); }
    if (SECTIONS.every((s) => S.seen[s])) unlock("explorer");
  }), { threshold: 0.15 });
  SECTIONS.forEach((id) => { const el = document.getElementById(id); if (el) secIO.observe(el); });

  // konami
  const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
  let kPos = 0;
  addEventListener("keydown", (e) => {
    const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    kPos = k === KONAMI[kPos] ? kPos + 1 : k === KONAMI[0] ? 1 : 0;
    if (kPos === KONAMI.length) { kPos = 0; goldMode(); }
  });
  function goldMode() {
    document.body.classList.toggle("gold");
    unlock("konami");
    if (S.ach.konami) toast("CHEAT ENABLED", document.body.classList.contains("gold") ? "GOLD MODE ON" : "GOLD MODE OFF", "Enter the code again to switch back");
  }

  /* ══ 1. FRAME-DROP MINI-GAME (hero canvas) ══ */
  const cv = $("#uplink"), ctx = cv.getContext("2d"), box = $("#uplink-box"), overlay = $("#mg-overlay");
  const pts = [];
  for (let i = 0; i < 120; i++) {
    const u = Math.random() * Math.PI * 2, v = Math.acos(2 * Math.random() - 1);
    pts.push([Math.sin(v) * Math.cos(u), Math.cos(v), Math.sin(v) * Math.sin(u)]);
  }
  const graph = new Array(90).fill(16.6);
  const LABELS = ["GC SPIKE", "SHADOWS", "OVERDRAW", "DRAW CALLS", "SHADER COMPILE", "PHYSICS", "ASSET LOAD", "UI REBUILD", "THERMAL", "LIGHTMAPS"];
  const ROUND = 20;
  let mode = "idle", G = null, last = performance.now(), frames = 0, fpsT = last, W = 0, H = 0;

  function updateBest() { $("#mg-best").textContent = S.best ? `BEST SCORE ${S.best}` : ""; }
  updateBest();

  function startGame() {
    unlock("framefixer");
    G = { t: 0, spikes: [], fps: 60, fpsSum: 0, fpsN: 0, score: 0, combo: 0, maxCombo: 0, fixed: 0, missed: 0, spawn: 0.6, pops: [], flash: 0 };
    mode = "play";
    box.classList.add("playing");
    overlay.classList.add("hidden");
    $("#uplink-label").textContent = "MINI-GAME // FIX THE DROPS";
  }
  function endGame() {
    mode = "idle";
    box.classList.remove("playing");
    const avg = Math.round(G.fpsSum / Math.max(1, G.fpsN));
    const rank = avg >= 56 ? "S" : avg >= 48 ? "A" : avg >= 38 ? "B" : "C";
    const isBest = G.score > S.best;
    if (isBest) { S.best = G.score; save(); }
    $("#mg-result").innerHTML = `<span class="rank ${rank}">${rank}</span>AVG ${avg} FPS · SCORE ${G.score}${isBest ? " · NEW BEST" : ""}<br><span class="muted">FIXED ${G.fixed} · MISSED ${G.missed} · MAX COMBO x${G.maxCombo}</span>`;
    $("#mg-result").classList.add("show");
    $("#mg-play").textContent = "▶ PLAY AGAIN";
    $("#uplink-label").textContent = "UPLINK // LIVE";
    updateBest();
    overlay.classList.remove("hidden");
    if (rank === "S") unlock("smooth");
  }
  $("#mg-play").addEventListener("click", startGame);

  const baseY = () => H * 0.62;
  cv.addEventListener("pointerdown", (e) => {
    if (mode !== "play") return;
    e.preventDefault();
    const r = cv.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    let best = null, bd = 1e9;
    for (const s of G.spikes) {
      if (s.state !== "live") continue;
      const tipY = baseY() - s.h;
      const dx = Math.abs(s.x - x);
      if (dx < 34 && y > tipY - 40 && y < baseY() + 30 && dx < bd) { best = s; bd = dx; }
    }
    if (best) {
      best.state = "fixed"; best.fade = 1;
      G.combo++; G.maxCombo = Math.max(G.maxCombo, G.combo); G.fixed++;
      const pts = 10 + Math.min(G.combo, 10) * 2;
      G.score += pts;
      G.pops.push({ x: best.x, y: baseY() - best.h - 10, t: 1, txt: `+${pts}` });
    } else {
      G.combo = 0;
      G.pops.push({ x, y, t: 0.6, txt: "miss", bad: true });
    }
  });

  function stepGame(dt) {
    G.t += dt;
    const p = G.t / ROUND;
    G.spawn -= dt;
    if (G.spawn <= 0) {
      G.spikes.push({ x: W + 20, h: H * (0.14 + Math.random() * 0.26), label: LABELS[(Math.random() * LABELS.length) | 0], state: "live", fade: 1 });
      G.spawn = 0.95 - p * 0.5 + Math.random() * 0.25;
    }
    const speed = W * (0.2 + p * 0.17);
    for (const s of G.spikes) {
      s.x -= speed * dt;
      if (s.state === "fixed") s.fade -= dt * 4;
      if (s.state === "live" && s.x < 26) {
        s.state = "missed"; G.missed++; G.combo = 0; G.flash = 1;
        G.fps = Math.max(12, G.fps - (5 + (s.h / H) * 20));
      }
    }
    G.spikes = G.spikes.filter((s) => s.x > -40 && s.fade > 0);
    G.fps = Math.min(60, G.fps + dt * 3.5);
    G.fpsSum += G.fps; G.fpsN++;
    G.flash = Math.max(0, G.flash - dt * 2.5);
    G.pops.forEach((q) => { q.t -= dt; q.y -= dt * 30; });
    G.pops = G.pops.filter((q) => q.t > 0);
    if (G.t >= ROUND) endGame();
  }

  function drawGame() {
    const by = baseY();
    if (G.flash) { ctx.fillStyle = `rgba(255,80,80,${G.flash * 0.18})`; ctx.fillRect(0, 0, W, H); }
    // danger zone
    ctx.fillStyle = "rgba(255,107,107,.07)"; ctx.fillRect(0, 0, 26, H);
    ctx.strokeStyle = "rgba(255,107,107,.4)"; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(26, 0); ctx.lineTo(26, H); ctx.stroke(); ctx.setLineDash([]);
    // 16.6 ms line
    ctx.strokeStyle = "rgba(125,141,153,.3)"; ctx.setLineDash([3, 5]); ctx.beginPath(); ctx.moveTo(0, by); ctx.lineTo(W, by); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = "rgba(125,141,153,.7)"; ctx.font = "9px JetBrains Mono, monospace"; ctx.fillText("16.6 ms", W - 52, by + 14);
    // frame-time line with bumps
    ctx.beginPath();
    for (let x = 0; x <= W; x += 3) {
      let y = by + Math.sin((x + G.t * 300) * 0.08) * 1.5;
      for (const s of G.spikes) {
        const k = s.state === "fixed" ? Math.max(0, s.fade) : 1;
        const d = (x - s.x) / 14;
        y -= s.h * k * Math.exp(-d * d);
      }
      x ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    }
    ctx.strokeStyle = "#6ee7a8"; ctx.lineWidth = 1.6; ctx.stroke();
    // spike markers
    for (const s of G.spikes) {
      if (s.state === "fixed") continue;
      const ty = by - s.h;
      const live = s.state === "live";
      ctx.fillStyle = live ? "rgba(255,107,107,.95)" : "rgba(255,107,107,.35)";
      ctx.beginPath(); ctx.arc(s.x, ty, live ? 7 : 4, 0, Math.PI * 2); ctx.fill();
      if (live) {
        ctx.strokeStyle = "rgba(255,107,107,.5)"; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(s.x, ty, 12 + Math.sin(G.t * 10) * 2, 0, Math.PI * 2); ctx.stroke();
        ctx.fillStyle = "#ffb3b3"; ctx.font = "9px JetBrains Mono, monospace"; ctx.textAlign = "center";
        ctx.fillText(s.label, s.x, ty - 18); ctx.textAlign = "left";
      }
    }
    for (const q of G.pops) {
      ctx.globalAlpha = Math.max(0, q.t);
      ctx.fillStyle = q.bad ? "#ff8a8a" : "#9ff0f0"; ctx.font = "bold 13px JetBrains Mono, monospace"; ctx.textAlign = "center";
      ctx.fillText(q.txt, q.x, q.y); ctx.textAlign = "left"; ctx.globalAlpha = 1;
    }
    // HUD
    const fpsCol = G.fps > 50 ? "#6ee7a8" : G.fps > 35 ? "#f5c86b" : "#ff6b6b";
    ctx.font = "bold 22px Unbounded, sans-serif"; ctx.fillStyle = fpsCol; ctx.fillText(`${Math.round(G.fps)} FPS`, 38, 36);
    ctx.font = "11px JetBrains Mono, monospace"; ctx.fillStyle = "#e6edf2";
    ctx.fillText(`SCORE ${G.score}`, 38, 56);
    if (G.combo > 1) { ctx.fillStyle = "#9ff0f0"; ctx.fillText(`COMBO x${G.combo}`, 38, 72); }
    ctx.fillStyle = "rgba(255,255,255,.08)"; ctx.fillRect(38, H - 54, W - 76, 3);
    ctx.fillStyle = "#9ff0f0"; ctx.fillRect(38, H - 54, (W - 76) * (1 - G.t / ROUND), 3);
  }

  function drawIdle(now, dt) {
    graph.push(Math.min(dt, 40)); graph.shift();
    const a = now / 4000, cx = W / 2, cy = H * 0.42, R = Math.min(W, H) * 0.3;
    const proj = pts.map(([x, y, z]) => {
      const X = x * Math.cos(a) - z * Math.sin(a), Z = x * Math.sin(a) + z * Math.cos(a);
      const Y = y * Math.cos(0.4) - Z * Math.sin(0.4), Z2 = y * Math.sin(0.4) + Z * Math.cos(0.4);
      return [cx + X * R, cy + Y * R, Z2];
    });
    const acc = getComputedStyle(document.body).getPropertyValue("--accent").trim() === "#f5c86b" ? "245,200,107" : "159,240,240";
    ctx.lineWidth = 0.5;
    const lim = (R * 0.32) ** 2;
    for (let i = 0; i < proj.length; i++) for (let j = i + 1; j < proj.length; j++) {
      const dx = proj[i][0] - proj[j][0], dy = proj[i][1] - proj[j][1], d = dx * dx + dy * dy;
      if (d < lim) {
        ctx.strokeStyle = `rgba(${acc},${0.18 * (1 - d / lim) * (1.3 + (proj[i][2] + proj[j][2]) / 2) / 2})`;
        ctx.beginPath(); ctx.moveTo(proj[i][0], proj[i][1]); ctx.lineTo(proj[j][0], proj[j][1]); ctx.stroke();
      }
    }
    for (const [x, y, z] of proj) { ctx.fillStyle = `rgba(${acc},${0.35 + z * 0.35})`; ctx.fillRect(x - 1, y - 1, 2, 2); }
    const gx = 16, gw = W - 32, gh = H * 0.16, gy = H - 40 - gh;
    ctx.strokeStyle = "rgba(125,141,153,.25)"; ctx.setLineDash([3, 4]);
    ctx.beginPath(); ctx.moveTo(gx, gy + gh - (16.6 / 40) * gh); ctx.lineTo(gx + gw, gy + gh - (16.6 / 40) * gh); ctx.stroke();
    ctx.setLineDash([]); ctx.strokeStyle = "#6ee7a8"; ctx.lineWidth = 1.2; ctx.beginPath();
    graph.forEach((v, i) => { const x = gx + (i / (graph.length - 1)) * gw, y = gy + gh - (v / 40) * gh; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); });
    ctx.stroke();
  }

  function frame(now) {
    const dpr = devicePixelRatio || 1;
    W = cv.clientWidth; H = cv.clientHeight;
    if (cv.width !== Math.round(W * dpr) || cv.height !== Math.round(H * dpr)) { cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    const dt = now - last; last = now; frames++;
    if (now - fpsT > 500) { if (mode === "idle") $("#fps").textContent = `FPS ${Math.round((frames * 1000) / (now - fpsT))}`; frames = 0; fpsT = now; }
    if (mode === "play") { stepGame(Math.min(dt, 50) / 1000); if (mode === "play") { drawGame(); $("#fps").textContent = `T-${Math.max(0, Math.ceil(ROUND - G.t))}s`; } }
    else drawIdle(now, dt);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  /* ══ 5. CHARACTER SHEET + SKILL NODES ══ */
  const ch = C.character;
  if (ch) {
    const initials = C.name.split(/\s+/).map((w) => w[0]).join("").slice(0, 2);
    $("#charsheet").innerHTML = `
      <div class="cs-id">
        <div class="cs-avatar">${C.photo ? `<img src="${esc(C.photo)}" alt="${esc(C.name)}" />` : ICON("user", 44)}</div>
        <span>NAME <b>${esc(C.name)}</b></span>
        <span>CLASS <b>${esc(ch.cls)}</b></span>
        <span>LEVEL <span class="cs-lv">${esc(ch.level)}</span></span>
      </div>
      <div class="cs-attrs">${ch.attrs.map((a) => `
        <div class="attr"><div class="attr-top"><span>${esc(a.name)}</span><b>${a.years} YR${a.years > 1 ? "S" : ""}</b></div>
        <div class="attr-bar"><i style="--w:${(Math.min(a.years, 12) / 12) * 100}%;--n:${Math.max(1, Math.min(a.years, 12))}"></i></div></div>`).join("")}
      </div>`;
    new IntersectionObserver((es, o) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("shown"); o.disconnect(); } }), { threshold: 0.3 }).observe($("#charsheet"));
  }
  const groups = document.querySelectorAll("#stack-grid .stack-group");
  groups.forEach((g) => {
    const nodes = g.querySelectorAll(".tag");
    nodes.forEach((n) => {
      n.classList.add("skill"); n.tabIndex = 0; n.setAttribute("role", "button");
      if (S.skills[n.textContent]) n.classList.add("got");
    });
  });
  const updateGroupCounts = () => groups.forEach((g) => {
    const h = g.querySelector("h3"), n = g.querySelectorAll(".tag").length, got = g.querySelectorAll(".tag.got").length;
    h.innerHTML = `${esc(h.dataset.t || (h.dataset.t = h.textContent))}<span>${got}/${n}</span>`;
  });
  updateGroupCounts();
  function inspect(n) {
    const k = n.textContent;
    if (!S.skills[k]) { S.skills[k] = 1; S.xp += 2; save(); renderHud(); }
    n.classList.add("got");
    updateGroupCounts();
    if (Object.keys(S.skills).length >= 8) unlock("skills");
  }
  $("#stack-grid").addEventListener("click", (e) => { const n = e.target.closest(".skill"); if (n) inspect(n); });
  $("#stack-grid").addEventListener("keydown", (e) => { const n = e.target.closest(".skill"); if (n && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); inspect(n); } });

  /* ══ 6. ARCADE ══ */
  const games = C.arcade || [];
  let cur = 0;
  $("#cab-list").innerHTML = games.map((g, i) => `
    <button class="cab-game" data-i="${i}"><img src="${esc(g.img)}" alt="" loading="lazy" /><span><b>${esc(g.title)}</b><small>${esc(g.genre)}</small></span></button>`).join("");
  function showGame(i, play = false) {
    cur = i;
    const g = games[i];
    document.querySelectorAll(".cab-game").forEach((b) => b.classList.toggle("on", +b.dataset.i === i));
    $("#cab-screen").innerHTML = `
      <div>
        <div class="cab-frame" style="background-image:url('${esc(g.img)}')">
          ${play ? `<iframe src="https://itch.io/embed-upload/${esc(g.upload)}?color=0a0f14" allow="autoplay; fullscreen; gamepad" allowfullscreen title="${esc(g.title)}"></iframe>`
                 : `<div class="cab-attract"><h3>${esc(g.title)}</h3><button class="btn btn-solid" id="coin"><span class="coin">INSERT COIN ▸</span></button></div>`}
        </div>
        <div class="cab-meta"><a href="${esc(g.page)}" target="_blank" rel="noopener">OPEN ON ITCH.IO ↗</a>${play ? `<button id="cab-stop">■ STOP</button>` : ""}</div>
      </div>`;
    if (play) unlock("arcade");
  }
  $("#cab-list").addEventListener("click", (e) => { const b = e.target.closest(".cab-game"); if (b) showGame(+b.dataset.i); });
  $("#cab-screen").addEventListener("click", (e) => {
    if (e.target.closest("#coin")) showGame(cur, true);
    if (e.target.closest("#cab-stop")) showGame(cur);
  });
  if (games.length) showGame(0);

  /* ══ 4. CONSOLE ══ */
  const con = $("#console"), out = $("#con-out"), input = $("#con-input");
  const hist = []; let hPos = 0;
  const print = (html, cls = "") => { const d = document.createElement("div"); if (cls) d.className = cls; d.innerHTML = html; out.appendChild(d); out.scrollTop = out.scrollHeight; };
  function openConsole() {
    con.hidden = false; input.focus(); unlock("hacker");
    if (!out.childElementCount) {
      print(`<span class="c-acc">ABHI-OS v1.0</span> · type <span class="c-ok">help</span> for commands, <span class="c-ok">exit</span> or Esc to close.`);
    }
  }
  const closeConsole = () => { con.hidden = true; input.blur(); };
  $("#con-btn").addEventListener("click", () => (con.hidden ? openConsole() : closeConsole()));
  $("#con-close").addEventListener("click", closeConsole);
  addEventListener("keydown", (e) => {
    const typing = /INPUT|TEXTAREA/.test(document.activeElement?.tagName) && document.activeElement !== input;
    if ((e.key === "`" || e.key === "~") && !typing) { e.preventDefault(); con.hidden ? openConsole() : closeConsole(); }
    else if (e.key === "Escape") { if (!con.hidden) closeConsole(); else if (!panel.hidden) togglePanel(false); }
  });
  input.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp" && hist.length) { e.preventDefault(); hPos = Math.max(0, hPos - 1); input.value = hist[hPos]; }
    if (e.key === "ArrowDown" && hist.length) { e.preventDefault(); hPos = Math.min(hist.length, hPos + 1); input.value = hist[hPos] || ""; }
  });
  const go = (id) => { closeConsole(); document.getElementById(id)?.scrollIntoView({ behavior: reduced ? "auto" : "smooth" }); };
  let listed = [];
  const CMDS = {
    help: () => print([
      ["about / whoami", "who I am"], ["projects [games|tools|work|itch|github]", "list projects"], ["open &lt;n&gt;", "open project n from the last list"],
      ["exp", "career log"], ["skills", "character sheet"], ["play", "frame-drop mini-game"], ["arcade [n]", "play my itch games"],
      ["cv", "download the CV"], ["contact", "email and links"], ["xp / quests", "your progress"], ["goto &lt;section&gt;", "jump to a section"], ["clear / exit", ""],
    ].map(([c, d]) => `  <span class="c-ok">${c.padEnd(40)}</span>${d}`).join("\n") + `\n  <span class="c-cmd">…and a few hidden ones.</span>`),
    about: () => print(`<span class="c-acc">${esc(C.name)}</span> · ${esc(C.role)}\n${esc(C.tagline || "")}\n<span class="c-cmd">${esc(C.location || "")}</span>`),
    whoami: () => print(`guest · LV ${level()} ${TITLES[level() - 1]} · ${S.xp} XP\n(the portfolio owner is ${esc(C.name)}; try <span class="c-ok">about</span>)`),
    projects: (arg) => {
      const map = { games: (p) => p.dir === "games", tools: (p) => p.dir === "tools", work: (p) => p.source === "work", itch: (p) => p.source === "itch", github: (p) => p.source === "github", private: (p) => p.source === "private" };
      listed = C.projects.filter(arg && map[arg] ? map[arg] : () => true);
      print(listed.map((p, i) => `  <span class="c-acc">${String(i + 1).padStart(2)}</span>  ${esc(p.title.padEnd(42))}<span class="c-cmd">${esc(p.tags.slice(0, 3).join(", "))}</span>`).join("\n") + `\n<span class="c-cmd">open &lt;n&gt; to view · filters: games tools work itch github private</span>`);
    },
    open: (arg) => {
      const p = listed[+arg - 1];
      if (!p) return print("usage: open &lt;n&gt; (run <span class=\"c-ok\">projects</span> first)", "c-err");
      print(`<span class="c-acc">${esc(p.title)}</span>\n${esc(p.text)}\n${(p.links || []).map((l) => `<a href="${esc(l.href)}" target="_blank" rel="noopener">${esc(l.label)} ↗</a>`).join("  ") || '<span class="c-cmd">no public link</span>'}`);
    },
    exp: () => print(C.experience.map((x) => `  <span class="c-acc">${esc(x.from)}–${esc(x.to)}</span>  ${esc(x.company)} · ${esc(x.role)}${x.place ? ` <span class="c-cmd">(${esc(x.place)})</span>` : ""}`).join("\n")),
    skills: () => { go("stack"); },
    stack: () => print(Object.entries(C.stack).map(([g, a]) => `<span class="c-acc">${esc(g)}</span>\n  ${a.map(esc).join(" · ")}`).join("\n")),
    play: () => { go("profile"); setTimeout(startGame, 500); },
    arcade: (arg) => { const i = +arg - 1; if (games[i]) showGame(i); else if (arg) return print(games.map((g, k) => `  ${k + 1}  ${esc(g.title)}`).join("\n")); go("arcade"); },
    cv: () => { const a = document.querySelector(".cv-link"); a.click(); print("downloading CV…", "c-ok"); },
    contact: () => print(`email     <a href="mailto:${esc(C.email)}">${esc(C.email)}</a>\n` + C.links.map((l) => `${esc(l.label.toLowerCase().padEnd(10))}<a href="${esc(l.href)}" target="_blank" rel="noopener">${esc(l.value)}</a>`).join("\n")),
    email: () => CMDS.contact(),
    hire: () => print(`Great choice. Run <span class="c-ok">contact</span>, or try <span class="c-ok">sudo hire</span> for admin rights.`),
    sudo: (arg) => {
      if (arg !== "hire") return print(`guest is not in the sudoers file. This incident will be reported.`, "c-err");
      print(`[sudo] password for guest: ********\n<span class="c-ok">ACCESS GRANTED.</span> Opening a hiring channel…`);
      unlock("root");
      setTimeout(() => { location.href = `mailto:${C.email}?subject=${encodeURIComponent("Let's talk about a role")}`; unlock("comms"); }, 1200);
    },
    xp: () => print(`LV ${level()} ${TITLES[level() - 1]} · ${S.xp} XP · ${Object.keys(S.ach).length}/${Object.keys(ACH).length} achievements · mini-game best ${S.best}`),
    quests: () => { closeConsole(); togglePanel(true); },
    achievements: () => CMDS.quests(),
    goto: (arg) => (SECTIONS.includes(arg) ? go(arg) : print(`sections: ${SECTIONS.join(", ")}`)),
    ls: () => print(`about.txt  projects/  experience.log  stack.cfg  cv.pdf  arcade/  .secrets`),
    cat: (arg) => (arg === ".secrets" ? print(`↑ ↑ ↓ ↓ ← → ← → B A`, "c-acc") : print(`cat: ${esc(arg || "")}: try <span class="c-ok">ls</span>`)),
    rm: () => print(`Nice try. This portfolio is server-authoritative.`, "c-err"),
    unity: () => print(`10+ years of Unity. Still loves a clean Update() loop and zero GC allocations per frame.`),
    coffee: () => print(`☕ brewing… done. Productivity +20%.`),
    clear: () => { out.innerHTML = ""; },
    exit: closeConsole,
  };
  $("#con-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const raw = input.value.trim(); input.value = "";
    if (!raw) return;
    hist.push(raw); hPos = hist.length;
    print(`<span class="c-cmd">$ ${esc(raw)}</span>`);
    const [cmd, ...rest] = raw.split(/\s+/);
    const fn = CMDS[cmd.toLowerCase()];
    fn ? fn(rest.join(" ").toLowerCase()) : print(`command not found: ${esc(cmd)} · type <span class="c-ok">help</span>`, "c-err");
  });

  /* ── boot: award "joined" once the intro is gone ── */
  renderHud();
  const waitBoot = setInterval(() => {
    if (!document.querySelector("#boot:not(.done)")) { clearInterval(waitBoot); setTimeout(() => unlock("joined"), 900); }
  }, 300);
})();
