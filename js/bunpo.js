const bunpoSearch = document.getElementById('bunpoSearch');
const bunpoList = document.getElementById('bunpoList');
const bunpoEmptyState = document.getElementById('bunpoEmptyState');

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
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
  // Ambil kelompok parens TERAKHIR sebagai arti — boleh ada kurung di dalam.
  const match = raw.match(/^(.*)\s\((.+)\)\s*$/);

  if (!match) {
    return {
      jp: raw,
      id: 'Belum ditambahkan.'
    };
  }

  return {
    jp: match[1].trim(),
    id: match[2].trim() || 'Belum ditambahkan.'
  };
}

let selectedBab = 'Semua';

function bunpoHideKey(item) {
  if (!item) return '';
  return String(item.pattern || '');
}

function isBunpoHidden(item) {
  return window.HiddenStore && HiddenStore.has('bunpo', bunpoHideKey(item));
}

function setBabFilter(bab) {
  selectedBab = bab;
  document.querySelectorAll('#babFilter .level-btn').forEach(btn => {
    btn.classList.toggle('active', btn.textContent === bab);
  });
  cardIndex = 0;
  renderBunpo();
}

function getOriginalIndex(item) {
  return bunpoDatabase.indexOf(item);
}

function renderBunpo() {
  const q = normalize(bunpoSearch.value);
  const filtered = bunpoDatabase.filter((item, index) => {
    const bab = item.bab || 'Bab Lanjutan';
    const babMatch = selectedBab === 'Semua' || bab === selectedBab;
    const hiddenMatch = !isBunpoHidden(item);
    return (
      babMatch &&
      hiddenMatch &&
      (!q ||
        normalize(bab).includes(q) ||
        normalize(item.pattern).includes(q) ||
        normalize(item.explanation).includes(q) ||
        (item.examples || []).some((ex) => normalize(ex).includes(q)))
    );
  });

  bunpoList.innerHTML = filtered
    .map((item) => {
      const examples = (item.examples || [])
        .map((ex) => {
          const parsed = parseExample(ex);
          return `<li><div class="ex-jp">${escapeHtml(parsed.jp)}</div><div class="ex-id">Arti: ${escapeHtml(parsed.id)}</div></li>`;
        })
        .join('');

      const rawPattern = item.pattern || '-';
      const explanation = expandShorthand(item.explanation || '-');
      const bab = item.bab || 'Bab Lanjutan';
      const idx = getOriginalIndex(item);

      return `
        <article class="item">
          <div class="item-top">
            <h3>Pola Asli</h3>
            <span class="bab-badge">${escapeHtml(bab)}</span>
          </div>
          <p class="pattern-main">${escapeHtml(rawPattern).replace(/~~([^~]+)~~/g, '<s>$1</s>')}</p>
          <p class="core-meaning"><strong>Penjelasan:</strong> ${escapeHtml(explanation)}</p>
          <p><strong>Contoh:</strong></p>
          <ul>${examples}</ul>
          <div class="practice-btn-row">
            <button type="button" class="hide-btn" onclick="hideBunpoItem(${idx})">🙈 Sembunyikan</button>
            <button type="button" class="practice-btn" onclick="openPracticeModal(${idx})">✎ Coba Pola</button>
          </div>
        </article>
      `;
    })
    .join('');

  bunpoEmptyState.style.display = filtered.length ? 'none' : '';

  // If card mode is active, re-render card view
  if (cardMode) renderCardView(filtered);
}

// ---- CARD MODE ----
let cardMode = false;
let cardIndex = 0;
let cardItems = [];

function buildItemHtml(item) {
  const examples = (item.examples || [])
    .map((ex) => {
      const parsed = parseExample(ex);
      return `<li><div class="ex-jp">${escapeHtml(parsed.jp)}</div><div class="ex-id">Arti: ${escapeHtml(parsed.id)}</div></li>`;
    })
    .join('');
  const rawPattern = item.pattern || '-';
  const explanation = expandShorthand(item.explanation || '-');
  const bab = item.bab || 'Bab Lanjutan';
  const idx = getOriginalIndex(item);
  return `
    <div class="item-top">
      <h3>Pola Asli</h3>
      <span class="bab-badge">${escapeHtml(bab)}</span>
    </div>
    <p class="pattern-main">${escapeHtml(rawPattern).replace(/~~([^~]+)~~/g, '<s>$1</s>')}</p>
    <p class="core-meaning"><strong>Penjelasan:</strong> ${escapeHtml(explanation)}</p>
    <p><strong>Contoh:</strong></p>
    <ul>${examples}</ul>
    <div class="practice-btn-row">
      <button type="button" class="hide-btn" onclick="hideBunpoItem(${idx})">🙈 Sembunyikan</button>
      <button type="button" class="practice-btn" onclick="openPracticeModal(${idx})">✎ Coba Pola</button>
    </div>
  `;
}

function renderCardView(items) {
  cardItems = items;
  if (cardIndex >= cardItems.length) cardIndex = 0;
  const card = document.getElementById('cardModeCard');
  const counter = document.getElementById('cardCounter');
  const prevBtn = document.getElementById('cardPrevBtn');
  const nextBtn = document.getElementById('cardNextBtn');
  if (!cardItems.length) {
    card.innerHTML = '<p style="color:var(--faded);text-align:center;">Tidak ada kartu.</p>';
    counter.textContent = '0 / 0';
    prevBtn.disabled = true;
    nextBtn.disabled = true;
    return;
  }
  counter.textContent = `${cardIndex + 1} / ${cardItems.length}`;
  card.innerHTML = buildItemHtml(cardItems[cardIndex]);
  prevBtn.disabled = cardIndex === 0;
  nextBtn.disabled = cardIndex === cardItems.length - 1;
}

function cardNav(dir) {
  cardIndex = Math.max(0, Math.min(cardItems.length - 1, cardIndex + dir));
  renderCardView(cardItems);
  document.getElementById('cardModeCard').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function toggleCardMode() {
  cardMode = !cardMode;
  const btn = document.getElementById('cardModeToggle');
  const listView = document.getElementById('bunpoList');
  const cardView = document.getElementById('cardModeView');
  const helperCard = document.querySelector('.helper-card');
  if (cardMode) {
    btn.textContent = '☰ Mode List';
    btn.classList.add('active');
    listView.style.display = 'none';
    if (helperCard) helperCard.style.display = 'none';
    cardView.style.display = 'block';
    cardIndex = 0;
    // collect current filtered items
    const q = normalize(bunpoSearch.value);
    cardItems = bunpoDatabase.filter((item, index) => {
      const bab = item.bab || 'Bab Lanjutan';
      const babMatch = selectedBab === 'Semua' || bab === selectedBab;
      const hiddenMatch = !isBunpoHidden(item);
      return babMatch && hiddenMatch && (!q ||
        normalize(bab).includes(q) ||
        normalize(item.pattern).includes(q) ||
        normalize(item.explanation).includes(q) ||
        (item.examples || []).some((ex) => normalize(ex).includes(q)));
    });
    renderCardView(cardItems);
  } else {
    btn.textContent = '▦ Mode Kartu';
    btn.classList.remove('active');
    listView.style.display = '';
    if (helperCard) helperCard.style.display = '';
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

bunpoSearch.addEventListener('input', () => {
  cardIndex = 0;
  renderBunpo();
});

// ---- PRACTICE MODAL ----
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
  const body = document.getElementById('practiceModalBody');
  const modal = document.getElementById('practiceModal');
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
    const templateHtml = data.template
      ? `<p class="practice-template">${escapeHtml(data.template)}</p>`
      : '';
    const patternRef = item
      ? `<div class="practice-pattern-ref"><span class="practice-pattern-ref-label">Pola Asli:</span> ${escapeHtml(item.pattern)}</div>`
      : '';

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
  const modal = document.getElementById('practiceModal');
  if (!modal) return;
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closePracticeModal();
});

function hideBunpoItem(idx) {
  if (!window.HiddenStore) return;
  const item = bunpoDatabase[idx];
  if (!item) return;
  HiddenStore.add('bunpo', bunpoHideKey(item));
  renderBunpo();
}

if (window.HiddenStore) {
  HiddenStore.subscribe((scope) => {
    if (scope !== 'bunpo') return;
    renderBunpo();
  });
}

renderBunpo();
toggleCardMode();
