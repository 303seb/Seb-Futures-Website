# Seb-Futures-Website

Sebastian Salazar

Trading mentorship site for The Market Element — NQ / ES futures education,
Discord community, and giveaways.

Static HTML/CSS/JS. No build step, no dependencies.

## Pages

| File | Sections |
| --- | --- |
| `index.html` | Hero, partners, stats, features, pricing, testimonials, FAQ, CTA |
| `discord.html` | Header, stats, safety notice |
| `giveaways.html` | Header, Giveaway/Rules tabs, scam warning + terms |
| `testimonials.html` | The full quote wall. **Unlisted** — see below |

The home page follows a single-page layout with anchor sections. Nav links
resolve to `index.html#pricing` etc. so they work from any page.

`testimonials.html` is deliberately absent from the nav: the only link to it is
the **View more testimonials** button under the home page carousel, and it
carries `robots: noindex, nofollow` so it stays out of search results. That
makes it unlisted, **not private** — anyone who has or guesses the URL can open
it, so do not put anything on it you would not show a stranger.

The six feature cards each mirror a headline item from the pricing tiers.
**Change a tier and change the matching card**, or the page promises one thing
and sells another. The tiers list every item in full rather than saying
"everything in Free, plus" — deliberately, so each column reads as a complete
offer.

## Structure

```
assets/
  css/style.css          all styling + design tokens
  js/main.js             sticky header, nav, FAQ, countdown, scroll reveal
  testimonials/          member screenshots, t-01..t-16
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

### Locked pricing tiers

The two paid tiers carry `tier--locked` plus a `.tier__lock` cover reading
**Restricted Access**, because neither is built yet. The cover fills the card so
nothing behind it is clickable, and those two `Get Access` controls are `<span>`
not `<a>`, so nothing behind it is tabbable either. **To open a tier up: delete
its `tier--locked` class and its `.tier__lock` div, and turn the `<span>` back
into an `<a>` with a real href.** Do all three or you ship a live-looking button
that goes nowhere.

Sections are marked with banner comments (`<!-- HERO -->`, `<!-- STATS -->`).
Repeated blocks — cards, steps, stat boxes — can be duplicated or deleted
freely; the grids auto-fit and the JavaScript picks up whatever is present.

### Text that is NOT a placeholder

Four things are real text, left in on purpose:

- **The promo bar** — the three partner offers, on every page.
- **The risk disclosure** in every footer. A trading education site should
  carry one; have it reviewed for your jurisdiction rather than deleted.
- **The impersonation warning** on the Discord page. Scam DMs are the
  standard attack on trading communities.
- **The scam warning and giveaway terms** on the Giveaways page. The "no
  purchase necessary" wording matters for giveaway compliance in many places.

Edit the wording freely, but think twice before removing them.

The **testimonial screenshots** are real member messages. Two of them had a
student's prop-firm account number visible (`t-02`, `t-07`); those regions are
blurred beyond recovery in the exported files. **Check any new screenshot for
account numbers, order IDs and real names before adding it** — the originals
are unedited in the source images, so a careless re-export puts them back.
Every screenshot carries `width`/`height` so the column layout does not reflow
as images load. Six cards read "Community member" because no name was visible;
they are marked with a TODO.

The **FAQ answers** are also real copy, not placeholders. Two of them make
claims that have to stay true: that the markets traded are NQ and ES, and that
no private or live signals are provided. If either ever changes, change the
answer — a stale "we don't give signals" is the kind of thing that gets a
trading site in trouble.

### Links still to fill in

- **Premium checkout** and **1-on-1 application form** — the two paid tiers are
  taped off (see below), so there is nothing to link yet
- **View more testimonials** — `href="#"` below the quote carousel
- **Affiliate links** — `href="#"` on each `.promo__item` (Alpha Futures,
  FundedNext, LVLUP Futures)
- **X/Twitter** in the footer socials (Discord, Instagram and YouTube are wired up)
- **Contact email** in the footer
- **Giveaway closing date** — the `data-countdown` attribute on
  `giveaways.html`, ISO 8601 with your UTC offset

## Mobile

Section 18b of the stylesheet is the phone layer. **Everything in it lives
inside a `max-width` media query, so the desktop layout is untouched** — keep
it that way when editing: no rule for phones belongs outside those blocks.

It is a scale-down of the same design, not a different one. The desktop rhythm
is built for a 1080px column, so at 390px the `clamp()` floors (section padding
68px, card padding 28px, heading floors) leave a page that is mostly empty
space. The phone layer brings padding, card insets and type sizes down together.

Two decisions worth knowing before changing them:

- **The three stats stay on one row.** Stacked they filled most of a phone
  screen on their own. The labels wrap to two lines at that width; that is the
  trade for not burning a screen of scroll on three numbers.
- **Testimonial cards do not shrink.** They are screenshots of small chat text,
  so a narrower card means smaller, less legible text. They stay at
  `min(78vw, 320px)` — close to desktop size, just a bigger share of the
  viewport.

## Cache busting

Asset URLs carry a version query (`style.css?v=35`). **Bump it on every CSS or
JS change** — GitHub Pages serves with `cache-control: max-age=600`, so without
it, returning visitors keep the stale file and the change looks like it never
deployed.

Use the script, not a manual find-and-replace:

```
./bump.sh          # next version
./bump.sh 42       # a specific one
```

Replacing the *current* number by hand silently skips any page already behind,
which is exactly how `discord.html` and `giveaways.html` sat on `v=24` for six
releases while `index.html` moved on. `bump.sh` rewrites whatever number it
finds, so the pages cannot drift apart.

## Local preview

```
python3 -m http.server 8000
```

Then open http://localhost:8000

## Deploy (GitHub Pages)

Settings → Pages → Source: `main`, folder `/ (root)`.
