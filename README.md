# Seb-Futures-Website

Sebastian Salazar

Trading mentorship site for The Market Element — NQ / ES futures education,
Discord community, and giveaways.

Static HTML/CSS/JS. No build step, no dependencies.

## Pages

| File | Sections |
| --- | --- |
| `index.html` | Hero, partners, stats, highlights, about, features, testimonials, FAQ, CTA |
| `discord.html` | Header, stats, safety notice |
| `giveaways.html` | Header, Giveaway/Rules tabs, scam warning + terms |

The home page follows a single-page layout with anchor sections. Nav links
resolve to `index.html#about` etc. so they work from any page.

## Structure

```
assets/
  css/style.css          all styling + design tokens
  js/main.js             sticky header, nav, FAQ, countdown, scroll reveal
  logo-dark.png          the mark used on the site - nav, footer, hero
  logo.png               same crop with the original dark linework
  icon-32.png            32px tab icon, rendered at size
  icon-256.png           256px icon
  icon-180.png           180px, iOS home screen
```

### About the logo files

`logo.png` is the supplied artwork, cropped to its bounding box with the flat
gray backdrop keyed out. The removal solves for the true colour behind each
partially-transparent pixel rather than just deleting gray, so soft edges and
drop shadows carry no gray halo.

`logo-dark.png` is what the site actually uses. The rails and outlines in the
artwork are near-black and disappear on the charcoal background, so the
**neutral** pixels are luminance-inverted — black linework becomes light,
white bevels become dark — while the purple, being high-saturation, passes
through untouched. Regenerate it from `logo.png` if the artwork changes.

The favicons keep the artwork's own gray backdrop as a plate, so the
near-black rails stay visible against a dark browser tab.

## Marquees

Three components scroll: the promo bar, the partner strip and the testimonial
carousel. All use the same trick — two identical groups in a track sliding
exactly `-50%`, so the second lands where the first began and the loop has no
seam. **If you add or remove an item, change both groups**, or the loop will
jump. The duplicate group carries `aria-hidden` so screen readers hear the
content once.

## Adding content back

Sections are marked with banner comments (`<!-- HERO -->`, `<!-- STATS -->`).
Repeated blocks — cards, steps, stat boxes — can be duplicated or deleted
freely; the grids auto-fit and the JavaScript picks up whatever is present.

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

- **Affiliate links** — `href="#"` on each `.promo__item` (Alpha Futures and FundedNext)
- **Google Form** — `href="#"` on the giveaway entry button
- **X/Twitter** in the footer socials (Discord, Instagram and YouTube are wired up)
- **Contact email** in the footer
- **Giveaway closing date** — the `data-countdown` attribute on
  `giveaways.html`, ISO 8601 with your UTC offset

## Cache busting

Asset URLs carry a version query (`style.css?v=24`). **Bump that number on
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
