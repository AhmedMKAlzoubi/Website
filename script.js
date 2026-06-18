// ===== Where orders are sent =====
// Change this to the email address that should receive orders.
const ORDER_EMAIL = "ahmedmohammedkhear@gmail.com";

// ===== "Order" buttons: fill the project name and jump to the form =====
document.querySelectorAll(".order-btn").forEach(function (btn) {
  btn.addEventListener("click", function () {
    const projectName = btn.getAttribute("data-project");
    const field = document.getElementById("project-field");
    if (field) field.value = projectName;

    const orderSection = document.getElementById("order");
    if (orderSection) orderSection.scrollIntoView({ behavior: "smooth" });
  });
});

// ===== Submit the order without leaving the page =====
const form = document.getElementById("order-form");
const status = document.getElementById("form-status");

if (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    status.textContent = "Sending your order...";

    const data = new FormData(form);

    fetch("https://formsubmit.co/ajax/" + ORDER_EMAIL, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: data,
    })
      .then(function (res) {
        return res.json();
      })
      .then(function () {
        form.reset();
        status.textContent =
          "Thank you. Your order has been sent — we will contact you shortly.";
      })
      .catch(function () {
        status.textContent =
          "Something went wrong. Please email us directly at " + ORDER_EMAIL + ".";
      });
  });
}
