const kanjiSearch = document.getElementById('kanjiSearch');
const kanjiList = document.getElementById('kanjiList');
const kanjiEmptyState = document.getElementById('kanjiEmptyState');

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

function asArray(value) {
  if (value == null) return [];
  return Array.isArray(value) ? value : [value];
}

function parseExample(text) {
  const raw = String(text || '').trim();
  // Format yang dikenali: "日本 (にほん) — Jepang"  atau  "日本 (にほん) - Jepang"
  const match = raw.match(/^(\S+)\s*\(([^()]+)\)\s*[—\-]\s*(.+)$/);
  if (match) {
    return { word: match[1].trim(), reading: match[2].trim(), meaning: match[3].trim() };
  }
  return { word: raw, reading: '', meaning: '' };
}

let selectedBab = 'Semua';

function setBabFilter(bab) {
  selectedBab = bab;
  document.querySelectorAll('#babFilter .level-btn').forEach(btn => {
    btn.classList.toggle('active', btn.textContent === bab);
  });
  renderKanji();
}

function matchesQuery(item, q) {
  if (!q) return true;
  if (normalize(item.kanji).includes(q)) return true;
  if (normalize(item.meaning).includes(q)) return true;
  if (normalize(item.bab).includes(q)) return true;
  if (asArray(item.onyomi).some((r) => normalize(r).includes(q))) return true;
  if (asArray(item.kunyomi).some((r) => normalize(r).includes(q))) return true;
  if (asArray(item.examples).some((ex) => normalize(ex).includes(q))) return true;
  return false;
}

function matchesBab(item) {
  if (selectedBab === 'Semua') return true;
  return (item.bab || '') === selectedBab;
}

function buildReadingsHtml(item) {
  const on = asArray(item.onyomi);
  const kun = asArray(item.kunyomi);
  if (!on.length && !kun.length) return '';
  const parts = [];
  if (on.length) {
    parts.push(`
      <div class="reading-row">
        <span class="reading-label">On'yomi</span>
        <div class="reading-list">
          ${on.map((r) => `<span class="reading-chip on">${escapeHtml(r)}</span>`).join('')}
        </div>
      </div>`);
  }
  if (kun.length) {
    parts.push(`
      <div class="reading-row">
        <span class="reading-label">Kun'yomi</span>
        <div class="reading-list">
          ${kun.map((r) => `<span class="reading-chip kun">${escapeHtml(r)}</span>`).join('')}
        </div>
      </div>`);
  }
  return `<div class="readings">${parts.join('')}</div>`;
}

function buildExamplesHtml(item) {
  const examples = asArray(item.examples);
  if (!examples.length) return '';
  const lis = examples.map((ex) => {
    const parsed = parseExample(ex);
    if (parsed.reading || parsed.meaning) {
      return `<li>
        <div class="ex-jp">${escapeHtml(parsed.word)}
          ${parsed.reading ? `<span class="ex-reading">${escapeHtml(parsed.reading)}</span>` : ''}
        </div>
        ${parsed.meaning ? `<div class="ex-id">${escapeHtml(parsed.meaning)}</div>` : ''}
      </li>`;
    }
    return `<li><div class="ex-jp">${escapeHtml(parsed.word)}</div></li>`;
  }).join('');
  return `
    <p class="examples-label"><strong>Contoh:</strong></p>
    <ul class="examples">${lis}</ul>
  `;
}

function buildItemHtml(item) {
  const kanji = item.kanji || '?';
  const meaning = item.meaning || '-';
  const bab = item.bab || '';
  return `
    <div class="kanji-top">
      <div class="kanji-char">${escapeHtml(kanji)}</div>
      <div class="kanji-info">
        <div class="kanji-meaning">${escapeHtml(meaning)}</div>
        ${bab ? `<span class="bab-badge">${escapeHtml(bab)}</span>` : ''}
      </div>
    </div>
    ${buildReadingsHtml(item)}
    ${buildExamplesHtml(item)}
  `;
}

function renderKanji() {
  const q = normalize(kanjiSearch.value);
  const filtered = fasihKanjiDatabase.filter((item) => matchesBab(item) && matchesQuery(item, q));

  if (!filtered.length) {
    kanjiList.innerHTML = '';
    kanjiEmptyState.style.display = '';
    if (!fasihKanjiDatabase.length) {
      kanjiEmptyState.querySelector('h2').textContent = 'Belum ada data kanji';
      kanjiEmptyState.querySelector('p').innerHTML = 'Data akan dimuat dari <code>data/fasih_kanji_database.js</code> begitu dikirim.';
    } else {
      kanjiEmptyState.querySelector('h2').textContent = 'Tidak ada hasil';
      kanjiEmptyState.querySelector('p').textContent = 'Coba kata kunci lain atau ubah filter bab.';
    }
  } else {
    kanjiEmptyState.style.display = 'none';
    kanjiList.innerHTML = filtered.map((item) => `<article class="kanji-item">${buildItemHtml(item)}</article>`).join('');
  }

  if (cardMode) renderCardView(filtered);
}

// ---- CARD MODE ----
let cardMode = false;
let cardIndex = 0;
let cardItems = [];

function renderCardView(items) {
  cardItems = items;
  if (cardIndex >= cardItems.length) cardIndex = 0;
  const cardView = document.getElementById('cardModeView');
  if (!cardItems.length) {
    cardView.style.display = 'none';
    return;
  }
  cardView.style.display = 'block';
  document.getElementById('cardCounter').textContent = `${cardIndex + 1} / ${cardItems.length}`;
  document.getElementById('cardModeCard').innerHTML = buildItemHtml(cardItems[cardIndex]);
  document.getElementById('cardPrevBtn').disabled = cardIndex === 0;
  document.getElementById('cardNextBtn').disabled = cardIndex === cardItems.length - 1;
}

function cardNav(dir) {
  cardIndex = Math.max(0, Math.min(cardItems.length - 1, cardIndex + dir));
  renderCardView(cardItems);
  document.getElementById('cardModeCard').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function toggleCardMode() {
  cardMode = !cardMode;
  const btn = document.getElementById('cardModeToggle');
  const listView = document.getElementById('kanjiList');
  const cardView = document.getElementById('cardModeView');
  if (cardMode) {
    btn.textContent = '☰ Mode List';
    btn.classList.add('active');
    listView.style.display = 'none';
    cardView.style.display = 'block';
    cardIndex = 0;
    const q = normalize(kanjiSearch.value);
    cardItems = fasihKanjiDatabase.filter((item) => matchesBab(item) && matchesQuery(item, q));
    renderCardView(cardItems);
  } else {
    btn.textContent = '▦ Mode Kartu';
    btn.classList.remove('active');
    listView.style.display = '';
    cardView.style.display = 'none';
  }
}

// Swipe support for card mode
(function() {
  let startX = 0;
  document.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
  document.addEventListener('touchend', (e) => {
    if (!cardMode) return;
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) cardNav(diff > 0 ? 1 : -1);
  }, { passive: true });
})();

kanjiSearch.addEventListener('input', renderKanji);
renderKanji();
toggleCardMode();
