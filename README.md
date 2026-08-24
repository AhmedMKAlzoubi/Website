# DC-001 Digital Card — website (v4)

A five-sheet site for the Digital Card, an NFC business card with an e-paper panel
and three printed case variants.

The site is presented as **an engineering drawing of the product**: drafting paper,
hairline rules, dimension lines with leader callouts, numbered sections, spec tables,
a revision history and a fixed title block.

**No database.** Orders are emailed through a relay (FormSubmit) and are not stored
anywhere.

## Design versions

| Version | Where | Look |
|---|---|---|
| v1 | `../WebsiteProject-v1-backup/` | Monochrome dark, zig-zag rows |
| v2 | `../WebsiteProject-v2-backup/` | Light "technical editorial", teal accent |
| v3 | `../WebsiteProject-v3-backup/` | Vibrant dark, aurora gradients, heavy motion |
| **v4** | **this folder** | Engineering drawing sheet |

Each backup is a complete standalone copy — open its `index.html` to view it.

## The house rules for v4

These are deliberate, and worth keeping if the site is extended:

- **No gradients, no drop shadows, no rounded corners, no blur, no glow.**
- Two spot colours only: `--red` for annotation, `--blue` for links.
- Flat colour, hairline rules, square corners.
- Motion is mechanical — rules extend, dimension lines draw themselves, readouts
  tick. Nothing bounces or floats.
- Type: Archivo (condensed, uppercase for headings) + JetBrains Mono for all data.

## Sheets

| File | Sheet | Content |
|---|---|---|
| `index.html` | 1 | General arrangement, specification, variants, build sequence, revisions |
| `shop.html` | 2 | Order sheet — the three variants and the request form |
| `projects.html` | 3 | Drawing index — other work |
| `docs.html` | 4 | Notes and procedures |
| `about.html` | 5 | Engineer |

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
3. The title block and footer on all five pages

**One-time activation:** send one test order. FormSubmit emails you a confirmation
link — click it once and every order after that lands in your inbox automatically.

**Prices** — in `shop.html`, look for `class="price"`. Currently marked *indicative*.

**Colours** — the whole palette is at the top of `style.css` under `:root`.

**The dimension lines on the hero** — in `index.html`, the `<svg class="annot">` block.
Coordinates are in a 1000 × 920 space matching the frame; each line has a `--d` value
setting its draw order.

**Title block** — the fixed strip at the bottom of every page. Sheet number, revision
and contact live there.

## Run it locally

```
python -m http.server 8080
```

Then open http://localhost:8080/

## Notes for later

- Card payments (Stripe etc.) are not wired up — cash on delivery or a payment link.
- Prices are indicative and confirmed per order.
- Fonts and the 3D viewer load from a CDN; everything else is local.
- All motion respects the operating system's "reduce motion" setting.
- `images/` is left over from earlier versions and is not used by v4.

### About the 5 MB PCB model

`digital_card.glb` looks alarming at 5.2 MB, but **leave it alone**. It is mostly
repeated per-component structure, so it gzips to about **556 KB** — and any real host
(GitHub Pages included) serves it gzipped automatically. Over the wire it is a ~0.5 MB
download, which is fine on mobile.

It only feels heavy on the local `python -m http.server`, which does not compress.

Merging the 8,487 sub-meshes into one does shrink the raw file to 1.9 MB, but it
flattens the per-part materials and the board loses its silkscreen and component
detail. Not worth it.
