/* HoralNET – interaktivita webu */
(function () {
  "use strict";

  /* ---------- Navigace ---------- */
  var nav = document.querySelector(".nav");
  var menu = document.getElementById("menu");
  var toggle = document.querySelector(".nav__toggle");

  function onScroll() { nav.classList.toggle("is-scrolled", window.scrollY > 20); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  function closeMenu() {
    menu.classList.remove("is-open");
    nav.classList.remove("menu-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Otevřít menu");
  }
  toggle.addEventListener("click", function () {
    var open = !menu.classList.contains("is-open");
    menu.classList.toggle("is-open", open);
    nav.classList.toggle("menu-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Zavřít menu" : "Otevřít menu");
  });
  menu.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", closeMenu); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeMenu(); });

  /* Zvýraznění aktivní sekce v menu */
  var links = Array.prototype.slice.call(menu.querySelectorAll('a[href^="#"]:not(.btn)'));
  if ("IntersectionObserver" in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          links.forEach(function (l) { l.classList.toggle("is-active", l.getAttribute("href") === "#" + en.target.id); });
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    links.forEach(function (l) {
      var s = document.querySelector(l.getAttribute("href"));
      if (s) spy.observe(s);
    });
  }

  /* ---------- Animace při scrollu ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el, i) {
      el.style.transitionDelay = (i % 4) * 70 + "ms";
      io.observe(el);
    });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Počítadla ---------- */
  var counters = document.querySelectorAll("[data-count]");
  if ("IntersectionObserver" in window) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target, end = +el.dataset.count, start = end > 1000 ? end - 40 : 0, t0 = null;
        function step(ts) {
          if (!t0) t0 = ts;
          var p = Math.min((ts - t0) / 1400, 1), e = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(start + (end - start) * e);
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        co.unobserve(el);
      });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { co.observe(c); });
  }

  /* ---------- Pokrytí ---------- */
  var TYPES = {
    wifi: "Bezdrátový internet",
    opt: "Kabelový internet – optika",
    lan: "Kabelový internet – LAN"
  };
  var TOWNS = [
    ["Hrčava", ["wifi"]],
    ["Bukovec", ["wifi"]],
    ["Písek", ["wifi", "opt"]],
    ["Písečná", ["wifi", "opt"]],
    ["Mosty u Jablunkova", ["wifi"]],
    ["Horní Lomná", ["wifi"]],
    ["Dolní Lomná", ["wifi"]],
    ["Bocanovice", ["wifi"]],
    ["Jablunkov", ["wifi", "lan"]],
    ["Návsí", ["wifi"]],
    ["Milíkov", ["wifi"]],
    ["Košařiska", ["wifi"]],
    ["Hrádek", ["wifi"]],
    ["Bystřice", ["wifi"]],
    ["Nýdek", ["wifi"]],
    ["Vendryně", ["wifi"]],
    ["Třinec", ["wifi", "lan"]]
  ];

  var list = document.getElementById("towns");
  var input = document.getElementById("obec");
  var result = document.getElementById("coverage-result");
  var filter = "all";

  function norm(s) { return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim(); }

  TOWNS.forEach(function (t) {
    var li = document.createElement("li");
    li.className = "town";
    li.dataset.name = norm(t[0]);
    li.dataset.types = t[1].join(" ");
    li.title = t[1].map(function (k) { return TYPES[k]; }).join(", ");
    var dots = '<span class="dots">' + t[1].map(function (k) { return '<i class="t t--' + k + '"></i>'; }).join("") + "</span>";
    li.innerHTML = dots + t[0];
    list.appendChild(li);
  });
  var items = Array.prototype.slice.call(list.children);

  function render() {
    var q = norm(input.value);
    var matches = [];
    items.forEach(function (li) {
      var typeOk = filter === "all" || li.dataset.types.split(" ").indexOf(filter) > -1;
      var qOk = !q || li.dataset.name.indexOf(q) > -1;
      li.classList.toggle("is-hidden", !(typeOk && qOk));
      li.classList.toggle("is-match", !!q && qOk && typeOk);
      if (q && qOk) matches.push(li);
    });

    result.className = "coverage__result";
    if (!q) { result.textContent = ""; return; }
    if (matches.length === 1 || (matches.length && matches[0].dataset.name === q)) {
      var li = matches[0];
      var types = li.dataset.types.split(" ").map(function (k) { return TYPES[k]; }).join(" a ");
      result.textContent = "✅ Skvělé! V obci " + li.textContent + " nabízíme: " + types + ".";
      result.classList.add("ok");
    } else if (matches.length > 1) {
      result.textContent = "Nalezeno " + matches.length + " obcí – upřesněte prosím název.";
    } else {
      result.textContent = "Tuto obec v seznamu nemáme. Zavolejte nám na 558 341 942, rádi to prověříme.";
      result.classList.add("no");
    }
  }

  input.addEventListener("input", render);
  document.querySelectorAll(".legend").forEach(function (b) {
    b.addEventListener("click", function () {
      document.querySelectorAll(".legend").forEach(function (x) { x.classList.remove("is-active"); });
      b.classList.add("is-active");
      filter = b.dataset.filter;
      render();
    });
  });
  render();

  /* ---------- Poptávkový formulář ---------- */
  var form = document.getElementById("order");
  var sel = document.getElementById("f-sluzba");

  document.querySelectorAll("[data-order]").forEach(function (a) {
    a.addEventListener("click", function () { sel.value = a.dataset.order; });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var ok = true;
    form.querySelectorAll("[required]").forEach(function (f) {
      var bad = !f.value.trim();
      f.classList.toggle("invalid", bad);
      if (bad && ok) { f.focus(); ok = false; }
    });
    if (!ok) return;

    var d = new FormData(form);
    var subject = "Poptávka z webu: " + d.get("sluzba");
    var body =
      "Služba: " + d.get("sluzba") + "\n" +
      "Jméno: " + d.get("jmeno") + "\n" +
      "Telefon: " + d.get("tel") + "\n" +
      "Obec: " + (d.get("obec") || "-") + "\n\n" +
      (d.get("zprava") || "");
    window.location.href = "mailto:posta@horalnet.cz?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
  });

  /* ---------- Rok v patičce ---------- */
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();
