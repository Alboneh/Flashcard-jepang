const kanjiSearch = document.getElementById('kanjiSearch');
const kanjiList = document.getElementById('kanjiList');
const kanjiEmptyState = document.getElementById('kanjiEmptyState');
const strokePanel = document.getElementById('strokePanel');
const strokeSelected = document.getElementById('strokeSelected');
const strokeTarget = document.getElementById('strokeTarget');
let filteredKanji = [...kanjiDatabase];
let selectedKanjiIndex = 0;
let strokeWriter = null;
let currentStrokeKanji = '';
let loopGeneration = 0;

function isMobileView() {
  return window.matchMedia('(max-width: 640px)').matches;
}

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

function updateStrokePanel(item) {
  if (!strokePanel || !strokeSelected || !strokeTarget) return;

  if (!item) {
    strokePanel.style.display = 'none';
    return;
  }

  strokePanel.style.display = '';
  strokeSelected.textContent = 'Kanji terpilih: ' + item.kanji;

  if (typeof HanziWriter === 'undefined') {
    strokeTarget.textContent = item.kanji;
    return;
  }

  if (currentStrokeKanji !== item.kanji || !strokeWriter) {
    strokeTarget.innerHTML = '';
    currentStrokeKanji = item.kanji;
    strokeWriter = HanziWriter.create('strokeTarget', item.kanji, {
      width: 180,
      height: 180,
      padding: 8,
      strokeAnimationSpeed: 1,
      delayBetweenStrokes: 250,
      strokeColor: '#226527',
      radicalColor: '#4f9c54',
      outlineColor: '#cfe5d0'
    });
  }

  loopGeneration++;
  const gen = loopGeneration;
  function loopAnimation() {
    if (gen !== loopGeneration) return;
    strokeWriter.animateCharacter({
      onComplete: () => {
        if (gen !== loopGeneration) return;
        setTimeout(() => {
          if (gen !== loopGeneration) return;
          loopAnimation();
        }, 1200);
      }
    });
  }
  loopAnimation();
}

function bindTileActions() {
  const tiles = kanjiList.querySelectorAll('.tile');
  tiles.forEach((tile) => {
    tile.addEventListener('click', (e) => {
      if (e.target.closest('.mnemonic-toggle')) return;
      const index = Number(tile.dataset.index || 0);
      selectKanji(index, true);
    });
  });

  kanjiList.querySelectorAll('.mnemonic-toggle').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const box = btn.nextElementSibling;
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      if (isOpen) {
        box.hidden = true;
        btn.setAttribute('aria-expanded', 'false');
        btn.textContent = '💡 Lihat Gambaran';
      } else {
        box.hidden = false;
        btn.setAttribute('aria-expanded', 'true');
        btn.textContent = '❌ Sembunyikan Gambaran';
      }
    });
  });
}

function selectKanji(index, smoothScroll) {
  if (!filteredKanji.length) {
    updateStrokePanel(null);
    return;
  }

  selectedKanjiIndex = Math.max(0, Math.min(index, filteredKanji.length - 1));
  const tiles = kanjiList.querySelectorAll('.tile');

  tiles.forEach((tile) => {
    const tileIndex = Number(tile.dataset.index || 0);
    tile.classList.toggle('active', tileIndex === selectedKanjiIndex);
  });

  const activeTile = kanjiList.querySelector(`.tile[data-index="${selectedKanjiIndex}"]`);
  if (activeTile) {
    activeTile.scrollIntoView({
      behavior: smoothScroll ? 'smooth' : 'auto',
      block: 'nearest',
      inline: isMobileView() ? 'center' : 'nearest'
    });
  }

  updateStrokePanel(filteredKanji[selectedKanjiIndex]);
}

function renderKanji() {
  const q = normalize(kanjiSearch.value);
  filteredKanji = kanjiDatabase.filter((item) => {
    return (
      !q ||
      normalize(item.bab).includes(q) ||
      normalize(item.kanji).includes(q) ||
      normalize(item.onyomi).includes(q) ||
      normalize(item.kunyomi).includes(q) ||
      normalize(item.meaning).includes(q) ||
      normalize(item.example).includes(q) ||
      normalize(item.mnemonic).includes(q)
    );
  });

  if (selectedKanjiIndex >= filteredKanji.length) {
    selectedKanjiIndex = 0;
  }

  kanjiList.innerHTML = filteredKanji
    .map((item, index) => {
      const activeClass = index === selectedKanjiIndex ? ' active' : '';
      return `
        <article class="tile${activeClass}" data-index="${index}">
          <div class="main">${escapeHtml(item.kanji || '-')}</div>
          <p>Bab: ${escapeHtml(item.bab || '-')}</p>
          <p>Onyomi: ${escapeHtml(item.onyomi || '-')}</p>
          <p>Kunyomi: ${escapeHtml(item.kunyomi || '-')}</p>
          <p>Arti: ${escapeHtml(item.meaning || '-')}</p>
          <p>Contoh: ${escapeHtml(item.example || '-')}</p>
          ${item.mnemonic ? `
          <button type="button" class="mnemonic-toggle" aria-expanded="false">💡 Lihat Gambaran</button>
          <div class="mnemonic" hidden><span class="mnemonic-label">Gambaran:</span> ${escapeHtml(item.mnemonic)}</div>` : ''}
        </article>
      `;
    })
    .join('');

  kanjiEmptyState.style.display = filteredKanji.length ? 'none' : '';
  bindTileActions();
  selectKanji(selectedKanjiIndex, false);
}

kanjiSearch.addEventListener('input', renderKanji);
renderKanji();
