const Q = (typeof BUNPO_QUIZ_QUESTIONS !== 'undefined' && Array.isArray(BUNPO_QUIZ_QUESTIONS))
  ? BUNPO_QUIZ_QUESTIONS
  : (Array.isArray(window.BUNPO_QUIZ_QUESTIONS) ? window.BUNPO_QUIZ_QUESTIONS : []);
const CATS = (typeof BUNPO_QUIZ_CATEGORIES !== 'undefined' && Array.isArray(BUNPO_QUIZ_CATEGORIES))
  ? BUNPO_QUIZ_CATEGORIES
  : (Array.isArray(window.BUNPO_QUIZ_CATEGORIES) ? window.BUNPO_QUIZ_CATEGORIES : []);

let selectedCat = 'all';
let sessionCount = 40;
let activeQ = [];
let qIdx = 0;
let score = 0;
let results = [];

function buildCatGrid() {
  const g = document.getElementById('catGrid');
  if (!g) return;

  g.innerHTML = '';
  CATS.forEach((c) => {
    const n = c.id === 'all' ? Q.length : Q.filter((q) => q.cat === c.id).length;
    const d = document.createElement('div');
    d.className = 'cat-card' + (selectedCat === c.id ? ' on' : '');
    d.innerHTML = `<div class="cc-icon">${c.icon}</div><div class="cc-name">${c.name}</div><div class="cc-n">${n} soal</div>`;
    d.onclick = () => {
      selectedCat = c.id;
      buildCatGrid();
    };
    g.appendChild(d);
  });
}

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
  const pool = selectedCat === 'all' ? Q : Q.filter((q) => q.cat === selectedCat);
  if (!pool.length) {
    alert('Tidak ada soal untuk kategori ini.');
    return;
  }

  activeQ = shuffle(pool).slice(0, Math.min(sessionCount, pool.length));
  qIdx = 0;
  score = 0;
  results = [];

  document.getElementById('introPanel').style.display = 'none';
  document.getElementById('quizPanel').style.display = '';
  document.getElementById('resultPanel').style.display = 'none';
  document.getElementById('hScore').textContent = '0';
  document.getElementById('hCorrect').textContent = '0';

  renderQ();
}

function fmt(text) {
  return String(text || '').replace(/（___）/g, '<span class="blank">＿＿</span>').replace(/\n/g, '<br>');
}

function renderQ() {
  const total = activeQ.length;
  const q = activeQ[qIdx];
  const wrap = document.getElementById('qWrap');

  document.getElementById('pLabel').textContent = `Soal ${qIdx + 1} / ${total}`;
  document.getElementById('pScore').textContent = `${score} benar`;
  document.getElementById('progFill').style.width = `${(qIdx / total) * 100}%`;

  wrap.innerHTML = '';

  const meta = document.createElement('div');
  meta.className = 'q-meta';
  meta.innerHTML = `<span class="q-num">No.${qIdx + 1}</span><span class="q-topic">${q.topic || '-'}</span><span class="q-pola">${q.pola || '-'}</span>`;
  wrap.appendChild(meta);

  const card = document.createElement('div');
  card.className = 'q-card';

  if (q.dlg) {
    card.innerHTML += '<div class="q-ctx">Percakapan — pilih yang tepat</div>';
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
    <button class="next-btn" id="nextBtn" onclick="nextQ()">${qIdx + 1 < total ? 'Soal Selanjutnya' : 'Lihat Hasil'}</button>
  `;
  wrap.appendChild(nav);
}

function answer(chosen) {
  const q = activeQ[qIdx];
  const correct = chosen === q.ans;
  if (correct) score += 1;

  results.push({ q, chosen, correct });

  document.getElementById('hScore').textContent = String(score);
  document.getElementById('hCorrect').textContent = String(score);

  document.querySelectorAll('.ch-btn').forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.ans) btn.classList.add('correct');
    if (i === chosen && !correct) btn.classList.add('wrong');
  });

  const fb = document.getElementById('fb');
  fb.className = 'fb show ' + (correct ? 'ok' : 'no');
  fb.innerHTML = `
    <div class="fb-icon">${correct ? 'Benar' : 'Salah'}</div>
    <div>
      <div class="fb-title">${correct ? 'Jawaban tepat' : 'Belum tepat'}</div>
      <div class="fb-txt">${q.ex || '-'}</div>
    </div>
  `;

  document.getElementById('nextBtn').classList.add('show');
  document.querySelector('.skip-btn').style.display = 'none';
}

function skipQ() {
  results.push({ q: activeQ[qIdx], chosen: -1, correct: false });
  nextQ();
}

function nextQ() {
  qIdx += 1;
  if (qIdx >= activeQ.length) {
    showResult();
    return;
  }
  renderQ();
}

function showResult() {
  document.getElementById('quizPanel').style.display = 'none';
  document.getElementById('resultPanel').style.display = '';
  document.getElementById('progFill').style.width = '100%';

  const total = activeQ.length;
  const wrong = total - score;
  const pct = total ? Math.round((score / total) * 100) : 0;

  document.getElementById('rScore').textContent = String(score);
  document.getElementById('rDenom').textContent = '/' + total;
  document.getElementById('rC').textContent = String(score);
  document.getElementById('rW').textContent = String(wrong);
  document.getElementById('rP').textContent = pct + '%';

  let title = 'Semangat';
  let msg = 'Terus latihan ya.';
  if (pct >= 90) {
    title = 'Luar biasa';
    msg = 'Hampir sempurna. Pertahankan!';
  } else if (pct >= 75) {
    title = 'Bagus';
    msg = 'Hasilmu sudah kuat, tinggal rapikan beberapa pola.';
  } else if (pct >= 55) {
    title = 'Hampir';
    msg = 'Sudah bagus, ulangi pola yang masih salah.';
  }

  document.getElementById('rTitle').textContent = title;
  document.getElementById('rMsg').textContent = msg;

  const wrongOnes = results.filter((r) => !r.correct);
  const rb = document.getElementById('reviewBox');

  if (!wrongOnes.length) {
    rb.innerHTML = '<h4>Review</h4><div style="text-align:center;padding:12px;color:var(--green);">Semua jawaban benar.</div>';
    return;
  }

  rb.innerHTML = `<h4>Perlu dipelajari lagi (${wrongOnes.length} soal)</h4>` +
    wrongOnes.map((r) => {
      const qText = r.q.dlg
        ? r.q.dlg.map((d) => (d.s ? `${d.s}:` : '') + d.t).join(' / ')
        : (r.q.solo || '');
      const yourAns = r.chosen >= 0 ? r.q.ch[r.chosen] : '(dilewati)';
      return `
      <div class="rv-item">
        <div class="rv-icon">x</div>
        <div>
          <div class="rv-q">${qText.replace(/（___）/g, '〔＿＿〕')}</div>
          <div class="rv-ans"><span class="wa">Jawabmu: ${yourAns}</span> -> <span class="ca">Benar: ${r.q.ch[r.q.ans]}</span></div>
        </div>
      </div>`;
    }).join('');
}

function retryQuiz() {
  document.getElementById('resultPanel').style.display = 'none';
  startQuiz();
}

function backMenu() {
  document.getElementById('resultPanel').style.display = 'none';
  document.getElementById('quizPanel').style.display = 'none';
  document.getElementById('introPanel').style.display = '';
  document.getElementById('hScore').textContent = '0';
  document.getElementById('hCorrect').textContent = '0';
}

if (!Q.length || !CATS.length) {
  alert('Database quiz belum terhubung.');
}

buildCatGrid();
