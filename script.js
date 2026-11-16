(() => {
  const C = window.CONTENT;
  const $ = (s) => document.querySelector(s);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const initials = (s) => s.split(/\s+/).map((w) => w[0]).join("").slice(0, 3).toUpperCase();

  /* ── fill static bits ── */
  document.title = `${C.name} — ${C.role}`;
  $("#nav-name").textContent = C.name;
  $("#nav-role").textContent = C.role;
  $("#hero-name").textContent = C.name;
  $("#hero-langs").textContent = `LANG: ${C.langs}`;
  if (C.tagline) $("#hero-tagline").textContent = C.tagline;
  if (C.location) $("#hero-loc").textContent = `LOC: ${C.location.toUpperCase()}`;
  $("#stats").innerHTML = (C.stats || []).map((s) => `<div class="stat"><b>${esc(s.n)}</b><span>${esc(s.l)}</span></div>`).join("");
  $("#foot").textContent = `© ${new Date().getFullYear()} ${C.name.toUpperCase()}`;
  document.querySelectorAll(".cv-link").forEach((a) => (a.href = C.cv));

  /* ── boot intro ── */
  const boot = $("#boot");
  let booted = false;
  const finishBoot = () => {
    if (booted) return;
    booted = true;
    boot.classList.add("done");
    document.body.classList.remove("locked");
    typeRole();
  };
  const startBoot = () => {
    document.body.classList.add("locked");
    $("#boot-q").textContent = "QUERY: #" + Math.random().toString(16).slice(2, 8).toUpperCase();
    const query = C.name.toUpperCase();
    const lines = [
      ["> CONNECTING TO NODE IN-01 ...", "OK"],
      ["> MATCHING RECORD ...", "1 FOUND"],
      ["> LOADING PROJECTS ...", `${C.projects.length} ENTRIES`],
      ["> DECRYPTING PROFILE ...", "DONE"],
    ];
    let i = 0;
    const typer = setInterval(() => {
      $("#boot-type").textContent = query.slice(0, ++i);
      if (i >= query.length) {
        clearInterval(typer);
        $("#boot-msg").textContent = "SEARCHING...";
        let j = 0;
        const log = $("#boot-log");
        const next = () => {
          if (booted) return;
          if (j >= lines.length) {
            $("#boot-msg").textContent = "ACCESS GRANTED";
            return setTimeout(finishBoot, 1400);
          }
          const [a, b] = lines[j++];
          log.innerHTML += `${esc(a)} <span class="ok">${esc(b)}</span>\n`;
          setTimeout(next, 650);
        };
        setTimeout(next, 700);
      }
    }, 110);
  };
  // show intro once per browser session
  let seen = false;
  try { seen = sessionStorage.getItem("booted") === "1"; sessionStorage.setItem("booted", "1"); } catch (e) {}
  if (seen || matchMedia("(prefers-reduced-motion: reduce)").matches) {
    boot.remove(); booted = true; typeRole();
  } else {
    startBoot();
    boot.addEventListener("click", finishBoot);
    addEventListener("keydown", (e) => { if (!booted && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); finishBoot(); } });
  }

  function typeRole() {
    const el = $("#hero-role");
    let i = 0;
    const t = setInterval(() => { el.textContent = C.role.slice(0, ++i); if (i >= C.role.length) clearInterval(t); }, 85);
  }

  /* ── directions ── */
  const count = (id) => C.projects.filter((p) => p.dir === id).length;
  $("#directions").innerHTML = C.directions.map((d) => `
    <a class="dir reveal" href="#projects" data-dir="${esc(d.id)}">
      <h3>${esc(d.title)}</h3><p>${esc(d.text)}</p><span>PROJECTS [${count(d.id)}] ▸</span>
    </a>`).join("");
  document.querySelectorAll(".dir").forEach((el) => el.addEventListener("click", () => { state.dir = el.dataset.dir; renderProjects(); }));

  /* ── projects + filters ── */
  const state = { dir: "all", tech: "all", src: "all" };
  // most-used technologies first
  const tally = {};
  C.projects.forEach((p) => p.tags.forEach((t) => (tally[t] = (tally[t] || 0) + 1)));
  // only technologies shared by 2+ projects get a filter chip
  const techs = Object.keys(tally).filter((t) => tally[t] > 1).sort((a, b) => tally[b] - tally[a]);
  const SOURCES = { work: "Studio work", itch: "itch.io", github: "GitHub", private: "Private repo" };

  function renderFilters() {
    const dirs = [{ id: "all", title: "All", n: C.projects.length }, ...C.directions.map((d) => ({ id: d.id, title: d.title, n: count(d.id) })).filter((d) => d.n)];
    $("#f-dir").innerHTML = dirs.map((d) => `<button class="chip ${state.dir === d.id ? "on" : ""}" data-dir="${esc(d.id)}">${esc(d.title)}<b>${d.n}</b></button>`).join("");
    const srcs = [["all", "All sources", C.projects.length], ...Object.entries(SOURCES).map(([k, v]) => [k, v, C.projects.filter((p) => p.source === k).length]).filter((s) => s[2])];
    $("#f-src").innerHTML = srcs.map(([k, v, n]) => `<button class="chip ${state.src === k ? "on" : ""}" data-src="${k}">${esc(v)}<b>${n}</b></button>`).join("");
    $("#f-tech").innerHTML = ["all", ...techs].map((t) => `<button class="chip ${state.tech === t ? "on" : ""}" data-tech="${esc(t)}">${t === "all" ? "All technologies" : esc(t)}</button>`).join("");
  }
  function renderProjects() {
    renderFilters();
    const list = C.projects.filter((p) => (state.dir === "all" || p.dir === state.dir) && (state.src === "all" || p.source === state.src) && (state.tech === "all" || p.tags.includes(state.tech)));
    $("#project-grid").innerHTML = list.length ? list.map((p, i) => `
      <article class="card" style="animation-delay:${i * 60}ms">
        ${p.img ? `<div class="card-img" style="background-image:url('${esc(p.img)}')">` : `<div class="card-img ph" data-ph="${p.source === "private" ? "SOURCE // CLASSIFIED" : p.source === "work" ? "CLIENT WORK // NDA" : "IMAGE // PENDING"}">${esc(initials(p.title))}`}
          ${p.source ? `<span class="src src-${esc(p.source)}">${p.source === "private" ? "🔒 " : ""}${esc(SOURCES[p.source] || p.source)}</span>` : ""}
        </div>
        <div class="card-body">
          <h3>${esc(p.title)}</h3>
          <p>${esc(p.text)}</p>
          <div class="tags">${p.tags.map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div>
          ${(p.links && p.links.length) ? `<div class="card-links">${p.links.map((l) => `<a class="card-link" href="${esc(l.href)}" target="_blank" rel="noopener">${esc(l.label)} ↗</a>`).join("")}</div>`
            : p.source === "private" ? `<div class="card-links"><span class="card-link off">PRIVATE REPO · ASK FOR A DEMO</span></div>` : ""}
        </div>
      </article>`).join("") : `<p class="muted" style="font-family:var(--mono)">NO RECORDS MATCH THIS FILTER.</p>`;
  }
  document.querySelector(".filters").addEventListener("click", (e) => {
    const b = e.target.closest(".chip");
    if (!b) return;
    if (b.dataset.dir) state.dir = b.dataset.dir;
    if (b.dataset.tech) state.tech = b.dataset.tech;
    if (b.dataset.src) state.src = b.dataset.src;
    renderProjects();
  });
  renderProjects();

  /* ── experience ── */
  const exp = C.experience;
  $("#timeline").innerHTML = exp.map((x, i) => `
    <div class="tl reveal ${i === exp.length - 1 ? "current" : ""}">
      <div class="tl-badge">${esc(initials(x.company))}</div>
      <div class="tl-date">${esc(x.from)} — ${esc(x.to)}</div>
      <h4>${esc(x.company)}</h4><p>${esc(x.role)}</p>
      ${x.place ? `<p class="tl-place">${esc(x.place)}</p>` : ""}
      ${x.points ? `<ul>${x.points.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>` : ""}
    </div>`).join("") + `
    <div class="tl next reveal"><div class="tl-badge">NEXT</div><div class="tl-date">???</div><h4>New Project?</h4><a href="#contact">HIRE ME ↗</a></div>`;

  /* ── stack ── */
  $("#stack-grid").innerHTML = Object.entries(C.stack).map(([g, items]) => `
    <div class="stack-group reveal"><h3>${esc(g)}</h3><div class="tags">${items.map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div></div>`).join("");

  /* ── education ── */
  $("#edu").innerHTML = C.education.map((e) => `
    <div class="edu-item reveal">
      <button aria-expanded="false"><span class="edu-year">${esc(e.year)}</span><span><h4>${esc(e.title)}</h4><small>${esc(e.place)}</small></span><span class="edu-more">MORE DETAILS ↓</span></button>
      <div class="edu-detail">${esc(e.details)}</div>
    </div>`).join("");
  $("#edu").addEventListener("click", (ev) => {
    const btn = ev.target.closest("button");
    if (!btn) return;
    const item = btn.parentElement;
    item.classList.toggle("open");
    btn.setAttribute("aria-expanded", item.classList.contains("open"));
  });

  /* ── contact ── */
  const rows = [{ label: "EMAIL", value: C.email, href: `mailto:${C.email}`, copy: true }, ...C.links];
  $("#contact-rows").innerHTML = rows.map((r) => `
    <div class="c-row"><label>${esc(r.label.toUpperCase())}</label>
      <a class="val" href="${esc(r.href)}" ${r.copy ? "" : 'target="_blank" rel="noopener"'}>${esc(r.value)}</a>
      ${r.copy ? `<button class="btn btn-sm" id="copy">COPY EMAIL</button>` : `<span></span>`}
    </div>`).join("");
  $("#copy").addEventListener("click", async (e) => {
    try { await navigator.clipboard.writeText(C.email); e.target.textContent = "COPIED ✓"; }
    catch { e.target.textContent = "COPY FAILED"; }
    setTimeout(() => (e.target.textContent = "COPY EMAIL"), 1600);
  });

  /* ── scroll: gauge, active nav, reveal ── */
  const sections = [...document.querySelectorAll("main section[id]")].filter((s) => s.id !== "directions");
  const navLinks = [...document.querySelectorAll("#nav-links a")];
  const onScroll = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    const p = max > 0 ? scrollY / max : 0;
    $("#gauge-pct").textContent = String(Math.round(p * 100)).padStart(3, "0") + "%";
    $("#gauge-fill").style.top = `${p * 157}px`;
    let cur = sections[0];
    for (const s of sections) if (s.getBoundingClientRect().top < innerHeight * 0.4) cur = s;
    $("#gauge-sec").textContent = cur.id.toUpperCase();
    navLinks.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === `#${cur.id}`));
  };
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("shown"); io.unobserve(e.target); } }), { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  /* ── hooks for game.js ── */
  window.PORTFOLIO = {
    state,
    setFilter(f) { Object.assign(state, { dir: "all", tech: "all", src: "all" }, f); renderProjects(); },
  };
})();
