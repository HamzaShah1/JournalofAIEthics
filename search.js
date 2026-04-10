/* search.js — Journal of AI Ethics
   Requires Fuse.js loaded before this script.
   Handles real-time search + tag filtering + sort on papers.html */

var LAIEJ = LAIEJ || {};

LAIEJ.papers = [
  {
    id: 'LAIEJ-2026-001',
    title: 'Obedience Theatre: Do Rule-Heavy System Prompts Produce Real Policy Compliance or Just Better Acting?',
    author: 'Hamza Shah',
    affiliation: 'Independent Researcher, London',
    date: 'April 2026',
    dateSort: '2026-04-01',
    abstract: 'When an assistant is given detailed internal rules, does it genuinely follow policy better, or does it simply learn to sound compliant? This paper examines the gap between behavioural compliance signals and actual policy adherence in large language models under heavily constrained system prompts.',
    tags: ['LLM Security', 'AI Ethics', 'Alignment'],
    keywords: ['large language models', 'system prompts', 'compliance', 'AI safety', 'alignment', 'policy enforcement'],
    url: 'papers/LAIEJ-2026-001/LAIEJ-2026-001.html',
    pdf: 'papers/LAIEJ-2026-001/LAIEJ-2026-001.pdf',
    wip: true
  }
  /* Add new papers here as objects with the same shape */
];

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  /* ----- Fuse.js initialisation ----- */
  var fuse = null;
  if (typeof Fuse !== 'undefined') {
    fuse = new Fuse(LAIEJ.papers, {
      keys: [
        { name: 'title',    weight: 0.40 },
        { name: 'abstract', weight: 0.30 },
        { name: 'author',   weight: 0.20 },
        { name: 'tags',     weight: 0.10 }
      ],
      threshold: 0.40,
      includeScore: true,
      ignoreLocation: true
    });
  }

  /* ----- DOM references ----- */
  var searchInput  = document.getElementById('paper-search');
  var sortSelect   = document.getElementById('sort-select');
  var filterBtns   = document.querySelectorAll('[data-filter-tag]');
  var cardList     = document.getElementById('paper-card-list');
  var noResults    = document.getElementById('no-results');

  if (!cardList) return; /* Not on papers.html */

  var activeTag   = null;
  var searchQuery = '';

  /* ----- Helpers ----- */
  function tagClass(tag) {
    return tag.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  }

  function buildCard(paper) {
    var primaryTag = paper.tags[0] || '';
    var tagsHtml = paper.tags.map(function (t) {
      return '<span class="tag-pill tag-pill--' + tagClass(t) + '">' + t + '</span>';
    }).join('');

    var wipOverlay = paper.wip
      ? '<div class="paper-wip-overlay" aria-label="Paper status notice">' +
          '<div class="paper-wip-overlay__inner">' +
            '<span class="paper-wip-overlay__badge">&#9679; Under Active Research</span>' +
            '<p class="paper-wip-overlay__title">Not Yet Formally Published</p>' +
            '<p class="paper-wip-overlay__desc">This paper is currently in progress and has not yet undergone formal peer review or publication. Content may change prior to final release.</p>' +
            '<a class="paper-wip-overlay__btn" href="mailto:hamzashah02@outlook.com">Contact the Researcher</a>' +
          '</div>' +
        '</div>'
      : '';

    return (
      '<article class="paper-card' + (paper.wip ? ' paper-card--wip' : '') + '" ' +
        'data-id="' + paper.id + '" ' +
        'data-tags="' + paper.tags.join('|') + '" ' +
        'data-date="' + paper.dateSort + '" ' +
        'data-primary-tag="' + primaryTag + '">' +
        '<div class="paper-card__ref">' + paper.id + '</div>' +
        '<h2 class="paper-card__title">' +
          '<a href="' + paper.url + '">' + paper.title + '</a>' +
        '</h2>' +
        '<div class="paper-card__byline">' +
          '<span>' + paper.author + '</span>' +
          '<span>' + paper.affiliation + '</span>' +
          '<span>' + paper.date + '</span>' +
        '</div>' +
        '<p class="paper-card__abstract">' + paper.abstract + '</p>' +
        '<div class="paper-card__tags">' + tagsHtml + '</div>' +
        '<div class="paper-card__footer">' +
          '<a class="paper-card__read" href="' + paper.url + '">Read paper &rarr;</a>' +
          '<a class="paper-card__pdf" href="' + paper.pdf + '" download>&#8595; PDF</a>' +
        '</div>' +
        wipOverlay +
      '</article>'
    );
  }

  function getSortedFiltered() {
    var pool = LAIEJ.papers;

    /* Tag filter */
    if (activeTag) {
      pool = pool.filter(function (p) {
        return p.tags.indexOf(activeTag) !== -1;
      });
    }

    /* Text search */
    if (searchQuery && fuse) {
      var results = fuse.search(searchQuery);
      var matchedIds = results.map(function (r) { return r.item.id; });
      pool = pool.filter(function (p) {
        return matchedIds.indexOf(p.id) !== -1;
      });
      /* Preserve relevance order if not sorted */
      if (!sortSelect || sortSelect.value === 'newest') {
        pool = matchedIds.map(function (id) {
          return pool.find(function (p) { return p.id === id; });
        }).filter(Boolean);
      }
    }

    /* Sort */
    if (sortSelect) {
      var dir = sortSelect.value === 'oldest' ? 1 : -1;
      pool = pool.slice().sort(function (a, b) {
        return dir * (a.dateSort < b.dateSort ? -1 : a.dateSort > b.dateSort ? 1 : 0);
      });
    }

    return pool;
  }

  function render() {
    var filtered = getSortedFiltered();
    if (filtered.length === 0) {
      cardList.innerHTML = '';
      if (noResults) noResults.classList.add('show');
    } else {
      if (noResults) noResults.classList.remove('show');
      cardList.innerHTML = filtered.map(buildCard).join('');
    }
  }

  /* ----- Event listeners ----- */
  if (searchInput) {
    searchInput.addEventListener('input', function () {
      searchQuery = this.value.trim();
      render();
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', render);
  }

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var tag = this.getAttribute('data-filter-tag');
      if (activeTag === tag) {
        activeTag = null;
        this.classList.remove('active');
      } else {
        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        activeTag = tag;
        this.classList.add('active');
      }
      render();
    });
  });

  /* Initial render */
  render();
});
