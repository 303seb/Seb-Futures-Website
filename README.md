# Seb-Futures-Website

Sebastian Salazar

Trading mentorship site for The Market Element — NQ / ES futures education,
Discord community, and giveaways.

Static HTML/CSS/JS. No build step, no dependencies.

## Pages

| File | Purpose |
| --- | --- |
| `index.html` | Home — hero, what you get, how it works, about |
| `discord.html` | Join the Discord — channels, weekly schedule, guidelines |
| `faq.html` | FAQ — accordion, grouped by category |
| `giveaways.html` | Giveaways — current prize + countdown, how to enter, past winners, rules |

## Structure

```
assets/
  css/style.css          all styling + design tokens
  js/main.js             nav, FAQ accordion, countdown, scroll reveal, hero chart
  logo.png               brand mark, transparent - nav + footer
  favicon.png            256px, browser tabs
  apple-touch-icon.png   180px, iOS home screen
  alpha-futures.svg      PLACEHOLDER promo logo - replace with the real asset
```

### About the logo files

`logo.png` is the supplied artwork, cropped to its bounding box with the flat
gray backdrop keyed out. The removal solves for the true colour behind each
partially-transparent pixel rather than just deleting gray, so the soft edges
and drop shadows do not carry a gray halo onto the white nav bubble.

The favicons keep the artwork's own gray backdrop as a plate. That is
deliberate: the rails in the mark are near-black, and on a transparent
background they would disappear against a dark browser tab.

## Palette

No background patterns. Depth comes from purple-tinted shadows in the same
lavender as the accent. The page is the off-white gray sampled from the
chart's plot area; cards are white so they lift off it.

Surfaces form a three-step ladder — page, band, card:

| Token | Value | Use |
| --- | --- | --- |
| `--bg` | `#e5e5e7` | page background (the chart's plot area) |
| `--bg-elev` | `#eeecf4` | alternating section bands |
| `--surface` | `#ffffff` | cards, panels, nav bubble |
| `--paper-deep` | `#dcdbe2` | footer |
| `--purple` | `#7365b6` | fills, marks — carries white text |
| `--purple-bright` | `#54479b` | emphasis that must be **read** |
| `--purple-deep` | `#453a80` | gradient ends |
| `--purple-soft` | `#ede9fa` | pale tint fills |
| `--purple-ring` | `rgba(207,200,234,.5)` | even ring around the nav bubble |
| `--text` | `#16171c` | body ink |
| `--red` / `--red-ink` | `#d63a54` / `#b3243c` | short signal / red text |
| `--green` / `--green-ink` | `#1e9488` / `#14746a` | bullish candles / green text |

One constraint worth keeping if you retune these:

- On these light surfaces the pale lavender is only usable as a *fill* — it
  fails contrast as text. Anything read uses `--purple-bright` or
  `--purple-deep`; the `*-ink` variants exist for the same reason.

All tokens are at the top of `assets/css/style.css`. The hero chart's colours
are set in `renderChart()` in `assets/js/main.js`.

## Filling in the content

Every piece of copy is a placeholder written in square brackets describing
what belongs in that slot, e.g. `[Put how many active members are in the
group]`. The layout, styling and JavaScript are finished — only the words
are missing.

To find what is left, search the HTML files for `[`. When a page returns no
matches, that page is done.

Structural comments mark each section (`<!-- STATS -->`, `<!-- CHANNELS -->`
and so on) so you can work one section at a time. Repeated blocks — cards,
steps, channels, FAQ items, table rows — can be duplicated or deleted freely;
the JavaScript picks up whatever is there.

### Text that is NOT a placeholder

Four things are real text, left in on purpose:

- **The promo bar** — Alpha Futures / code `NQSEB`, on every page.
- **The risk disclosure** in every footer. A trading education site should
  carry one; have it reviewed for your jurisdiction rather than deleted.
- **The impersonation warning** on the Discord page. Scam DMs are the
  standard attack on trading communities.
- **The scam warning and giveaway terms** on the Giveaways page. The "no
  purchase necessary" wording matters for giveaway compliance in many places.

Edit the wording freely, but think twice before removing them.

### Links still to fill in

- **Discord invite** — `href="#"` on the Discord page buttons
- **Alpha Futures affiliate link** — `href="#"` on the promo bar
- **Alpha Futures logo** — `assets/alpha-futures.svg` is a placeholder mark,
  not their real logo. Replace the file, keep the name
- **Discord and X** in the footer socials (Instagram and YouTube are wired up)
- **Contact email** in the footer
- **Giveaway closing date** — the `data-countdown` attribute on
  `giveaways.html`, ISO 8601 with your UTC offset

## Cache busting

Asset URLs carry a version query (`style.css?v=10`). **Bump that number on
every CSS or JS change** — GitHub Pages serves with `cache-control: max-age=600`,
so without it, returning visitors keep the stale file and the change looks
like it never deployed.

## Local preview

```
python3 -m http.server 8000
```

Then open http://localhost:8000

## Deploy (GitHub Pages)

Settings → Pages → Source: `main`, folder `/ (root)`.
