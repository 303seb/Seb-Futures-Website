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
  css/style.css       all styling + design tokens
  js/main.js          nav, FAQ accordion, countdown, scroll reveal, hero chart
  logo.svg            full brand mark - hollow bars + bevels, for large use
  logo-mark.svg       simplified solid version, used for the 32px nav mark
  favicon.svg         simplified + light plate, for browser tabs
  alpha-futures.svg   PLACEHOLDER promo logo - replace with the real asset
```

### Why three logo files

The mark is three hollow bars over two rails. That hollow slot is roughly
1px wide once the mark is drawn at nav or tab size, so the dark outline
swallows it and the whole thing reads black instead of purple. `logo-mark.svg`
and `favicon.svg` solve that by filling the bars solid. The favicon also
carries a light plate, because the rails are near-black and would vanish
against a dark browser tab on a transparent background.

Use `logo.svg` anywhere it renders larger than roughly 64px.

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

## Before going live

Placeholders that need real values:

- **Discord invite link** — `href="#"` on the join buttons in `discord.html`
- **Alpha Futures logo** — `assets/alpha-futures.svg` is a placeholder mark,
  not their real logo. Replace the file (keep the name) with the asset from
  their affiliate kit; it renders 19px tall on purple, so white works best
- **Alpha Futures affiliate link** — `href="#"` on the `.promo` bar
- **Social links** — Instagram and YouTube are wired up; Discord and X in
  the footer are still `href="#"`
- **Email** — `hello@example.com` in footers and `faq.html`
- **Stats** — member counts and session numbers on `index.html` / `discord.html`
- **Giveaway** — prize, and the `data-countdown` ISO date on `giveaways.html`
- **Past winners** — sample rows in the `giveaways.html` table

## Cache busting

Asset URLs carry a version query (`style.css?v=8`). **Bump that number on
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
