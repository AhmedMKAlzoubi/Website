// ===== Where orders are sent (change this to your email) =====
const ORDER_EMAIL = "ahmedmohammedkhear@gmail.com";

// ===== Mobile nav toggle =====
const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.getElementById("site-nav");
if (navToggle && siteNav) {
  navToggle.addEventListener("click", function () {
    const open = siteNav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
}

// ===== Scroll-reveal animations =====
const revealEls = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && revealEls.length) {
  const io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        // Toggle each time the element enters/leaves view, so it fades in AND out.
        entry.target.classList.toggle("in", entry.isIntersecting);
      });
    },
    { threshold: 0.12 }
  );
  revealEls.forEach(function (el) { io.observe(el); });
} else {
  revealEls.forEach(function (el) { el.classList.add("in"); });
}

// ===== Hero fade on scroll =====
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const heroContent = document.querySelector(".hero__content");
const heroModel = document.querySelector(".hero__model");
const MODEL_BASE_OPACITY = 0.7;

if (!prefersReducedMotion && (heroContent || heroModel)) {
  const onScroll = function () {
    const p = Math.min(window.scrollY / (window.innerHeight * 0.8), 1); // 0 → 1
    if (heroContent) {
      heroContent.style.opacity = String(1 - p);
      heroContent.style.transform = "translateY(" + p * 30 + "px)";
    }
    if (heroModel) {
      heroModel.style.opacity = String((1 - p) * MODEL_BASE_OPACITY);
    }
  };
  window.addEventListener("scroll", function () { requestAnimationFrame(onScroll); }, { passive: true });
  onScroll();
}

// ===== "Order" buttons: prefill project name, jump to form (Shop page) =====
document.querySelectorAll(".order-btn").forEach(function (btn) {
  btn.addEventListener("click", function () {
    const field = document.getElementById("project");
    if (field) field.value = btn.getAttribute("data-project");
    const orderSection = document.getElementById("order");
    if (orderSection) orderSection.scrollIntoView({ behavior: "smooth" });
    if (field) field.focus({ preventScroll: true });
  });
});

// ===== Order form submit (Shop page) =====
const form = document.getElementById("order-form");
const status = document.getElementById("form-status");
const submitBtn = document.getElementById("submit-btn");

function setStatus(message, state) {
  if (!status) return;
  status.textContent = message;
  if (state) status.setAttribute("data-state", state);
  else status.removeAttribute("data-state");
}

if (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending…";
    setStatus("Sending your order…", "");

    fetch("https://formsubmit.co/ajax/" + ORDER_EMAIL, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: new FormData(form),
    })
      .then(function (res) { return res.json(); })
      .then(function () {
        form.reset();
        setStatus("Thank you. Your order has been sent — we will contact you shortly.", "success");
      })
      .catch(function () {
        setStatus("Something went wrong. Please email us directly at " + ORDER_EMAIL + ".", "error");
      })
      .finally(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = "Submit order";
      });
  });
}
