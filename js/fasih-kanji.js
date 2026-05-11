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
  if (testMode) {
    showTestIntro();
    document.getElementById('testQuestion').style.display = 'none';
    document.getElementById('testResult').style.display = 'none';
  }
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

function buildStrokeOrderHtml(kanji) {
  if (!kanji || kanji === '?') return '';
  return `
    <div class="stroke-order">
      <p class="stroke-order-label"><strong>Urutan Goresan:</strong></p>
      <div class="stroke-boxes" data-kanji="${escapeHtml(kanji)}">
        <span class="stroke-loading">Memuat goresan…</span>
      </div>
    </div>
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
    ${buildStrokeOrderHtml(kanji)}
  `;
}

function renderKanji() {
  const q = normalize(kanjiSearch.value);
  const filtered = fasihKanjiDatabase.filter((item) => matchesBab(item) && matchesQuery(item, q));

  // Hide empty state when not in list mode — handled by applyViewMode
  if (cardMode || testMode) {
    kanjiList.innerHTML = '';
    kanjiEmptyState.style.display = 'none';
  } else if (!filtered.length) {
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
  populateStrokeBoxes();
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
  populateStrokeBoxes();
}

function cardNav(dir) {
  cardIndex = Math.max(0, Math.min(cardItems.length - 1, cardIndex + dir));
  renderCardView(cardItems);
  document.getElementById('cardModeCard').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function toggleCardMode() {
  if (testMode) testMode = false;
  cardMode = !cardMode;
  applyViewMode();
}

function toggleTestMode() {
  if (cardMode) cardMode = false;
  testMode = !testMode;
  applyViewMode();
}

function applyViewMode() {
  const listView = document.getElementById('kanjiList');
  const cardView = document.getElementById('cardModeView');
  const testView = document.getElementById('testModeView');
  const cardBtn = document.getElementById('cardModeToggle');
  const testBtn = document.getElementById('testModeToggle');

  listView.style.display = (cardMode || testMode) ? 'none' : '';
  cardView.style.display = cardMode ? 'block' : 'none';
  testView.style.display = testMode ? 'block' : 'none';

  cardBtn.textContent = cardMode ? '☰ Mode List' : '▦ Mode Kartu';
  cardBtn.classList.toggle('active', cardMode);
  testBtn.textContent = testMode ? '✕ Tutup Test' : '🎯 Test';
  testBtn.classList.toggle('active', testMode);

  if (cardMode) {
    cardIndex = 0;
    const q = normalize(kanjiSearch.value);
    cardItems = fasihKanjiDatabase.filter((item) => matchesBab(item) && matchesQuery(item, q));
    renderCardView(cardItems);
  }
  if (testMode) {
    showTestIntro();
    document.getElementById('testQuestion').style.display = 'none';
    document.getElementById('testResult').style.display = 'none';
  }
  // list mode visibility + empty state handled by renderKanji
  renderKanji();
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

// ---- TEST MODE ----
let testMode = false;
let testQuestions = [];
let testIndex = 0;
let testScore = 0;
let testAnswered = false;
const TEST_MAX_QUESTIONS = 15;

function getTestPool() {
  const q = normalize(kanjiSearch.value);
  return fasihKanjiDatabase.filter((item) => matchesBab(item) && matchesQuery(item, q));
}

function getDistractorPool(pool) {
  // Use bab pool if it has at least 4 entries, otherwise use full database
  return pool.length >= 4 ? pool : fasihKanjiDatabase;
}

function showTestIntro() {
  const intro = document.getElementById('testIntro');
  const info = document.getElementById('testIntroInfo');
  const startBtn = document.getElementById('testStartBtn');
  intro.style.display = 'block';

  const pool = getTestPool();
  const distractorPool = getDistractorPool(pool);
  const babLabel = selectedBab === 'Semua' ? 'semua bab' : selectedBab;

  if (pool.length === 0) {
    info.innerHTML = `<p class="test-error">Belum ada kanji untuk ${escapeHtml(babLabel)}. Pilih bab lain atau tambah data.</p>`;
    startBtn.disabled = true;
  } else if (distractorPool.length < 4) {
    info.innerHTML = `<p class="test-error">Butuh minimal 4 kanji di database untuk membuat pilihan ganda.</p>`;
    startBtn.disabled = true;
  } else {
    const sessionSize = Math.min(pool.length, TEST_MAX_QUESTIONS);
    info.innerHTML = `<p>Pilihan ganda untuk <strong>${escapeHtml(babLabel)}</strong>:<br>${sessionSize} soal dari ${pool.length} kanji.</p>`;
    startBtn.disabled = false;
  }
}

function makeTestQuestion(correct, distractorPool) {
  const distractors = distractorPool.filter((k) => k.kanji !== correct.kanji && k.meaning !== correct.meaning);
  const shuffled = [...distractors].sort(() => Math.random() - 0.5).slice(0, 3);
  const options = [correct, ...shuffled].sort(() => Math.random() - 0.5);
  return { correct, options };
}

function startTest() {
  const pool = getTestPool();
  const distractorPool = getDistractorPool(pool);
  if (distractorPool.length < 4) return;

  const sessionSize = Math.min(pool.length, TEST_MAX_QUESTIONS);
  const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, sessionSize);
  testQuestions = shuffled.map((kanji) => makeTestQuestion(kanji, distractorPool));
  testIndex = 0;
  testScore = 0;
  testAnswered = false;

  document.getElementById('testIntro').style.display = 'none';
  document.getElementById('testResult').style.display = 'none';
  document.getElementById('testQuestion').style.display = 'block';
  renderTestQuestion();
}

function renderTestQuestion() {
  const q = testQuestions[testIndex];
  document.getElementById('testKanjiChar').textContent = q.correct.kanji;
  document.getElementById('testProgressText').textContent = `Soal ${testIndex + 1} / ${testQuestions.length}`;
  document.getElementById('testScore').textContent = `Skor: ${testScore}`;

  const optionsContainer = document.getElementById('testOptions');
  optionsContainer.innerHTML = q.options.map((opt) =>
    `<button class="test-option" data-correct="${opt.kanji === q.correct.kanji}" onclick="pickAnswer(this)">${escapeHtml(opt.meaning)}</button>`
  ).join('');

  document.getElementById('testFeedback').style.display = 'none';
  document.getElementById('testNextBtn').style.display = 'none';
  testAnswered = false;
}

function pickAnswer(btn) {
  if (testAnswered) return;
  testAnswered = true;
  const isCorrect = btn.dataset.correct === 'true';
  if (isCorrect) testScore++;

  document.querySelectorAll('.test-option').forEach((b) => {
    b.disabled = true;
    if (b.dataset.correct === 'true') b.classList.add('correct');
    if (b === btn && !isCorrect) b.classList.add('wrong');
  });

  const feedback = document.getElementById('testFeedback');
  feedback.className = `test-feedback ${isCorrect ? 'correct' : 'wrong'}`;
  feedback.textContent = isCorrect
    ? '✓ Benar!'
    : `✗ Jawaban: ${testQuestions[testIndex].correct.meaning}`;
  feedback.style.display = 'block';

  document.getElementById('testScore').textContent = `Skor: ${testScore}`;
  const nextBtn = document.getElementById('testNextBtn');
  nextBtn.textContent = testIndex === testQuestions.length - 1 ? 'Lihat Hasil →' : 'Berikutnya →';
  nextBtn.style.display = 'block';
}

function nextTestQuestion() {
  testIndex++;
  if (testIndex >= testQuestions.length) {
    showTestResult();
  } else {
    renderTestQuestion();
  }
}

function showTestResult() {
  document.getElementById('testQuestion').style.display = 'none';
  document.getElementById('testResult').style.display = 'block';
  const total = testQuestions.length;
  const pct = Math.round((testScore / total) * 100);
  document.getElementById('finalScore').textContent = testScore;
  document.getElementById('finalTotal').textContent = total;

  let msg;
  if (pct === 100) msg = 'Sempurna! Sudah fasih untuk bab ini. 🌸';
  else if (pct >= 80) msg = `Mantap! Akurasi ${pct}%.`;
  else if (pct >= 60) msg = `Lumayan, akurasi ${pct}%. Coba ulang biar lebih fasih.`;
  else msg = `Akurasi ${pct}%. Pelajari ulang kanjinya di mode kartu lalu coba lagi.`;
  document.getElementById('testResultMsg').textContent = msg;
}

function restartTest() {
  showTestIntro();
}

// ---- STROKE ORDER (KanjiVG) ----
const strokeCache = new Map();
const STROKE_LS_PREFIX = 'fasih:strokes:v1:';

async function fetchStrokeOrder(kanji) {
  if (strokeCache.has(kanji)) return strokeCache.get(kanji);

  const lsKey = STROKE_LS_PREFIX + kanji;
  try {
    const cached = localStorage.getItem(lsKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      strokeCache.set(kanji, parsed);
      return parsed;
    }
  } catch (e) { /* ignore */ }

  const codepoint = kanji.codePointAt(0).toString(16).padStart(5, '0');
  const url = `https://cdn.jsdelivr.net/gh/KanjiVG/kanjivg@master/kanji/${codepoint}.svg`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('not found');
    const text = await res.text();
    const doc = new DOMParser().parseFromString(text, 'image/svg+xml');
    const paths = [...doc.querySelectorAll('path[id]')]
      .filter((p) => /-s\d+$/.test(p.id))
      .sort((a, b) => {
        const an = +a.id.match(/-s(\d+)$/)[1];
        const bn = +b.id.match(/-s(\d+)$/)[1];
        return an - bn;
      })
      .map((p) => p.getAttribute('d'));
    strokeCache.set(kanji, paths);
    try { localStorage.setItem(lsKey, JSON.stringify(paths)); } catch (e) { /* quota */ }
    return paths;
  } catch (e) {
    strokeCache.set(kanji, null);
    return null;
  }
}

function buildStrokeBoxHtml(strokes, upToIndex) {
  const grid = `
    <line x1="54.5" y1="0" x2="54.5" y2="109" stroke="rgba(0,0,0,0.18)" stroke-width="0.5" stroke-dasharray="2,2"/>
    <line x1="0" y1="54.5" x2="109" y2="54.5" stroke="rgba(0,0,0,0.18)" stroke-width="0.5" stroke-dasharray="2,2"/>
  `;
  const paths = strokes.slice(0, upToIndex + 1).map((d, j) => {
    const isNew = j === upToIndex;
    const color = isNew ? '#ec407a' : '#1a1108';
    return `<path d="${d}" stroke="${color}" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  }).join('');
  return `
    <div class="stroke-box">
      <svg viewBox="0 0 109 109" xmlns="http://www.w3.org/2000/svg">
        ${grid}
        ${paths}
      </svg>
    </div>
  `;
}

async function renderStrokeBoxes(container, kanji) {
  if (!container || container.dataset.loaded === 'true' || container.dataset.loaded === 'loading') return;
  container.dataset.loaded = 'loading';
  const strokes = await fetchStrokeOrder(kanji);
  if (!strokes || !strokes.length) {
    container.innerHTML = '<span class="stroke-error">Belum ada data goresan untuk kanji ini.</span>';
    container.dataset.loaded = 'true';
    return;
  }
  container.innerHTML = strokes.map((_, i) => buildStrokeBoxHtml(strokes, i)).join('');
  container.dataset.loaded = 'true';
}

function populateStrokeBoxes() {
  document.querySelectorAll('.stroke-boxes[data-kanji]').forEach((el) => {
    if (el.dataset.loaded === 'true' || el.dataset.loaded === 'loading') return;
    renderStrokeBoxes(el, el.dataset.kanji);
  });
}

kanjiSearch.addEventListener('input', renderKanji);
renderKanji();
toggleCardMode();
