(function () {
  const kosakataListEl = document.getElementById('kosakataList');
  const kosakataEmptyEl = document.getElementById('kosakataEmpty');
  const kosakataCountEl = document.getElementById('kosakataCount');
  const kosakataClearBtn = document.getElementById('clearKosakataBtn');

  const bunpoListEl = document.getElementById('bunpoList');
  const bunpoEmptyEl = document.getElementById('bunpoEmpty');
  const bunpoCountEl = document.getElementById('bunpoCount');
  const bunpoClearBtn = document.getElementById('clearBunpoBtn');

  function escapeHtml(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
    }

  function findVocabByKey(key) {
    if (!key || typeof vocab === 'undefined') return null;
    const colon = key.indexOf(':');
    if (colon < 0) return null;
    const type = key.slice(0, colon);
    const id = key.slice(colon + 1);
    if (type === 'k') {
      return vocab.find((v) => v.type === 'kanji' && v.kanji === id) || null;
    }
    if (type === 'v') {
      return vocab.find((v) => v.type !== 'kanji' && v.jp === id) || null;
    }
    return null;
  }

  function findBunpoByPattern(pattern) {
    if (!pattern || typeof bunpoDatabase === 'undefined') return null;
    return bunpoDatabase.find((b) => b.pattern === pattern) || null;
  }

  function renderKosakataItem(key) {
    const v = findVocabByKey(key);
    const safeKey = escapeHtml(key);
    if (!v) {
      return `
        <article class="hidden-card hidden-card--missing">
          <div class="hidden-card-body">
            <div class="hidden-card-jp">${safeKey}</div>
            <div class="hidden-card-meta">Item tidak ditemukan di database saat ini.</div>
          </div>
          <button type="button" class="unhide-btn" data-scope="kosakata" data-key="${safeKey}">↺ Tampilkan</button>
        </article>
      `;
    }
    const isKanji = v.type === 'kanji';
    const jpDisplay = isKanji ? v.kanji : v.jp;
    const reading = isKanji
      ? `On: ${escapeHtml(v.unyomi || '-')} | Kun: ${escapeHtml(v.kunyomi || '-')}`
      : escapeHtml(v.rom || '');
    return `
      <article class="hidden-card">
        <div class="hidden-card-body">
          <div class="hidden-card-jp">${escapeHtml(jpDisplay)}</div>
          <div class="hidden-card-reading">${reading}</div>
          <div class="hidden-card-meaning">${escapeHtml(v.id || '')}</div>
          <div class="hidden-card-meta"><span class="bab-pill">${escapeHtml(v.cat || '')}</span></div>
        </div>
        <button type="button" class="unhide-btn" data-scope="kosakata" data-key="${safeKey}">↺ Tampilkan</button>
      </article>
    `;
  }

  function renderBunpoItem(pattern) {
    const item = findBunpoByPattern(pattern);
    const safeKey = escapeHtml(pattern);
    if (!item) {
      return `
        <article class="hidden-card hidden-card--missing">
          <div class="hidden-card-body">
            <div class="hidden-card-jp">${safeKey}</div>
            <div class="hidden-card-meta">Pola tidak ditemukan di database saat ini.</div>
          </div>
          <button type="button" class="unhide-btn" data-scope="bunpo" data-key="${safeKey}">↺ Tampilkan</button>
        </article>
      `;
    }
    const bab = item.bab || 'Bab Lanjutan';
    const explanation = item.explanation || '';
    return `
      <article class="hidden-card">
        <div class="hidden-card-body">
          <div class="hidden-card-pattern">${escapeHtml(item.pattern).replace(/~~([^~]+)~~/g, '<s>$1</s>')}</div>
          <div class="hidden-card-meaning">${escapeHtml(explanation)}</div>
          <div class="hidden-card-meta"><span class="bab-pill">${escapeHtml(bab)}</span></div>
        </div>
        <button type="button" class="unhide-btn" data-scope="bunpo" data-key="${safeKey}">↺ Tampilkan</button>
      </article>
    `;
  }

  function render() {
    if (!window.HiddenStore) return;

    const kosakataKeys = HiddenStore.list('kosakata');
    kosakataCountEl.textContent = kosakataKeys.length;
    kosakataClearBtn.disabled = kosakataKeys.length === 0;
    if (kosakataKeys.length) {
      kosakataListEl.innerHTML = kosakataKeys.map(renderKosakataItem).join('');
      kosakataEmptyEl.style.display = 'none';
    } else {
      kosakataListEl.innerHTML = '';
      kosakataEmptyEl.style.display = '';
    }

    const bunpoKeys = HiddenStore.list('bunpo');
    bunpoCountEl.textContent = bunpoKeys.length;
    bunpoClearBtn.disabled = bunpoKeys.length === 0;
    if (bunpoKeys.length) {
      bunpoListEl.innerHTML = bunpoKeys.map(renderBunpoItem).join('');
      bunpoEmptyEl.style.display = 'none';
    } else {
      bunpoListEl.innerHTML = '';
      bunpoEmptyEl.style.display = '';
    }
  }

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.unhide-btn');
    if (!btn || !window.HiddenStore) return;
    const scope = btn.getAttribute('data-scope');
    const key = btn.getAttribute('data-key');
    if (!scope || !key) return;
    const card = btn.closest('.hidden-card');
    const jpEl = card ? card.querySelector('.hidden-card-jp, .hidden-card-pattern') : null;
    const itemLabel = jpEl ? jpEl.textContent.trim() : key;
    const label = scope === 'kosakata' ? 'kosakata' : 'bunpo';
    if (!confirm(`Tampilkan kembali ${label} "${itemLabel}"?`)) return;
    HiddenStore.remove(scope, key);
  });

  window.clearScope = function (scope) {
    if (!window.HiddenStore) return;
    if (HiddenStore.count(scope) === 0) return;
    const label = scope === 'kosakata' ? 'kosakata' : 'bunpo';
    if (!confirm(`Tampilkan kembali SEMUA ${label} yang tersembunyi?`)) return;
    HiddenStore.clearScope(scope);
  };

  window.importHiddenFile = function (input) {
    if (!input || !input.files || !input.files[0] || !window.HiddenStore) return;
    const file = input.files[0];
    const mode = confirm('OK = GABUNG dengan data lama.\nCancel = TIMPA total dengan isi file.') ? 'merge' : 'replace';
    HiddenStore.importFromFile(file, mode)
      .then(() => {
        alert('Berhasil import data tersembunyi.');
        input.value = '';
      })
      .catch((err) => {
        alert('Gagal import: ' + (err && err.message ? err.message : err));
        input.value = '';
      });
  };

  if (window.HiddenStore) {
    HiddenStore.subscribe(render);
  }

  render();
})();
