# Seb-Futures-Website

Sebastian Salazar

Trading mentorship site for The Market Element — NQ / ES futures education,
Discord community, and giveaways.

Static HTML/CSS/JS. No build step, no dependencies.

## Pages

| File | Purpose |
| --- | --- |
| `index.html` | Home — hero, stats, what you get, how it works, about, **FAQ**, CTA |
| `discord.html` | Discord — channels, weekly schedule, guidelines |
| `giveaways.html` | Giveaways — current prize + countdown, entry, winners, rules |

The FAQ used to be its own page. It is now a section on the home page
(`index.html#faq`) and is no longer in the top nav; `faq.html` was deleted.
Recover it from git history if you ever want it back as a standalone page.

## Structure

```
assets/
  css/style.css          all styling + design tokens
  js/main.js             nav, FAQ accordion, countdown, scroll reveal, hero chart
  logo-dark.png          brand mark used on the site (light linework)
  logo.png               original crop, dark linework - for light backgrounds
  favicon.png            256px, browser tabs
  apple-touch-icon.png   180px, iOS home screen
  alpha-futures.svg      PLACEHOLDER promo logo - replace with the real asset
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

- **Alpha Futures affiliate link** — `href="#"` on the promo bar
- **Alpha Futures logo** — `assets/alpha-futures.svg` is a placeholder mark,
  not their real logo. Replace the file, keep the name
- **X/Twitter** in the footer socials (Discord, Instagram and YouTube are wired up)
- **Contact email** in the footer
- **Giveaway closing date** — the `data-countdown` attribute on
  `giveaways.html`, ISO 8601 with your UTC offset

## Cache busting

Asset URLs carry a version query (`style.css?v=15`). **Bump that number on
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
