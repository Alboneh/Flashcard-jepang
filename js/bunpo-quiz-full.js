const Q = (typeof BUNPO_QUIZ_QUESTIONS !== 'undefined' && Array.isArray(BUNPO_QUIZ_QUESTIONS))
  ? BUNPO_QUIZ_QUESTIONS
  : (Array.isArray(window.BUNPO_QUIZ_QUESTIONS) ? window.BUNPO_QUIZ_QUESTIONS : []);

const ALL_BAB = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];

// Map a question to its Bab via the Pola number in q.pola
function getBabForQuestion(q) {
  const m = String(q.pola || '').match(/Pola\s+(\d+)/);
  if (!m) return null;
  const p = +m[1];
  // Special cases where Pola number doesn't match Minna no Nihongo bab order
  if (p === 12) return 10;  // arimasu/imasu keberadaan content
  if (p === 14) return 2;   // no-modifier (にほんのくるま)
  if (p <= 6)  return 1;
  if (p <= 9)  return 2;
  if (p <= 15) return 3;
  if (p <= 20) return 4;
  if (p <= 23) return 5;
  if (p <= 30) return 6;
  if (p <= 35) return 7;
  if (p <= 42) return 8;
  if (p <= 48) return 9;
  if (p <= 53) return 10;
  if (p <= 58) return 11;
  if (p <= 74) return 12;
  if (p <= 79) return 13;
  if (p <= 84) return 14;
  if (p <= 88) return 15;
  return null;
}

// Precompute bab per question for fast filtering
Q.forEach((q) => { q._bab = getBabForQuestion(q); });

// Default: kosong = semua bab. Centang spesifik = hanya bab itu.
const selectedBabs = new Set();

let sessionCount = 9999;
let activeQ = [];
let qIdx = 0;
let score = 0;
let xp = 0;
let streak = 0;
let bestStreak = 0;
let hearts = 5;
const MAX_HEARTS = 5;
let results = [];

function el(id) { return document.getElementById(id); }

// ===== AUDIO (Web Audio API, no external files) =====
let audioCtx = null;
let soundEnabled = true;

function getAudioCtx() {
  if (!audioCtx) {
    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) { return null; }
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
  // Naik dua nada cerah ala Duolingo
  playTone(659.25, 0.12, 'triangle', 0.22, 0);     // E5
  playTone(987.77, 0.22, 'triangle', 0.22, 0.10);  // B5
}

function playWrong() {
  if (!soundEnabled) return;
  // Turun dua nada redup
  playTone(220, 0.18, 'sawtooth', 0.18, 0);    // A3
  playTone(164.81, 0.28, 'sawtooth', 0.18, 0.12); // E3
}

function toggleSound() {
  soundEnabled = !soundEnabled;
  const btn = el('soundBtn');
  if (btn) btn.textContent = soundEnabled ? '🔊' : '🔇';
  if (soundEnabled) playCorrect();
}

function updateTopMeta() {
  el('hHearts').textContent = hearts;
  el('hStreak').textContent = streak;
  el('hScore').textContent = xp;
}

function filteredPool() {
  // Empty selection → semua bab. Ada selection → hanya bab terpilih.
  if (selectedBabs.size === 0) return Q.filter((q) => q._bab !== null);
  return Q.filter((q) => q._bab !== null && selectedBabs.has(q._bab));
}

function babCount(b) {
  return Q.filter((q) => q._bab === b).length;
}

function updateSummary() {
  const total = filteredPool().length;
  const sum = el('selSummary');
  const btnText = el('babBtnText');

  if (selectedBabs.size === 0) {
    sum.textContent = `Semua bab · ${total} soal`;
    sum.classList.remove('empty');
    btnText.textContent = 'Semua Bab (1–15)';
    el('iPola').textContent = ALL_BAB.length;
  } else {
    const list = ALL_BAB.filter((b) => selectedBabs.has(b));
    sum.textContent = `${selectedBabs.size} bab dipilih · ${total} soal`;
    sum.classList.remove('empty');
    btnText.textContent = list.length <= 4
      ? list.map((b) => `Bab ${b}`).join(', ')
      : `${list.length} bab dipilih`;
    el('iPola').textContent = selectedBabs.size;
  }

  el('iTotal').textContent = total;
  el('startBtn').disabled = false;
}

function buildBabList() {
  const list = el('babList');
  list.innerHTML = '';
  ALL_BAB.forEach((b) => {
    const n = babCount(b);
    if (n === 0) return; // skip bab without questions
    const row = document.createElement('label');
    row.className = 'bab-row';
    row.innerHTML = `
      <input type="checkbox" data-bab="${b}" ${selectedBabs.has(b) ? 'checked' : ''}>
      <span class="bab-row-name">Bab ${b}</span>
      <span class="bab-row-count">${n} soal</span>
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

// Close dropdown on outside click
document.addEventListener('click', (e) => {
  const dd = el('babDropdown');
  if (dd && dd.classList.contains('open') && !dd.contains(e.target)) {
    closeDropdown();
  }
});

function setMode(btn, n) {
  document.querySelectorAll('.mode-btn').forEach((b) => b.classList.remove('on'));
  btn.classList.add('on');
  sessionCount = n;
}

function shuffle(arr) {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function startQuiz() {
  const pool = filteredPool();
  if (!pool.length) {
    alert('Tidak ada soal untuk bab yang dipilih.');
    return;
  }

  activeQ = shuffle(pool).slice(0, Math.min(sessionCount, pool.length));
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

function fmt(text) {
  return String(text || '').replace(/（___）/g, '<span class="blank">＿＿</span>').replace(/\n/g, '<br>');
}

function renderQ() {
  const total = activeQ.length;
  const q = activeQ[qIdx];
  const wrap = el('qWrap');

  el('pLabel').textContent = `Soal ${qIdx + 1} / ${total}`;
  el('pScore').textContent = `${score} benar`;
  el('progFill').style.width = `${(qIdx / total) * 100}%`;

  wrap.innerHTML = '';

  const meta = document.createElement('div');
  meta.className = 'q-card-meta';
  const babLabel = q._bab ? `Bab ${q._bab}` : '-';
  meta.innerHTML = `<span class="pill q-num">No.${qIdx + 1}</span><span class="pill q-topic">${babLabel}</span><span class="pill q-pola">${q.pola || '-'}</span>`;
  wrap.appendChild(meta);

  const card = document.createElement('div');
  card.className = 'q-card';

  if (q.dlg) {
    card.innerHTML += '<div class="q-ctx">💬 Percakapan</div>';
    const dl = document.createElement('div');
    dl.className = 'dialogue';
    q.dlg.forEach((line) => {
      const row = document.createElement('div');
      row.className = 'd-line';
      row.innerHTML = `<div class="d-sp">${line.s ? `${line.s}:` : ''}</div><div class="d-txt">${fmt(line.t)}</div>`;
      dl.appendChild(row);
    });
    card.appendChild(dl);
  }

  if (q.solo) {
    const s = document.createElement('div');
    s.className = 'solo-q';
    s.innerHTML = fmt(q.solo);
    card.appendChild(s);
  }

  if (q.note) {
    card.innerHTML += `<div class="note-box"><b>Catatan:</b> ${q.note}</div>`;
  }

  wrap.appendChild(card);

  const choiceBox = document.createElement('div');
  choiceBox.className = 'choices';
  const letters = ['A', 'B', 'C', 'D'];

  q.ch.forEach((choice, i) => {
    const btn = document.createElement('button');
    btn.className = 'ch-btn';
    btn.innerHTML = `<div class="ch-letter">${letters[i]}</div><div class="ch-text">${choice}</div>`;
    btn.onclick = () => answer(i);
    choiceBox.appendChild(btn);
  });

  wrap.appendChild(choiceBox);

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

function loseHeart() {
  hearts = Math.max(0, hearts - 1);
  const hEl = el('hHearts');
  hEl.classList.add('lost');
  setTimeout(() => {
    hEl.classList.remove('lost');
    updateTopMeta();
  }, 300);
}

function reactMascot(correct) {
  const m = el('mascot');
  if (!m) return;
  m.classList.remove('happy', 'sad');
  void m.offsetWidth;
  m.classList.add(correct ? 'happy' : 'sad');
  setTimeout(() => m.classList.remove('happy', 'sad'), 1100);
}

function answer(chosen) {
  const q = activeQ[qIdx];
  const correct = chosen === q.ans;

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
  reactMascot(correct);

  results.push({ q, chosen, correct });
  updateTopMeta();

  document.querySelectorAll('.ch-btn').forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.ans) btn.classList.add('correct');
    if (i === chosen && !correct) btn.classList.add('wrong');
  });

  const fb = el('fb');
  fb.className = 'fb show ' + (correct ? 'ok' : 'no');
  const bonusText = correct && streak >= 3 ? ` <small>(+${streak >= 5 ? 15 : 12} XP, beruntun ${streak}🔥)</small>` : (correct ? ' <small>(+10 XP)</small>' : '');
  fb.innerHTML = `
    <div class="fb-icon">${correct ? '✓' : '✕'}</div>
    <div>
      <div class="fb-title">${correct ? 'Jawaban tepat!' : 'Belum tepat'}${bonusText}</div>
      <div class="fb-txt">${q.ex || '-'}</div>
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
  results.push({ q: activeQ[qIdx], chosen: -1, correct: false });
  streak = 0;
  updateTopMeta();
  nextQ();
}

function nextQ() {
  qIdx += 1;
  if (qIdx >= activeQ.length || hearts === 0) {
    showResult(hearts === 0);
    return;
  }
  renderQ();
}

function showResult(gameOver) {
  el('quizPanel').style.display = 'none';
  el('resultPanel').style.display = '';
  el('mascotWrap').classList.remove('active');
  el('progFill').style.width = '100%';

  const answered = results.length;
  const wrong = answered - score;
  const pct = answered ? Math.round((score / answered) * 100) : 0;

  el('rScore').textContent = String(score);
  el('rDenom').textContent = '/' + answered;
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
    msg = `Kamu menjawab ${answered} soal sebelum nyawa habis. XP: ${xp} · Beruntun terbaik: ${bestStreak}🔥`;
  } else if (pct === 100) {
    title = 'SEMPURNA! 🏆';
    msg = `Tidak ada salah satu pun. XP: ${xp} · Beruntun terbaik: ${bestStreak}🔥`;
  } else if (pct >= 90) {
    title = 'Luar biasa! 🌟';
    msg = `Hampir sempurna. XP: ${xp} · Beruntun terbaik: ${bestStreak}🔥`;
  } else if (pct >= 75) {
    title = 'Bagus sekali! 👍';
    msg = `Hasilmu kuat, beberapa pola perlu dirapikan. XP: ${xp} · Beruntun terbaik: ${bestStreak}🔥`;
  } else if (pct >= 55) {
    title = 'Hampir! 📚';
    msg = `Sudah bagus, ulangi pola yang masih salah. XP: ${xp} · Beruntun terbaik: ${bestStreak}🔥`;
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
    rb.innerHTML = `<h4>Perlu dipelajari lagi (${wrongOnes.length} soal)</h4>` +
      wrongOnes.map((r) => {
        const qText = r.q.dlg
          ? r.q.dlg.map((d) => (d.s ? `${d.s}:` : '') + d.t).join(' / ')
          : (r.q.solo || '');
        const yourAns = r.chosen >= 0 ? r.q.ch[r.chosen] : '(dilewati)';
        return `
        <div class="rv-item">
          <div class="rv-icon">✕</div>
          <div>
            <div class="rv-q">${qText.replace(/（___）/g, '〔＿＿〕')}</div>
            <div class="rv-ans"><span class="wa">Jawabmu: ${yourAns}</span> → <span class="ca">Benar: ${r.q.ch[r.q.ans]}</span></div>
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
  el('mascotWrap').classList.remove('active');
  xp = 0; streak = 0; hearts = MAX_HEARTS; score = 0;
  updateTopMeta();
  updateSummary();
}

if (!Q.length) {
  alert('Database quiz belum terhubung.');
}

buildBabList();
updateTopMeta();
