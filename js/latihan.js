// ===== DATA =====
const VOCAB = (typeof vocab !== 'undefined' && Array.isArray(vocab)) ? vocab : [];
const ALL_BAB = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];

// Map "Bab X" string → bab number
function getBabNum(v) {
  const m = String(v.cat || '').match(/(\d+)/);
  return m ? +m[1] : null;
}
VOCAB.forEach((v) => { v._bab = getBabNum(v); });

// ===== STATE =====
const selectedBabs = new Set();   // empty = semua
let questionType = 'campur';      // campur / jp-to-id / id-to-jp
let sessionCount = 9999;          // default Semua
let activeList = [];
let qIdx = 0;
let score = 0;
let xp = 0;
let streak = 0;
let bestStreak = 0;
let hearts = 5;
const MAX_HEARTS = 5;
let results = [];
let currentQ = null;
let answered = false;

function el(id) { return document.getElementById(id); }

// ===== AUDIO =====
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
  playTone(659.25, 0.12, 'triangle', 0.22, 0);     // E5
  playTone(987.77, 0.22, 'triangle', 0.22, 0.10);  // B5
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

// ===== HELPERS =====
function getJp(item) {
  return item.type === 'kanji' ? item.kanji : item.jp;
}

function shuffle(arr) {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function babCount(b) {
  return VOCAB.filter((v) => v._bab === b).length;
}

function filteredPool() {
  if (selectedBabs.size === 0) return VOCAB.filter((v) => v._bab !== null);
  return VOCAB.filter((v) => v._bab !== null && selectedBabs.has(v._bab));
}

function updateTopMeta() {
  el('hHearts').textContent = hearts;
  el('hStreak').textContent = streak;
  el('hScore').textContent = xp;
}

function updateSummary() {
  const total = filteredPool().length;
  const sum = el('selSummary');
  const btnText = el('babBtnText');

  if (selectedBabs.size === 0) {
    sum.textContent = `Semua bab · ${total} kata`;
    sum.classList.remove('empty');
    btnText.textContent = 'Semua Bab (1–15)';
    el('iPola').textContent = ALL_BAB.length;
  } else {
    const list = ALL_BAB.filter((b) => selectedBabs.has(b));
    sum.textContent = `${selectedBabs.size} bab dipilih · ${total} kata`;
    sum.classList.remove('empty');
    btnText.textContent = list.length <= 4
      ? list.map((b) => `Bab ${b}`).join(', ')
      : `${list.length} bab dipilih`;
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
      <span class="bab-row-count">${n} kata</span>
    `;
    const cb = row.querySelector('input');
    cb.addEventListener('change', () => {
      if (cb.checked) selectedBabs.add(b);
      else selectedBabs.delete(b);
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

function closeDropdown() {
  el('babDropdown').classList.remove('open');
}

document.addEventListener('click', (e) => {
  const dd = el('babDropdown');
  if (dd && dd.classList.contains('open') && !dd.contains(e.target)) {
    closeDropdown();
  }
});

// ===== MODE BUTTONS =====
function setMode(btn, n) {
  document.querySelectorAll('#modeRow .mode-btn').forEach((b) => b.classList.remove('on'));
  btn.classList.add('on');
  sessionCount = n;
}

function setQType(btn, type) {
  document.querySelectorAll('#qtypeRow .mode-btn').forEach((b) => b.classList.remove('on'));
  btn.classList.add('on');
  questionType = type;
}

// ===== QUIZ =====
function startQuiz() {
  const pool = filteredPool();
  if (!pool.length) {
    alert('Tidak ada kata untuk bab yang dipilih.');
    return;
  }

  activeList = shuffle(pool).slice(0, Math.min(sessionCount, pool.length));
  qIdx = 0;
  score = 0;
  xp = 0;
  streak = 0;
  bestStreak = 0;
  hearts = MAX_HEARTS;
  results = [];

  el('introPanel').style.display = 'none';
  el('quizPanel').style.display = '';
  el('resultPanel').style.display = 'none';
  updateTopMeta();

  renderQ();
}

function determineDirection() {
  if (questionType === 'jp-to-id') return true;
  if (questionType === 'id-to-jp') return false;
  return Math.random() > 0.5;
}

function pickDistractors(correct, isJpToId, count = 3) {
  // Pick from same pool, ensure unique answer text per direction
  const correctText = isJpToId ? correct.id : getJp(correct);
  const pool = activeList.filter((v) => v !== correct);
  const picked = [];
  const used = new Set([correctText]);
  const tmpShuffled = shuffle(pool);
  for (const v of tmpShuffled) {
    if (picked.length >= count) break;
    const txt = isJpToId ? v.id : getJp(v);
    if (used.has(txt)) continue;
    used.add(txt);
    picked.push(v);
  }
  // Fallback: if pool too small, allow duplicates by text
  while (picked.length < count && tmpShuffled.length > 0) {
    picked.push(tmpShuffled[picked.length % tmpShuffled.length]);
  }
  return picked;
}

function renderQ() {
  const total = activeList.length;
  const v = activeList[qIdx];
  const wrap = el('qWrap');
  const isJpToId = determineDirection();

  const distractors = pickDistractors(v, isJpToId, 3);
  const choices = shuffle([v, ...distractors]);
  currentQ = { vocab: v, isJpToId, choices, ansIdx: choices.indexOf(v) };
  answered = false;

  el('pLabel').textContent = `Soal ${qIdx + 1} / ${total}`;
  el('pScore').textContent = `${score} benar`;
  el('progFill').style.width = `${(qIdx / total) * 100}%`;

  wrap.innerHTML = '';

  const meta = document.createElement('div');
  meta.className = 'q-card-meta';
  const babLabel = v._bab ? `Bab ${v._bab}` : '-';
  const dirLabel = isJpToId ? 'JP → Arti' : 'Arti → JP';
  meta.innerHTML = `<span class="pill q-num">No.${qIdx + 1}</span><span class="pill q-topic">${babLabel}</span><span class="pill q-mode">${dirLabel}</span>`;
  wrap.appendChild(meta);

  const card = document.createElement('div');
  card.className = 'q-card';
  if (isJpToId) {
    const jp = getJp(v) || '-';
    const rom = v.rom ? `<span class="rom">${v.rom}</span>` : '';
    card.innerHTML = `<div class="q-prompt">Apa artinya?</div><div class="q-content jp">${jp}${rom}</div>`;
  } else {
    card.innerHTML = `<div class="q-prompt">Apa bahasa Jepangnya?</div><div class="q-content">${v.id || '-'}</div>`;
  }
  wrap.appendChild(card);

  const opts = document.createElement('div');
  opts.className = 'options-grid';
  const letters = ['A', 'B', 'C', 'D'];
  choices.forEach((c, i) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.dataset.idx = String(i);
    btn.innerHTML = `
      <div class="option-letter">${letters[i]}</div>
      <div class="option-content">${formatOption(c, isJpToId)}</div>
    `;
    btn.onclick = () => answer(i, btn);
    opts.appendChild(btn);
  });
  wrap.appendChild(opts);

  const fb = document.createElement('div');
  fb.className = 'fb';
  fb.id = 'fb';
  wrap.appendChild(fb);

  const nav = document.createElement('div');
  nav.className = 'q-nav';
  nav.innerHTML = `
    <button class="skip-btn" onclick="skipQ()">Lewati</button>
    <button class="next-btn" id="nextBtn" onclick="nextQ()">${qIdx + 1 < total ? 'Lanjut ▶' : 'Lihat Hasil ▶'}</button>
  `;
  wrap.appendChild(nav);
}

function formatOption(item, isJpToId) {
  const jp = getJp(item) || '-';
  const id = item.id || '-';
  const rom = item.rom ? ` <span class="option-romaji">(${item.rom})</span>` : '';
  if (isJpToId) {
    return `<div class="option-main">${escapeHtml(id)}</div><div class="option-sub">${escapeHtml(jp)}${rom}</div>`;
  }
  return `<div class="option-main jp">${escapeHtml(jp)}</div><div class="option-sub">Arti: ${escapeHtml(id)}${rom}</div>`;
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function loseHeart() {
  hearts = Math.max(0, hearts - 1);
  const hEl = el('hHearts');
  hEl.classList.add('lost');
  setTimeout(() => { hEl.classList.remove('lost'); updateTopMeta(); }, 300);
}

function answer(idx, btnEl) {
  if (answered) return;
  answered = true;
  const correct = idx === currentQ.ansIdx;

  if (correct) {
    score += 1;
    streak += 1;
    bestStreak = Math.max(bestStreak, streak);
    const bonus = streak >= 5 ? 15 : streak >= 3 ? 12 : 10;
    xp += bonus;
    playCorrect();
  } else {
    streak = 0;
    loseHeart();
    playWrong();
  }

  results.push({ q: currentQ, chosenIdx: idx, correct });
  updateTopMeta();

  document.querySelectorAll('.option-btn').forEach((b, i) => {
    b.disabled = true;
    b.classList.add('show-detail');
    if (i === currentQ.ansIdx) b.classList.add('correct');
    if (i === idx && !correct) b.classList.add('wrong');
  });

  const fb = el('fb');
  fb.className = 'fb show ' + (correct ? 'ok' : 'no');
  const bonusText = correct && streak >= 3
    ? ` <small>(+${streak >= 5 ? 15 : 12} XP, beruntun ${streak}🔥)</small>`
    : (correct ? ' <small>(+10 XP)</small>' : '');

  const v = currentQ.vocab;
  const detail = currentQ.isJpToId
    ? `<b>${escapeHtml(getJp(v))}</b>${v.rom ? ' (' + escapeHtml(v.rom) + ')' : ''} = <b>${escapeHtml(v.id)}</b>`
    : `<b>${escapeHtml(v.id)}</b> = <b>${escapeHtml(getJp(v))}</b>${v.rom ? ' (' + escapeHtml(v.rom) + ')' : ''}`;
  fb.innerHTML = `
    <div class="fb-icon">${correct ? '✓' : '✕'}</div>
    <div>
      <div class="fb-title">${correct ? 'Jawaban tepat!' : 'Belum tepat'}${bonusText}</div>
      <div class="fb-txt">${detail}</div>
    </div>
  `;

  const nextBtn = el('nextBtn');
  nextBtn.classList.add('show');
  if (!correct) nextBtn.classList.add('no-style');
  else nextBtn.classList.remove('no-style');
  document.querySelector('.skip-btn').style.display = 'none';

  if (hearts === 0) {
    nextBtn.textContent = 'Lihat Hasil ▶';
    nextBtn.onclick = () => showResult(true);
  }
}

function skipQ() {
  results.push({ q: currentQ, chosenIdx: -1, correct: false });
  streak = 0;
  updateTopMeta();
  nextQ();
}

function nextQ() {
  qIdx += 1;
  if (qIdx >= activeList.length || hearts === 0) {
    showResult(hearts === 0);
    return;
  }
  renderQ();
}

function showResult(gameOver) {
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

  const circle = document.querySelector('.result-circle');
  circle.classList.remove('bad', 'mid');
  if (pct < 55) circle.classList.add('bad');
  else if (pct < 75) circle.classList.add('mid');

  let title = 'Semangat! 💪';
  let msg = 'Terus latihan, kamu pasti bisa.';
  if (gameOver) {
    title = 'Nyawa habis 💔';
    msg = `Kamu menjawab ${total} kata sebelum nyawa habis. XP: ${xp} · Beruntun terbaik: ${bestStreak}🔥`;
  } else if (pct === 100) {
    title = 'SEMPURNA! 🏆';
    msg = `Tidak ada salah satu pun. XP: ${xp} · Beruntun terbaik: ${bestStreak}🔥`;
  } else if (pct >= 90) {
    title = 'Luar biasa! 🌟';
    msg = `Hampir sempurna. XP: ${xp} · Beruntun terbaik: ${bestStreak}🔥`;
  } else if (pct >= 75) {
    title = 'Bagus sekali! 👍';
    msg = `Hasilmu kuat, beberapa kata perlu dirapikan. XP: ${xp} · Beruntun terbaik: ${bestStreak}🔥`;
  } else if (pct >= 55) {
    title = 'Hampir! 📚';
    msg = `Sudah bagus, ulangi kata yang masih salah. XP: ${xp} · Beruntun terbaik: ${bestStreak}🔥`;
  } else {
    msg = `Jangan menyerah! XP: ${xp} · Beruntun terbaik: ${bestStreak}🔥`;
  }

  el('rTitle').textContent = title;
  el('rMsg').textContent = msg;

  const wrongOnes = results.filter((r) => !r.correct);
  const rb = el('reviewBox');
  if (!wrongOnes.length) {
    rb.innerHTML = '<h4>Review</h4><div style="text-align:center;padding:12px;color:var(--green-dark);font-weight:700;">✓ Semua jawaban benar!</div>';
  } else {
    rb.innerHTML = `<h4>Perlu dipelajari lagi (${wrongOnes.length} kata)</h4>` +
      wrongOnes.map((r) => {
        const v = r.q.vocab;
        const jp = escapeHtml(getJp(v));
        const id = escapeHtml(v.id);
        const rom = v.rom ? ' (' + escapeHtml(v.rom) + ')' : '';
        const yourAns = r.chosenIdx >= 0
          ? (r.q.isJpToId ? escapeHtml(r.q.choices[r.chosenIdx].id) : escapeHtml(getJp(r.q.choices[r.chosenIdx])))
          : '(dilewati)';
        const correctText = r.q.isJpToId ? id : jp;
        return `
        <div class="rv-item">
          <div class="rv-icon">✕</div>
          <div>
            <div class="rv-q">${jp}${rom} = ${id}</div>
            <div class="rv-ans"><span class="wa">Jawabmu: ${yourAns}</span> → <span class="ca">Benar: ${correctText}</span></div>
          </div>
        </div>`;
      }).join('');
  }

  const existingGO = document.querySelector('.game-over-msg');
  if (existingGO) existingGO.remove();
  if (gameOver) {
    const banner = document.createElement('div');
    banner.className = 'game-over-msg';
    banner.textContent = '💔 Latihan berhenti karena nyawa habis. Coba lagi!';
    rb.parentNode.insertBefore(banner, rb);
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
  xp = 0; streak = 0; hearts = MAX_HEARTS; score = 0;
  updateTopMeta();
  updateSummary();
}

// ===== INIT =====
if (!VOCAB.length) {
  alert('Database kosakata belum terhubung.');
}

buildBabList();
updateTopMeta();
