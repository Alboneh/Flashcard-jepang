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
  const match = raw.match(/^(.*)\s\(([^()]*)\)\s*$/);

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

function setBabFilter(bab) {
  selectedBab = bab;
  document.querySelectorAll('#babFilter .level-btn').forEach(btn => {
    btn.classList.toggle('active', btn.textContent === bab);
  });
  renderBunpo();
}

function renderBunpo() {
  const q = normalize(bunpoSearch.value);
  const filtered = bunpoDatabase.filter((item, index) => {
    const bab = item.bab || 'Bab Lanjutan';
    const babMatch = selectedBab === 'Semua' || bab === selectedBab;
    return (
      babMatch &&
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
  return `
    <div class="item-top">
      <h3>Pola Asli</h3>
      <span class="bab-badge">${escapeHtml(bab)}</span>
    </div>
    <p class="pattern-main">${escapeHtml(rawPattern).replace(/~~([^~]+)~~/g, '<s>$1</s>')}</p>
    <p class="core-meaning"><strong>Penjelasan:</strong> ${escapeHtml(explanation)}</p>
    <p><strong>Contoh:</strong></p>
    <ul>${examples}</ul>
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
      return babMatch && (!q ||
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

bunpoSearch.addEventListener('input', renderBunpo);
renderBunpo();
toggleCardMode();
