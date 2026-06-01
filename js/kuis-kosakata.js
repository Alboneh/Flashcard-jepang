/* ===== KUIS KETIK (Kosakata v2) =====
   Mode mengetik jawaban. Dua arah soal:
   - 'id-to-jp' : tampil arti Indonesia → user mengetik kata Jepang (kana / kanji / romaji diterima)
   - 'jp-to-id' : tampil kata Jepang → user mengetik artinya dalam bahasa Indonesia
   - 'campur'   : acak antara keduanya per soal
   Kalau salah LEBIH dari 5x pada soal yang sama, popup jawaban otomatis muncul. */

// Salah lebih dari angka ini → popup jawaban muncul otomatis.
const MAX_TRIES_BEFORE_REVEAL = 5;

// ===== DATA =====
const VOCAB = (typeof vocab !== 'undefined' && Array.isArray(vocab)) ? vocab : [];

function getBabNum(v) {
  const m = String(v.cat || '').match(/(\d+)/);
  return m ? +m[1] : null;
}
VOCAB.forEach((v) => { v._bab = getBabNum(v); });

const ALL_BAB = [...new Set(VOCAB.map((v) => v._bab).filter((b) => b !== null))].sort((a, b) => a - b);

// ===== STATE =====
const selectedBabs = new Set();   // kosong = semua
let direction = 'id-to-jp';       // id-to-jp / jp-to-id / campur
let sessionCount = 20;
let activeList = [];
let qIdx = 0;
let score = 0;
let xp = 0;
let streak = 0;
let bestStreak = 0;
let results = [];
let currentQ = null;
let answered = false;
let wrongTries = 0;

function el(id) { return document.getElementById(id); }

(function preselectFromURL() {
  try {
    const raw = new URLSearchParams(window.location.search).get('bab');
    if (!raw) return;
    raw.split(',').forEach((s) => {
      const n = parseInt(String(s).trim(), 10);
      if (!isNaN(n) && ALL_BAB.includes(n)) selectedBabs.add(n);
    });
  } catch (e) { /* ignore */ }
})();

// ===== AUDIO (feedback beeps) =====
let audioCtx = null;
let soundEnabled = true;

function getAudioCtx() {
  if (!audioCtx) {
    try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); }
    catch (e) { return null; }
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

function playTone(freq, duration, type = 'sine', startGain = 0.2, delay = 0) {
  const ctx = getAudioCtx();
  if (!ctx) return;
  const t0 = ctx.currentTime + delay;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  gain.gain.setValueAtTime(startGain, t0);
  gain.gain.exponentialRampToValueAtTime(0.001, t0 + duration);
  osc.connect(gain).connect(ctx.destination);
  osc.start(t0);
  osc.stop(t0 + duration);
}

function playCorrect() {
  if (!soundEnabled) return;
  playTone(659.25, 0.12, 'triangle', 0.22, 0);
  playTone(987.77, 0.22, 'triangle', 0.22, 0.10);
}

function playWrong() {
  if (!soundEnabled) return;
  playTone(220, 0.18, 'sawtooth', 0.18, 0);
  playTone(164.81, 0.28, 'sawtooth', 0.18, 0.12);
}

function toggleSound() {
  soundEnabled = !soundEnabled;
  const btn = el('soundBtn');
  if (btn) btn.textContent = soundEnabled ? '🔊' : '🔇';
  if (soundEnabled) playCorrect();
}

// ===== TTS (baca kata Jepang) — file dulu, fallback speechSynthesis =====
let ttsAudio = null;
async function speakJp(text) {
  if (!text) return;
  try {
    if (window.TTSCache) {
      const res = await TTSCache.getAudioURL(text, 'ja');
      if (res && res.url) {
        if (!ttsAudio) { ttsAudio = new Audio(); ttsAudio.preload = 'auto'; }
        ttsAudio.src = res.url;
        const ok = await ttsAudio.play().then(() => true).catch(() => false);
        if (ok) return;
      }
    }
  } catch (e) { /* fall through */ }
  if ('speechSynthesis' in window) {
    try {
      const utt = new SpeechSynthesisUtterance(String(text).replace(/[〜~]/g, ''));
      utt.lang = 'ja-JP';
      utt.rate = 0.9;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utt);
    } catch (e) { /* ignore */ }
  }
}

// ===== HELPERS =====
function shuffle(arr) {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function babCount(b) { return VOCAB.filter((v) => v._bab === b).length; }

function filteredPool() {
  if (selectedBabs.size === 0) return VOCAB.filter((v) => v._bab !== null);
  return VOCAB.filter((v) => v._bab !== null && selectedBabs.has(v._bab));
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ===== ANSWER NORMALISATION / CHECKING =====
function normRomaji(s) {
  return String(s).toLowerCase().replace(/[〜~]/g, '').replace(/[^a-z0-9]/g, '');
}
function normJp(s) {
  return String(s)
    .replace(/[〜~\s]/g, '')
    .replace(/[、。，．・！？「」『』]/g, '')
    .replace(/[（）()［］\[\]]/g, '')   // sisa kurung/bracket
    .trim();
}
function cleanId(s) {
  return String(s)
    .toLowerCase()
    .replace(/…/g, ' ')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')   // buang tanda baca, kurung, garis miring, dst.
    .replace(/\s+/g, ' ')
    .trim();
}

// Untuk TAMPILAN (bukan pengecekan): pecah "ひらがな（漢字）" jadi { main, reading }.
// main = bentuk utama yang ditampilkan besar (kanji bila ada, kalau tidak ya kana);
// reading = bacaan hiragana untuk ditaruh kecil di bawah. Bracket [..] dibuka isinya.
function parseJpDisplay(raw) {
  let s = String(raw || '').split('/')[0].trim();
  s = s.replace(/[［[]([^］\]]*)[］\]]/g, '$1');   // [お] -> お
  // bentuk: <bacaan>（<kanji>）<akhiran kana opsional>
  const m = s.match(/^(.*?)[（(]([^）)]*)[）)](.*)$/);
  if (m) {
    const before = m[1].trim();
    const inside = m[2].trim();
    const after = m[3].trim();
    return { main: (inside + after).trim(), reading: (before + after).trim() };
  }
  return { main: s, reading: '' };
}
function cleanRom(s) {
  return String(s || '').split('/')[0].replace(/[［\]\[］()（）~〜]/g, '').trim();
}

// Field jp sering berbentuk "ひらがな（漢字）" atau "［～を］みせてください（見せてください）".
// Pecah jadi bentuk yang bisa diterima: bacaan hiragana SAJA, kanji SAJA, dengan/tanpa
// prefix bracket. Jadi user boleh ketik salah satunya.
function addJpForm(set, raw) {
  const n = normJp(raw);
  if (n) set.add(n);
}
function jpVariants(raw) {
  const set = new Set();
  String(raw || '').split('/').forEach((chunk) => {
    const s = chunk.trim();
    const noBrackets = s.replace(/[［[][^］\]]*[］\]]/g, '');   // buang [..] / ［..］ opsional
    [s, noBrackets].forEach((variant) => {
      const inside = [];
      const base = variant.replace(/[（(]([^）)]*)[）)]/g, (m, g) => { inside.push(g); return ''; });
      addJpForm(set, base);                 // bacaan tanpa kurung (mis. hiragana)
      inside.forEach((g) => addJpForm(set, g)); // isi kurung (mis. kanji)
      addJpForm(set, variant);              // bentuk utuh
    });
  });
  return set;
}

// Mode arti→JP: terima kana/kanji ATAU romaji.
function acceptableJapanese(v) {
  const set = jpVariants(v.jp);
  String(v.rom || '').split('/').forEach((p) => { const n = normRomaji(p); if (n) set.add(n); });
  return set;
}
function checkJp(input, v) {
  const set = acceptableJapanese(v);
  return set.has(normJp(input)) || set.has(normRomaji(input));
}

// Mode JP→arti: pencocokan longgar (arti sering punya beberapa variasi).
function acceptableMeanings(v) {
  const out = new Set();
  String(v.id || '').split('/').forEach((part) => {
    const withParen = cleanId(part);
    const noParen = cleanId(part.replace(/\([^)]*\)/g, ' '));
    if (withParen) out.add(withParen);
    if (noParen) out.add(noParen);
  });
  return [...out].filter(Boolean);
}
function checkId(input, v) {
  const t = cleanId(input);
  if (!t) return false;
  for (const varr of acceptableMeanings(v)) {
    if (t === varr) return true;
    if (t.length >= 4 && (varr.includes(t) || t.includes(varr))) return true;
  }
  return false;
}

// ===== UI: TOP META =====
function updateTopMeta() {
  const set = (id, val) => { const e = el(id); if (e) e.textContent = val; };
  set('sideCorrect', score);
  set('sideTotal', activeList.length);
  set('pScore', `${score} benar`);
}

function updateSummary() {
  const total = filteredPool().length;
  const sum = el('selSummary');
  const btnText = el('babBtnText');

  if (selectedBabs.size === 0) {
    sum.textContent = `Semua bab · ${total} kata`;
    sum.classList.remove('empty');
    const first = ALL_BAB[0];
    const last = ALL_BAB[ALL_BAB.length - 1];
    btnText.textContent = (first && last) ? `Semua Bab (${first}–${last})` : 'Semua Bab';
    el('iPola').textContent = ALL_BAB.length;
  } else {
    const list = ALL_BAB.filter((b) => selectedBabs.has(b));
    sum.textContent = `${selectedBabs.size} bab dipilih · ${total} kata`;
    sum.classList.remove('empty');
    btnText.textContent = list.length <= 4 ? list.map((b) => `Bab ${b}`).join(', ') : `${list.length} bab dipilih`;
    el('iPola').textContent = selectedBabs.size;
  }
  el('iTotal').textContent = total;
  el('startBtn').disabled = false;
}

// ===== BAB DROPDOWN =====
function buildBabList() {
  const list = el('babList');
  list.innerHTML = '';
  ALL_BAB.forEach((b) => {
    const n = babCount(b);
    if (n === 0) return;
    const row = document.createElement('label');
    row.className = 'bab-row';
    row.innerHTML = `
      <input type="checkbox" data-bab="${b}" ${selectedBabs.has(b) ? 'checked' : ''}>
      <span class="bab-row-name">Bab ${b}</span>
      <span class="bab-row-count">${n} kata</span>`;
    const cb = row.querySelector('input');
    cb.addEventListener('change', () => {
      if (cb.checked) selectedBabs.add(b); else selectedBabs.delete(b);
      updateSummary();
    });
    list.appendChild(row);
  });
  updateSummary();
}

function toggleDropdown(evt) {
  if (evt) evt.stopPropagation();
  el('babDropdown').classList.toggle('open');
}
function closeDropdown() { el('babDropdown').classList.remove('open'); }

document.addEventListener('click', (e) => {
  const dd = el('babDropdown');
  if (dd && dd.classList.contains('open') && !dd.contains(e.target)) closeDropdown();
});

// ===== MODE BUTTONS =====
function setSession(btn, n) {
  document.querySelectorAll('#modeRow .seg-btn').forEach((b) => b.classList.remove('on'));
  btn.classList.add('on');
  sessionCount = n;
}
function setDirection(btn, type) {
  document.querySelectorAll('#dirRow .seg-btn').forEach((b) => b.classList.remove('on'));
  btn.classList.add('on');
  direction = type;
}

// ===== QUIZ FLOW =====
function startQuiz() {
  const pool = filteredPool();
  if (!pool.length) { alert('Tidak ada kata untuk bab yang dipilih.'); return; }

  activeList = shuffle(pool).slice(0, Math.min(sessionCount, pool.length));
  qIdx = 0; score = 0; xp = 0; streak = 0; bestStreak = 0; results = [];

  el('introPanel').style.display = 'none';
  el('quizPanel').style.display = '';
  el('resultPanel').style.display = 'none';
  updateTopMeta();
  renderQ();
}

function resolveDir() {
  if (direction === 'campur') return Math.random() > 0.5 ? 'jp-to-id' : 'id-to-jp';
  return direction;
}

function renderQ() {
  const total = activeList.length;
  const v = activeList[qIdx];
  const dir = resolveDir();
  currentQ = { vocab: v, dir };
  answered = false;
  wrongTries = 0;

  el('pLabel').textContent = `Soal ${qIdx + 1} / ${total}`;
  el('pScore').textContent = `${score} benar`;
  el('progFill').style.width = `${(qIdx / total) * 100}%`;

  const wrap = el('qWrap');
  wrap.innerHTML = '';

  // Meta pills
  const meta = document.createElement('div');
  meta.className = 'q-card-meta';
  const babLabel = v._bab ? `Bab ${v._bab}` : '-';
  const dirLabel = dir === 'jp-to-id' ? 'JP → Arti' : 'Arti → JP';
  meta.innerHTML = `<span class="pill q-num">No.${qIdx + 1}</span><span class="pill q-topic">${babLabel}</span><span class="pill q-mode">${dirLabel}</span>`;
  wrap.appendChild(meta);

  // Question card
  const card = document.createElement('div');
  card.className = 'q-card';
  if (dir === 'jp-to-id') {
    const p = parseJpDisplay(v.jp);
    const readingBits = [p.reading, cleanRom(v.rom)].filter(Boolean).join(' · ');
    const rom = readingBits ? `<span class="rom">${escapeHtml(readingBits)}</span>` : '';
    card.innerHTML = `
      <div class="q-prompt">Apa artinya? (ketik bahasa Indonesia)</div>
      <div class="q-content jp">${escapeHtml(p.main)}${rom}</div>
      <button class="say-btn" type="button" id="sayBtn">🔊 Dengar</button>`;
  } else {
    card.innerHTML = `
      <div class="q-prompt">Tulis dalam bahasa Jepang (kana / romaji)</div>
      <div class="q-content">${escapeHtml(v.id || '-')}</div>`;
  }
  wrap.appendChild(card);

  // Input row
  const inputRow = document.createElement('div');
  inputRow.className = 'answer-row';
  inputRow.innerHTML = `
    <input type="text" id="answerInput" class="answer-input ${dir === 'jp-to-id' ? '' : 'jp-hint'}"
      placeholder="${dir === 'jp-to-id' ? 'Ketik artinya...' : 'Ketik jawaban (mis. watashi / わたし)'}"
      autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false">
    <button class="submit-btn" id="submitBtn" type="button">Cek ✓</button>`;
  wrap.appendChild(inputRow);

  // Tries hint
  const hint = document.createElement('div');
  hint.className = 'tries-hint';
  hint.id = 'triesHint';
  wrap.appendChild(hint);

  // Feedback
  const fb = document.createElement('div');
  fb.className = 'fb';
  fb.id = 'fb';
  wrap.appendChild(fb);

  // Nav
  const nav = document.createElement('div');
  nav.className = 'q-nav';
  nav.innerHTML = `
    <button class="skip-btn" id="skipBtn" type="button" onclick="skipQ()">Lewati</button>
    <button class="reveal-btn" id="revealBtn" type="button" onclick="revealAnswer(false)">Lihat jawaban</button>
    <button class="next-btn" id="nextBtn" type="button" onclick="nextQ()">${qIdx + 1 < total ? 'Lanjut ▶' : 'Lihat Hasil ▶'}</button>`;
  wrap.appendChild(nav);

  // Wire up events
  const input = el('answerInput');
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); submitAnswer(); } });
  el('submitBtn').addEventListener('click', submitAnswer);
  const sayBtn = el('sayBtn');
  if (sayBtn) sayBtn.addEventListener('click', () => speakJp(v.jp));
  setTimeout(() => input.focus(), 50);
}

function correctAnswerText(v, dir) {
  if (dir === 'jp-to-id') return escapeHtml(v.id || '-');
  const p = parseJpDisplay(v.jp);
  const reading = [p.reading, cleanRom(v.rom)].filter(Boolean).join(' · ');
  const rom = reading ? ` <span class="ca-rom">(${escapeHtml(reading)})</span>` : '';
  return `${escapeHtml(p.main)}${rom}`;
}

function lockInput() {
  const input = el('answerInput');
  const submit = el('submitBtn');
  if (input) input.disabled = true;
  if (submit) submit.disabled = true;
  const skip = el('skipBtn'); if (skip) skip.style.display = 'none';
  const reveal = el('revealBtn'); if (reveal) reveal.style.display = 'none';
  const nb = el('nextBtn'); if (nb) nb.classList.add('show');
}

function submitAnswer() {
  if (answered) return;
  const input = el('answerInput');
  const val = (input.value || '').trim();
  if (!val) { input.focus(); return; }

  const v = currentQ.vocab;
  const ok = currentQ.dir === 'jp-to-id' ? checkId(val, v) : checkJp(val, v);

  if (ok) {
    answered = true;
    score += 1;
    streak += 1;
    bestStreak = Math.max(bestStreak, streak);
    playCorrect();
    updateTopMeta();
    results.push({ vocab: v, dir: currentQ.dir, status: 'benar', tries: wrongTries });

    input.classList.add('ok');
    const fb = el('fb');
    fb.className = 'fb show ok';
    fb.innerHTML = `
      <div class="fb-icon">✓</div>
      <div>
        <div class="fb-title">Benar!</div>
        <div class="fb-txt">${correctAnswerText(v, currentQ.dir)} = <b>${escapeHtml(currentQ.dir === 'jp-to-id' ? v.jp : v.id)}</b></div>
      </div>`;
    lockInput();
    setTimeout(() => { const nb = el('nextBtn'); if (nb) nb.focus(); }, 60);
  } else {
    wrongTries += 1;
    streak = 0;
    playWrong();
    updateTopMeta();

    input.classList.remove('shake');
    void input.offsetWidth;
    input.classList.add('shake', 'wrong');
    input.select();

    if (wrongTries > MAX_TRIES_BEFORE_REVEAL) {
      revealAnswer(true);
      return;
    }
    const hint = el('triesHint');
    const left = MAX_TRIES_BEFORE_REVEAL + 1 - wrongTries;
    hint.className = 'tries-hint show';
    hint.innerHTML = `✕ Belum tepat. Coba lagi — salah <b>${wrongTries}</b>×. Setelah ${MAX_TRIES_BEFORE_REVEAL + 1}× salah, jawaban ditampilkan (${left}× lagi).`;
  }
}

function revealAnswer(viaPopup) {
  if (answered) return;
  answered = true;
  streak = 0;
  updateTopMeta();

  const v = currentQ.vocab;
  results.push({ vocab: v, dir: currentQ.dir, status: viaPopup ? 'bantuan' : 'lihat', tries: wrongTries });

  // Isi & buka popup
  const p = parseJpDisplay(v.jp);
  const reading = [p.reading, cleanRom(v.rom)].filter(Boolean).join(' · ');
  el('popupJp').innerHTML = escapeHtml(p.main) + (reading ? ` <span class="pop-rom">${escapeHtml(reading)}</span>` : '');
  el('popupId').textContent = v.id || '-';
  el('popupBab').textContent = v._bab ? `Bab ${v._bab}` : '';
  el('popupTitle').textContent = viaPopup ? `Salah lebih dari ${MAX_TRIES_BEFORE_REVEAL}× — ini jawabannya` : 'Jawaban';
  openPopup();

  // Feedback merah di bawah + state terjawab
  const input = el('answerInput');
  if (input) input.classList.add('wrong');
  const fb = el('fb');
  fb.className = 'fb show no';
  fb.innerHTML = `
    <div class="fb-icon">✕</div>
    <div>
      <div class="fb-title">Jawaban yang benar</div>
      <div class="fb-txt">${correctAnswerText(v, 'id-to-jp')} = <b>${escapeHtml(v.id)}</b></div>
    </div>`;
  lockInput();
}

function skipQ() {
  if (answered) return;
  results.push({ vocab: currentQ.vocab, dir: currentQ.dir, status: 'lewati', tries: wrongTries });
  streak = 0;
  updateTopMeta();
  nextQ();
}

function nextQ() {
  closePopup();
  qIdx += 1;
  if (qIdx >= activeList.length) { showResult(); return; }
  renderQ();
}

// ===== POPUP =====
function openPopup() {
  const ov = el('answerPopup');
  ov.classList.add('show');
  setTimeout(() => { const b = el('popupCloseBtn'); if (b) b.focus(); }, 60);
}
function closePopup() {
  const ov = el('answerPopup');
  if (ov) ov.classList.remove('show');
}
function popupContinue() {
  closePopup();
  nextQ();
}

// ===== RESULT =====
function showResult() {
  el('quizPanel').style.display = 'none';
  el('resultPanel').style.display = '';
  el('progFill').style.width = '100%';

  const total = results.length;
  const wrong = total - score;
  const pct = total ? Math.round((score / total) * 100) : 0;

  el('rScore').textContent = String(score);
  el('rDenom').textContent = '/' + total;
  el('rC').textContent = String(score);
  el('rW').textContent = String(wrong);
  el('rP').textContent = pct + '%';

  const circle = document.querySelector('.result-score');
  if (circle) {
    circle.classList.remove('bad', 'mid');
    if (pct < 55) circle.classList.add('bad');
    else if (pct < 75) circle.classList.add('mid');
  }

  let title = 'Selesai';
  let msg = `Kamu menjawab ${score} dari ${total} kata dengan benar.`;
  if (pct === 100) { title = 'Sempurna'; msg = `${total} kata, semua benar. Kerja bagus.`; }
  else if (pct >= 90) { title = 'Sangat baik'; msg = `${score} dari ${total} benar — hampir sempurna.`; }
  else if (pct >= 75) { title = 'Bagus'; msg = `${score} dari ${total} benar. Sedikit lagi rapi.`; }
  else if (pct >= 55) { title = 'Lumayan'; msg = `${score} dari ${total} benar. Ulangi kata yang masih salah.`; }
  else { title = 'Terus berlatih'; msg = `${score} dari ${total} benar. Coba ulangi bab ini.`; }

  el('rTitle').textContent = title;
  el('rMsg').textContent = msg;

  const wrongOnes = results.filter((r) => r.status !== 'benar');
  const rb = el('reviewBox');
  if (!wrongOnes.length) {
    rb.innerHTML = '<h4>Review</h4><div style="text-align:center;padding:12px;color:var(--green-dark);font-weight:700;">✓ Semua kamu ketik benar!</div>';
  } else {
    const badge = { lewati: 'dilewati', lihat: 'lihat jawaban', bantuan: `salah >${MAX_TRIES_BEFORE_REVEAL}×` };
    rb.innerHTML = `<h4>Perlu dipelajari lagi (${wrongOnes.length} kata)</h4>` +
      wrongOnes.map((r) => {
        const v = r.vocab;
        const jp = escapeHtml(v.jp || '-');
        const id = escapeHtml(v.id || '-');
        const rom = v.rom ? ' (' + escapeHtml(v.rom) + ')' : '';
        return `
        <div class="rv-item">
          <div class="rv-icon">✕</div>
          <div>
            <div class="rv-q">${jp}${rom} = ${id}</div>
            <div class="rv-ans"><span class="wa">${badge[r.status] || 'salah'}</span></div>
          </div>
        </div>`;
      }).join('');
  }
}

function retryQuiz() {
  el('resultPanel').style.display = 'none';
  startQuiz();
}

function backMenu() {
  el('resultPanel').style.display = 'none';
  el('quizPanel').style.display = 'none';
  el('introPanel').style.display = '';
  xp = 0; streak = 0; score = 0;
  updateTopMeta();
  updateSummary();
}

// ===== INIT =====
if (!VOCAB.length) alert('Database kosakata belum terhubung.');

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closePopup();
});

buildBabList();
updateTopMeta();
