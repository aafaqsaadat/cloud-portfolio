(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('js');
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Footer year */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  /* Theme toggle (remembers the choice when storage is available) */
  var themeBtn = document.getElementById('theme');
  function systemDark() { return window.matchMedia('(prefers-color-scheme: dark)').matches; }
  try { var saved = localStorage.getItem('theme'); if (saved) root.setAttribute('data-theme', saved); } catch (e) {}
  if (themeBtn) themeBtn.addEventListener('click', function () {
    var current = root.getAttribute('data-theme') || (systemDark() ? 'dark' : 'light');
    var next = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
  });

  /* Tabs */
  var tabs = [].slice.call(document.querySelectorAll('.tab'));
  var panels = [].slice.call(document.querySelectorAll('.panel'));
  function show(id, focus, push) {
    if (!document.getElementById(id) || !document.getElementById('tab-' + id)) id = 'home';
    tabs.forEach(function (t) {
      var on = t.id === 'tab-' + id;
      t.setAttribute('aria-selected', on);
      t.tabIndex = on ? 0 : -1;
      if (on) { if (focus) t.focus(); t.scrollIntoView({ block: 'nearest', inline: 'center' }); }
    });
    panels.forEach(function (p) { p.hidden = p.id !== id; });
    if (push && location.hash !== '#' + id) history.replaceState(null, '', '#' + id);
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { show(t.id.slice(4), false, true); });
    t.addEventListener('keydown', function (e) {
      var n = e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowLeft' ? i - 1 :
              e.key === 'Home' ? 0 : e.key === 'End' ? tabs.length - 1 : null;
      if (n === null) return;
      e.preventDefault();
      n = (n + tabs.length) % tabs.length;
      show(tabs[n].id.slice(4), true, true);
    });
  });
  document.querySelectorAll('[data-tab]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault(); show(a.dataset.tab, false, true); window.scrollTo({ top: 0 });
    });
  });
  window.addEventListener('hashchange', function () { show(location.hash.slice(1), false, false); });
  show(location.hash.slice(1) || 'home', false, false);

  /* Typing effect on the home tab */
  var typed = document.getElementById('typed');
  if (typed && !reduced) {
    var roles = ['cloud computing student', 'AWS builder', 'IoT tinkerer', 'aspiring cloud intern'];
    var r = 0, c = roles[0].length, deleting = true;
    (function tick() {
      var word = roles[r];
      typed.textContent = word.slice(0, c);
      var delay = deleting ? 40 : 85;
      if (!deleting && c === word.length) { deleting = true; delay = 1800; }
      else if (deleting && c === 0) { deleting = false; r = (r + 1) % roles.length; delay = 300; }
      else { c += deleting ? -1 : 1; }
      setTimeout(tick, delay);
    })();
  }

  /* Soft spotlight that follows the pointer on project cards */
  document.querySelectorAll('.project').forEach(function (card) {
    card.addEventListener('pointermove', function (e) {
      var b = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - b.left) + 'px');
      card.style.setProperty('--my', (e.clientY - b.top) + 'px');
    });
  });

  /* Copy email */
  var copy = document.getElementById('copy');
  if (copy) copy.addEventListener('click', function () {
    var email = 'aafaqsaadat@gmail.com';
    function done(msg) { copy.textContent = msg; setTimeout(function () { copy.textContent = 'Copy email'; }, 2000); }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(email).then(function () { done('Copied'); }, function () { done(email); });
    } else { done(email); }
  });
})();
