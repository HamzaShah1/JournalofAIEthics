/* theme.js — Journal of AI Ethics */
(function () {
  'use strict';

  /* Apply theme immediately to prevent flash */
  var stored = localStorage.getItem('laiej-theme');
  var prefersDark = window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches;
  var theme = stored || (prefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', theme);

  function updateToggle(theme) {
    var btn = document.getElementById('theme-toggle');
    if (!btn) return;
    if (theme === 'dark') {
      btn.textContent = '☀ Light';
      btn.setAttribute('aria-label', 'Switch to light mode');
    } else {
      btn.textContent = '☽ Dark';
      btn.setAttribute('aria-label', 'Switch to dark mode');
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    updateToggle(document.documentElement.getAttribute('data-theme'));

    var btn = document.getElementById('theme-toggle');
    if (!btn) return;

    btn.addEventListener('click', function () {
      var current = document.documentElement.getAttribute('data-theme');
      var next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('laiej-theme', next);
      updateToggle(next);
    });
  });

  /* Mobile sidebar toggle */
  document.addEventListener('DOMContentLoaded', function () {
    var hamburger = document.getElementById('hamburger-btn');
    var sidebar   = document.getElementById('left-sidebar');
    var overlay   = document.getElementById('sidebar-overlay');

    if (!hamburger || !sidebar) return;

    hamburger.addEventListener('click', function () {
      var open = sidebar.classList.toggle('open');
      if (overlay) overlay.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', open);
    });

    if (overlay) {
      overlay.addEventListener('click', function () {
        sidebar.classList.remove('open');
        overlay.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    }
  });
})();
