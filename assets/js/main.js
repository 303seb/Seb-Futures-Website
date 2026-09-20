/* ==========================================================================
   The Market Element — site behaviour
   Sticky header, mobile nav, typing animation, tabs, FAQ accordion,
   giveaway countdown, and scroll reveal.
   ========================================================================== */

(function () {
  "use strict";

  /* ----------------------------------------------------------------------
     Mobile navigation
     ---------------------------------------------------------------------- */
  function initNav() {
    var toggle = document.getElementById("navToggle");
    var links = document.getElementById("navLinks");
    var nav = document.getElementById("nav");
    if (!toggle || !links) return;

    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
      document.body.classList.toggle("is-locked", open);
    });

    // Close the menu after tapping any link
    links.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        links.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        document.body.classList.remove("is-locked");
      }
    });

    // Drop a border on the header once the page scrolls
    if (nav) {
      var onScroll = function () {
        nav.classList.toggle("is-stuck", window.scrollY > 8);
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
    }
  }

  /* ----------------------------------------------------------------------
     Typing animation

     Types a word out, holds, erases it letter by letter, moves to the next.
     Word list comes from the data-typer attribute as JSON.
     ---------------------------------------------------------------------- */
  function initTyper() {
    var host = document.querySelector("[data-typer]");
    if (!host) return;

    var out = host.querySelector(".typer__text");
    if (!out) return;

    var words;
    try {
      words = JSON.parse(host.getAttribute("data-typer"));
    } catch (e) {
      return;
    }
    if (!Array.isArray(words) || !words.length) return;

    // Reduced motion: show the first word and stop
    var mq = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq && mq.matches) {
      out.textContent = words[0];
      return;
    }

    var TYPE = 78, ERASE = 38, HOLD = 1500, GAP = 320;
    var i = 0, pos = 0, erasing = false;

    (function tick() {
      var word = words[i];

      if (!erasing) {
        pos += 1;
        out.textContent = word.slice(0, pos);
        if (pos >= word.length) {
          erasing = true;
          return setTimeout(tick, HOLD);
        }
        return setTimeout(tick, TYPE);
      }

      pos -= 1;
      out.textContent = word.slice(0, pos);
      if (pos <= 0) {
        erasing = false;
        i = (i + 1) % words.length;
        return setTimeout(tick, GAP);
      }
      setTimeout(tick, ERASE);
    })();
  }

  /* ----------------------------------------------------------------------
     Tab switcher

     Panels are plain [hidden] siblings, so the content is in the DOM and
     indexable whichever tab is showing. Also honours a matching #hash on
     load, which is what makes the "see the rules" link work.
     ---------------------------------------------------------------------- */
  function initTabs() {
    var lists = document.querySelectorAll("[data-tabs]");
    if (!lists.length) return;

    lists.forEach(function (list) {
      var tabs = Array.prototype.slice.call(list.querySelectorAll(".tab"));
      if (!tabs.length) return;

      function select(tab, focus) {
        tabs.forEach(function (t) {
          var on = t === tab;
          t.setAttribute("aria-selected", String(on));
          t.tabIndex = on ? 0 : -1;
          var panel = document.getElementById(t.getAttribute("aria-controls"));
          if (panel) panel.hidden = !on;
        });
        if (focus) tab.focus();
      }

      list.addEventListener("click", function (e) {
        var t = e.target.closest(".tab");
        if (t) select(t);
      });

      // Left/right arrows move between tabs, as expected of a tablist
      list.addEventListener("keydown", function (e) {
        var i = tabs.indexOf(document.activeElement);
        if (i < 0) return;
        var step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
        if (!step) return;
        e.preventDefault();
        select(tabs[(i + step + tabs.length) % tabs.length], true);
      });

      // Deep link: /giveaways.html#rules opens the Rules tab
      function fromHash() {
        var id = window.location.hash.slice(1);
        if (!id) return;
        var match = tabs.filter(function (t) {
          return t.getAttribute("aria-controls") === id;
        })[0];
        if (match) select(match);
      }

      fromHash();
      window.addEventListener("hashchange", fromHash);
    });
  }

  /* ----------------------------------------------------------------------
     Copy a discount code

     navigator.clipboard needs a secure context and can still be refused, so
     there is a execCommand fallback and, if both fail, the code stays
     selectable on screen — nothing about the card depends on this working.
     ---------------------------------------------------------------------- */
  function initCopyCode() {
    var buttons = document.querySelectorAll("[data-copy]");
    if (!buttons.length) return;

    function fallback(text) {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.cssText = "position:fixed;top:-100px;opacity:0";
      document.body.appendChild(ta);
      ta.select();
      var ok = false;
      try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
      document.body.removeChild(ta);
      return ok;
    }

    buttons.forEach(function (btn) {
      var timer;
      btn.addEventListener("click", function () {
        var text = btn.getAttribute("data-copy");

        var done = function () {
          btn.classList.add("is-copied");
          clearTimeout(timer);
          timer = setTimeout(function () { btn.classList.remove("is-copied"); }, 1600);
        };

        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(text).then(done, function () {
            if (fallback(text)) done();
          });
        } else if (fallback(text)) {
          done();
        }
      });
    });
  }

  /* ----------------------------------------------------------------------
     Discord panel

     Two jobs. First, keep the header in step with whichever channel tab is
     selected — initTabs() owns the switching, this just mirrors the name.

     Second, the only genuinely live part of the panel. Discord exposes no
     public endpoint for messages, so the conversation is static, but the
     invite endpoint returns member and online counts and allows cross-origin
     reads, so those two numbers are real and fetched on load. If the fetch
     fails the markup keeps its em-dash placeholders rather than showing a
     wrong number.
     ---------------------------------------------------------------------- */
  var DISCORD_INVITE = "RJQQMAvDkJ";

  function initDiscordPanel() {
    var panel = document.querySelector(".dui");
    if (!panel) return;

    // Mirror the selected channel into the header. The tab's textContent
    // carries the hash, emoji and separator too, so read the name from its
    // own span rather than trying to strip them back off.
    var head  = panel.querySelector(".dui__topname");
    var emoji = panel.querySelector("[data-dui-emoji]");
    var bar   = panel.querySelector("[data-dui-bar]");
    var compose = panel.querySelector("[data-dui-compose]");
    var list  = panel.querySelector(".dui__channels");

    function mirror(tab) {
      var nameEl = tab.querySelector(".dui__cname");
      var emojiEl = tab.querySelector(".dui__emoji");
      var name = nameEl ? nameEl.textContent : "";
      if (head) head.textContent = name;
      if (emoji) {
        emoji.textContent = emojiEl ? emojiEl.textContent : "";
        emoji.hidden = !emojiEl;
      }
      if (bar) bar.hidden = !emojiEl;
      if (compose) {
        compose.textContent = (emojiEl ? "\u2009" + emojiEl.textContent + "\u2009| " : " ") + name;
      }
    }

    if (head && list) {
      list.addEventListener("click", function (e) {
        var t = e.target.closest(".dui__channel");
        if (t) mirror(t);
      });
      // initTabs also moves selection with the arrow keys
      new MutationObserver(function (records) {
        records.forEach(function (r) {
          if (r.target.getAttribute("aria-selected") === "true") mirror(r.target);
        });
      }).observe(list, { subtree: true, attributes: true, attributeFilter: ["aria-selected"] });
    }

    var online = document.querySelectorAll("[data-discord-online]");
    var members = document.querySelectorAll("[data-discord-members]");
    if (!online.length && !members.length) return;

    fetch("https://discord.com/api/v10/invites/" + DISCORD_INVITE + "?with_counts=true")
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) {
        if (!d) return;
        var fmt = function (n) { return n.toLocaleString("en-US"); };
        if (typeof d.approximate_presence_count === "number") {
          online.forEach(function (el) { el.textContent = fmt(d.approximate_presence_count); });
        }
        if (typeof d.approximate_member_count === "number") {
          members.forEach(function (el) { el.textContent = fmt(d.approximate_member_count); });
        }
      })
      .catch(function () { /* placeholders stay */ });
  }

  /* ----------------------------------------------------------------------
     FAQ accordion — one open at a time within a group
     ---------------------------------------------------------------------- */
  function initFaq() {
    var items = document.querySelectorAll(".faq-item");
    if (!items.length) return;

    items.forEach(function (item) {
      var btn = item.querySelector(".faq-item__q");
      var panel = item.querySelector(".faq-item__a");
      if (!btn || !panel) return;

      btn.setAttribute("aria-expanded", "false");

      btn.addEventListener("click", function () {
        var isOpen = item.classList.contains("is-open");

        // Collapse siblings so only one answer is expanded at a time
        var group = item.closest(".faq-group") || document;
        group.querySelectorAll(".faq-item.is-open").forEach(function (other) {
          if (other === item) return;
          other.classList.remove("is-open");
          other.querySelector(".faq-item__a").style.maxHeight = null;
          other.querySelector(".faq-item__q").setAttribute("aria-expanded", "false");
        });

        item.classList.toggle("is-open", !isOpen);
        btn.setAttribute("aria-expanded", String(!isOpen));
        panel.style.maxHeight = isOpen ? null : panel.scrollHeight + "px";
      });
    });

    // Keep an open panel correctly sized if the viewport reflows
    window.addEventListener("resize", function () {
      document.querySelectorAll(".faq-item.is-open .faq-item__a").forEach(function (panel) {
        panel.style.maxHeight = panel.scrollHeight + "px";
      });
    });
  }

  /* ----------------------------------------------------------------------
     Giveaway countdown
     Target date lives in data-countdown on the container (ISO 8601).
     ---------------------------------------------------------------------- */
  function initCountdown() {
    var el = document.querySelector("[data-countdown]");
    if (!el) return;

    var target = new Date(el.getAttribute("data-countdown")).getTime();
    if (isNaN(target)) return;

    var cells = {
      days: el.querySelector('[data-unit="days"]'),
      hours: el.querySelector('[data-unit="hours"]'),
      minutes: el.querySelector('[data-unit="minutes"]'),
      seconds: el.querySelector('[data-unit="seconds"]')
    };

    var pad = function (n) { return String(n).padStart(2, "0"); };

    function tick() {
      var diff = target - Date.now();

      if (diff <= 0) {
        Object.keys(cells).forEach(function (k) {
          if (cells[k]) cells[k].textContent = "00";
        });
        var label = el.querySelector(".countdown__label");
        if (label) label.textContent = "Entries closed";
        clearInterval(timer);
        return;
      }

      var s = Math.floor(diff / 1000);
      if (cells.days) cells.days.textContent = pad(Math.floor(s / 86400));
      if (cells.hours) cells.hours.textContent = pad(Math.floor(s / 3600) % 24);
      if (cells.minutes) cells.minutes.textContent = pad(Math.floor(s / 60) % 60);
      if (cells.seconds) cells.seconds.textContent = pad(s % 60);
    }

    tick();
    var timer = setInterval(tick, 1000);
  }

  /* ----------------------------------------------------------------------
     Scroll reveal
     ---------------------------------------------------------------------- */
  function initReveal() {
    var targets = document.querySelectorAll(".reveal");
    if (!targets.length) return;

    if (!("IntersectionObserver" in window)) {
      targets.forEach(function (t) { t.classList.add("is-visible"); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
      // threshold must be 0, not a fraction. A fraction is a share of the
      // ELEMENT, so an element taller than the viewport can never reach it and
      // stays stuck at opacity 0 forever. The testimonial wall is one .reveal
      // about 7000px tall on a phone: 12% of that is 844px, more than the
      // screen, so the page rendered blank. rootMargin does the same job
      // safely, since it is measured against the viewport.
    }, { threshold: 0, rootMargin: "0px 0px -60px 0px" });

    targets.forEach(function (t, i) {
      t.style.transitionDelay = Math.min(i % 4, 3) * 70 + "ms";
      observer.observe(t);
    });
  }

  /* ----------------------------------------------------------------------
     Discord panel: fit the desktop composition to a phone

     Below 620px the panel keeps its desktop layout at a fixed design size
     and is scaled down as one piece, so the phone shows the same component
     rather than a rearranged one. The scale factor has to come from JS:
     CSS can divide a length by a number but cannot produce the bare number
     that scale() needs. Never scales above 1 -- past its design size the
     panel simply stops growing.
     ---------------------------------------------------------------------- */
  function initDuiScale() {
    var dui = document.querySelector(".dui");
    if (!dui) return;
    var wrap = dui.parentElement;
    var mq = window.matchMedia("(max-width: 620px)");

    function apply() {
      if (!mq.matches) {
        dui.style.removeProperty("--dui-k");
        return;
      }
      // offsetWidth is the laid-out width, which transforms do not affect,
      // so the design size stays in the stylesheet rather than being
      // duplicated here.
      var design = dui.offsetWidth;
      if (!design) return;
      var k = Math.min(1, wrap.clientWidth / design);
      dui.style.setProperty("--dui-k", k.toFixed(4));
    }

    apply();

    // Fires on rotation and on the address bar collapsing, both of which
    // change the available width.
    var pending;
    window.addEventListener("resize", function () {
      clearTimeout(pending);
      pending = setTimeout(apply, 80);
    });
    if (mq.addEventListener) mq.addEventListener("change", apply);

    // Late web-font swap can change nothing here, but the images inside the
    // feed can still be decoding when DOMContentLoaded fires.
    window.addEventListener("load", apply);
  }

  /* ----------------------------------------------------------------------
     Email gate

     Collect-only: the address is posted to a Google Apps Script web app,
     which appends it to a sheet. Nothing is emailed.

     The gate arms itself only when data-endpoint is filled in, so an
     unfinished setup leaves the page working rather than showing a form
     that goes nowhere. The poster is visible in the markup and hidden here,
     which means a JS failure fails open instead of locking the page.

     Apps Script does not answer CORS preflight, so the body goes as
     url-encoded form data -- a "simple" request that skips preflight -- and
     the post is fire-and-forget under no-cors. The reply cannot be read, so
     a resolved promise is taken as delivered; a rejected one falls back to
     a hidden-iframe form submit, which no CORS rule applies to.
     ---------------------------------------------------------------------- */
  function initEmailGate() {
    var form = document.querySelector("[data-gate]");
    if (!form) return;

    var section = document.querySelector("[data-gate-section]");
    var locked = document.querySelector("[data-gate-locked]");
    var errorEl = form.querySelector("[data-gate-error]");
    var input = form.querySelector("#gate-email");
    var nameInput = form.querySelector("#gate-name");
    var button = form.querySelector(".gate__submit");
    var suggestEl = form.querySelector("[data-gate-suggest]");
    var fixEl = form.querySelector("[data-gate-fix]");
    var refused = null;
    var endpoint = (form.getAttribute("data-endpoint") || "").trim();
    var KEY = "me:rb-checklist-unlocked";
    var loadedAt = Date.now();

    function unlock() {
      if (section) section.remove();
      if (locked) locked.removeAttribute("hidden");
    }

    // No endpoint yet, or this browser has already given an address.
    if (!endpoint) return unlock();
    try {
      if (window.localStorage && localStorage.getItem(KEY)) return unlock();
    } catch (err) { /* private mode: just show the gate */ }

    if (locked) locked.setAttribute("hidden", "");
    if (section) section.removeAttribute("hidden");

    function fail(message, field) {
      errorEl.textContent = message;
      errorEl.removeAttribute("hidden");
      (field || input).focus();
    }

    var IDLE = button.textContent;
    function busy(on, label) {
      button.disabled = on;
      button.textContent = on ? label : IDLE;
    }

    /* Three checks, cheapest first.

       1. Syntax. Stricter than the usual one-liner: no leading, trailing or
          doubled dots in the local part, real domain labels, and a TLD of
          at least two letters.
       2. The domain. A DNS lookup for an MX record answers "can this domain
          receive mail at all", which is as far as anyone can get without
          sending something. It catches invented domains and most typos --
          gmial.com resolves but has no mail server.
       3. Throwaway providers, which all have valid MX records and so have
          to be named.

       None of this proves the mailbox exists. Only sending to it does. */
    var SYNTAX = /^[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,}$/;

    var DISPOSABLE = ["mailinator.com", "guerrillamail.com", "sharklasers.com",
      "temp-mail.org", "tempmail.com", "10minutemail.com", "yopmail.com",
      "trashmail.com", "dispostable.com", "getnada.com", "maildrop.cc",
      "throwawaymail.com", "fakeinbox.com", "mailnesia.com", "tempr.email",
      "moakt.com", "emailondeck.com", "spamgourmet.com", "mytemp.email"];

    var POPULAR = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com",
      "icloud.com", "aol.com", "live.com", "msn.com", "comcast.net",
      "proton.me", "protonmail.com", "me.com", "mac.com", "gmx.com",
      "zoho.com", "yandex.com", "verizon.net", "att.net", "sbcglobal.net",
      "cox.net", "charter.net", "fastmail.com", "hey.com"];

    // One insertion, deletion or substitution apart.
    function offByOne(a, b) {
      if (Math.abs(a.length - b.length) > 1) return false;
      var i = 0, j = 0, edits = 0;
      while (i < a.length && j < b.length) {
        if (a.charAt(i) === b.charAt(j)) { i++; j++; continue; }
        if (++edits > 1) return false;
        if (a.length > b.length) i++;
        else if (b.length > a.length) j++;
        else { i++; j++; }
      }
      return edits + (a.length - i) + (b.length - j) <= 1;
    }

    // Two neighbouring letters swapped: hotmial, gmial, yahooo are all this.
    function swapped(a, b) {
      if (a.length !== b.length) return false;
      var diff = [];
      for (var i = 0; i < a.length; i++) {
        if (a.charAt(i) !== b.charAt(i)) diff.push(i);
        if (diff.length > 2) return false;
      }
      return diff.length === 2 && diff[1] === diff[0] + 1 &&
             a.charAt(diff[0]) === b.charAt(diff[1]) &&
             a.charAt(diff[1]) === b.charAt(diff[0]);
    }

    function suggestDomain(domain) {
      if (POPULAR.indexOf(domain) !== -1) return null;
      for (var i = 0; i < POPULAR.length; i++) {
        if (offByOne(domain, POPULAR[i]) || swapped(domain, POPULAR[i])) return POPULAR[i];
      }
      return null;
    }

    /* Google's DNS-over-HTTPS. No custom headers, so it stays a "simple"
       request and never needs a preflight. If it cannot be reached the
       answer is "unknown" and the address is let through -- a DNS outage
       must not stop real people signing up. The Apps Script checks again
       on its side, which is also what guards the endpoint against someone
       posting to it directly. */
    function domainTakesMail(domain) {
      if (!window.fetch) return Promise.resolve("unknown");
      var stop, timer = new Promise(function (resolve) {
        stop = setTimeout(function () { resolve("unknown"); }, 4000);
      });
      var query = fetch("https://dns.google/resolve?type=MX&name=" + encodeURIComponent(domain))
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (data) {
          clearTimeout(stop);
          if (!data) return "unknown";
          if (data.Status === 3) return "nodomain";
          var mx = (data.Answer || []).filter(function (a) { return a.type === 15; });
          return mx.length ? "ok" : "nomx";
        })
        .catch(function () { clearTimeout(stop); return "unknown"; });
      return Promise.race([query, timer]);
    }

    function viaIframe(body) {
      var name = "gate-sink-" + Date.now();
      var frame = document.createElement("iframe");
      frame.name = name;
      frame.style.display = "none";
      document.body.appendChild(frame);

      var proxy = document.createElement("form");
      proxy.method = "POST";
      proxy.action = endpoint;
      proxy.target = name;
      body.forEach(function (value, key) {
        var field = document.createElement("input");
        field.type = "hidden";
        field.name = key;
        field.value = value;
        proxy.appendChild(field);
      });
      document.body.appendChild(proxy);
      proxy.submit();
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      errorEl.setAttribute("hidden", "");
      suggestEl.setAttribute("hidden", "");

      var name = nameInput.value.trim();
      if (!name) return fail("Please enter your name.", nameInput);

      var email = input.value.trim();
      if (!SYNTAX.test(email)) return fail("That does not look like an email address.");

      var at = email.lastIndexOf("@");
      var domain = email.slice(at + 1).toLowerCase();

      if (DISPOSABLE.indexOf(domain) !== -1) {
        return fail("Please use a permanent email address, not a temporary one.");
      }

      // Offered once. Submitting the same address again accepts it, because
      // someone may genuinely own the domain that looks like a typo.
      var better = suggestDomain(domain);
      if (better && better !== refused) {
        refused = better;
        fixEl.textContent = email.slice(0, at + 1) + better;
        suggestEl.removeAttribute("hidden");
        return;
      }
      suggestEl.setAttribute("hidden", "");

      // Honeypot filled, or submitted faster than a person can type: a bot.
      // Both are answered with the success state so it learns nothing.
      var trapped = form.querySelector("#gate-website").value !== "" ||
                    Date.now() - loadedAt < 1200;

      function done() {
        try {
          if (window.localStorage) localStorage.setItem(KEY, "1");
        } catch (err) { /* nothing to do */ }
        unlock();
        if (locked) {
          var poster = locked.querySelector(".poster");
          if (poster) poster.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }

      if (trapped) return done();

      function send() {
        button.textContent = "Unlocking...";
        var body = new URLSearchParams();
        body.append("name", name);
        body.append("email", email);
        body.append("source", "rejection-block-checklist");

        if (window.fetch) {
          fetch(endpoint, { method: "POST", mode: "no-cors", body: body })
            .then(done, function () { viaIframe(body); done(); });
        } else {
          viaIframe(body);
          done();
        }
      }

      busy(true, "Checking...");
      domainTakesMail(domain).then(function (verdict) {
        if (verdict === "nodomain") {
          busy(false);
          return fail("There is no such domain. Check the spelling after the @.");
        }
        if (verdict === "nomx") {
          busy(false);
          return fail("That domain cannot receive email. Check the spelling after the @.");
        }
        send();   // "ok", or "unknown" when DNS could not be reached
      });
    });

    // Accepting the suggested spelling resubmits straight away.
    form.querySelector("[data-gate-fix]").addEventListener("click", function () {
      input.value = fixEl.textContent;
      suggestEl.setAttribute("hidden", "");
      refused = null;
      if (form.requestSubmit) form.requestSubmit();
      else form.dispatchEvent(new Event("submit", { cancelable: true }));
    });
  }

  /* ----------------------------------------------------------------------
     Misc
     ---------------------------------------------------------------------- */
  function initYear() {
    document.querySelectorAll("[data-year]").forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initNav();
    initTyper();
    initTabs();
    initCopyCode();
    initDiscordPanel();
    initDuiScale();
    initEmailGate();
    initFaq();
    initCountdown();
    initReveal();
    initYear();
  });
})();
