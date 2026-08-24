# Digital Card — website

A five-page site for presenting and selling the Digital Card (a custom NFC business
card) and other embedded builds.

Light theme by default with a dark toggle, scroll-driven animations, and interactive
3D models exported straight from KiCad and FreeCAD.

**No database.** Orders are emailed through a relay (FormSubmit) and are not stored
anywhere.

## Pages

| File | What it is |
|---|---|
| `index.html` | Home — hero, case-variant explorer, feature grid |
| `shop.html`  | Products, prices, and the order form |
| `projects.html` | Portfolio of past builds |
| `docs.html`  | Specs, assembly, ordering, FAQ |
| `about.html` | Background, toolkit, certificates |

Shared: `style.css`, `script.js`, `images/`, `models/`.

## The 3D models

| File | Source |
|---|---|
| `models/digital_card.glb` | The PCB, exported from KiCad |
| `models/case-card.glb` | Card variant (tray + cover) |
| `models/case-nameplate.glb` | Desk nameplate variant |
| `models/case-badge.glb` | Conference badge variant |

**Regenerate the PCB** after changing the board:

```
kicad-cli pcb export glb --output models/digital_card.glb --include-soldermask --include-silkscreen --subst-models --force "C:/Users/Ahmed/Desktop/digital_card/digital card.kicad_pcb"
```

**Regenerate a case** after changing the STLs — needs `pip install trimesh numpy scipy`,
then load the tray and cover, centre them, and export as `.glb`.

## How to change things (no coding needed)

**Where orders are sent** — three places:
1. `script.js`, the `ORDER_EMAIL` line at the top
2. `shop.html`, the form's `action="https://formsubmit.co/...your email..."`
3. The footer email on all five pages

**One-time activation:** send one test order. FormSubmit emails you a confirmation
link — click it once and every order after that lands in your inbox automatically.

**Prices** — in `shop.html`, look for `class="price"`.

**Brand name** — currently "Digital Card". It appears in the header and footer of
each page next to `class="glyph"`, and in each page's `<title>`.

**Contact details** — the footer block near the bottom of each page.

**Colours** — all at the top of `style.css` under `:root` (light) and
`:root[data-theme="dark"]`. Change once, it applies everywhere.

## Run it locally

```
python -m http.server 8080
```

Then open http://localhost:8080/

## Notes for later

- Card payments (Stripe etc.) are not wired up — customers choose cash on delivery
  or ask for a payment link.
- The 3D viewer library and fonts load from a CDN; everything else is local.
- The previous dark-only build is kept untouched at `../WebsiteProject-v1-backup/`.
