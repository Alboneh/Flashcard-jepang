/* ==========================================================
   BUNPO — Card-focus mode (single pattern, prev/next)
   ========================================================== */

const $ = (id) => document.getElementById(id);
const bunpoSearch = $('bunpoSearch');
const bunpoCard = $('bunpoCard');
const cardCounter = $('cardCounter');
const miniFill = $('miniFill');
const progressNum = $('progressNum');
const progressTotal = $('progressTotal');
const progressPct = $('progressPct');
const progressFill = $('progressFill');
const crumbBab = $('crumbBab');
const crumbPattern = $('crumbPattern');
const cardPrevBtn = $('cardPrevBtn');
const cardNextBtn = $('cardNextBtn');
const hideAction = $('hideAction');
const practiceAction = $('practiceAction');
const themeToggle = $('themeToggle');
const mobileMenuToggle = $('mobileMenuToggle');
const mobileBackdrop = $('mobileBackdrop');
const appSidebar = $('appSidebar');
const babFilterEl = $('babFilter');

let selectedBab = 'Semua';
let cardIndex = 0;
let cardItems = [];

/* ===== Helpers ===== */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function normalize(value) {
  return String(value || '').toLowerCase();
}

function expandShorthand(text) {
  return String(text || '')
    .replace(/KB1/g, 'Kata Benda 1')
    .replace(/KB2/g, 'Kata Benda 2')
    .replace(/KB3/g, 'Kata Benda 3')
    .replace(/KW1/g, 'Keterangan Waktu 1')
    .replace(/KW2/g, 'Keterangan Waktu 2')
    .replace(/Ket\.Tempat/g, 'Keterangan Tempat')
    .replace(/Ket\.Hari/g, 'Keterangan Hari')
    .replace(/K\.Kerja Transitif/g, 'Kata Kerja Transitif')
    .replace(/K\.Kerja/g, 'Kata Kerja')
    .replace(/K\.Benda/g, 'Kata Benda')
    .replace(/K\.Sifat/g, 'Kata Sifat')
    .replace(/KK/g, 'Kata Kerja')
    .replace(/KW/g, 'Keterangan Waktu')
    .replace(/KB/g, 'Kata Benda');
}

function parseExample(exampleText) {
  const raw = String(exampleText || '').trim();
  const match = raw.match(/^(.*)\s\((.+)\)\s*$/);
  if (!match) return { jp: raw, id: '' };
  return { jp: match[1].trim(), id: match[2].trim() };
}

/* Format penjelasan jadi readable HTML */
const PARA_MARKER_RE = /\s+(?=(?:Pengecualian|PERHATIAN!?|Bentuk negatif|Bentuk positif|Khusus untuk|Beda dengan|Catatan|Tips|NB|TAPI\b)\s*[:.])/g;

const INLINE_MARKER_RE = /\b(Pengecualian|PERHATIAN!?|Bentuk negatif|Bentuk positif|Khusus untuk|Beda dengan|Catatan|Tips|NB|Aturan|Pola|Cara bentuk|Cara mengubah|Contoh)(\s*:)/g;

function formatInline(text) {
  return escapeHtml(text).replace(INLINE_MARKER_RE, '<strong class="exp-marker">$1$2</strong>');
}

function splitSentences(text) {
  const parts = [];
  let current = '';
  let depth = 0;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '(' || ch === '「' || ch === '『') depth++;
    else if (ch === ')' || ch === '」' || ch === '』') depth = Math.max(0, depth - 1);
    current += ch;
    if ((ch === '.' || ch === '。') && depth === 0) {
      const next = text[i + 1];
      if (next === undefined || next === ' ' || next === '\t' || next === '\n') {
        const trimmed = current.trim();
        if (trimmed) parts.push(trimmed);
        current = '';
        if (next === ' ' || next === '\t') i++;
      }
    }
  }
  const last = current.trim();
  if (last) parts.push(last);
  return parts;
}

function paragraphHtml(text) {
  const sentences = splitSentences(text);
  if (!sentences.length) return '';
  return sentences.map((s) => `<p>${formatInline(s)}</p>`).join('');
}

function formatParagraph(para) {
  const numCount = (para.match(/\(\d\)/g) || []).length;
  if (numCount >= 2 && /\(1\)/.test(para)) {
    const firstNumIdx = para.indexOf('(1)');
    const intro = firstNumIdx > 0 ? para.substring(0, firstNumIdx).trim() : '';
    const listText = para.substring(firstNumIdx);
    const itemRe = /\((\d+)\)\s*([^()]+?)(?=\s*\(\d+\)|$)/g;
    const items = [];
    let m;
    while ((m = itemRe.exec(listText)) !== null) {
      items.push({ num: m[1], text: m[2].trim().replace(/[.\s]+$/, '') });
    }
    let html = '';
    if (intro) html += paragraphHtml(intro);
    html += `<ol class="exp-list">${items.map((it) =>
      `<li><span class="exp-num">${it.num}</span><span>${escapeHtml(it.text)}</span></li>`
    ).join('')}</ol>`;
    return html;
  }
  return paragraphHtml(para);
}

function formatExplanation(text) {
  if (!text) return '';
  const expanded = expandShorthand(text);
  const paragraphs = expanded.split(PARA_MARKER_RE).map((p) => p.trim()).filter(Boolean);
  return paragraphs.map(formatParagraph).join('');
}

function bunpoHideKey(item) {
  return String(item && item.pattern || '');
}

function isBunpoHidden(item) {
  return window.HiddenStore && HiddenStore.has('bunpo', bunpoHideKey(item));
}

function getOriginalIndex(item) {
  return bunpoDatabase.indexOf(item);
}

/* ===== Categories (Bab filter) ===== */
const CAT_COLORS = ['#e8607e', '#7fa790', '#c9a14a', '#e89476', '#a684c4'];

function getBabList() {
  const map = new Map();
  bunpoDatabase.forEach((item) => {
    if (isBunpoHidden(item)) return;
    const bab = item.bab || 'Bab Lainnya';
    map.set(bab, (map.get(bab) || 0) + 1);
  });
  const arr = Array.from(map.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => {
      const na = parseInt(a.name.replace(/\D/g, ''), 10) || 999;
      const nb = parseInt(b.name.replace(/\D/g, ''), 10) || 999;
      return na - nb;
    });
  const total = arr.reduce((s, b) => s + b.count, 0);
  return [{ name: 'Semua', count: total, color: '#e8607e' }, ...arr.map((b, i) => ({
    ...b,
    color: CAT_COLORS[i % CAT_COLORS.length]
  }))];
}

function renderBabFilter() {
  const babs = getBabList();
  babFilterEl.innerHTML = babs.map((b) => `
    <button class="cat-btn ${b.name === selectedBab ? 'active' : ''}" data-bab="${escapeHtml(b.name)}">
      <span class="cat-dot" style="--cat-color:${b.color}"></span>
      <span class="cat-name">${escapeHtml(b.name)}</span>
      <span class="cat-count">${b.count}</span>
    </button>
  `).join('');
  babFilterEl.querySelectorAll('.cat-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      selectedBab = btn.dataset.bab;
      cardIndex = 0;
      renderBabFilter();
      renderCard();
      closeMobileSidebar();
    });
  });
}

/* ===== Filtering ===== */
function filterItems() {
  const q = normalize(bunpoSearch.value);
  return bunpoDatabase.filter((item) => {
    if (isBunpoHidden(item)) return false;
    const bab = item.bab || 'Bab Lainnya';
    if (selectedBab !== 'Semua' && bab !== selectedBab) return false;
    if (!q) return true;
    return (
      normalize(bab).includes(q) ||
      normalize(item.pattern).includes(q) ||
      normalize(item.explanation).includes(q) ||
      (item.examples || []).some((ex) => normalize(ex).includes(q))
    );
  });
}

/* ===== Render card ===== */
function renderCard() {
  cardItems = filterItems();
  if (cardIndex >= cardItems.length) cardIndex = Math.max(0, cardItems.length - 1);

  // progress sidebar
  const totalAll = bunpoDatabase.filter((i) => !isBunpoHidden(i)).length;
  progressNum.textContent = cardItems.length ? cardIndex + 1 : 0;
  progressTotal.textContent = `/ ${cardItems.length}`;
  const pct = cardItems.length ? Math.round(((cardIndex + 1) / cardItems.length) * 100) : 0;
  progressPct.textContent = `${pct}%`;
  progressFill.style.width = `${pct}%`;

  // bottom counter
  cardCounter.textContent = cardItems.length ? `${cardIndex + 1} / ${cardItems.length}` : '0 / 0';
  miniFill.style.width = `${pct}%`;

  // breadcrumb
  crumbBab.textContent = selectedBab;

  // nav buttons
  cardPrevBtn.disabled = !cardItems.length || cardIndex === 0;
  cardNextBtn.disabled = !cardItems.length || cardIndex >= cardItems.length - 1;

  if (!cardItems.length) {
    crumbPattern.textContent = 'Tidak ada hasil';
    bunpoCard.innerHTML = `<div class="bunpo-empty"><p>Tidak ada pola yang cocok dengan filter & pencarian saat ini.</p></div>`;
    return;
  }

  const item = cardItems[cardIndex];
  const examples = (item.examples || []).map((ex) => {
    const p = parseExample(ex);
    return `<li class="example-item">
      <div class="example-jp">${escapeHtml(p.jp)}</div>
      ${p.id ? `<div class="example-id">${escapeHtml(p.id)}</div>` : ''}
    </li>`;
  }).join('');

  const explanationHtml = formatExplanation(item.explanation || '-');
  const pattern = item.pattern || '-';
  const bab = item.bab || 'Bab Lainnya';

  crumbPattern.textContent = pattern.length > 50 ? pattern.slice(0, 50) + '…' : pattern;

  bunpoCard.innerHTML = `
    <header class="bunpo-card-head">
      <span class="bunpo-badge">Pola</span>
      <h1 class="bunpo-title">${escapeHtml(pattern).replace(/~~([^~]+)~~/g, '<s>$1</s>')}</h1>
      <p class="bunpo-subtitle">${escapeHtml(bab)}</p>
    </header>

    <div class="bunpo-body">
      <section class="bunpo-section bunpo-section--explain">
        <h3 class="bunpo-section-title"><span class="section-emoji">📖</span>Penjelasan</h3>
        <div class="bunpo-explanation">${explanationHtml}</div>
      </section>

      <section class="bunpo-section bunpo-section--examples">
        <h3 class="bunpo-section-title"><span class="section-emoji">💡</span>Contoh</h3>
        <ul class="examples-list">${examples}</ul>
      </section>
    </div>
  `;
}

/* ===== Navigation ===== */
function cardNav(dir) {
  if (!cardItems.length) return;
  cardIndex = Math.max(0, Math.min(cardItems.length - 1, cardIndex + dir));
  renderCard();
  document.querySelector('.app-content').scrollTo({ top: 0, behavior: 'smooth' });
}

cardPrevBtn.addEventListener('click', () => cardNav(-1));
cardNextBtn.addEventListener('click', () => cardNav(1));

/* Keyboard nav */
document.addEventListener('keydown', (e) => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
  if (e.key === 'ArrowLeft') cardNav(-1);
  else if (e.key === 'ArrowRight') cardNav(1);
});

/* Ctrl+/ to focus search */
document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === '/') {
    e.preventDefault();
    bunpoSearch.focus();
    bunpoSearch.select();
  }
  if (e.key === 'Escape') closePracticeModal();
});

/* Swipe nav on touch */
(function() {
  let startX = 0, startY = 0;
  document.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }, { passive: true });
  document.addEventListener('touchend', (e) => {
    const dx = startX - e.changedTouches[0].clientX;
    const dy = startY - e.changedTouches[0].clientY;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) cardNav(dx > 0 ? 1 : -1);
  }, { passive: true });
})();

/* ===== Search ===== */
bunpoSearch.addEventListener('input', () => {
  cardIndex = 0;
  renderCard();
});

/* ===== Hide ===== */
hideAction.addEventListener('click', () => {
  if (!window.HiddenStore || !cardItems.length) return;
  const item = cardItems[cardIndex];
  const label = (item && item.pattern ? String(item.pattern) : '').replace(/~~([^~]+)~~/g, '$1');
  if (!confirm(`Sembunyikan pola "${label}" dari daftar bunpo?`)) return;
  HiddenStore.add('bunpo', bunpoHideKey(item));
  renderBabFilter();
  renderCard();
});

if (window.HiddenStore) {
  HiddenStore.subscribe((scope) => {
    if (scope !== 'bunpo') return;
    renderBabFilter();
    renderCard();
  });
}

/* ===== Practice modal ===== */
practiceAction.addEventListener('click', () => {
  if (!cardItems.length) return;
  const item = cardItems[cardIndex];
  const idx = getOriginalIndex(item);
  openPracticeModal(idx);
});

function buildPracticeItemHtml(it, num) {
  if (it && typeof it === 'object' && (it.q || it.a)) {
    const q = it.q ? `<div class="practice-qa-q"><span class="practice-qa-label">Q:</span> ${escapeHtml(it.q)}</div>` : '';
    const a = it.a ? `<div class="practice-qa-a"><span class="practice-qa-label">A:</span> ${escapeHtml(it.a)}　<span class="practice-arrow">＞ …</span></div>` : '';
    return `<li class="practice-item practice-item--qa"><span class="practice-num">${num}.</span><div class="practice-item-body">${q}${a}</div></li>`;
  }
  const text = String((it && it.text) || it || '');
  return `<li class="practice-item"><span class="practice-num">${num}.</span><div class="practice-item-body">${escapeHtml(text)}　<span class="practice-arrow">＞ …</span></div></li>`;
}

function openPracticeModal(idx) {
  const data = (typeof bunpoPractice !== 'undefined') ? bunpoPractice[idx] : null;
  const item = bunpoDatabase[idx];
  const body = $('practiceModalBody');
  const modal = $('practiceModal');
  if (!body || !modal) return;

  if (!data) {
    body.innerHTML = `
      <div class="practice-modal-header">
        <span class="practice-modal-eyebrow">Coba Pola</span>
        <h2 class="practice-modal-title" id="practiceModalTitle">${escapeHtml(item ? item.pattern : 'Pola')}</h2>
      </div>
      <p class="practice-empty">Soal latihan belum tersedia untuk pola ini.</p>
    `;
  } else {
    const itemsHtml = (data.items || []).map((it, i) => buildPracticeItemHtml(it, i + 1)).join('');
    const templateHtml = data.template ? `<p class="practice-template">${escapeHtml(data.template)}</p>` : '';
    const patternRef = item ? `<div class="practice-pattern-ref"><span class="practice-pattern-ref-label">Pola:</span> ${escapeHtml(item.pattern)}</div>` : '';

    body.innerHTML = `
      <div class="practice-modal-header">
        <span class="practice-modal-eyebrow">Coba Pola</span>
        <h2 class="practice-modal-title" id="practiceModalTitle">${escapeHtml(data.title || 'ぶんしょうを つくりましょう！')}</h2>
        ${patternRef}
      </div>
      ${templateHtml}
      <ol class="practice-list">${itemsHtml}</ol>
      <p class="practice-note">※ Coba susun sendiri jawabannya. Soal ini tidak dicek otomatis.</p>
    `;
  }

  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closePracticeModal() {
  const modal = $('practiceModal');
  if (!modal) return;
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}
window.closePracticeModal = closePracticeModal;

/* ===== Dark mode ===== */
const THEME_KEY = 'bunpo-theme';
function applyTheme(theme) {
  if (theme === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
  else document.documentElement.removeAttribute('data-theme');
}
function initTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  applyTheme(saved === 'dark' ? 'dark' : 'light');
}
themeToggle.addEventListener('click', () => {
  const cur = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  const next = cur === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  localStorage.setItem(THEME_KEY, next);
});
initTheme();

/* ===== Mobile sidebar ===== */
function openMobileSidebar() {
  appSidebar.classList.add('is-open');
  mobileBackdrop.classList.add('is-open');
}
function closeMobileSidebar() {
  appSidebar.classList.remove('is-open');
  mobileBackdrop.classList.remove('is-open');
}
mobileMenuToggle.addEventListener('click', openMobileSidebar);
mobileBackdrop.addEventListener('click', closeMobileSidebar);

/* ===== Init ===== */
renderBabFilter();
renderCard();
