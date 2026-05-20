(function (global) {
  const STORAGE_KEY = 'belajarJepang.hidden.v1';
  const LEGACY_KEY = 'belajarJepang.hafal.v1';
  const SCOPES = ['kosakata', 'bunpo'];

  migrateLegacy();
  const state = loadState();
  const listeners = new Set();

  function migrateLegacy() {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) {
        const legacy = localStorage.getItem(LEGACY_KEY);
        if (legacy) {
          localStorage.setItem(STORAGE_KEY, legacy);
        }
      }
      localStorage.removeItem(LEGACY_KEY);
    } catch (err) { /* ignore */ }
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return blankState();
      const parsed = JSON.parse(raw);
      const out = blankState();
      SCOPES.forEach((s) => {
        const arr = Array.isArray(parsed[s]) ? parsed[s] : [];
        out[s] = new Set(arr.filter((k) => typeof k === 'string'));
      });
      return out;
    } catch (err) {
      console.warn('Hidden: gagal membaca localStorage, mulai kosong.', err);
      return blankState();
    }
  }

  function blankState() {
    const out = {};
    SCOPES.forEach((s) => { out[s] = new Set(); });
    return out;
  }

  function persist() {
    const plain = {};
    SCOPES.forEach((s) => { plain[s] = Array.from(state[s]); });
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(plain));
    } catch (err) {
      console.warn('Hidden: gagal menyimpan ke localStorage.', err);
    }
  }

  function ensureScope(scope) {
    if (!state[scope]) state[scope] = new Set();
    return state[scope];
  }

  function notify(scope) {
    listeners.forEach((fn) => {
      try { fn(scope); } catch (err) { console.error(err); }
    });
  }

  function has(scope, key) {
    return ensureScope(scope).has(String(key));
  }

  function add(scope, key) {
    ensureScope(scope).add(String(key));
    persist();
    notify(scope);
  }

  function remove(scope, key) {
    ensureScope(scope).delete(String(key));
    persist();
    notify(scope);
  }

  function toggle(scope, key) {
    const set = ensureScope(scope);
    const k = String(key);
    if (set.has(k)) set.delete(k); else set.add(k);
    persist();
    notify(scope);
    return set.has(k);
  }

  function clearScope(scope) {
    ensureScope(scope).clear();
    persist();
    notify(scope);
  }

  function list(scope) {
    return Array.from(ensureScope(scope));
  }

  function count(scope) {
    return ensureScope(scope).size;
  }

  function subscribe(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  }

  function exportData() {
    const payload = {
      version: 1,
      exportedAt: new Date().toISOString(),
    };
    SCOPES.forEach((s) => { payload[s] = Array.from(state[s]); });
    return payload;
  }

  function downloadExport() {
    const data = exportData();
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    a.href = url;
    a.download = `tersembunyi-jepang-${stamp}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function applyImport(parsed, mode) {
    if (!parsed || typeof parsed !== 'object') {
      throw new Error('Format JSON tidak dikenal.');
    }
    SCOPES.forEach((s) => {
      const incoming = Array.isArray(parsed[s]) ? parsed[s].filter((k) => typeof k === 'string') : [];
      if (mode === 'replace') {
        state[s] = new Set(incoming);
      } else {
        incoming.forEach((k) => ensureScope(s).add(k));
      }
    });
    persist();
    SCOPES.forEach((s) => notify(s));
  }

  function importFromText(text, mode) {
    const parsed = JSON.parse(text);
    applyImport(parsed, mode || 'merge');
  }

  function importFromFile(file, mode) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          importFromText(String(reader.result || ''), mode);
          resolve();
        } catch (err) { reject(err); }
      };
      reader.onerror = () => reject(reader.error || new Error('Gagal membaca file.'));
      reader.readAsText(file);
    });
  }

  global.HiddenStore = {
    SCOPES,
    has,
    add,
    remove,
    toggle,
    clearScope,
    list,
    count,
    subscribe,
    exportData,
    downloadExport,
    importFromText,
    importFromFile,
  };
})(window);
