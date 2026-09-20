# Seb-Futures-Website

Sebastian Salazar

Trading mentorship site for The Market Element — NQ / ES futures education,
Discord community, and giveaways.

Static HTML/CSS/JS. No build step, no dependencies.

## Pages

| File | Sections |
| --- | --- |
| `index.html` | Hero, partners, stats, about, features, pricing, testimonials, discounts, FAQ, CTA |
| `discord.html` | Header, stats, safety notice |
| `giveaways.html` | Header, Giveaway/Rules tabs, scam warning + terms |
| `testimonials.html` | The full quote wall. **Unlisted** — see below |
| `rejection-block-checklist.html` | Free-resource poster + PDF. **Unlisted** |

The home page follows a single-page layout with anchor sections. Nav links
resolve to `index.html#pricing` etc. so they work from any page.

Two pages are deliberately absent from the nav and both carry
`robots: noindex, nofollow`:

- `testimonials.html` — the only link to it is the **View more testimonials**
  button under the home page carousel.
- `rejection-block-checklist.html` — **nothing** links to it. Shared by URL only.

Unlisted is **not private**: anyone with the URL can open it and pass it on, so
do not put anything on either page you would not show a stranger. Do not add a
`robots.txt` to hide them — a disallow rule publishes the very paths it is
meant to conceal. `noindex` is the right tool and is already in place.

The poster is shown as an image, not an embedded PDF: iOS Safari renders
`<embed>`/`<iframe>` PDFs as a grey box or forces a download, so most phone
visitors would see nothing. The PDF is the download button. Both files live in
`assets/resources/` and are generated from the source artwork — regenerate both
together if the artwork changes.

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

Two components scroll on their own: the partner strip and the testimonial
carousel. Both use the same trick — two identical groups in a track sliding
exactly `-50%`, so the second lands where the first began and the loop has no
seam. **If you add or remove an item, change both groups**, or the loop will
jump. The duplicate group carries `aria-hidden` so screen readers hear the
content once.

The **discount carousel** is a different thing: a CSS `scroll-snap` scroller,
not a marquee and not a JS slider. Touch swiping and keyboard arrows come from
the browser; `initCarousel()` only wires the two arrow buttons and disables
them at each end. With JS off it is still a working horizontal scroller. Add or
remove `.deal` cards freely — nothing is duplicated.

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

- **The risk disclosure** in every footer. A trading education site should
  carry one; have it reviewed for your jurisdiction rather than deleted. It is
  a `<details>` so the footer stays small — the headline warning is the
  always-visible `<summary>` and the full text is still in the DOM, so
  collapsing it hides nothing from crawlers. Do not trim the wording to save
  space; collapse is the space saving.
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
- **Top One Futures** in the discount carousel has no affiliate link, so its
  button is a disabled `<span>` reading "Link coming soon" rather than a dead
  `href="#"`. Its code is shown as `SEB` — that was the code on the third slot
  of the old promo bar, which listed LVLUP Futures; **confirm it before
  trusting it.** Swap the span for an `<a ... target="_blank"
  rel="sponsored noopener">` when the link arrives.

  Note: that URL 307-redirects to `/usa` for US visitors and the redirect
  drops the query string, so `fpr=SEB` never reaches the landing page. Check
  the FundedNext dashboard registers a click before relying on it; the
  workaround is a link whose destination does not redirect.
- **X/Twitter** in the footer socials (Discord, Instagram and YouTube are wired up)
- **Giveaway closing date** — the `data-countdown` attribute on
  `giveaways.html`, ISO 8601 with your UTC offset

## The palette

Dark theme, rebuilt from a client reference. Page `#030305`, cards `#101015`,
purple `#cabbfb` — light enough to read straight onto the page at 11.8:1, so
anything sitting **on** a purple fill uses `--purple-ink` (`#16111f`, 10.6:1).
White on the purple is 1.75:1 and must never be used.

The ground is not flat black: `body::before` lays a 76px grid at ~3% white,
masked to fade out before it reaches the headline, and `body::after` adds a
purple bloom behind the hero plus an edge vignette. Both are `position: fixed`
so they do not slide under the content, and `z-index: 0` with the real content
at `z-index: 1`.

## The hero

`.hero__title` uses `background-clip: text` with a white-to-grey gradient, and
its `<span>` carries a purple gradient for the brand half. The span is
`white-space: nowrap` so "The Market Element" never splits mid-phrase —
checked at 320-1920px, it always fits because the clamp scales it down first.

`.hero__shot` is an empty framed slot for a screenshot of the Discord server.
Drop in an `<img>` and the frame sizes itself; the bottom border and radius are
deliberately absent so it runs off the fold like the reference.

## The Discord panel

`.dui` on the home page is a **styled replica of the real server, not an
embed.** That is forced, not stylistic:

- Discord exposes **no public endpoint that returns messages.** Reading a
  channel needs a bot token and something running to hold it; a token in
  client-side JS is a leaked token, and this site is static. The conversation
  is fixed content and will not update when people post.
- The **member and online counts are live.** The invite endpoint
  (`/api/v10/invites/<code>?with_counts=true`) returns both and allows
  cross-origin reads, so `initDiscordPanel()` fetches them on load. On failure
  the em-dash placeholders stay rather than a wrong number appearing.
- Enabling the server widget (Server Settings → Widget) would additionally
  expose up to 100 **online members with avatars** — still no messages.

The sidebar mirrors the real server: seventeen channels in their real
categories. `#trades` carries real messages transcribed from a screenshot,
including the pinned `@everyone` and luhrob's chart
(`assets/discord/trade-luhrob.jpg`, cropped from the same screenshot).
**Every other channel is a `.dui__feed--locked` panel** — which is what a
non-member genuinely sees, and doubles as a CTA.

Channels are ordinary tabs on `initTabs()`, so arrow-key navigation is free.
To add one, add a `<button class="tab dui__channel">` whose `aria-controls`
names a matching `.dui__feed`. The header, its emoji and the compose bar are
mirrored from the selected tab's `.dui__cname` / `.dui__emoji` spans — read
those, never the tab's `textContent`, which also carries the hash and
separator.

### Four traps this component hit

- `[hidden]` is only `display: none` in the UA sheet, so a panel with an
  author `display` ignores it. There is a global
  `[hidden] { display: none !important; }`.
- A `1fr` grid track floors at min-content, so the phone channel scroller
  widened the panel instead of scrolling. Tracks are `minmax(0, 1fr)` and
  `.dui__main` carries `min-height: 0`.
- `.hero__shot img` (0,1,1) out-specifies `.dui__shot` (0,1,0), so the chart
  rendered full width. The rule is `.dui .dui__shot`.
- Hiding a count span on mobile left its label text node behind
  ("26 online members"). Number and label are wrapped together in
  `.dui__presence-more`.

## The closing arc

`.cta__arc` is a very wide, very tall box with only its top two corners
rounded. The slash syntax `50% 50% 0 0 / 100% 100% 0 0` gives those corners a
vertical radius equal to the full height, which turns a rectangle into a dome;
only its crown sits inside the section and the rest is clipped, so the rim
reads as a horizon.

Two things keep it honest at any width. `.cta` declares `--cta-pad` and
`--cta-mark`, and the arc's `top` is `calc(var(--cta-pad) + var(--cta-mark)/2)`
— so the logo tile straddles the rim rather than the two being lined up by
eye at one breakpoint. And a horizontal mask fades the rim out before the
viewport edge instead of letting it stop dead.

On phones the same 190%-wide ellipse becomes a tight dome, so it widens to
330% against a taller box, which flattens the curve back out.

## Discount cards

One card per firm, all shown at once (the carousel is gone). Each card is a
branded banner that links out, the firm name and tagline, a click-to-copy code
pill, and a slot for the walkthrough video.

The banner washes are **CSS gradients standing in for the firms' own
artwork** — to use a real image, add `background-image` to
`.deal__banner--<slug>`. Each firm keeps its own colour (Alpha green,
FundedNext indigo) so the three read as three brands.

`initCopyCode()` handles the code pill. `navigator.clipboard` needs a secure
context and can still be refused, so there is an `execCommand` fallback, and
if both fail the code is still on screen to read. Nothing about the card
depends on the copy working.

## The testimonial wall

Three vertical marquees: **outer columns travel down, the middle one up.**
Same trick as the horizontal strips turned 90 degrees — each track holds its
set twice and moves exactly `-50%`, so the second copy lands where the first
began. **Add a card to BOTH copies in the same column** or the loop jumps.
The duplicate set is `aria-hidden` with empty `alt`, so a screen reader hears
each screenshot once.

Screenshots only, no name captions. On phones the third column is hidden —
three columns at 390px gives ~110px cards.

The Whop panel rides in the middle column and uses **Whop's red, not the site
purple**, for the same reason the Discord button stays blurple. It currently
shows "Reviews coming soon": there is no rating yet, and a made-up score is
not an option. The markup carries a comment with exactly what to swap in.

## Typography

**One family, Inter, everywhere.** The site used to set codes, badges, prices
and labels in JetBrains Mono; that is gone, along with its font request. Do not
reintroduce a second family — if you want tabular figures for a price or a
countdown, use `font-variant-numeric: tabular-nums` (the `.mono` utility class
does exactly that and nothing else).

## The video slot

`#about` has a 16:9 `.vidbox` placeholder. To drop the real video in, replace
everything **inside** `.vidbox` with the embed — an `<iframe>` or a `<video>`.
Both are already absolutely positioned to fill the frame by the CSS, so the
embed needs no width, height or wrapper of its own.

## The typing animation

The typed word grows and shrinks, which moves the line's wrap point and can
pop the paragraph between one line and two, shoving everything below it up and
down on a loop. That is held off by geometry, not by reserving width: the lede
is short enough to stay on one line at 375px and up, and below 374px
`.typer-slot` becomes `display: block` so the word sits on its own line and the
height is two lines for **every** word.

Reserving a fixed width on the slot also works, but the lede is centred, so a
short word then leaves the whole line visibly off-centre — 46px at desktop
width, measured. Do not reintroduce it.

**If you add a longer word to `data-typer`, re-check the wrap** at 375px and at
desktop width; a word long enough to wrap the line brings the jump back.

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

Asset URLs carry a version query (`style.css?v=60`). **Bump it on every CSS or
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
