let currentExerciseList = [];
let currentQuestionIndex = 0;
let correctAnswers = 0;
let wrongAnswers = 0;
let currentQuestion = null;
let answerSubmitted = false;

function getSelectedBabs() {
  const checkboxes = document.querySelectorAll('.bab-checkbox input[type="checkbox"]:checked');
  return Array.from(checkboxes).map(cb => cb.value);
}

function buildExerciseList(selectedBabs) {
  const items = [];

  // Kanji items: tebak furigana dari contoh kata (pakai daftar contoh tambahan jika ada)
  kanjiDatabase
    .filter(k => selectedBabs.includes(k.bab))
    .forEach(k => {
      const exList = (typeof kanjiExamples !== 'undefined' && kanjiExamples[k.kanji])
        ? kanjiExamples[k.kanji]
        : [k.example];

      exList.forEach(ex => {
        const parts = ex.split(' (');
        const word = parts[0].trim();
        const furigana = parts[1] ? parts[1].replace(')', '').trim() : '';
        if (word && furigana) {
          items.push({
            type: 'kanji-furigana',
            question: word,
            answer: furigana,
            label: 'Pilih furigana yang benar!',
            detail: k
          });
        }
      });
    });

  return items;
}

function startNewExercise() {
  const selectedBabs = getSelectedBabs();

  if (selectedBabs.length === 0) {
    document.getElementById('exerciseContainer').style.display = 'none';
    document.getElementById('noDataMessage').style.display = 'block';
    return;
  }

  const allItems = buildExerciseList(selectedBabs);

  if (allItems.length === 0) {
    document.getElementById('exerciseContainer').style.display = 'none';
    document.getElementById('noDataMessage').style.display = 'block';
    return;
  }

  currentExerciseList = shuffleArray(allItems);
  currentQuestionIndex = 0;
  correctAnswers = 0;
  wrongAnswers = 0;
  answerSubmitted = false;

  document.getElementById('exerciseContainer').style.display = 'block';
  document.getElementById('noDataMessage').style.display = 'none';

  generateNewQuestion();
}

function shuffleArray(arr) {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function generateNewQuestion() {
  if (currentQuestionIndex >= currentExerciseList.length) {
    currentQuestionIndex = 0;
    currentExerciseList = shuffleArray([...currentExerciseList]);
  }

  currentQuestion = currentExerciseList[currentQuestionIndex];
  renderQuestion();
  answerSubmitted = false;
}

function renderQuestion() {
  document.getElementById('questionLabel').textContent = currentQuestion.label;
  document.getElementById('questionContent').textContent = currentQuestion.question;

  // Both kanji types use large kanji font
  document.getElementById('questionContent').className = 'question-content kanji-question';

  const totalQuestions = currentExerciseList.length;
  document.getElementById('progressText').textContent = `${currentQuestionIndex + 1}/${totalQuestions}`;
  document.getElementById('progressFill').style.width = `${((currentQuestionIndex + 1) / totalQuestions) * 100}%`;

  renderMultipleChoice();

  document.getElementById('feedbackArea').style.display = 'none';
  document.getElementById('multipleChoiceMode').style.display = 'block';

  updateStats();
}

function renderMultipleChoice() {
  const correctAnswer = currentQuestion.answer;
  const type = currentQuestion.type;

  // Ambil jawaban salah dari pool yang sama jenisnya dulu
  const sameTypePool = shuffleArray(
    currentExerciseList.filter(item => item !== currentQuestion && item.type === type)
  );

  const distractors = [];
  for (const item of sameTypePool) {
    if (!distractors.includes(item.answer) && item.answer !== correctAnswer) {
      distractors.push(item.answer);
    }
    if (distractors.length >= 3) break;
  }

  // Kalau kurang dari 3, ambil dari pool lain
  if (distractors.length < 3) {
    const fallbackPool = shuffleArray(
      currentExerciseList.filter(item => item !== currentQuestion && !distractors.includes(item.answer) && item.answer !== correctAnswer)
    );
    for (const item of fallbackPool) {
      if (!distractors.includes(item.answer)) {
        distractors.push(item.answer);
      }
      if (distractors.length >= 3) break;
    }
  }

  const options = shuffleArray([correctAnswer, ...distractors.slice(0, 3)]);

  const optionsGrid = document.getElementById('optionsGrid');
  optionsGrid.innerHTML = '';

  options.forEach(option => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.textContent = option;
    btn.onclick = () => selectAnswer(option, correctAnswer, btn);
    optionsGrid.appendChild(btn);
  });
}

function selectAnswer(selectedOption, correctAnswer, btnElement) {
  if (answerSubmitted) return;
  answerSubmitted = true;

  document.querySelectorAll('.option-btn').forEach(btn => {
    btn.classList.add('disabled');
  });

  const isCorrect = selectedOption === correctAnswer;

  if (isCorrect) {
    btnElement.classList.add('correct');
    correctAnswers++;
  } else {
    btnElement.classList.add('wrong');
    wrongAnswers++;
    document.querySelectorAll('.option-btn').forEach(btn => {
      if (btn.textContent === correctAnswer) btn.classList.add('correct');
    });
  }

  showFeedback(isCorrect, correctAnswer);
  updateStats();
}

function showFeedback(isCorrect, correctAnswer) {
  const item = currentQuestion;
  const feedbackArea = document.getElementById('feedbackArea');
  const feedbackContent = document.getElementById('feedbackContent');

  let html = isCorrect
    ? '<span class="feedback-correct">&#10003; Benar!</span>'
    : '<span class="feedback-wrong">&#10007; Salah</span>';

  html += '<div class="feedback-details">';

  const k = item.detail;
  html += `<strong>Kanji:</strong> <span style="font-family:'Noto Serif JP',serif;font-size:1.4rem;">${k.kanji}</span><br>`;
  html += `<strong>Contoh:</strong> ${k.example}<br>`;
  html += `<strong>Arti:</strong> ${k.meaning}<br>`;
  html += `<strong>On'yomi:</strong> ${k.onyomi} &nbsp;|&nbsp; <strong>Kun'yomi:</strong> ${k.kunyomi}`;

  html += '</div>';

  feedbackContent.innerHTML = html;
  feedbackArea.style.display = 'flex';
  document.getElementById('multipleChoiceMode').style.display = 'none';
}

function nextQuestion() {
  currentQuestionIndex++;
  generateNewQuestion();
}

function updateStats() {
  document.getElementById('correctCount').textContent = correctAnswers;
  document.getElementById('wrongCount').textContent = wrongAnswers;
  const total = correctAnswers + wrongAnswers;
  const accuracy = total > 0 ? Math.round((correctAnswers / total) * 100) : 0;
  document.getElementById('accuracyRate').textContent = accuracy + '%';
}

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('exerciseContainer').style.display = 'none';
  document.getElementById('noDataMessage').style.display = 'block';
});
