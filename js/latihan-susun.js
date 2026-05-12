// ===== DATA =====
const BUNPO = (typeof bunpoDatabase !== 'undefined' && Array.isArray(bunpoDatabase)) ? bunpoDatabase : [];
const ALL_BAB = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];

function babNum(s) {
  const m = String(s || '').match(/(\d+)/);
  return m ? +m[1] : null;
}

// Build flat list of sentence exercises (>= 3 chips, has translation)
function exampleToExercise(ex, item) {
  const m = String(ex).match(/^(.*)\s\((.+)\)\s*$/);
  if (!m) return null;
  const jp = m[1].trim().replace(/[。．！？]+$/, '').trim();
  const id = m[2].trim();
  const chips = jp.split(/[\s　]+/).filter((c) => c.length > 0);
  if (chips.length < 3) return null;
  return {
    chips,
    answer: chips.join(''),       // canonical (no spaces)
    chipsJoined: chips.join(' '), // for display
    meaning: id,
    bab: babNum(item.bab),
    babLabel: item.bab || '-',
    pola: item.pattern || '-'
  };
}

const EXERCISES = [];
BUNPO.forEach((item) => {
  (item.examples || []).forEach((ex) => {
    const e = exampleToExercise(ex, item);
    if (e) EXERCISES.push(e);
  });
});

// ===== STATE =====
const selectedBabs = new Set();   // empty = semua
let sessionCount = 20;
let activeList = [];
let qIdx = 0;
let score = 0;
let xp = 0;
let streak = 0;
let bestStreak = 0;
let hearts = 5;
const MAX_HEARTS = 5;
let results = [];
let currentExercise = null;
let answered = false;
let placedChips = [];   // array of {chipText, sourceIdx}
let sourceChips = [];   // array of {text, used:false}

function el(id) { return document.getElementById(id); }

// ===== AUDIO =====
let audioCtx = null;
let soundEnabled = true;
function getCtx() {
  if (!audioCtx) {
    try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return null; }
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}
function tone(freq, dur, type, gain, delay) {
  const ctx = getCtx(); if (!ctx) return;
  const t0 = ctx.currentTime + (delay || 0);
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  g.gain.setValueAtTime(gain, t0);
  g.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
  osc.connect(g).connect(ctx.destination);
  osc.start(t0); osc.stop(t0 + dur);
}
function playCorrect() {
  if (!soundEnabled) return;
  tone(659.25, 0.12, 'triangle', 0.22, 0);
  tone(987.77, 0.22, 'triangle', 0.22, 0.10);
}
function playWrong() {
  if (!soundEnabled) return;
  tone(220, 0.18, 'sawtooth', 0.18, 0);
  tone(164.81, 0.28, 'sawtooth', 0.18, 0.12);
}
function tapSound() {
  if (!soundEnabled) return;
  tone(440, 0.04, 'sine', 0.1, 0);
}
function toggleSound() {
  soundEnabled = !soundEnabled;
  const btn = el('soundBtn');
  if (btn) btn.textContent = soundEnabled ? '🔊' : '🔇';
  if (soundEnabled) playCorrect();
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

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function babCount(b) {
  return EXERCISES.filter((x) => x.bab === b).length;
}

function filteredPool() {
  if (selectedBabs.size === 0) return EXERCISES.filter((x) => x.bab !== null);
  return EXERCISES.filter((x) => x.bab !== null && selectedBabs.has(x.bab));
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
    sum.textContent = `Semua bab · ${total} kalimat`;
    btnText.textContent = 'Semua Bab';
    el('iBab').textContent = ALL_BAB.length;
  } else {
    const list = ALL_BAB.filter((b) => selectedBabs.has(b));
    sum.textContent = `${selectedBabs.size} bab dipilih · ${total} kalimat`;
    btnText.textContent = list.length <= 4
      ? list.map((b) => `Bab ${b}`).join(', ')
      : `${list.length} bab dipilih`;
    el('iBab').textContent = selectedBabs.size;
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
      <span class="bab-row-count">${n} kalimat</span>
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

document.addEventListener('click', (e) => {
  const dd = el('babDropdown');
  if (dd && dd.classList.contains('open') && !dd.contains(e.target)) {
    dd.classList.remove('open');
  }
});

function setMode(btn, n) {
  document.querySelectorAll('#modeRow .mode-btn').forEach((b) => b.classList.remove('on'));
  btn.classList.add('on');
  sessionCount = n;
}

// ===== MASCOT =====
function reactMascot(correct) {
  const m = el('mascot');
  if (!m) return;
  m.classList.remove('happy', 'sad');
  void m.offsetWidth;
  m.classList.add(correct ? 'happy' : 'sad');
  setTimeout(() => m.classList.remove('happy', 'sad'), 1100);
}

// ===== QUIZ =====
function startQuiz() {
  const pool = filteredPool();
  if (!pool.length) {
    alert('Tidak ada soal untuk bab yang dipilih.');
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
  el('mascotWrap').classList.add('active');
  updateTopMeta();
  renderQ();
}

function renderQ() {
  const total = activeList.length;
  const ex = activeList[qIdx];
  currentExercise = ex;
  answered = false;
  placedChips = [];
  sourceChips = shuffle(ex.chips.map((text, idx) => ({ text, originalIdx: idx, used: false })));

  el('pLabel').textContent = `Soal ${qIdx + 1} / ${total}`;
  el('pScore').textContent = `${score} benar`;
  el('progFill').style.width = `${(qIdx / total) * 100}%`;
  el('qNum').textContent = `No.${qIdx + 1}`;
  el('qBab').textContent = ex.babLabel || '-';
  el('qPola').textContent = ex.pola || '-';
  el('promptText').textContent = ex.meaning;

  renderAnswer();
  renderSource();

  el('fb').classList.remove('show', 'ok', 'no');
  el('submitBtn').style.display = '';
  el('skipBtn').style.display = '';
  el('undoBtn').style.display = '';
  el('nextBtn').classList.remove('show', 'no-style');
  el('nextBtn').textContent = (qIdx + 1 < total) ? 'Lanjut ▶' : 'Lihat Hasil ▶';

  el('answerArea').classList.remove('correct', 'wrong');
}

function renderAnswer() {
  const area = el('answerArea');
  // remove all chips but keep placeholder
  Array.from(area.querySelectorAll('.chip')).forEach((c) => c.remove());
  if (placedChips.length === 0) {
    area.classList.remove('has-chips');
  } else {
    area.classList.add('has-chips');
  }
  placedChips.forEach((p, i) => {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'chip chip-anim';
    chip.textContent = p.text;
    chip.onclick = () => { if (!answered) removeFromAnswer(i); };
    area.appendChild(chip);
  });
  updateSubmitState();
}

function renderSource() {
  const area = el('sourceArea');
  area.innerHTML = '';
  sourceChips.forEach((s, idx) => {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'chip' + (s.used ? ' used' : '');
    chip.textContent = s.text;
    chip.onclick = () => { if (!answered && !s.used) addToAnswer(idx); };
    area.appendChild(chip);
  });
}

function addToAnswer(sourceIdx) {
  if (sourceChips[sourceIdx].used) return;
  sourceChips[sourceIdx].used = true;
  placedChips.push({ text: sourceChips[sourceIdx].text, sourceIdx });
  tapSound();
  renderAnswer();
  renderSource();
}

function removeFromAnswer(placedIdx) {
  const placed = placedChips[placedIdx];
  if (!placed) return;
  if (sourceChips[placed.sourceIdx]) sourceChips[placed.sourceIdx].used = false;
  placedChips.splice(placedIdx, 1);
  tapSound();
  renderAnswer();
  renderSource();
}

function undoLast() {
  if (answered) return;
  if (placedChips.length === 0) return;
  removeFromAnswer(placedChips.length - 1);
}

function updateSubmitState() {
  const btn = el('submitBtn');
  btn.disabled = placedChips.length === 0;
}

function submitQ() {
  if (answered) return;
  if (placedChips.length === 0) return;
  const userAns = placedChips.map((p) => p.text).join('');
  const correct = userAns === currentExercise.answer;

  answered = true;
  if (correct) {
    score += 1;
    streak += 1;
    bestStreak = Math.max(bestStreak, streak);
    const bonus = streak >= 5 ? 15 : streak >= 3 ? 12 : 10;
    xp += bonus;
    playCorrect();
  } else {
    streak = 0;
    hearts = Math.max(0, hearts - 1);
    playWrong();
  }
  reactMascot(correct);
  updateTopMeta();
  results.push({ ex: currentExercise, userOrder: placedChips.map((p) => p.text), correct });

  el('answerArea').classList.add(correct ? 'correct' : 'wrong');

  const fb = el('fb');
  fb.className = 'fb show ' + (correct ? 'ok' : 'no');
  el('fbIcon').textContent = correct ? '✓' : '✕';

  const bonusText = correct && streak >= 3
    ? ` <small>(+${streak >= 5 ? 15 : 12} XP, beruntun ${streak}🔥)</small>`
    : (correct ? ' <small>(+10 XP)</small>' : '');

  const correctText = currentExercise.chips.join(' ');
  el('fbContent').innerHTML = correct
    ? `<div class="fb-title">Tepat sekali!${bonusText}</div>
       <div class="fb-detail"><span class="label">Kalimat</span><span class="ja">${escapeHtml(correctText)}</span></div>`
    : `<div class="fb-title">Belum tepat</div>
       <div class="fb-detail">
         <div><span class="label">Benar</span><span class="ja">${escapeHtml(correctText)}</span></div>
         <div style="margin-top:0.3rem;"><span class="label">Susunanmu</span><span class="ja">${escapeHtml(placedChips.map((p) => p.text).join(' '))}</span></div>
       </div>`;

  el('submitBtn').style.display = 'none';
  el('skipBtn').style.display = 'none';
  el('undoBtn').style.display = 'none';
  const nextBtn = el('nextBtn');
  nextBtn.classList.add('show');
  if (!correct) nextBtn.classList.add('no-style');
  else nextBtn.classList.remove('no-style');

  if (hearts === 0) nextBtn.textContent = 'Lihat Hasil ▶';
}

function skipQ() {
  if (answered) return;
  results.push({ ex: currentExercise, userOrder: [], correct: false });
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
  el('mascotWrap').classList.remove('active');

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
  let msg = `Skor: ${score}/${total} · XP: ${xp} · Beruntun terbaik: ${bestStreak}🔥`;
  if (gameOver) title = 'Nyawa habis 💔';
  else if (pct === 100) title = 'SEMPURNA! 🏆';
  else if (pct >= 90) title = 'Luar biasa! 🌟';
  else if (pct >= 75) title = 'Bagus sekali! 👍';
  else if (pct >= 55) title = 'Hampir! 📚';
  el('rTitle').textContent = title;
  el('rMsg').textContent = msg;

  const wrongOnes = results.filter((r) => !r.correct);
  const rb = el('reviewBox');
  if (!wrongOnes.length) {
    rb.innerHTML = '<h4>Review</h4><div style="text-align:center;padding:12px;color:var(--green-dark);font-weight:700;">✓ Semua jawaban benar!</div>';
  } else {
    rb.innerHTML = `<h4>Perlu dipelajari lagi (${wrongOnes.length} kalimat)</h4>` +
      wrongOnes.map((r) => {
        const correctJP = r.ex.chips.join(' ');
        const userTxt = r.userOrder.length ? r.userOrder.join(' ') : '(dilewati)';
        return `
        <div class="rv-item">
          <div class="rv-ja">${escapeHtml(correctJP)}</div>
          <div class="rv-id">${escapeHtml(r.ex.meaning)}</div>
          <div class="rv-user">Susunanmu: ${escapeHtml(userTxt)}</div>
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
  el('mascotWrap').classList.remove('active');
  xp = 0; streak = 0; hearts = MAX_HEARTS; score = 0;
  updateTopMeta();
  updateSummary();
}

// ===== INIT =====
if (!EXERCISES.length) {
  alert('Database soal kosong.');
}

buildBabList();
updateTopMeta();
