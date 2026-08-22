/* ==========================================================================
   The Market Element — site behaviour
   Sticky header, mobile nav, typing animation, tabs, FAQ accordion,
   giveaway countdown, and scroll reveal.
   ========================================================================== */

(function () {
  "use strict";

  /* ----------------------------------------------------------------------
     Sticky promo bar

     Both the promo bar and the nav are sticky, so the nav has to park at
     exactly the bar's height or they overlap. That height depends on font
     loading and the viewport, so it is measured rather than hard-coded and
     published as --promo-h for the CSS to use.
     ---------------------------------------------------------------------- */
  function initStickyTop() {
    var promo = document.querySelector(".promo");
    if (!promo) return;

    var apply = function () {
      document.documentElement.style.setProperty(
        "--promo-h", promo.offsetHeight + "px"
      );
    };

    apply();
    window.addEventListener("resize", apply);

    // Catches the reflow when the web fonts finish loading
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(apply);
    }
    if (window.ResizeObserver) {
      new ResizeObserver(apply).observe(promo);
    }
  }

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
    }, { threshold: 0.12, rootMargin: "0px 0px -60px 0px" });

    targets.forEach(function (t, i) {
      t.style.transitionDelay = Math.min(i % 4, 3) * 70 + "ms";
      observer.observe(t);
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
    initStickyTop();
    initNav();
    initTyper();
    initTabs();
    initFaq();
    initCountdown();
    initReveal();
    initYear();
  });
})();
