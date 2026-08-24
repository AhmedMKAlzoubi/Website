/* ============================================================
   Digital Card — site behaviour
   Change ORDER_EMAIL to the address that should receive orders.
   ============================================================ */
const ORDER_EMAIL = "ahmedmohammedkhear@gmail.com";

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Theme toggle (persisted) ---------- */
(function theme() {
  const btn = document.getElementById("theme-toggle");
  if (!btn) return;
  btn.addEventListener("click", function () {
    const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try { localStorage.setItem("dc-theme", next); } catch (e) { /* storage blocked */ }
    btn.setAttribute("aria-label", next === "dark" ? "Switch to light theme" : "Switch to dark theme");
  });
})();

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
    if (e.target.tagName === "A") {
      menu.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });
})();

/* ---------- Scroll progress bar ---------- */
(function progress() {
  const bar = document.querySelector(".progress");
  if (!bar) return;
  function update() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? window.scrollY / max : 0;
    bar.style.transform = "scaleX(" + pct + ")";
  }
  window.addEventListener("scroll", function () { requestAnimationFrame(update); }, { passive: true });
  window.addEventListener("resize", update, { passive: true });
  update();
})();

/* ---------- Staggered reveal on scroll ---------- */
(function reveal() {
  const els = document.querySelectorAll(".reveal");
  if (!els.length) return;

  // Give each element in a group its own stagger index.
  const groups = new Map();
  els.forEach(function (el) {
    const parent = el.parentElement;
    const n = groups.get(parent) || 0;
    el.style.setProperty("--i", n);
    groups.set(parent, n + 1);
  });

  if (reduceMotion || !("IntersectionObserver" in window)) {
    els.forEach(function (el) { el.classList.add("in"); });
    return;
  }
  const io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -8% 0px" }
  );
  els.forEach(function (el) { io.observe(el); });
})();

/* ---------- Count-up numbers ---------- */
(function countUp() {
  const nodes = document.querySelectorAll("[data-count]");
  if (!nodes.length) return;
  if (reduceMotion || !("IntersectionObserver" in window)) {
    nodes.forEach(function (n) { n.textContent = n.getAttribute("data-count"); });
    return;
  }
  const io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      io.unobserve(el);
      const target = parseFloat(el.getAttribute("data-count"));
      const decimals = (el.getAttribute("data-count").split(".")[1] || "").length;
      const suffix = el.getAttribute("data-suffix") || "";
      const dur = 1100;
      const start = performance.now();
      function tick(now) {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = (target * eased).toFixed(decimals) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.4 });
  nodes.forEach(function (n) { io.observe(n); });
})();

/* ---------- Case variant explorer ---------- */
(function explorer() {
  const tabs = document.querySelectorAll(".vtab");
  const viewer = document.getElementById("variant-model");
  if (!tabs.length || !viewer) return;

  const specHost = document.getElementById("variant-specs");
  const nameHost = document.getElementById("variant-name");
  const noteHost = document.getElementById("variant-note");

  function select(tab) {
    tabs.forEach(function (t) { t.setAttribute("aria-selected", String(t === tab)); });

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
      specHost.innerHTML = specs
        .map(function (s) {
          return "<div><dt>" + s[0] + "</dt><dd>" + s[1] + "</dd></div>";
        })
        .join("");
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

  const initial = document.querySelector('.vtab[aria-selected="true"]') || tabs[0];
  select(initial);
})();

/* ---------- Docs scroll-spy ---------- */
(function docsSpy() {
  const links = document.querySelectorAll(".docs-rail a");
  if (!links.length || !("IntersectionObserver" in window)) return;
  const map = new Map();
  links.forEach(function (a) {
    const id = a.getAttribute("href").slice(1);
    const sec = document.getElementById(id);
    if (sec) map.set(sec, a);
  });
  const io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a) { a.classList.remove("active"); });
        const a = map.get(entry.target);
        if (a) a.classList.add("active");
      });
    },
    { rootMargin: "-15% 0px -70% 0px" }
  );
  map.forEach(function (_a, sec) { io.observe(sec); });
})();

/* ---------- Order buttons: prefill and jump to the form ---------- */
(function orderButtons() {
  document.querySelectorAll("[data-order]").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      const item = btn.getAttribute("data-order");
      const field = document.getElementById("item");
      if (!field) return; // link to shop page handles it instead
      e.preventDefault();
      field.value = item;
      const form = document.getElementById("order");
      if (form) form.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
      field.focus({ preventScroll: true });
    });
  });
})();

/* ---------- Order form submit ---------- */
(function orderForm() {
  const form = document.getElementById("order-form");
  if (!form) return;
  const status = document.getElementById("form-status");
  const btn = document.getElementById("submit-btn");

  function setStatus(msg, state) {
    if (!status) return;
    status.textContent = msg;
    if (state) status.setAttribute("data-state", state);
    else status.removeAttribute("data-state");
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    btn.disabled = true;
    const label = btn.textContent;
    btn.textContent = "Sending…";
    setStatus("Sending your order…", "");

    fetch("https://formsubmit.co/ajax/" + ORDER_EMAIL, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: new FormData(form),
    })
      .then(function (r) { return r.json(); })
      .then(function () {
        form.reset();
        setStatus("Thank you — your order has been sent. We will be in touch shortly.", "success");
      })
      .catch(function () {
        setStatus("Something went wrong. Please email us directly at " + ORDER_EMAIL + ".", "error");
      })
      .finally(function () {
        btn.disabled = false;
        btn.textContent = label;
      });
  });
})();
