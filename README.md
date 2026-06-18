# Embedded Projects — website

A single-page site for presenting and selling embedded projects.
Black and white, scroll-based: landing at the top, projects in the middle
(alternating left/right), an order form, and a fixed contact strip at the bottom.

No database is used. Orders are emailed to you through a free relay
(FormSubmit) and are not stored anywhere.

## Files

- `index.html` — the page content
- `style.css` — all styling
- `script.js` — order buttons and form sending
- `images/` — project photos (placeholders for now)

## How to change things (no coding experience needed)

**Change the email that receives orders**
1. In `script.js`, edit the line `const ORDER_EMAIL = "...";`
2. In `index.html`, edit the form's `action="https://formsubmit.co/...your email..."`
3. In `index.html`, edit the email shown in the bottom contact strip.

**One-time activation (do this once):** Submit one test order on the site.
FormSubmit will email you a link to confirm. Click it once, and after that all
orders arrive in your inbox automatically.

**Edit contact info:** In `index.html`, find the `contact-strip` section near the
bottom and change the phone and location.

**Add a project:** Copy one `<article class="project"> ... </article>` block in
`index.html`, change the title, description, price, and the `data-project` value
on the Order button.

**Replace a placeholder photo:** Put your image in the `images/` folder and change
the `src="images/project-1.svg"` to your file (e.g. `images/project-1.jpg`).

## Notes for later

- Real card payments (Stripe, etc.) are not included yet — for now customers
  choose "cash on delivery" or "request a payment link".
- When you want stronger privacy/security, the email relay can be replaced with
  your own backend.
