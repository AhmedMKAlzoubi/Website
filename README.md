# Digital Card — website (v3)

A five-page site for presenting and selling the Digital Card (a custom NFC business
card) and other embedded builds.

Vibrant dark theme, animated aurora background, per-section colour shifting,
tilt/magnetic interactions, a horizontal-scroll story, and interactive 3D models
exported from KiCad and FreeCAD.

**No database.** Orders are emailed through a relay (FormSubmit) and are not stored
anywhere.

## Design versions

| Version | Where | Look |
|---|---|---|
| v1 | `../WebsiteProject-v1-backup/` | Monochrome dark, zig-zag rows |
| v2 | `../WebsiteProject-v2-backup/` | Light "technical editorial", teal accent, dark toggle |
| **v3** | **this folder** | Vibrant dark, aurora gradients, heavy motion |

Each backup is a complete standalone copy — open its `index.html` to view it.

## Pages

| File | What it is |
|---|---|
| `index.html` | Home — hero, variant explorer, horizontal story, feature grid |
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
then load tray + cover, centre on origin, export `.glb`.

## How to change things (no coding needed)

**Where orders are sent** — three places:
1. `script.js`, the `ORDER_EMAIL` line at the top
2. `shop.html`, the form's `action="https://formsubmit.co/...your email..."`
3. The footer email on all five pages

**One-time activation:** send one test order. FormSubmit emails you a confirmation
link — click it once and every order after that lands in your inbox automatically.

**Prices** — in `shop.html`, look for `class="price"`.

**Colours** — the whole palette is at the top of `style.css` under `:root`
(`--c-teal`, `--c-violet`, `--c-amber`, `--c-pink`, `--c-lime`, `--c-coral`).
Change one value and it updates everywhere.

**Section colours** — each `<section>` carries `data-accent="teal"` (etc.). The page
accent fades to that colour as you scroll into the section.

**Calm it down** — to reduce motion, lower `--dur` in `style.css`, or delete the
`.aurora` and `.spotlight` divs from a page's HTML.

**Brand name** — currently "Digital Card", in the header/footer of each page next to
`class="glyph"`, and in each page's `<title>`.

## Run it locally

```
python -m http.server 8080
```

Then open http://localhost:8080/

## Notes for later

- Card payments (Stripe etc.) are not wired up — customers choose cash on delivery
  or ask for a payment link.
- Prices are placeholders.
- The 3D viewer library and fonts load from a CDN; everything else is local.
- All motion respects the operating system's "reduce motion" setting.
