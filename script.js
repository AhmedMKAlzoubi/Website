/* ============================================================
   Digital Card — v3 behaviour
   Change ORDER_EMAIL to the address that should receive orders.
   ============================================================ */
const ORDER_EMAIL = "ahmedmohammedkhear@gmail.com";

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isTouch = window.matchMedia("(hover: none)").matches;

/* ---------- Mobile nav ---------- */
(function nav() {
  const toggle = document.querySelector(".nav-toggle");
  const menu = document.getElementById("site-nav");
  if (!toggle || !menu) return;
  toggle.addEventListener("click", function () {
    const open = menu.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
  menu.addEventListener("click", function (e) {
    if (e.target.closest("a")) {
      menu.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });
})();

/* ---------- Scroll progress ---------- */
(function progress() {
  const bar = document.querySelector(".progress");
  if (!bar) return;
  function update() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = "scaleX(" + (max > 0 ? window.scrollY / max : 0) + ")";
  }
  window.addEventListener("scroll", function () { requestAnimationFrame(update); }, { passive: true });
  window.addEventListener("resize", update, { passive: true });
  update();
})();

/* ---------- Split the hero headline into letters ---------- */
(function splitText() {
  const lines = document.querySelectorAll(".split-line");
  if (!lines.length) return;
  let n = 0;
  lines.forEach(function (line) {
    const text = line.textContent;
    line.textContent = "";
    text.split("").forEach(function (ch) {
      const s = document.createElement("span");
      s.className = "ch";
      s.style.setProperty("--n", n++);
      s.textContent = ch === " " ? " " : ch;
      line.appendChild(s);
    });
  });
  requestAnimationFrame(function () {
    lines.forEach(function (l) { l.classList.add("go"); });
  });
})();

/* ---------- Staggered reveal ---------- */
(function reveal() {
  const els = document.querySelectorAll(".reveal");
  if (!els.length) return;
  const groups = new Map();
  els.forEach(function (el) {
    const p = el.parentElement;
    const i = groups.get(p) || 0;
    el.style.setProperty("--i", i);
    groups.set(p, i + 1);
  });
  if (reduceMotion || !("IntersectionObserver" in window)) {
    els.forEach(function (el) { el.classList.add("in"); });
    return;
  }
  const io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -8% 0px" });
  els.forEach(function (el) { io.observe(el); });
})();

/* ---------- Cursor spotlight ---------- */
(function spotlight() {
  const el = document.querySelector(".spotlight");
  if (!el || reduceMotion || isTouch) return;
  let x = 0, y = 0, tx = 0, ty = 0, running = false;
  document.addEventListener("mousemove", function (e) {
    tx = e.clientX; ty = e.clientY;
    document.body.classList.add("has-cursor");
    if (!running) { running = true; requestAnimationFrame(loop); }
  }, { passive: true });
  function loop() {
    x += (tx - x) * 0.14;
    y += (ty - y) * 0.14;
    el.style.transform = "translate(" + x + "px," + y + "px) translate(-50%,-50%)";
    if (Math.abs(tx - x) > 0.4 || Math.abs(ty - y) > 0.4) requestAnimationFrame(loop);
    else running = false;
  }
})();

/* ---------- Section accent colour shifting ---------- */
(function sectionAccent() {
  const sections = document.querySelectorAll("[data-accent]");
  if (!sections.length || !("IntersectionObserver" in window)) return;
  const io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      const a = e.target.getAttribute("data-accent");
      const b = e.target.getAttribute("data-accent-2") || a;
      document.documentElement.style.setProperty("--accent", "var(--c-" + a + ")");
      document.documentElement.style.setProperty("--accent-2", "var(--c-" + b + ")");
    });
  }, { rootMargin: "-40% 0px -50% 0px" });
  sections.forEach(function (s) { io.observe(s); });
})();

/* ---------- Card tilt + glow follow ---------- */
(function tiltAndGlow() {
  if (isTouch || reduceMotion) return;

  document.querySelectorAll(".tilt").forEach(function (el) {
    el.addEventListener("mousemove", function (e) {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform =
        "perspective(900px) rotateY(" + (px * 9).toFixed(2) + "deg) rotateX(" + (-py * 9).toFixed(2) + "deg)";
    });
    el.addEventListener("mouseleave", function () { el.style.transform = ""; });
  });

  document.querySelectorAll(".cell, .pcard").forEach(function (el) {
    el.addEventListener("mousemove", function (e) {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", ((e.clientX - r.left) / r.width * 100).toFixed(1) + "%");
      el.style.setProperty("--my", ((e.clientY - r.top) / r.height * 100).toFixed(1) + "%");
    });
  });
})();

/* ---------- Magnetic buttons ---------- */
(function magnetic() {
  if (isTouch || reduceMotion) return;
  document.querySelectorAll(".btn").forEach(function (btn) {
    btn.addEventListener("mousemove", function (e) {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      btn.style.transform = "translate(" + x * 0.18 + "px," + y * 0.26 + "px)";
    });
    btn.addEventListener("mouseleave", function () { btn.style.transform = ""; });
  });
})();

/* ---------- Horizontal scroll story ---------- */
(function hscroll() {
  const wrap = document.querySelector(".hscroll");
  const track = document.querySelector(".hscroll-track");
  if (!wrap || !track) return;

  const small = window.matchMedia("(max-width: 760px)");
  let distance = 0;

  function measure() {
    if (small.matches || reduceMotion) {
      wrap.style.height = "";
      track.style.transform = "";
      return;
    }
    distance = Math.max(0, track.scrollWidth - window.innerWidth + 64);
    wrap.style.height = window.innerHeight + distance + "px";
    move();
  }
  function move() {
    if (small.matches || reduceMotion || !distance) return;
    const top = wrap.offsetTop;
    const p = Math.min(Math.max((window.scrollY - top) / distance, 0), 1);
    track.style.transform = "translate3d(" + -(p * distance) + "px,0,0)";
  }

  window.addEventListener("scroll", function () { requestAnimationFrame(move); }, { passive: true });
  window.addEventListener("resize", measure, { passive: true });
  measure();
  window.addEventListener("load", measure);
})();

/* ---------- Count-up ---------- */
(function countUp() {
  const nodes = document.querySelectorAll("[data-count]");
  if (!nodes.length) return;
  if (reduceMotion || !("IntersectionObserver" in window)) {
    nodes.forEach(function (n) { n.textContent = n.getAttribute("data-count"); });
    return;
  }
  const io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      const el = e.target;
      io.unobserve(el);
      const raw = el.getAttribute("data-count");
      const target = parseFloat(raw);
      const dec = (raw.split(".")[1] || "").length;
      const start = performance.now();
      function tick(now) {
        const p = Math.min((now - start) / 1200, 1);
        el.textContent = (target * (1 - Math.pow(1 - p, 3))).toFixed(dec);
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.4 });
  nodes.forEach(function (n) { io.observe(n); });
})();

/* ---------- Variant explorer ---------- */
(function explorer() {
  const tabs = document.querySelectorAll(".vtab");
  const viewer = document.getElementById("variant-model");
  if (!tabs.length || !viewer) return;

  const specHost = document.getElementById("variant-specs");
  const nameHost = document.getElementById("variant-name");
  const noteHost = document.getElementById("variant-note");
  const scope = document.getElementById("variants");

  function select(tab) {
    tabs.forEach(function (t) { t.setAttribute("aria-selected", String(t === tab)); });

    const colour = tab.getAttribute("data-colour");
    if (colour && scope) {
      scope.setAttribute("data-accent", colour);
      document.documentElement.style.setProperty("--accent", "var(--c-" + colour + ")");
    }

    const src = tab.getAttribute("data-model");
    if (src && viewer.getAttribute("src") !== src) {
      viewer.setAttribute("src", src);
      viewer.setAttribute("alt", tab.getAttribute("data-alt") || "Case variant");
    }
    if (nameHost) nameHost.textContent = tab.getAttribute("data-name") || "";
    if (noteHost) noteHost.textContent = tab.getAttribute("data-note") || "";

    if (specHost) {
      let specs = [];
      try { specs = JSON.parse(tab.getAttribute("data-specs") || "[]"); } catch (e) { specs = []; }
      specHost.innerHTML = specs.map(function (s) {
        return "<div><dt>" + s[0] + "</dt><dd>" + s[1] + "</dd></div>";
      }).join("");
    }
  }

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () { select(tab); });
    tab.addEventListener("keydown", function (e) {
      const list = Array.prototype.slice.call(tabs);
      const i = list.indexOf(tab);
      let next = null;
      if (e.key === "ArrowDown" || e.key === "ArrowRight") next = list[(i + 1) % list.length];
      if (e.key === "ArrowUp" || e.key === "ArrowLeft") next = list[(i - 1 + list.length) % list.length];
      if (next) { e.preventDefault(); next.focus(); select(next); }
    });
  });

  select(document.querySelector('.vtab[aria-selected="true"]') || tabs[0]);
})();

/* ---------- Docs scroll-spy ---------- */
(function docsSpy() {
  const links = document.querySelectorAll(".docs-rail a");
  if (!links.length || !("IntersectionObserver" in window)) return;
  const map = new Map();
  links.forEach(function (a) {
    const sec = document.getElementById(a.getAttribute("href").slice(1));
    if (sec) map.set(sec, a);
  });
  const io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      links.forEach(function (a) { a.classList.remove("active"); });
      const a = map.get(e.target);
      if (a) a.classList.add("active");
    });
  }, { rootMargin: "-15% 0px -70% 0px" });
  map.forEach(function (_a, sec) { io.observe(sec); });
})();

/* ---------- Order buttons ---------- */
(function orderButtons() {
  document.querySelectorAll("[data-order]").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      const field = document.getElementById("item");
      if (!field) return;
      e.preventDefault();
      field.value = btn.getAttribute("data-order");
      const target = document.getElementById("order");
      if (target) target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
      field.focus({ preventScroll: true });
    });
  });
})();

/* ---------- Order form ---------- */
(function orderForm() {
  const form = document.getElementById("order-form");
  if (!form) return;
  const status = document.getElementById("form-status");
  const btn = document.getElementById("submit-btn");
  const label = btn ? btn.innerHTML : "";

  function setStatus(msg, state) {
    if (!status) return;
    status.textContent = msg;
    if (state) status.setAttribute("data-state", state);
    else status.removeAttribute("data-state");
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    btn.disabled = true;
    btn.innerHTML = "<span>Sending…</span>";
    setStatus("Sending your order…", "");

    fetch("https://formsubmit.co/ajax/" + ORDER_EMAIL, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: new FormData(form),
    })
      .then(function (r) { return r.json(); })
      .then(function () {
        form.reset();
        setStatus("Order sent. We will be in touch shortly.", "success");
      })
      .catch(function () {
        setStatus("Something went wrong. Please email us at " + ORDER_EMAIL + ".", "error");
      })
      .finally(function () {
        btn.disabled = false;
        btn.innerHTML = label;
      });
  });
})();
