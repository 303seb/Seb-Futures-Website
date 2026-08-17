/* ==========================================================================
   The Market Element — site behaviour
   Mobile nav, sticky header, FAQ accordion, giveaway countdown,
   scroll reveal, and the hero candlestick chart.
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
     Hero candlestick chart
     Draws a downtrend into a reversal off the highlighted demand zone —
     the same structure as the NQ chart the palette came from.
     ---------------------------------------------------------------------- */
  function initChart() {
    var svg = document.getElementById("heroChart");
    if (!svg) return;

    var W = 620, H = 330;
    var padL = 12, padR = 62, padT = 14, padB = 22;
    var NS = "http://www.w3.org/2000/svg";

    // Deterministic pseudo-random so the chart is identical on every load
    var seed = 20260810;
    function rand() {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    }

    // Build an OHLC series: drift down, base out, then reverse up
    var candles = [];
    var price = 76;
    var count = 44;

    for (var i = 0; i < count; i++) {
      var drift;
      if (i < 10) drift = 0.18;          // chop at the highs
      else if (i < 30) drift = -1.15;    // the sell-off
      else drift = 1.05;                 // reversal off the zone

      var open = price;
      var move = drift + (rand() - 0.5) * 2.4;
      var close = open + move;
      var wick = 0.5 + rand() * 1.7;

      candles.push({
        o: open,
        c: close,
        h: Math.max(open, close) + wick,
        l: Math.min(open, close) - wick
      });

      price = close;
    }

    var lows = candles.map(function (c) { return c.l; });
    var highs = candles.map(function (c) { return c.h; });
    var min = Math.min.apply(null, lows) - 2;
    var max = Math.max.apply(null, highs) + 2;

    var plotW = W - padL - padR;
    var plotH = H - padT - padB;
    var stepX = plotW / count;
    var bodyW = Math.max(3, stepX * 0.6);

    var x = function (i) { return padL + i * stepX + stepX / 2; };
    var y = function (v) { return padT + (max - v) / (max - min) * plotH; };

    function make(tag, attrs) {
      var node = document.createElementNS(NS, tag);
      Object.keys(attrs).forEach(function (k) { node.setAttribute(k, attrs[k]); });
      return node;
    }

    var frag = document.createDocumentFragment();

    // --- Horizontal grid lines ---
    for (var g = 0; g <= 4; g++) {
      var gy = padT + (plotH / 4) * g;
      frag.appendChild(make("line", {
        x1: padL, y1: gy, x2: W - padR, y2: gy,
        stroke: "rgba(255,255,255,0.06)", "stroke-width": 1
      }));
    }

    // --- The lavender demand zone (index 28 through the end) ---
    var zoneTop = y(candles[28].h + 1);
    var zoneBot = y(min + 1.5);
    frag.appendChild(make("rect", {
      x: x(28) - bodyW, y: zoneTop,
      width: W - padR - (x(28) - bodyW), height: zoneBot - zoneTop,
      fill: "rgba(147,51,234,0.24)",
      stroke: "rgba(147,51,234,0.65)", "stroke-width": 1, rx: 2
    }));

    // --- Gray supply zone up top ---
    var supTop = y(max - 2.5);
    var supBot = y(candles[9].l);
    frag.appendChild(make("rect", {
      x: padL, y: supTop,
      width: plotW * 0.52, height: supBot - supTop,
      fill: "rgba(255,255,255,0.045)",
      stroke: "rgba(255,255,255,0.14)", "stroke-width": 1, rx: 2
    }));

    // --- Dashed trendline across the sell-off ---
    frag.appendChild(make("line", {
      x1: x(10), y1: y(candles[10].h),
      x2: x(31), y2: y(candles[31].l),
      stroke: "rgba(232,232,238,0.45)", "stroke-width": 1.2,
      "stroke-dasharray": "5 4"
    }));

    // --- Candles ---
    candles.forEach(function (c, i) {
      var cx = x(i);
      var bull = c.c >= c.o;
      var color = bull ? "#2fd4b4" : "#ff5c78";

      frag.appendChild(make("line", {
        x1: cx, y1: y(c.h), x2: cx, y2: y(c.l),
        stroke: color, "stroke-width": 1
      }));

      var top = y(Math.max(c.o, c.c));
      var height = Math.max(1.4, Math.abs(y(c.o) - y(c.c)));

      frag.appendChild(make("rect", {
        x: cx - bodyW / 2, y: top,
        width: bodyW, height: height,
        fill: color, rx: 0.8
      }));
    });

    // --- Short arrow at the top of the range ---
    var sx = x(11), sy = y(candles[11].h) - 12;
    frag.appendChild(make("path", {
      d: "M" + sx + " " + sy + " l4.5 -7 h-9 z",
      fill: "#ff5c78", transform: "rotate(180 " + sx + " " + (sy - 3.5) + ")"
    }));

    // --- Long arrow at the reversal low ---
    var lowIdx = 30;
    var lx = x(lowIdx), ly = y(candles[lowIdx].l) + 14;
    frag.appendChild(make("path", {
      d: "M" + lx + " " + ly + " l4.5 7 h-9 z",
      fill: "#4d84ff", transform: "rotate(180 " + lx + " " + (ly + 3.5) + ")"
    }));

    // --- Last price tag on the right axis ---
    var last = candles[count - 1].c;
    var ly2 = y(last);
    frag.appendChild(make("line", {
      x1: padL, y1: ly2, x2: W - padR, y2: ly2,
      stroke: "rgba(176,111,247,0.7)", "stroke-width": 1, "stroke-dasharray": "3 3"
    }));
    frag.appendChild(make("rect", {
      x: W - padR + 4, y: ly2 - 10, width: 52, height: 20,
      fill: "#9333ea", rx: 3
    }));

    var tag = make("text", {
      x: W - padR + 30, y: ly2 + 4,
      "text-anchor": "middle", fill: "#17171c",
      "font-size": "10.5", "font-weight": "600",
      "font-family": "ui-monospace, SFMono-Regular, Menlo, monospace"
    });
    tag.textContent = (29600 + last * 1.6).toFixed(2);
    frag.appendChild(tag);

    svg.setAttribute("viewBox", "0 0 " + W + " " + H);
    svg.appendChild(frag);
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
    initFaq();
    initCountdown();
    initReveal();
    initChart();
    initYear();
  });
})();
