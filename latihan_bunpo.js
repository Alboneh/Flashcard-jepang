let currentExerciseList = [];
let currentQuestionIndex = 0;
let correctAnswers = 0;
let wrongAnswers = 0;
let currentQuestion = null;
let answerSubmitted = false;

const PARTICLES = ['は', 'が', 'を', 'に', 'で', 'へ', 'と', 'も', 'の', 'か', 'から', 'まで'];

function getBabByIndex(index) {
  if (index <= 5) return 'Bab 1';
  if (index <= 10) return 'Bab 2';
  if (index <= 16) return 'Bab 3';
  if (index <= 22) return 'Bab 4';
  if (index <= 26) return 'Bab 5';
  if (index <= 35) return 'Bab 6';
  if (index <= 38) return 'Bab 7';
  if (index <= 46) return 'Bab 8';
  return 'Bab 9';
}

function shuffleArray(arr) {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function normalize(text) {
  return String(text || '').trim().toLowerCase();
}

function parseExample(exampleText) {
  const raw = String(exampleText || '').trim();
  if (!raw) {
    return { jp: '', id: '' };
  }

  const match = raw.match(/^(.*)\(([^()]*)\)\s*$/);
  if (!match) {
    return { jp: raw, id: '' };
  }

  return {
    jp: String(match[1] || '').trim(),
    id: String(match[2] || '').trim()
  };
}

function pickExamplePair(item) {
  const list = (item.examples || []).map(parseExample).filter((p) => p.jp || p.id);
  if (!list.length) {
    return { jp: '', id: item.explanation || '' };
  }
  return list[Math.floor(Math.random() * list.length)];
}

function pickParticlesFromSentence(sentence) {
  const tokens = String(sentence || '').split(/\s+/).filter(Boolean);
  return tokens
    .map((tok, idx) => ({ tok, idx }))
    .filter((x) => PARTICLES.includes(x.tok));
}

function replaceTokensWithBlanks(sentence, targets) {
  const tokens = String(sentence || '').split(/\s+/).filter(Boolean);
  targets.forEach((t, i) => {
    if (t.idx >= 0 && t.idx < tokens.length) {
      tokens[t.idx] = `___(${i + 1})`;
    }
  });
  return tokens.join(' ');
}

function getAllConversationUnits() {
  return bunpoDatabase.map((item, idx) => {
    const bab = getBabByIndex(idx);
    const examples = (item.examples || []).map(parseExample).filter((x) => x.jp || x.id);
    return { item, bab, examples };
  });
}

function buildParticleQuestion(unit) {
  const pair = pickExamplePair(unit.item);
  const sourceSentence = pair.jp || '';
  const allParticlePositions = pickParticlesFromSentence(sourceSentence);
  if (!allParticlePositions.length) return null;

  let blankCount = 1;
  if (allParticlePositions.length >= 2) {
    blankCount = Math.min(3, allParticlePositions.length);
    if (blankCount === 3 && Math.random() < 0.5) {
      blankCount = 2;
    }
  }

  const selectedTargets = shuffleArray(allParticlePositions)
    .slice(0, blankCount)
    .sort((a, b) => a.idx - b.idx)
    .map((p, i) => {
      const wrong = new Set();
      while (wrong.size < 3) {
        const candidate = PARTICLES[Math.floor(Math.random() * PARTICLES.length)];
        if (normalize(candidate) !== normalize(p.tok)) {
          wrong.add(candidate);
        }
      }
      return {
        idx: p.idx,
        answer: p.tok,
        options: shuffleArray([p.tok, ...Array.from(wrong)]),
        blankNo: i + 1
      };
    });

  return {
    type: 'particle',
    bab: unit.bab,
    label: selectedTargets.length > 1
      ? 'Isi semua partikel yang kosong pada kalimat ini'
      : 'Partikel paling tepat untuk melengkapi kalimat ini apa?',
    prompt: replaceTokensWithBlanks(sourceSentence, selectedTargets),
    targets: selectedTargets,
    explanation: unit.item.explanation,
    reference: sourceSentence
  };
}

function startNewExercise() {
  const allUnits = getAllConversationUnits();
  currentExerciseList = shuffleArray(
    allUnits.filter((u) => u.examples.some((ex) => pickParticlesFromSentence(ex.jp).length > 0))
  );

  currentQuestionIndex = 0;
  correctAnswers = 0;
  wrongAnswers = 0;
  answerSubmitted = false;

  document.getElementById('exerciseContainer').style.display = 'block';
  generateNewQuestion();
}

function generateNewQuestion() {
  if (currentQuestionIndex >= currentExerciseList.length) {
    currentQuestionIndex = 0;
    currentExerciseList = shuffleArray(currentExerciseList);
  }

  let unit = currentExerciseList[currentQuestionIndex];
  let question = buildParticleQuestion(unit);
  let guard = 0;
  while (!question && guard < currentExerciseList.length) {
    currentQuestionIndex = (currentQuestionIndex + 1) % currentExerciseList.length;
    unit = currentExerciseList[currentQuestionIndex];
    question = buildParticleQuestion(unit);
    guard++;
  }

  if (!question) return;

  currentQuestion = {
    unit,
    question,
    userAnswers: Array(question.targets.length).fill('')
  };

  answerSubmitted = false;
  renderQuestion();
}

function renderQuestion() {
  document.getElementById('cornerBab').textContent = currentQuestion.question.bab;
  document.getElementById('questionLabel').textContent = currentQuestion.question.label;
  document.getElementById('questionContent').textContent = currentQuestion.question.prompt;

  const totalQuestions = currentExerciseList.length;
  document.getElementById('progressText').textContent = `${currentQuestionIndex + 1}/${totalQuestions}`;
  document.getElementById('progressFill').style.width = `${((currentQuestionIndex + 1) / totalQuestions) * 100}%`;

  const optionsGrid = document.getElementById('optionsGrid');
  optionsGrid.innerHTML = '';

  currentQuestion.question.targets.forEach((target, targetIdx) => {
    const block = document.createElement('div');
    block.className = 'blank-block';

    const title = document.createElement('div');
    title.className = 'blank-title';
    title.textContent = `Blank (${target.blankNo})`;
    block.appendChild(title);

    const row = document.createElement('div');
    row.className = 'blank-options-row';

    target.options.forEach((opt) => {
      const btn = document.createElement('button');
      btn.className = 'option-btn bunpo-option small-option';
      btn.textContent = opt;
      btn.dataset.targetIdx = String(targetIdx);
      btn.onclick = () => selectParticleAnswer(targetIdx, opt, btn);
      row.appendChild(btn);
    });

    block.appendChild(row);
    optionsGrid.appendChild(block);
  });

  document.getElementById('feedbackArea').style.display = 'none';
  updateStats();
}

function selectParticleAnswer(targetIdx, selectedOption, btnElement) {
  if (answerSubmitted) return;

  currentQuestion.userAnswers[targetIdx] = selectedOption;

  const targetButtons = Array.from(document.querySelectorAll(`.option-btn[data-target-idx="${targetIdx}"]`));
  targetButtons.forEach((btn) => btn.classList.remove('selected'));
  btnElement.classList.add('selected');

  const allFilled = currentQuestion.userAnswers.every((ans) => !!String(ans).trim());
  if (!allFilled) return;

  answerSubmitted = true;
  document.querySelectorAll('.option-btn').forEach((btn) => btn.classList.add('disabled'));

  let allCorrect = true;
  currentQuestion.question.targets.forEach((target, idx) => {
    const picked = currentQuestion.userAnswers[idx];
    const isCorrect = normalize(picked) === normalize(target.answer);
    if (!isCorrect) allCorrect = false;

    const buttons = Array.from(document.querySelectorAll(`.option-btn[data-target-idx="${idx}"]`));
    buttons.forEach((btn) => {
      if (normalize(btn.textContent) === normalize(target.answer)) {
        btn.classList.add('correct');
      }
      if (normalize(btn.textContent) === normalize(picked) && !isCorrect) {
        btn.classList.add('wrong');
      }
    });
  });

  if (allCorrect) {
    correctAnswers++;
  } else {
    wrongAnswers++;
  }

  showFeedback(allCorrect);
  updateStats();
}

function showFeedback(isCorrect) {
  const feedbackContent = document.getElementById('feedbackContent');
  const q = currentQuestion.question;

  let html = '';
  html += isCorrect
    ? '<span class="feedback-correct">Benar!</span>'
    : '<span class="feedback-wrong">Belum tepat.</span>';

  html += '<div class="feedback-details">';
  html += `<strong>Bab:</strong> ${q.bab}<br>`;
  html += `<strong>Fungsi bunpo:</strong> ${q.explanation}<br>`;
  if (q.reference) {
    html += `<strong>Contoh kaiwa:</strong> ${q.reference}<br>`;
  }
  const answerText = q.targets.map((t, i) => `(${i + 1}) ${t.answer}`).join(', ');
  html += `<strong>Jawaban benar:</strong> ${answerText}`;
  html += '</div>';

  feedbackContent.innerHTML = html;
  document.getElementById('feedbackArea').style.display = 'block';
}

function nextQuestion() {
  currentQuestionIndex++;
  generateNewQuestion();
}

function updateStats() {
  document.getElementById('correctCount').textContent = correctAnswers;
  document.getElementById('wrongCount').textContent = wrongAnswers;
  const total = correctAnswers + wrongAnswers;
  const acc = total ? Math.round((correctAnswers / total) * 100) : 0;
  document.getElementById('accuracyRate').textContent = `${acc}%`;
}

document.addEventListener('DOMContentLoaded', () => {
  startNewExercise();
});
