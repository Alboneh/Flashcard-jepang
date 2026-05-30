/* TTS audio cache — fetch from Google Translate TTS, cache in IndexedDB.
   On CORS failure, falls back to direct URL (no offline cache for that item).
   Public API: window.TTSCache.{ getAudioURL, getCacheCount, clearCache, precache } */
(function () {
  const DB_NAME = 'kosakata-tts';
  const STORE = 'audio';
  const TTS_BASE = 'https://translate.google.com/translate_tts';
  let dbPromise = null;

  function openDB() {
    if (dbPromise) return dbPromise;
    dbPromise = new Promise((resolve, reject) => {
      try {
        const req = indexedDB.open(DB_NAME, 1);
        req.onupgradeneeded = (e) => {
          const db = e.target.result;
          if (!db.objectStoreNames.contains(STORE)) {
            db.createObjectStore(STORE, { keyPath: 'key' });
          }
        };
        req.onsuccess = (e) => resolve(e.target.result);
        req.onerror = (e) => reject(e.target.error || new Error('IDB open failed'));
      } catch (err) { reject(err); }
    });
    return dbPromise;
  }

  function makeKey(text, lang) { return `${lang}::${text}`; }

  function directURL(text, lang) {
    return `${TTS_BASE}?ie=UTF-8&tl=${encodeURIComponent(lang)}&q=${encodeURIComponent(text)}&client=tw-ob`;
  }

  async function getFromCache(text, lang) {
    try {
      const db = await openDB();
      return await new Promise((resolve) => {
        const tx = db.transaction(STORE, 'readonly');
        const req = tx.objectStore(STORE).get(makeKey(text, lang));
        req.onsuccess = () => resolve(req.result ? req.result.blob : null);
        req.onerror = () => resolve(null);
      });
    } catch (e) { return null; }
  }

  async function putToCache(text, lang, blob) {
    try {
      const db = await openDB();
      await new Promise((resolve) => {
        const tx = db.transaction(STORE, 'readwrite');
        const req = tx.objectStore(STORE).put({
          key: makeKey(text, lang), text, lang, blob, ts: Date.now(),
        });
        req.onsuccess = () => resolve();
        req.onerror = () => resolve();
      });
    } catch (e) { /* ignore */ }
  }

  async function fetchAndCache(text, lang) {
    const res = await fetch(directURL(text, lang), {
      mode: 'cors',
      credentials: 'omit',
      referrerPolicy: 'no-referrer',
    });
    if (!res.ok) throw new Error(`TTS HTTP ${res.status}`);
    const blob = await res.blob();
    if (!blob || blob.size === 0) throw new Error('Empty TTS blob');
    putToCache(text, lang, blob).catch(() => {});
    return blob;
  }

  /**
   * Returns { url, cached, blob } where url is playable in <audio>.
   * - If cached: ObjectURL from blob in IDB (offline-safe)
   * - If fresh fetch ok: ObjectURL from new blob (also cached for next time)
   * - If fetch blocked by CORS: direct URL (still plays, but no offline)
   */
  async function getAudioURL(text, lang) {
    if (!text) return null;
    const cached = await getFromCache(text, lang);
    if (cached) return { url: URL.createObjectURL(cached), cached: true, blob: cached };
    try {
      const blob = await fetchAndCache(text, lang);
      return { url: URL.createObjectURL(blob), cached: false, blob };
    } catch (e) {
      // CORS / network → use direct URL as fallback (works for <audio src> in many browsers)
      return { url: directURL(text, lang), cached: false, blob: null };
    }
  }

  async function getCacheCount() {
    try {
      const db = await openDB();
      return await new Promise((resolve) => {
        const tx = db.transaction(STORE, 'readonly');
        const req = tx.objectStore(STORE).count();
        req.onsuccess = () => resolve(req.result || 0);
        req.onerror = () => resolve(0);
      });
    } catch (e) { return 0; }
  }

  async function clearCache() {
    try {
      const db = await openDB();
      await new Promise((resolve) => {
        const tx = db.transaction(STORE, 'readwrite');
        const req = tx.objectStore(STORE).clear();
        req.onsuccess = () => resolve();
        req.onerror = () => resolve();
      });
      return true;
    } catch (e) { return false; }
  }

  /** Pre-cache a list of items: [{text, lang}, ...]. Runs in series (gentle on endpoint). */
  function precache(items, onProgress) {
    return (async () => {
      let done = 0;
      for (const item of items) {
        try { await getAudioURL(item.text, item.lang); } catch (e) { /* ignore */ }
        done++;
        if (onProgress) try { onProgress(done, items.length); } catch (e) { /* ignore */ }
      }
    })();
  }

  window.TTSCache = { getAudioURL, getCacheCount, clearCache, precache };
})();
