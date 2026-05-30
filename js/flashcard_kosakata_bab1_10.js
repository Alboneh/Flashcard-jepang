/* ==========================================================
   KOSAKATA — Flashcard mode (single-select bab)
   ========================================================== */

const $k = (id) => document.getElementById(id);

let filtered = [];
let idx = 0;
let flipped = false;
let mode = 'flash';
let voicesReady = false;
let autoVoiceRunning = false;
let autoVoiceRunId = 0;
let reverseMode = false;
const SELECTED_BAB_KEY = 'kosakata-selected-bab';
let selectedBab = (function () {
  try { return localStorage.getItem(SELECTED_BAB_KEY) || 'Semua'; }
  catch (e) { return 'Semua'; }
})();

const JAPANESE_TO_MEANING_DELAY_MS = 1000;
const AUTO_NEXT_DELAY_MS = 1500;
const CAT_COLORS = ['#e8607e', '#7fa790', '#c9a14a', '#e89476', '#a684c4'];

/* ===== Helpers ===== */
function vocabHideKey(v) {
  if (!v) return '';
  return v.type === 'kanji' ? 'k:' + v.kanji : 'v:' + v.jp;
}

function isVocabHidden(v) {
  return window.HiddenStore && HiddenStore.has('kosakata', vocabHideKey(v));
}

function waitMs(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

/* ===== Speech (audio-file based via TTSCache, works on lock screen) ===== */
let ttsAudio = null;
let ttsCurrentURL = null;

function getTTSAudio() {
  if (!ttsAudio) {
    ttsAudio = new Audio();
    ttsAudio.preload = 'auto';
    ttsAudio.playsInline = true;
    document.body.appendChild(ttsAudio);
  }
  return ttsAudio;
}

function releaseTTSURL() {
  if (ttsCurrentURL && ttsCurrentURL.startsWith('blob:')) {
    try { URL.revokeObjectURL(ttsCurrentURL); } catch (e) { /* ignore */ }
  }
  ttsCurrentURL = null;
}

function loadVoices() { /* legacy no-op, kept for compatibility */ }

/* Clean Indonesian text for TTS — strip Japanese chars, parens, tildes
   that would confuse the Indonesian voice. */
function cleanForTTS(text, lang) {
  if (!text) return '';
  if (lang !== 'id') return text;
  return String(text)
    .replace(/\([^)]*\)/g, '')                       // remove (...)
    .replace(/\[[^\]]*\]/g, '')                      // remove [...]
    .replace(/[぀-ヿ一-鿿]/g, '')    // remove hiragana/katakana/kanji
    .replace(/[~～]/g, 'ini')                        // tilde → "ini"
    .replace(/\s+([,.!?:;])/g, '$1')                 // tighten punct
    .replace(/([,.!?:;])\1+/g, '$1')                 // collapse repeats: ",, " → ","
    .replace(/^[\s,.!?:;]+/, '')                     // strip leading junk
    .replace(/[\s,]+$/, '')                          // strip trailing comma/space
    .replace(/\s+/g, ' ')                            // collapse spaces
    .trim();
}

async function speakText(text, lang) {
  const cleaned = cleanForTTS(text, lang);
  if (!cleaned || !window.TTSCache) return;
  let res;
  try { res = await TTSCache.getAudioURL(cleaned, lang); }
  catch (e) { return; }
  if (!res || !res.url) return;

  releaseTTSURL();
  ttsCurrentURL = res.url;

  const audio = getTTSAudio();
  audio.src = ttsCurrentURL;

  return new Promise((resolve) => {
    let done = false;
    const finish = () => { if (done) return; done = true; cleanup(); resolve(); };
    const cleanup = () => {
      audio.removeEventListener('ended', finish);
      audio.removeEventListener('error', finish);
    };
    audio.addEventListener('ended', finish);
    audio.addEventListener('error', finish);
    audio.play().catch(() => finish());
  });
}

function getJapaneseReadText(v) {
  if (v.type === 'kanji') {
    return v.kanji + '。 おんよみ ' + v.unyomi + '。 くんよみ ' + v.kunyomi;
  }
  return v.jp;
}

function updateMediaSession(v) {
  if (!('mediaSession' in navigator)) return;
  try {
    const title = v.type === 'kanji' ? v.kanji : v.jp;
    navigator.mediaSession.metadata = new MediaMetadata({
      title: title || 'Kosakata',
      artist: v.id || '',
      album: v.cat || 'Kosakata',
    });
  } catch (e) { /* ignore */ }
}

function setupMediaSessionHandlers() {
  if (!('mediaSession' in navigator)) return;
  try {
    navigator.mediaSession.setActionHandler('play', () => {
      if (mode === 'auto' && !autoVoiceRunning) startAutoVoice(false);
      else if (ttsAudio && ttsAudio.paused && ttsAudio.src) ttsAudio.play().catch(() => {});
    });
    navigator.mediaSession.setActionHandler('pause', () => {
      stopAutoVoice();
    });
    navigator.mediaSession.setActionHandler('previoustrack', () => {
      if (!filtered.length) return;
      idx = (idx - 1 + filtered.length) % filtered.length;
      renderCard();
      if (mode === 'auto') startAutoVoice(true);
    });
    navigator.mediaSession.setActionHandler('nexttrack', () => {
      if (!filtered.length) return;
      idx = (idx + 1) % filtered.length;
      renderCard();
      if (mode === 'auto') startAutoVoice(true);
    });
  } catch (e) { /* ignore */ }
}

function prefetchNextCard() {
  if (!window.TTSCache || filtered.length < 2) return;
  const nextIdx = (idx + 1) % filtered.length;
  const v = filtered[nextIdx];
  if (!v) return;
  TTSCache.getAudioURL(getJapaneseReadText(v), 'ja').catch(() => {});
  if (v.id) TTSCache.getAudioURL(v.id, 'id').catch(() => {});
}

async function speakCurrentCardSequence(autoFlip) {
  if (!filtered.length) return;
  const v = filtered[idx];
  updateMediaSession(v);
  prefetchNextCard();

  const jpText = getJapaneseReadText(v);
  const idText = v.id;

  if (reverseMode) {
    await speakText(idText, 'id');
    await waitMs(JAPANESE_TO_MEANING_DELAY_MS);
    if (autoFlip) { flipped = true; updateFlipState(); }
    await speakText(jpText, 'ja');
  } else {
    await speakText(jpText, 'ja');
    await waitMs(JAPANESE_TO_MEANING_DELAY_MS);
    if (autoFlip) { flipped = true; updateFlipState(); }
    await speakText(idText, 'id');
  }
}

function speakCurrentCard() {
  speakCurrentCardSequence(false);
}

/* ===== Filtering ===== */
function getBabList() {
  const map = new Map();
  vocab.forEach((v) => {
    if (isVocabHidden(v)) return;
    const c = v.cat || 'Lainnya';
    map.set(c, (map.get(c) || 0) + 1);
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
  const el = $k('babFilter');
  if (!el) return;
  const babs = getBabList();
  el.innerHTML = babs.map((b) => `
    <button class="cat-btn ${b.name === selectedBab ? 'active' : ''}" data-bab="${b.name}">
      <span class="cat-dot" style="--cat-color:${b.color}"></span>
      <span class="cat-name">${b.name}</span>
      <span class="cat-count">${b.count}</span>
    </button>
  `).join('');
  el.querySelectorAll('.cat-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      selectedBab = btn.dataset.bab;
      try { localStorage.setItem(SELECTED_BAB_KEY, selectedBab); } catch (e) { /* ignore */ }
      idx = 0;
      renderBabFilter();
      filterCards();
      closeMobileSidebar();
    });
  });
}

function filterCards(opts) {
  const preservePos = !!(opts && opts.preservePosition);
  const q = $k('search').value.toLowerCase();
  filtered = vocab.filter((v) => {
    if (isVocabHidden(v)) return false;
    if (selectedBab !== 'Semua' && v.cat !== selectedBab) return false;
    if (!q) return true;
    if (v.type === 'kanji') {
      return (
        (v.kanji || '').includes(q) ||
        (v.unyomi || '').toLowerCase().includes(q) ||
        (v.kunyomi || '').toLowerCase().includes(q) ||
        (v.id || '').toLowerCase().includes(q)
      );
    }
    return (
      (v.jp || '').includes(q) ||
      (v.rom || '').toLowerCase().includes(q) ||
      (v.id || '').toLowerCase().includes(q)
    );
  });
  if (preservePos) {
    if (idx >= filtered.length) idx = Math.max(0, filtered.length - 1);
    if (idx < 0) idx = 0;
  } else {
    idx = 0;
  }
  renderCard();
  if (mode === 'auto') startAutoVoice(true);
}

/* ===== Render ===== */
function updateFlipState() {
  $k('front').classList.toggle('hide', flipped);
  $k('back').classList.toggle('show', flipped);
}

function renderCard() {
  const hint = document.querySelector('.card-hint');
  if (hint) hint.textContent = reverseMode ? 'Ketuk untuk melihat Jepang' : 'Ketuk untuk melihat arti';

  const crumbBab = $k('crumbBab');
  if (crumbBab) crumbBab.textContent = selectedBab;

  const latihanBtn = $k('latihanBtn');
  if (latihanBtn) {
    latihanBtn.textContent = selectedBab === 'Semua' ? '✎ Latihan Semua' : `✎ Latihan ${selectedBab}`;
  }

  if (!filtered.length) {
    $k('fcJp').textContent = '–';
    $k('fcRomaji').textContent = '';
    $k('fcMeaning').textContent = 'Tidak ada kata';
    $k('fcCat').textContent = '';
    $k('fcBabFront').textContent = '';
    $k('prog').textContent = '0 / 0';
    $k('miniFill').style.width = '0%';
    updateProgressSidebar(0, 0);
    updateNavBtns();
    return;
  }

  const v = filtered[idx];
  const isKanji = v.type === 'kanji';
  const jpDisplay = isKanji ? v.kanji : v.jp;

  flipped = false;
  updateFlipState();

  $k('fcBabFront').textContent = v.cat || '';
  $k('fcJp').textContent = reverseMode ? v.id : jpDisplay;
  if (isKanji) {
    $k('fcRomaji').textContent = 'On: ' + v.unyomi + ' | Kun: ' + v.kunyomi;
  } else {
    $k('fcRomaji').textContent = v.rom;
  }
  $k('fcMeaning').textContent = reverseMode ? jpDisplay : v.id;
  $k('fcCat').textContent = v.cat || '';

  // Progress (bottom)
  $k('prog').textContent = (idx + 1) + ' / ' + filtered.length;
  const pct = Math.round(((idx + 1) / filtered.length) * 100);
  $k('miniFill').style.width = pct + '%';

  // Progress (sidebar)
  updateProgressSidebar(idx + 1, filtered.length);

  updateNavBtns();
}

function updateProgressSidebar(current, total) {
  $k('progressNum').textContent = current;
  $k('progressTotal').textContent = '/ ' + total;
  const pct = total ? Math.round((current / total) * 100) : 0;
  $k('progressPct').textContent = pct + '%';
  $k('progressFill').style.width = pct + '%';
}

function updateNavBtns() {
  $k('prevBtn').disabled = !filtered.length;
  $k('nextBtn').disabled = !filtered.length;
  $k('hideBtn').disabled = !filtered.length;
}

/* ===== Navigation ===== */
function flipCard() {
  if (mode === 'side') return;
  flipped = !flipped;
  updateFlipState();
}

function next() {
  if (!filtered.length) return;
  idx = (idx + 1) % filtered.length;
  renderCard();
  if (mode === 'auto') startAutoVoice(true);
}

function prev() {
  if (!filtered.length) return;
  idx = (idx - 1 + filtered.length) % filtered.length;
  renderCard();
  if (mode === 'auto') startAutoVoice(true);
}

/* ===== Mode ===== */
function setMode(m) {
  mode = m;
  document.querySelectorAll('.mode-tab').forEach((t) => {
    t.classList.toggle('active', t.dataset.mode === m);
  });
  const fc = $k('fc');
  if (fc) fc.classList.toggle('mode-side', m === 'side');
  if (m === 'side') { flipped = false; updateFlipState(); }
  if (m === 'auto') startAutoVoice(true);
  else { stopAutoVoice(); updateAutoVoiceStatus(); }
}

async function updateAutoVoiceStatus() {
  const el = $k('autoVoiceStatus');
  const controls = document.querySelector('.auto-voice-controls');
  if (controls) controls.style.display = mode === 'auto' ? 'flex' : 'none';
  if (!el) return;
  if (mode !== 'auto') { el.textContent = ''; return; }
  let cacheInfo = '';
  if (window.TTSCache) {
    try {
      const n = await TTSCache.getCacheCount();
      if (n > 0) cacheInfo = ` · ${n} audio di-cache`;
    } catch (e) { /* ignore */ }
  }
  const base = autoVoiceRunning
    ? 'Auto Voice aktif — bisa lock HP & dengar dengan tenang'
    : 'Auto Voice siap';
  el.textContent = base + cacheInfo;
}

let precacheRunning = false;
async function precacheCurrentBab() {
  if (precacheRunning || !window.TTSCache || !filtered.length) return;
  const items = [];
  filtered.forEach((v) => {
    const jp = getJapaneseReadText(v);
    if (jp) items.push({ text: jp, lang: 'ja' });
    if (v.id) items.push({ text: v.id, lang: 'id' });
  });
  if (!items.length) return;

  precacheRunning = true;
  const btn = $k('precacheBtn');
  if (btn) btn.disabled = true;
  const el = $k('autoVoiceStatus');

  await TTSCache.precache(items, (done, total) => {
    if (el) el.textContent = `Pre-cache ${done}/${total}...`;
  });

  precacheRunning = false;
  if (btn) btn.disabled = false;
  updateAutoVoiceStatus();
}

function updateReverseButton() {
  const btn = $k('reverseBtn');
  if (!btn) return;
  btn.textContent = reverseMode ? '↔ Reverse: ON' : '↔ Reverse: OFF';
}

function toggleReverseMode() {
  reverseMode = !reverseMode;
  updateReverseButton();
  renderCard();
  if (mode === 'auto') startAutoVoice(true);
}

function stopAutoVoice() {
  autoVoiceRunning = false;
  autoVoiceRunId += 1;
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  if (ttsAudio) { try { ttsAudio.pause(); } catch (e) { /* ignore */ } }
  if ('mediaSession' in navigator) {
    try { navigator.mediaSession.playbackState = 'paused'; } catch (e) { /* ignore */ }
  }
  updateAutoVoiceStatus();
}

function shouldContinueAuto(runId) {
  return autoVoiceRunning && mode === 'auto' && runId === autoVoiceRunId;
}

async function runAutoVoiceLoop(runId) {
  while (shouldContinueAuto(runId)) {
    renderCard();
    await speakCurrentCardSequence(true);
    if (!shouldContinueAuto(runId)) break;
    await waitMs(AUTO_NEXT_DELAY_MS);
    if (!shouldContinueAuto(runId)) break;
    idx = (idx + 1) % filtered.length;
  }
}

function startAutoVoice(restart) {
  if (!filtered.length) { updateAutoVoiceStatus(); return; }
  if (restart) stopAutoVoice();
  if (autoVoiceRunning) return;
  // Prime <audio> with user gesture context — this lets it keep playing on lock screen
  try { getTTSAudio(); } catch (e) { /* ignore */ }
  setupMediaSessionHandlers();
  autoVoiceRunning = true;
  autoVoiceRunId += 1;
  const runId = autoVoiceRunId;
  updateAutoVoiceStatus();
  runAutoVoiceLoop(runId);
}

function shuffle() {
  for (let i = filtered.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [filtered[i], filtered[j]] = [filtered[j], filtered[i]];
  }
  idx = 0;
  renderCard();
}

function hideCurrentCard() {
  if (!filtered.length || !window.HiddenStore) return;
  const v = filtered[idx];
  const label = v.type === 'kanji' ? v.kanji : v.jp;
  if (!confirm(`Sembunyikan "${label}" dari daftar kosakata?`)) return;
  HiddenStore.add('kosakata', vocabHideKey(v));
  renderBabFilter();
  filterCards({ preservePosition: true });
}

function goToLatihan() {
  const url = new URL('latihan.html', window.location.href);
  if (selectedBab && selectedBab !== 'Semua') {
    const m = String(selectedBab).match(/(\d+)/);
    if (m) url.searchParams.set('bab', m[1]);
  }
  window.location.href = url.toString();
}

/* ===== Keyboard ===== */
function isTypingElement(el) {
  if (!el) return false;
  const tag = el.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || el.isContentEditable;
}

document.addEventListener('keydown', (e) => {
  if (isTypingElement(e.target)) {
    if ((e.ctrlKey || e.metaKey) && e.key === '/') {
      e.preventDefault();
      $k('search').focus();
      $k('search').select();
    }
    return;
  }
  if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
  else if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
  else if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); flipCard(); }
  else if (e.key === 'Escape') { if (mode === 'auto') stopAutoVoice(); }
  else if ((e.ctrlKey || e.metaKey) && e.key === '/') {
    e.preventDefault();
    $k('search').focus();
    $k('search').select();
  }
});

$k('search').addEventListener('input', () => filterCards());

if (window.HiddenStore) {
  HiddenStore.subscribe((scope) => {
    if (scope !== 'kosakata') return;
    renderBabFilter();
    filterCards({ preservePosition: true });
  });
}

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
const themeToggle = $k('themeToggle');
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const cur = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const next = cur === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem(THEME_KEY, next);
  });
}
initTheme();

/* ===== Mobile sidebar ===== */
const appSidebar = $k('appSidebar');
const mobileMenuToggle = $k('mobileMenuToggle');
const mobileBackdrop = $k('mobileBackdrop');
function openMobileSidebar() {
  appSidebar.classList.add('is-open');
  mobileBackdrop.classList.add('is-open');
}
function closeMobileSidebar() {
  appSidebar.classList.remove('is-open');
  mobileBackdrop.classList.remove('is-open');
}
if (mobileMenuToggle) mobileMenuToggle.addEventListener('click', openMobileSidebar);
if (mobileBackdrop) mobileBackdrop.addEventListener('click', closeMobileSidebar);

/* ===== Touch swipe ===== */
(function () {
  let startX = 0, startY = 0;
  document.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }, { passive: true });
  document.addEventListener('touchend', (e) => {
    const dx = startX - e.changedTouches[0].clientX;
    const dy = startY - e.changedTouches[0].clientY;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      if (dx > 0) next(); else prev();
    }
  }, { passive: true });
})();

/* ===== Init ===== */
loadVoices();
if ('speechSynthesis' in window) {
  window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
}
renderBabFilter();
filterCards();
updateReverseButton();
updateAutoVoiceStatus();
