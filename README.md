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

Light "notebook" theme. The page background is the off-white gray sampled
from the chart panel in the reference screenshot, overlaid with a fine
graph-paper grid. The lavender highlight zone from that chart is the accent.

| Token | Value | Use |
| --- | --- | --- |
| `--bg` | `#e5e5e7` | page background (the chart's plot area) |
| `--bg-elev` | `#eeeef0` | alternating section bands |
| `--surface` / `--surface-2` | `#fbfbfc` / `#ffffff` | cards, panels |
| `--paper-deep` | `#dadade` | footer |
| `--purple` | `#7365b6` | fills, marks, borders |
| `--purple-bright` | `#54479b` | emphasis that must be **read** on paper |
| `--purple-deep` | `#453a80` | button gradient end |
| `--purple-soft` | `#e3dff5` | pale tint fills |
| `--text` | `#16171c` | body ink |
| `--blue` | `#2962ff` | long / buy signal |
| `--red` / `--red-ink` | `#d63a54` / `#b3243c` | short signal / red text |
| `--green` / `--green-ink` | `#1e9488` / `#14746a` | bullish candles / green text |

On a light background the pale lavender is only usable as a *fill* — it fails
contrast as text. Anything that has to be read uses `--purple-bright` or
`--purple-deep`, and the `*-ink` variants exist for the same reason.

All tokens are defined at the top of `assets/css/style.css`. The hero chart's
colours are set in `renderChart()` in `assets/js/main.js`.

## Before going live

Placeholders that need real values:

- **Discord invite link** — `href="#"` on the join buttons in `discord.html`
- **Social links** — `href="#"` in every footer and the `.socials` block
- **Email** — `hello@example.com` in footers and `faq.html`
- **Stats** — member counts and session numbers on `index.html` / `discord.html`
- **Giveaway** — prize, and the `data-countdown` ISO date on `giveaways.html`
- **Past winners** — sample rows in the `giveaways.html` table

## Local preview

```
python3 -m http.server 8000
```

Then open http://localhost:8000

## Deploy (GitHub Pages)

Settings → Pages → Source: `main`, folder `/ (root)`.
