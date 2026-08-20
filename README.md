# Seb-Futures-Website

Sebastian Salazar

Trading mentorship site for The Market Element — NQ / ES futures education,
Discord community, and giveaways.

Static HTML/CSS/JS. No build step, no dependencies.

## Pages

| File | Sections currently live |
| --- | --- |
| `index.html` | Hero, stats |
| `discord.html` | Header, stats, safety notice |
| `giveaways.html` | Header, scam warning + terms |

Every remaining section holds real copy — there are no placeholders left in
any page. The template sections (cards, steps, about, FAQ, channels,
schedule, guidelines, giveaway card, how-to-enter, prize pool, winners
table, rules, closing CTAs) were removed rather than shipped half-written.

**Their CSS is deliberately still in `style.css`.** To bring a section back,
recover its markup from git history — `git show <commit>:index.html` — and
paste it in; it will style itself with no CSS work. The commit before the
strip is the one to look at.

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

- **Alpha Futures affiliate link** — `href="#"` on the promo bar
- **Alpha Futures logo** — `assets/alpha-futures.svg` is a placeholder mark,
  not their real logo. Replace the file, keep the name
- **X/Twitter** in the footer socials (Discord, Instagram and YouTube are wired up)
- **Contact email** in the footer
- **Giveaway closing date** — the `data-countdown` attribute on
  `giveaways.html`, ISO 8601 with your UTC offset

## Cache busting

Asset URLs carry a version query (`style.css?v=17`). **Bump that number on
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
