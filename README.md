# Seb-Futures-Website

Sebastian Salazar

Trading mentorship site for the Seb Futures community — NQ / ES futures education,
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
  css/style.css     all styling + design tokens
  js/main.js        nav, FAQ accordion, countdown, scroll reveal, hero chart
  favicon.svg
```

## Palette

Clean white theme. No background patterns — depth comes from purple-tinted
shadows in the same lavender as the accent.

| Token | Value | Use |
| --- | --- | --- |
| `--bg` / `--surface` | `#ffffff` | page and card background |
| `--bg-elev` | `#faf9fe` | alternating section bands |
| `--paper-deep` | `#f8f6fd` | footer |
| `--purple` | `#7365b6` | fills, marks — carries white text |
| `--purple-bright` | `#54479b` | emphasis that must be **read** on white |
| `--purple-deep` | `#453a80` | gradient ends |
| `--purple-soft` | `#ede9fa` | pale tint fills |
| `--purple-edge` | `#e4defa` | solid raised edge under the nav bubble |
| `--text` | `#16171c` | body ink |
| `--red` / `--red-ink` | `#d63a54` / `#b3243c` | short signal / red text |
| `--green` / `--green-ink` | `#1e9488` / `#14746a` | bullish candles / green text |

Every shadow token is tinted with the accent purple rather than neutral
black — that is what gives the site its depth on a flat white background.

On white the pale lavender is only usable as a *fill*; it fails contrast as
text. Anything that has to be read uses `--purple-bright` or `--purple-deep`,
and the `*-ink` variants exist for the same reason.

All tokens are defined at the top of `assets/css/style.css`. The hero chart's
colours are set in `renderChart()` in `assets/js/main.js`.

## Before going live

Placeholders that need real values:

- **Discord invite link** — `href="#"` on the join buttons in `discord.html`
- **Alpha Futures logo** — `assets/alpha-futures.svg` is a placeholder mark,
  not their real logo. Replace the file (keep the name) with the asset from
  their affiliate kit; it renders 19px tall on purple, so white works best
- **Alpha Futures affiliate link** — `href="#"` on the `.promo` bar
- **Social links** — `href="#"` in the nav bubble and every footer
- **Email** — `hello@example.com` in footers and `faq.html`
- **Stats** — member counts and session numbers on `index.html` / `discord.html`
- **Giveaway** — prize, and the `data-countdown` ISO date on `giveaways.html`
- **Past winners** — sample rows in the `giveaways.html` table

## Cache busting

Asset URLs carry a version query (`style.css?v=3`). **Bump that number on
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
