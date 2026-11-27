import { CATEGORIES, ENTRIES, LATEST_ADDITIONS, PLATFORMS, SITE_COPY } from '../data/codex-data.js';
import {
  initAnchorPositionFallback,
  initDialogClosedByFallback,
  initHintPopoverFallback,
  initScrollHeaderFallback,
  loadPlatformPolyfills,
  wireHintPopovers
} from './polyfills.js';

const STORAGE_SCHEME_KEY = 'edcodex-color-scheme';
const STORAGE_DIR_KEY = 'edcodex-direction';
const STORAGE_FAVS_KEY = 'edcodex-favorites';

const state = {
  direction: document.documentElement.getAttribute('data-direction') || 'telemetry',
  route: 'home',
  entryId: 631,
  search: '',
  category: 'all',
  platform: 'all',
  sort: 'updated',
  compactView: false,
  exportFormat: 'text',
  favorites: loadFavorites()
};

function loadFavorites() {
  try {
    const raw = localStorage.getItem(STORAGE_FAVS_KEY);
    return new Set(raw ? JSON.parse(raw) : [631]);
  } catch {
    return new Set([631]);
  }
}

function saveFavorites() {
  try {
    localStorage.setItem(STORAGE_FAVS_KEY, JSON.stringify([...state.favorites]));
  } catch {}
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function categoryIconSvg(iconName) {
  const paths = {
    database: '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.66 3.58 3 8 3s8-1.34 8-3V5"/><path d="M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3"/>',
    exchange: '<path d="M16 3l4 4-4 4"/><path d="M20 7H4"/><path d="M8 21l-4-4 4-4"/><path d="M4 17h16"/>',
    monitor: '<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>',
    users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    chart: '<path d="M3 3v18h18"/><path d="M7 16l4-6 4 3 5-7"/>',
    cog: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.26.6.85 1 1.51 1H21a2 2 0 1 1 0 4h-.09c-.66 0-1.25.4-1.51 1z"/>',
    compass: '<circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>',
    pin: '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
    gamepad: '<rect x="2" y="6" width="20" height="12" rx="4"/><path d="M6 12h4M8 10v4M15 11h.01M18 13h.01"/>',
    wrench: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>'
  };
  const d = paths[iconName] || paths.wrench;
  return `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">${d}</svg>`;
}

function getFilteredEntries() {
  const q = state.search.trim().toLowerCase();
  const list = ENTRIES.filter((item) => {
    if (state.category !== 'all' && !item.categories.includes(state.category)) return false;
    if (state.platform !== 'all' && !item.platforms.includes(state.platform)) return false;
    if (q) {
      const hay = `${item.title} ${item.authors} ${item.summary} ${item.categories.join(' ')}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  if (state.sort === 'alpha') {
    list.sort((a, b) => a.title.localeCompare(b.title));
  } else if (state.sort === 'stars') {
    list.sort((a, b) => getDisplayStars(b) - getDisplayStars(a) || a.updatedOrder - b.updatedOrder);
  } else {
    list.sort((a, b) => a.updatedOrder - b.updatedOrder);
  }
  return list;
}

function getDisplayStars(entry) {
  return entry.stars + (state.favorites.has(entry.id) && entry.id !== 631 ? 1 : !state.favorites.has(entry.id) && entry.id === 631 ? -1 : 0);
}

function renderToolCard(entry) {
  const isFav = state.favorites.has(entry.id);
  const starCount = Math.max(0, getDisplayStars(entry));
  const compactCls = state.compactView ? ' is-compact' : '';

  const iconsHtml = entry.categories
    .map((catName) => {
      const cat = CATEGORIES.find((c) => c.id === catName) || { id: catName, label: catName, icon: 'wrench' };
      const hintId = `hint-${entry.id}-${catName.replace(/[^a-z0-9]/gi, '')}`;
      return `
        <li>
          <button type="button" class="cat-icon-btn" interestfor="${hintId}" aria-label="${escapeHtml(cat.label)} category">
            ${categoryIconSvg(cat.icon)}
          </button>
          <div id="${hintId}" popover="hint">${escapeHtml(cat.label)}</div>
        </li>
      `;
    })
    .join('');

  const catChipsHtml = entry.categories
    .map((c) => `<li class="cat-chip">${escapeHtml(c)}</li>`)
    .join('');

  return `
    <article class="tool-card${compactCls}" style="view-transition-name: tool-${entry.id}">
      <header class="card-header">
        <div class="card-title-group">
          <h2 class="card-title">
            <a href="#tool/${entry.id}" class="card-link" data-entry-link="${entry.id}">${escapeHtml(entry.title)}</a>
          </h2>
          ${entry.isNew ? '<span class="badge badge-new">New</span>' : ''}
        </div>
        <ul class="card-icons" aria-label="Categories">${iconsHtml}</ul>
      </header>
      <p class="card-summary">${escapeHtml(entry.summary)}</p>
      <footer class="card-footer">
        <div class="card-meta-left">
          <ul class="tag-list card-meta-cats" aria-label="Category tags">${catChipsHtml}</ul>
          <span>${escapeHtml(entry.platforms.join(', '))}</span>
        </div>
        <div class="card-meta-right">
          <span>${escapeHtml(entry.authors)}</span>
          <span class="mono-stat">Updated ${escapeHtml(entry.updatedLabel)}</span>
          <button type="button" class="fav-btn" data-fav-id="${entry.id}" aria-pressed="${isFav}" aria-label="Favorite ${escapeHtml(entry.title)}">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="${isFav ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            <span>${starCount}</span>
          </button>
        </div>
      </footer>
    </article>
  `;
}

function renderLatestList() {
  return `
    <ul class="latest-list">
      ${LATEST_ADDITIONS.map((item) => {
        const href = item.hasFullRecord ? `#tool/${item.id}` : item.url;
        const attrs = item.hasFullRecord ? `data-entry-link="${item.id}"` : 'target="_blank" rel="noopener"';
        return `
          <li class="latest-item">
            <a href="${href}" ${attrs}>${escapeHtml(item.title)}</a>
            <span class="badge badge-neutral">${escapeHtml(item.type)}</span>
          </li>
        `;
      }).join('')}
    </ul>
  `;
}

function renderHomeView() {
  const featured = ENTRIES[0];
  const latestSection = `
    <aside class="panel-box">
      <h2>Latest additions on EDCodex</h2>
      ${renderLatestList()}
      <div style="margin-block-start: var(--space-4);">
        <a href="#tools" class="btn" data-nav="tools">Browse all ${SITE_COPY.totalCatalogTools} tools</a>
      </div>
    </aside>
  `;

  const introProse = `
    <div class="home-prose">
      <section class="panel-box">
        <h2>Purpose</h2>
        <p style="margin-block-start: var(--space-2); color: var(--fg-secondary);">${escapeHtml(SITE_COPY.purpose)}</p>
      </section>
      <section class="panel-box">
        <h2>Vision</h2>
        <ul style="margin-block-start: var(--space-2);">
          ${SITE_COPY.vision.map((line) => `<li>${escapeHtml(line)}</li>`).join('')}
        </ul>
      </section>
      <section class="editorial-two-col">
        <div class="panel-box">
          <h3>The public database</h3>
          <p style="margin-block-start: var(--space-2); color: var(--fg-secondary); font-size: var(--text-sm);">${escapeHtml(SITE_COPY.publicDatabaseDesc)}</p>
        </div>
        <div class="panel-box">
          <h3>Features for registered users</h3>
          <p style="margin-block-start: var(--space-2); color: var(--fg-secondary); font-size: var(--text-sm);">${escapeHtml(SITE_COPY.registeredFeaturesDesc)}</p>
        </div>
      </section>
    </div>
  `;

  if (state.direction === 'editorial') {
    return `
      <section class="editorial-hero">
        <div class="editorial-hero-copy">
          <span class="editorial-kicker">${escapeHtml(SITE_COPY.subTagline)} · ${SITE_COPY.totalCatalogTools} Tools Indexed</span>
          <h1 id="main-heading" tabindex="-1">${escapeHtml(SITE_COPY.brand)}</h1>
          <p style="color: var(--fg-secondary);">${escapeHtml(SITE_COPY.tagline)}. ${escapeHtml(SITE_COPY.introLead)}</p>
          <div class="tag-list">
            <a href="#tools" class="btn btn-primary" data-nav="tools">Browse Tools Directory</a>
            <button type="button" class="btn" commandfor="submit-dialog" command="show-modal">Submit an Entry</button>
          </div>
        </div>
        <div class="editorial-frame">
          <img src="../template/top8.jpg" width="1440" height="500" fetchpriority="high" alt="Orbital horizon view of a planet in deep space">
          <div class="editorial-overlay-card">
            <p>Featured Entry · Updated ${escapeHtml(featured.updatedLabel)}</p>
            <strong><a href="#tool/${featured.id}" data-entry-link="${featured.id}">${escapeHtml(featured.title)}</a></strong>
          </div>
        </div>
      </section>

      <section class="editorial-section">
        <div class="editorial-two-col">
          ${introProse}
          ${latestSection}
        </div>
      </section>
    `;
  }

  if (state.direction === 'command') {
    return `
      <section class="command-hero-strip">
        <div style="display: grid; gap: var(--space-2); max-inline-size: 44rem;">
          <span class="badge badge-neutral">${escapeHtml(SITE_COPY.subTagline)}</span>
          <h1 id="main-heading" tabindex="-1">${escapeHtml(SITE_COPY.brand)}</h1>
          <p style="color: var(--fg-secondary);">${escapeHtml(SITE_COPY.tagline)}</p>
        </div>
        <div class="tag-list">
          <a href="#tools" class="btn btn-primary" data-nav="tools">Open Tools Workspace (${SITE_COPY.totalCatalogTools})</a>
          <button type="button" class="btn" commandfor="quick-search-dialog" command="show-modal">Quick Search (Ctrl+K)</button>
        </div>
      </section>

      <div class="command-shell">
        <aside class="command-sidebar" aria-label="Directory summary">
          <div class="facet-group">
            <span class="facet-title">Quick Categories</span>
            <ul class="facet-list">
              ${CATEGORIES.slice(0, 6)
                .map(
                  (c) => `
                  <li>
                    <button type="button" class="facet-btn" data-jump-cat="${escapeHtml(c.id)}">
                      <span>${escapeHtml(c.label)}</span>
                    </button>
                  </li>
                `
                )
                .join('')}
            </ul>
          </div>
          <div class="facet-group">
            <span class="facet-title">For Developers</span>
            <p style="font-size: var(--text-xs); color: var(--fg-muted);">${escapeHtml(SITE_COPY.submitCta)}</p>
            <button type="button" class="btn" commandfor="submit-dialog" command="show-modal">Submit entry</button>
          </div>
        </aside>
        <div style="display: grid; gap: var(--space-5);">
          ${latestSection}
          ${introProse}
        </div>
      </div>
    `;
  }

  // Direction A: telemetry
  return `
    <section class="hero-telemetry">
      <img class="hero-telemetry-img" src="../template/top8.jpg" width="1440" height="420" fetchpriority="high" alt="Orbital horizon view of a planet in deep space">
      <div class="hero-telemetry-scrim">
        <h1 id="main-heading" tabindex="-1">${escapeHtml(SITE_COPY.brand)}</h1>
        <p style="max-inline-size: 46rem;">${escapeHtml(SITE_COPY.tagline)} — ${escapeHtml(SITE_COPY.subTagline)}.</p>
        <div class="tag-list">
          <a href="#tools" class="btn btn-primary" data-nav="tools">Explore ${SITE_COPY.totalCatalogTools} Tools</a>
          <button type="button" class="btn" commandfor="submit-dialog" command="show-modal">Share your project</button>
        </div>
        <div class="telemetry-pillars">
          ${SITE_COPY.pillars
            .map(
              (p) => `
              <div class="telemetry-pillar">
                <h2>${escapeHtml(p.title)}</h2>
                <p>${escapeHtml(p.summary)}</p>
              </div>
            `
            )
            .join('')}
        </div>
      </div>
    </section>

    <div class="home-split">
      ${introProse}
      <div style="display: grid; gap: var(--space-4);">
        <div class="panel-box">
          <p style="font-size: var(--text-sm); color: var(--fg-secondary); margin-block-end: var(--space-3);">${escapeHtml(SITE_COPY.submitCta)}</p>
          <div class="tag-list">
            <a href="https://edcodex.info/?p=login" class="btn" target="_blank" rel="noopener">Login</a>
            <a href="https://edcodex.info/?p=register" class="btn btn-primary" target="_blank" rel="noopener">Register</a>
          </div>
        </div>
        ${latestSection}
      </div>
    </div>
  `;
}

function renderFacetSidebarHtml() {
  const catCounts = new Map();
  for (const item of ENTRIES) {
    for (const c of item.categories) {
      catCounts.set(c, (catCounts.get(c) || 0) + 1);
    }
  }

  return `
    <div class="facet-group">
      <span class="facet-title">Categories</span>
      <ul class="facet-list">
        <li>
          <button type="button" class="facet-btn" data-facet-cat="all" aria-pressed="${state.category === 'all'}">
            <span>All categories</span>
            <span class="facet-count">${ENTRIES.length}</span>
          </button>
        </li>
        ${CATEGORIES.map((c) => {
          const count = catCounts.get(c.id) || 0;
          if (!count) return '';
          return `
            <li>
              <button type="button" class="facet-btn" data-facet-cat="${escapeHtml(c.id)}" aria-pressed="${state.category === c.id}">
                <span>${escapeHtml(c.label)}</span>
                <span class="facet-count">${count}</span>
              </button>
            </li>
          `;
        }).join('')}
      </ul>
    </div>
    <div class="facet-group">
      <span class="facet-title">Platform</span>
      <ul class="facet-list">
        <li>
          <button type="button" class="facet-btn" data-facet-plat="all" aria-pressed="${state.platform === 'all'}">
            <span>All platforms</span>
          </button>
        </li>
        ${PLATFORMS.map(
          (plat) => `
          <li>
            <button type="button" class="facet-btn" data-facet-plat="${escapeHtml(plat)}" aria-pressed="${state.platform === plat}">
              <span>${escapeHtml(plat)}</span>
            </button>
          </li>
        `
        ).join('')}
      </ul>
    </div>
  `;
}

function renderToolsView() {
  const entries = getFilteredEntries();

  const filterBar = `
    <search>
      <form class="filter-bar" id="tools-filter-form" onsubmit="return false;">
        <div class="filter-field filter-field-search">
          <label for="filter-search" class="filter-label">Filter by keyword or author</label>
          <input id="filter-search" name="q" type="search" class="field-input" value="${escapeHtml(state.search)}" placeholder="Search tools…">
        </div>
        ${
          state.direction !== 'command'
            ? `
        <div class="filter-field">
          <label for="filter-category" class="filter-label">Category</label>
          <select id="filter-category" name="category" class="field-select">
            <option value="all"${state.category === 'all' ? ' selected' : ''}>All categories</option>
            ${CATEGORIES.map(
              (c) => `<option value="${escapeHtml(c.id)}"${state.category === c.id ? ' selected' : ''}>${escapeHtml(c.label)}</option>`
            ).join('')}
          </select>
        </div>
        <div class="filter-field">
          <label for="filter-platform" class="filter-label">Platform</label>
          <select id="filter-platform" name="platform" class="field-select">
            <option value="all"${state.platform === 'all' ? ' selected' : ''}>All platforms</option>
            ${PLATFORMS.map(
              (p) => `<option value="${escapeHtml(p)}"${state.platform === p ? ' selected' : ''}>${escapeHtml(p)}</option>`
            ).join('')}
          </select>
        </div>
        `
            : ''
        }
        <div class="filter-field">
          <label for="filter-sort" class="filter-label">Sort</label>
          <select id="filter-sort" name="sort" class="field-select">
            <option value="updated"${state.sort === 'updated' ? ' selected' : ''}>Last Updated</option>
            <option value="stars"${state.sort === 'stars' ? ' selected' : ''}>Most Favorited</option>
            <option value="alpha"${state.sort === 'alpha' ? ' selected' : ''}>Alphabetical</option>
          </select>
        </div>
      </form>
    </search>
  `;

  const resultsHeader = `
    <div class="results-bar">
      <p class="results-count">Showing <strong>${entries.length}</strong> featured entries (out of ${SITE_COPY.totalCatalogTools} indexed on edcodex.info)</p>
      <div class="tag-list">
        ${
          state.direction === 'command'
            ? '<button type="button" class="btn mobile-facet-trigger" commandfor="facet-dialog" command="show-modal">Filters</button>'
            : ''
        }
        <button type="button" class="btn" id="toggle-compact-btn" aria-pressed="${state.compactView}">
          ${state.compactView ? 'Show Details' : 'Hide Details'}
        </button>
      </div>
    </div>
  `;

  const listHtml = entries.length
    ? `<div class="tools-list" id="tools-grid">${entries.map(renderToolCard).join('')}</div>`
    : `
      <div class="empty-state">
        <h2>No matching entries</h2>
        <p style="color: var(--fg-muted);">Try clearing your search text or resetting the category and platform filters.</p>
        <button type="button" class="btn btn-primary" id="reset-filters-btn">Reset all filters</button>
      </div>
    `;

  if (state.direction === 'command') {
    return `
      <h1 id="main-heading" tabindex="-1" style="margin-block-end: var(--space-4);">Third-party tools (${SITE_COPY.totalCatalogTools})</h1>
      <div class="command-shell">
        <aside class="command-sidebar" aria-label="Directory facets">
          ${renderFacetSidebarHtml()}
        </aside>
        <div>
          ${filterBar}
          ${resultsHeader}
          ${listHtml}
        </div>
      </div>
    `;
  }

  return `
    <h1 id="main-heading" tabindex="-1" style="margin-block-end: var(--space-4);">Third-party tools (${SITE_COPY.totalCatalogTools})</h1>
    ${filterBar}
    ${resultsHeader}
    ${listHtml}
  `;
}

function renderDetailSpecBox(entry) {
  return `
    <section class="panel-box" aria-label="Entry specifications">
      <h2 style="font-size: var(--text-base); margin-block-end: var(--space-3);">Specifications</h2>
      <ul class="tag-list" style="margin-block-end: var(--space-4);">
        ${entry.categories.map((c) => `<li class="cat-chip">${escapeHtml(c)}</li>`).join('')}
      </ul>
      <dl class="spec-list">
        <dt>Authors</dt><dd>${escapeHtml(entry.authors)}</dd>
        <dt>Status</dt><dd><span class="badge badge-active">${escapeHtml(entry.status)}</span></dd>
        <dt>Date release</dt><dd>${escapeHtml(entry.dateRelease)}</dd>
        ${entry.revision ? `<dt>Revision</dt><dd class="mono-stat">${escapeHtml(entry.revision)}</dd>` : ''}
        <dt>Compatible</dt><dd>${entry.compatibleWithRelease ? 'Yes' : 'Check entry'}</dd>
        <dt>Sources</dt><dd>${entry.sourcesAvailable ? 'Available' : 'Not listed'}</dd>
        <dt>License</dt><dd>${escapeHtml(entry.license)}</dd>
        <dt>Languages</dt><dd>${escapeHtml(entry.languages.join(', '))}</dd>
        <dt>Platform</dt><dd>${escapeHtml(entry.platforms.join(', '))}</dd>
      </dl>
    </section>
  `;
}

function renderDetailActions(entry) {
  const isFav = state.favorites.has(entry.id);
  const starCount = Math.max(0, getDisplayStars(entry));
  return `
    <div class="tag-list">
      <button type="button" class="fav-btn" data-fav-id="${entry.id}" aria-pressed="${isFav}">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="${isFav ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
        <span>${starCount} Favorites</span>
      </button>
      <button type="button" class="btn" commandfor="export-dialog" command="show-modal">Export</button>
      <a href="https://edcodex.info/?m=tools&entry=${entry.id}" class="btn btn-primary" target="_blank" rel="noopener">Open on edcodex.info</a>
    </div>
  `;
}

function renderDetailMainBody(entry) {
  return `
    <div style="display: grid; gap: var(--space-5);">
      <section class="panel-box">
        <p style="font-size: var(--text-base); color: var(--fg-primary); margin-block-end: var(--space-3);">${escapeHtml(entry.summary)}</p>
        <p style="color: var(--fg-secondary); font-size: var(--text-sm);">${escapeHtml(entry.longIntro)}</p>
      </section>

      <section class="panel-box">
        <h2>Key Features</h2>
        <ul class="feature-list">
          ${entry.features.map((f) => `<li>${escapeHtml(f)}</li>`).join('')}
        </ul>
      </section>

      <section class="panel-box">
        <h2>Links</h2>
        <ul class="links-grid">
          ${entry.links
            .map(
              (link) => `
              <li>
                <a href="${escapeHtml(link.url)}" class="btn" target="_blank" rel="noopener">
                  <span class="badge badge-neutral">${escapeHtml(link.kind)}</span>
                  <span>${escapeHtml(link.label)}</span>
                </a>
              </li>
            `
            )
            .join('')}
        </ul>
      </section>

      <details class="revision-details">
        <summary>History &amp; Revisions (${entry.revisions.length})</summary>
        <ul class="revision-list">
          ${entry.revisions
            .map(
              (r) => `
              <li class="revision-row">
                <span><strong>${escapeHtml(r.rev)}</strong> — ${escapeHtml(r.note)}</span>
                <span class="mono-stat" style="color: var(--fg-muted);">${escapeHtml(r.date)}</span>
              </li>
            `
            )
            .join('')}
        </ul>
      </details>
    </div>
  `;
}

function renderDetailView() {
  const entry = ENTRIES.find((e) => e.id === state.entryId) || ENTRIES[0];
  const breadcrumbs = `
    <nav class="breadcrumbs" aria-label="Breadcrumb">
      <a href="#home" data-nav="home">Home</a>
      <span aria-hidden="true">/</span>
      <a href="#tools" data-nav="tools">Tools</a>
      <span aria-hidden="true">/</span>
      <span aria-current="page">${escapeHtml(entry.title)}</span>
    </nav>
  `;

  if (state.direction === 'command') {
    return `
      ${breadcrumbs}
      <header class="detail-header-bar">
        <div>
          <h1 id="main-heading" tabindex="-1">${escapeHtml(entry.title)}</h1>
          <p style="color: var(--fg-muted); font-size: var(--text-sm); margin-block-start: 0.25rem;">By ${escapeHtml(entry.authors)} · Updated ${escapeHtml(entry.updatedLabel)}</p>
        </div>
        ${renderDetailActions(entry)}
      </header>
      <div class="detail-layout">
        ${renderDetailMainBody(entry)}
        ${renderDetailSpecBox(entry)}
      </div>
    `;
  }

  if (state.direction === 'editorial') {
    return `
      ${breadcrumbs}
      <div class="results-bar" style="margin-block-end: var(--space-5);">
        <h1 id="main-heading" tabindex="-1">${escapeHtml(entry.title)}</h1>
        ${renderDetailActions(entry)}
      </div>
      <div class="detail-layout">
        ${renderDetailSpecBox(entry)}
        ${renderDetailMainBody(entry)}
      </div>
    `;
  }

  // Direction A: telemetry (Main content left, sticky Action & Spec Rail right)
  return `
    ${breadcrumbs}
    <h1 id="main-heading" tabindex="-1" style="margin-block-end: var(--space-5);">${escapeHtml(entry.title)}</h1>
    <div class="detail-layout">
      ${renderDetailMainBody(entry)}
      <aside class="detail-rail">
        <div class="panel-box">
          <h2 style="font-size: var(--text-base); margin-block-end: var(--space-3);">Actions</h2>
          ${renderDetailActions(entry)}
        </div>
        ${renderDetailSpecBox(entry)}
      </aside>
    </div>
  `;
}

function updateDocumentTitle() {
  if (state.route === 'tools') {
    document.title = 'Tools Directory | EDCodex';
  } else if (state.route === 'detail') {
    const entry = ENTRIES.find((e) => e.id === state.entryId) || ENTRIES[0];
    document.title = `${entry.title} | EDCodex`;
  } else {
    document.title = 'EDCodex — Elite: Dangerous Third-Party Tools Directory';
  }
}

function updateNavActive() {
  for (const link of document.querySelectorAll('.primary-nav .nav-link[data-nav]')) {
    const navTarget = link.getAttribute('data-nav');
    if (navTarget === state.route) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  }
}

let announceTimer = null;
function announceFilterCount(count) {
  clearTimeout(announceTimer);
  announceTimer = setTimeout(() => {
    const el = document.getElementById('live-announcer');
    if (el) el.textContent = `${count} tools displayed`;
  }, 250);
}

function render({ withTransition = false, focusHeading = false } = {}) {
  const main = document.getElementById('main-content');
  if (!main) return;

  const paint = () => {
    if (state.route === 'tools') {
      main.innerHTML = renderToolsView();
      const facetBody = document.getElementById('facet-dialog-body');
      if (facetBody) facetBody.innerHTML = renderFacetSidebarHtml();
    } else if (state.route === 'detail') {
      main.innerHTML = renderDetailView();
    } else {
      main.innerHTML = renderHomeView();
    }
    updateDocumentTitle();
    updateNavActive();
    wireHintPopovers(main);
    bindViewEvents();
    if (focusHeading) {
      document.getElementById('main-heading')?.focus({ preventScroll: false });
    }
  };

  if (withTransition && document.startViewTransition) {
    document.startViewTransition(paint);
  } else {
    paint();
  }
}

function bindViewEvents() {
  const searchInput = document.getElementById('filter-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.search = e.target.value;
      const entries = getFilteredEntries();
      const grid = document.getElementById('tools-grid');
      if (grid && entries.length > 0) {
        const update = () => {
          grid.innerHTML = entries.map(renderToolCard).join('');
          wireHintPopovers(grid);
          bindFavoriteButtons(grid);
        };
        if (document.startViewTransition) {
          document.startViewTransition(update);
        } else {
          update();
        }
        const countEl = document.querySelector('.results-count strong');
        if (countEl) countEl.textContent = String(entries.length);
      } else {
        render({ withTransition: true });
      }
      announceFilterCount(entries.length);
    });
  }

  document.getElementById('filter-category')?.addEventListener('change', (e) => {
    state.category = e.target.value;
    render({ withTransition: true });
    announceFilterCount(getFilteredEntries().length);
  });

  document.getElementById('filter-platform')?.addEventListener('change', (e) => {
    state.platform = e.target.value;
    render({ withTransition: true });
    announceFilterCount(getFilteredEntries().length);
  });

  document.getElementById('filter-sort')?.addEventListener('change', (e) => {
    state.sort = e.target.value;
    render({ withTransition: true });
  });

  document.getElementById('toggle-compact-btn')?.addEventListener('click', () => {
    state.compactView = !state.compactView;
    render({ withTransition: true });
  });

  document.getElementById('reset-filters-btn')?.addEventListener('click', () => {
    state.search = '';
    state.category = 'all';
    state.platform = 'all';
    render({ withTransition: true });
  });

  for (const btn of document.querySelectorAll('[data-facet-cat]')) {
    btn.addEventListener('click', () => {
      state.category = btn.getAttribute('data-facet-cat') || 'all';
      render({ withTransition: true });
      announceFilterCount(getFilteredEntries().length);
    });
  }

  for (const btn of document.querySelectorAll('[data-facet-plat]')) {
    btn.addEventListener('click', () => {
      state.platform = btn.getAttribute('data-facet-plat') || 'all';
      render({ withTransition: true });
      announceFilterCount(getFilteredEntries().length);
    });
  }

  for (const btn of document.querySelectorAll('[data-jump-cat]')) {
    btn.addEventListener('click', () => {
      state.category = btn.getAttribute('data-jump-cat') || 'all';
      navigateTo('tools');
    });
  }

  bindFavoriteButtons(document);
  updateExportPreview();
}

function bindFavoriteButtons(root) {
  for (const btn of root.querySelectorAll('[data-fav-id]')) {
    btn.addEventListener('click', () => {
      const id = Number(btn.getAttribute('data-fav-id'));
      if (state.favorites.has(id)) {
        state.favorites.delete(id);
      } else {
        state.favorites.add(id);
      }
      saveFavorites();
      render();
    });
  }
}

function navigateTo(hashPath) {
  location.hash = `#${hashPath}`;
}

function syncFromHash() {
  const hash = location.hash.replace(/^#/, '');
  if (hash.startsWith('tool/')) {
    const id = Number(hash.split('/')[1]);
    state.route = 'detail';
    state.entryId = Number.isFinite(id) && id > 0 ? id : 631;
  } else if (hash === 'tools') {
    state.route = 'tools';
  } else {
    state.route = 'home';
  }
  render();
}

function setDirection(dir) {
  state.direction = dir;
  document.documentElement.setAttribute('data-direction', dir);
  try {
    localStorage.setItem(STORAGE_DIR_KEY, dir);
  } catch {}
  for (const btn of document.querySelectorAll('[data-dir]')) {
    btn.setAttribute('aria-pressed', String(btn.getAttribute('data-dir') === dir));
  }
  render();
}

/* Theme override per dark-mode-toggle guidance */
function initThemeControl() {
  const meta = document.querySelector('meta[name="color-scheme"]');
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  const getStored = () => {
    try {
      return localStorage.getItem(STORAGE_SCHEME_KEY);
    } catch {
      return null;
    }
  };

  const applyScheme = (choice) => {
    if (choice === 'light' || choice === 'dark') {
      meta.content = choice;
      try {
        localStorage.setItem(STORAGE_SCHEME_KEY, choice);
      } catch {}
    } else {
      meta.content = 'light dark';
      try {
        localStorage.removeItem(STORAGE_SCHEME_KEY);
      } catch {}
    }
    syncThemeUI();
  };

  const syncThemeUI = () => {
    const stored = getStored();
    const active = stored === 'light' || stored === 'dark' ? stored : 'system';
    const sysText = mediaQuery.matches ? 'System (Currently dark)' : 'System (Currently light)';
    const sysLabel = document.getElementById('theme-system-label');
    if (sysLabel) sysLabel.textContent = sysText;
    for (const btn of document.querySelectorAll('#theme-options [data-scheme]')) {
      btn.setAttribute('aria-pressed', String(btn.getAttribute('data-scheme') === active));
    }
  };

  for (const btn of document.querySelectorAll('#theme-options [data-scheme]')) {
    btn.addEventListener('click', () => {
      applyScheme(btn.getAttribute('data-scheme'));
    });
  }

  // Note: NEVER delete stored value when OS scheme changes to match it.
  mediaQuery.addEventListener('change', syncThemeUI);
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_SCHEME_KEY) {
      meta.content = e.newValue === 'light' || e.newValue === 'dark' ? e.newValue : 'light dark';
      syncThemeUI();
    }
  });

  syncThemeUI();
}

function updateExportPreview() {
  const out = document.getElementById('export-output');
  if (!out) return;
  const entry = ENTRIES.find((e) => e.id === state.entryId) || ENTRIES[0];

  if (state.exportFormat === 'json') {
    out.textContent = JSON.stringify(
      {
        id: entry.id,
        title: entry.title,
        authors: entry.authors,
        status: entry.status,
        revision: entry.revision,
        categories: entry.categories,
        platforms: entry.platforms,
        license: entry.license,
        url: `https://edcodex.info/?m=tools&entry=${entry.id}`
      },
      null,
      2
    );
  } else if (state.exportFormat === 'bbcode') {
    out.textContent = `[b]${entry.title}[/b] by ${entry.authors}\n[url=https://edcodex.info/?m=tools&entry=${entry.id}]EDCodex Entry[/url]\nPlatforms: ${entry.platforms.join(', ')}\n${entry.summary}`;
  } else {
    out.textContent = `${entry.title} (by ${entry.authors})\nPlatforms: ${entry.platforms.join(', ')} | Categories: ${entry.categories.join(', ')}\n${entry.summary}\nhttps://edcodex.info/?m=tools&entry=${entry.id}`;
  }
}

function initModalsAndTweaks() {
  // Quick Search Ctrl+K
  const quickInput = document.getElementById('quick-search-input');
  const quickResults = document.getElementById('quick-search-results');
  const quickDialog = document.getElementById('quick-search-dialog');

  const renderQuickResults = (query = '') => {
    const q = query.trim().toLowerCase();
    const matches = ENTRIES.filter((e) =>
      `${e.title} ${e.authors} ${e.categories.join(' ')}`.toLowerCase().includes(q)
    ).slice(0, 6);
    if (!quickResults) return;
    quickResults.innerHTML = matches.length
      ? matches
          .map(
            (m) => `
          <li>
            <button type="button" class="popover-item" data-quick-id="${m.id}">
              <span><strong>${escapeHtml(m.title)}</strong> <small style="color: var(--fg-muted);">by ${escapeHtml(m.authors)}</small></span>
              <span class="badge badge-neutral">${escapeHtml(m.categories[0] || 'Tool')}</span>
            </button>
          </li>
        `
          )
          .join('')
      : '<li style="color: var(--fg-muted); font-size: var(--text-sm);">No entries found.</li>';

    for (const btn of quickResults.querySelectorAll('[data-quick-id]')) {
      btn.addEventListener('click', () => {
        const id = Number(btn.getAttribute('data-quick-id'));
        quickDialog?.close('selected');
        navigateTo(`tool/${id}`);
      });
    }
  };

  quickInput?.addEventListener('input', (e) => renderQuickResults(e.target.value));
  renderQuickResults('');

  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (quickDialog && !quickDialog.open) {
        quickDialog.showModal();
      }
    }
  });

  // Reset dialog.returnValue on close per dialog guide
  for (const dlg of document.querySelectorAll('dialog')) {
    dlg.addEventListener('close', () => {
      dlg.returnValue = '';
    });
  }

  // Export dialog tabs & copy
  for (const btn of document.querySelectorAll('[data-export-format]')) {
    btn.addEventListener('click', () => {
      state.exportFormat = btn.getAttribute('data-export-format') || 'text';
      updateExportPreview();
    });
  }

  document.getElementById('copy-export-btn')?.addEventListener('click', async () => {
    const out = document.getElementById('export-output');
    const copyBtn = document.getElementById('copy-export-btn');
    if (!out || !copyBtn) return;
    try {
      await navigator.clipboard.writeText(out.textContent || '');
      copyBtn.textContent = 'Copied!';
      setTimeout(() => {
        copyBtn.textContent = 'Copy to clipboard';
      }, 1500);
    } catch {}
  });

  // Floating Tweaks Panel
  const tweaksBtn = document.getElementById('tweaks-toggle');
  const tweaksPanel = document.getElementById('tweaks-panel');
  const tweaksClose = document.getElementById('tweaks-close');

  const setTweaksOpen = (open) => {
    if (!tweaksPanel || !tweaksBtn) return;
    tweaksPanel.hidden = !open;
    tweaksBtn.setAttribute('aria-expanded', String(open));
  };

  tweaksBtn?.addEventListener('click', () => {
    setTweaksOpen(Boolean(tweaksPanel?.hidden));
  });
  tweaksClose?.addEventListener('click', () => setTweaksOpen(false));

  for (const btn of document.querySelectorAll('[data-dir]')) {
    btn.addEventListener('click', () => setDirection(btn.getAttribute('data-dir')));
  }
  for (const btn of document.querySelectorAll('[data-jump]')) {
    btn.addEventListener('click', () => navigateTo(btn.getAttribute('data-jump')));
  }

  setDirection(state.direction);
}

// Bootstrap
loadPlatformPolyfills();
initDialogClosedByFallback();
initHintPopoverFallback();
initAnchorPositionFallback();
initScrollHeaderFallback();
initThemeControl();
initModalsAndTweaks();

window.addEventListener('hashchange', syncFromHash);

// Read optional ?view= param for direct preview linking
const params = new URLSearchParams(location.search);
const initialView = params.get('view');
if (!location.hash && initialView) {
  location.replace(`#${initialView}`);
} else {
  syncFromHash();
}
