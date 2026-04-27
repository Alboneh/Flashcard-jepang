function getAvailableBabs() {
  const checkboxes = document.querySelectorAll('.multi-option input[type="checkbox"]');
  return Array.from(checkboxes).map((cb) => cb.value);
}

function getSelectedBabs() {
  const checkboxes = document.querySelectorAll('.multi-option input[type="checkbox"]:checked');
  return Array.from(checkboxes).map((cb) => cb.value);
}

function updateBabFilterButtonLabel() {
  const btn = document.getElementById('babFilterBtn');
  if(!btn) return;
  const selected = getSelectedBabs();

  if(selected.length === 0) {
    btn.textContent = 'Filter Bab: Semua';
    return;
  }

  if(selected.length <= 2) {
    btn.textContent = 'Filter Bab: ' + selected.join(', ');
    return;
  }

  btn.textContent = 'Filter Bab: ' + selected.length + ' Bab dipilih';
}

function toggleBabDropdown() {
  const panel = document.getElementById('babFilterPanel');
  if(!panel) return;
  panel.classList.toggle('show');
}

function closeBabDropdown() {
  const panel = document.getElementById('babFilterPanel');
  if(!panel) return;
  panel.classList.remove('show');
}

function onBabSelectionChange() {
  updateBabFilterButtonLabel();
  renderAllKosakata();
}

function getFilteredVocab() {
  const selectedBabs = getSelectedBabs();
  const q = document.getElementById('search').value.trim().toLowerCase();

  return vocab.filter((item) => {
    const matchesBab = selectedBabs.length === 0 || selectedBabs.includes(item.cat);
    if(!matchesBab) return false;

    if(!q) return true;

    const jpText = item.jp || item.kanji || '';
    const romajiText = item.rom || [item.unyomi, item.kunyomi].filter(Boolean).join(' ');
    const meaningText = item.id || '';

    return (
      jpText.toLowerCase().includes(q) ||
      romajiText.toLowerCase().includes(q) ||
      meaningText.toLowerCase().includes(q)
    );
  });
}

function renderAllKosakata() {
  const grid = document.getElementById('allGrid');
  const stats = document.getElementById('stats');
  const list = getFilteredVocab();

  stats.textContent = list.length + ' kata';

  if(!list.length) {
    grid.innerHTML = '<p class="empty-state">Tidak ada kata yang cocok dengan filter atau pencarian.</p>';
    return;
  }

  grid.innerHTML = list.map((item) => {
    const jpText = item.jp || item.kanji || '-';
    const romajiText = item.rom || [item.unyomi, item.kunyomi].filter(Boolean).join(' / ');
    const meaningText = item.id || '-';

    return `
      <article class="all-card">
        <p class="all-jp">${jpText}</p>
        <p class="all-romaji">${romajiText || '-'}</p>
        <p class="all-meaning">${meaningText}</p>
        <span class="all-cat">${item.cat}</span>
      </article>
    `;
  }).join('');
}

function selectAllBabs() {
  const checkboxes = document.querySelectorAll('.multi-option input[type="checkbox"]');
  checkboxes.forEach((cb) => {
    cb.checked = true;
  });
  updateBabFilterButtonLabel();
  renderAllKosakata();
}

function clearAllBabs() {
  const checkboxes = document.querySelectorAll('.multi-option input[type="checkbox"]');
  checkboxes.forEach((cb) => {
    cb.checked = false;
  });
  updateBabFilterButtonLabel();
  renderAllKosakata();
}

document.addEventListener('click', (e) => {
  const root = document.getElementById('babFilter');
  if(!root) return;
  if(!root.contains(e.target)) {
    closeBabDropdown();
  }
});

updateBabFilterButtonLabel();
renderAllKosakata();
