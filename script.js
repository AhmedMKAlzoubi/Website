/* ============================================================
   DIGITAL CARD — v4 behaviour
   Motion is mechanical: rules extend, dimension lines draw,
   readouts tick. Nothing bounces.
   Change ORDER_EMAIL to the address that should receive orders.
   ============================================================ */
const ORDER_EMAIL = "ahmedmohammedkhear@gmail.com";

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

/* ---------- Reveal: rules extend, blocks fade ---------- */
(function reveal() {
  const els = document.querySelectorAll(".draw, .fade");
  if (!els.length) return;

  const groups = new Map();
  els.forEach(function (el) {
    if (!el.classList.contains("fade")) return;
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
  }, { threshold: 0.08, rootMargin: "0px 0px -6% 0px" });
  els.forEach(function (el) { io.observe(el); });
})();

/* ---------- Dimension lines: measure, then draw ---------- */
(function annotations() {
  const svgs = document.querySelectorAll(".annot");
  if (!svgs.length) return;

  svgs.forEach(function (svg) {
    // Give every stroked path its own dash length so the draw is even.
    svg.querySelectorAll(".drawline").forEach(function (p, i) {
      let len = 400;
      try { len = p.getTotalLength ? p.getTotalLength() : 400; } catch (e) { /* not laid out yet */ }
      p.style.setProperty("--len", Math.ceil(len) || 400);
      if (!p.style.getPropertyValue("--d")) p.style.setProperty("--d", i % 6);
    });
  });

  if (reduceMotion || !("IntersectionObserver" in window)) {
    svgs.forEach(function (s) { s.classList.add("go"); });
    return;
  }
  const io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add("go"); io.unobserve(e.target); }
    });
  }, { threshold: 0.3 });
  svgs.forEach(function (s) { io.observe(s); });
})();

/* ---------- Hide annotations while the model is being turned ---------- */
(function annotOnDrag() {
  document.querySelectorAll(".viewport").forEach(function (vp) {
    const mv = vp.querySelector("model-viewer");
    const annot = vp.querySelector(".annot");
    if (!mv || !annot) return;
    let timer = null;
    mv.addEventListener("camera-change", function (e) {
      if (!e.detail || e.detail.source !== "user-interaction") return;
      annot.classList.add("hide");
      clearTimeout(timer);
      timer = setTimeout(function () { annot.classList.remove("hide"); }, 1800);
    });
  });
})();

/* ---------- Numeric readouts tick up ---------- */
(function readouts() {
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
        const p = Math.min((now - start) / 900, 1);
        el.textContent = (target * (1 - Math.pow(1 - p, 4))).toFixed(dec);
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.5 });
  nodes.forEach(function (n) { io.observe(n); });
})();

/* ---------- Title block: live scroll readout ---------- */
(function readout() {
  const out = document.getElementById("scroll-readout");
  if (!out) return;
  function update() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? Math.round((window.scrollY / max) * 100) : 0;
    out.textContent = String(pct).padStart(3, "0") + "%";
  }
  window.addEventListener("scroll", function () { requestAnimationFrame(update); }, { passive: true });
  window.addEventListener("resize", update, { passive: true });
  update();
})();

/* ---------- Variant selector ---------- */
(function variants() {
  const tabs = document.querySelectorAll(".vtab");
  const viewer = document.getElementById("variant-model");
  if (!tabs.length || !viewer) return;

  const nameHost = document.getElementById("variant-name");
  const noteHost = document.getElementById("variant-note");
  const bodyHost = document.getElementById("variant-specs");
  const figHost = document.getElementById("variant-fig");

  function select(tab) {
    tabs.forEach(function (t) { t.setAttribute("aria-selected", String(t === tab)); });

    const src = tab.getAttribute("data-model");
    if (src && viewer.getAttribute("src") !== src) {
      viewer.setAttribute("src", src);
      viewer.setAttribute("alt", tab.getAttribute("data-alt") || "Case variant");
    }
    if (nameHost) nameHost.textContent = tab.getAttribute("data-name") || "";
    if (noteHost) noteHost.textContent = tab.getAttribute("data-note") || "";
    if (figHost) figHost.textContent = tab.getAttribute("data-fig") || "";

    if (bodyHost) {
      let rows = [];
      try { rows = JSON.parse(tab.getAttribute("data-specs") || "[]"); } catch (e) { rows = []; }
      bodyHost.innerHTML = rows.map(function (r, i) {
        return "<tr><td class='n'>" + String(i + 1).padStart(2, "0") +
               "</td><td>" + r[0] + "</td><td class='v'>" + r[1] + "</td></tr>";
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
  }, { rootMargin: "-12% 0px -72% 0px" });
  map.forEach(function (_a, sec) { io.observe(sec); });
})();

/* ---------- Accordion +/- sign ---------- */
(function accSign() {
  document.querySelectorAll("details.acc").forEach(function (d) {
    const sign = d.querySelector(".sign");
    if (!sign) return;
    function set() { sign.textContent = d.open ? "[ - ]" : "[ + ]"; }
    d.addEventListener("toggle", set);
    set();
  });
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
  const label = btn ? btn.textContent : "";

  function setStatus(msg, state) {
    if (!status) return;
    status.textContent = msg;
    if (state) status.setAttribute("data-state", state);
    else status.removeAttribute("data-state");
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    btn.disabled = true;
    btn.textContent = "Transmitting…";
    setStatus("Sending order…", "");

    fetch("https://formsubmit.co/ajax/" + ORDER_EMAIL, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: new FormData(form),
    })
      .then(function (r) { return r.json(); })
      .then(function () {
        form.reset();
        setStatus("Order received. We will be in touch shortly.", "success");
      })
      .catch(function () {
        setStatus("Transmission failed — please email " + ORDER_EMAIL + ".", "error");
      })
      .finally(function () {
        btn.disabled = false;
        btn.textContent = label;
      });
  });
})();
