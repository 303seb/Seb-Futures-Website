# Seb-Futures-Website

Sebastian Salazar

Trading mentorship site for the Bazz Trades community — NQ / ES futures education,
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

Pulled from the NQ/ES chart screenshot the design is based on.

| Token | Value | Use |
| --- | --- | --- |
| `--bg` | `#0c0d11` | page background |
| `--surface` | `#171a22` | cards, panels |
| `--purple` | `#8b7fc8` | primary accent (the chart's highlight zone) |
| `--purple-bright` | `#a89ade` | hover, links, emphasis |
| `--panel-light` | `#e5e5e7` | light chart panel |
| `--blue` | `#2962ff` | long / buy signal |
| `--red` | `#e0455e` | short / sell signal |
| `--green` | `#26a69a` | bullish candles, live badge |

All tokens are defined at the top of `assets/css/style.css`.

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
