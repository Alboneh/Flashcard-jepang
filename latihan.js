let currentExerciseList = [];
let currentQuestionIndex = 0;
let correctAnswers = 0;
let wrongAnswers = 0;
let currentQuestion = null;
let answerSubmitted = false;

function getJapaneseText(item) {
  return item.type === 'kanji' ? item.kanji : item.jp;
}

function formatOptionHtml(item, isJpToId) {
  const jp = getJapaneseText(item) || '-';
  const id = item.id || '-';
  const rom = item.rom ? ` <span class="option-romaji">(${item.rom})</span>` : '';

  if (isJpToId) {
    return `
      <div class="option-main">${id}</div>
      <div class="option-sub">${jp}${rom}</div>
    `;
  }

  return `
    <div class="option-main jp">${jp}</div>
    <div class="option-sub">Arti: ${id}${rom}</div>
  `;
}

function getSelectedBabs() {
  const checkboxes = document.querySelectorAll('.bab-checkbox input[type="checkbox"]:checked');
  return Array.from(checkboxes).map(cb => cb.value);
}

function startNewExercise() {
  const selectedBabs = getSelectedBabs();
  
  if (selectedBabs.length === 0) {
    document.getElementById('exerciseContainer').style.display = 'none';
    document.getElementById('noDataMessage').style.display = 'block';
    return;
  }

  // Filter vocabulary by selected Babs
  const filtered = vocab.filter(v => selectedBabs.includes(v.cat));
  
  if (filtered.length === 0) {
    document.getElementById('exerciseContainer').style.display = 'none';
    document.getElementById('noDataMessage').style.display = 'block';
    return;
  }

  // Shuffle and set up exercise
  currentExerciseList = shuffleArray([...filtered]);
  currentQuestionIndex = 0;
  correctAnswers = 0;
  wrongAnswers = 0;
  answerSubmitted = false;

  document.getElementById('exerciseContainer').style.display = 'block';
  document.getElementById('noDataMessage').style.display = 'none';

  generateNewQuestion();
}

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function generateNewQuestion() {
  if (currentQuestionIndex >= currentExerciseList.length) {
    currentQuestionIndex = 0;
    currentExerciseList = shuffleArray([...currentExerciseList]);
  }

  const vocab = currentExerciseList[currentQuestionIndex];
  const questionType = document.querySelector('input[name="questionType"]:checked').value;
  
  let isJpToId = false;
  
  if (questionType === 'campur') {
    isJpToId = Math.random() > 0.5;
  } else if (questionType === 'jp-to-id') {
    isJpToId = true;
  } else {
    isJpToId = false;
  }

  currentQuestion = {
    vocab: vocab,
    isJpToId: isJpToId,
    correctAnswer: isJpToId ? vocab.id : getJapaneseText(vocab),
    options: []
  };

  renderQuestion();
  answerSubmitted = false;
}

function renderQuestion() {
  const vocab = currentQuestion.vocab;
  const isJpToId = currentQuestion.isJpToId;

  // Update question
  const questionLabel = isJpToId ? 'Apa artinya?' : 'Apa dalam Jepang?';
  document.getElementById('questionLabel').textContent = questionLabel;

  if (isJpToId) {
    const display = vocab.type === 'kanji' ? vocab.kanji : vocab.jp;
    document.getElementById('questionContent').textContent = display;
  } else {
    document.getElementById('questionContent').textContent = vocab.id;
  }

  // Update progress
  const totalQuestions = currentExerciseList.length;
  document.getElementById('progressText').textContent = `${currentQuestionIndex + 1}/${totalQuestions}`;
  const progressPercent = ((currentQuestionIndex + 1) / totalQuestions) * 100;
  document.getElementById('progressFill').style.width = progressPercent + '%';

  // Generate options
  renderMultipleChoice();

  // Hide feedback
  document.getElementById('feedbackArea').style.display = 'none';
  document.getElementById('multipleChoiceMode').style.display = 'block';
  document.getElementById('textInputMode').style.display = 'none';

  // Update stats
  updateStats();
}

function renderMultipleChoice() {
  const allVocab = currentExerciseList;
  const correctVocab = currentQuestion.vocab;
  
  // Get 3 random wrong entries
  const wrongOptionEntries = [];
  const vocabPool = allVocab.filter(v => v !== correctVocab);
  
  while (wrongOptionEntries.length < 3 && vocabPool.length > 0) {
    const randomIdx = Math.floor(Math.random() * vocabPool.length);
    const wrongVocab = vocabPool.splice(randomIdx, 1)[0];

    const exists = wrongOptionEntries.some((item) => {
      const sameId = (item.id || '').trim() === (wrongVocab.id || '').trim();
      const sameJp = getJapaneseText(item) === getJapaneseText(wrongVocab);
      return sameId && sameJp;
    });

    if (!exists) {
      wrongOptionEntries.push(wrongVocab);
    }
  }

  // Create options array with correct entry
  let options = [correctVocab, ...wrongOptionEntries];
  options = shuffleArray(options);
  currentQuestion.options = options;

  // Render options
  const optionsGrid = document.getElementById('optionsGrid');
  optionsGrid.innerHTML = '';

  options.forEach((option, idx) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.innerHTML = formatOptionHtml(option, currentQuestion.isJpToId);
    btn.dataset.optionIndex = String(idx);
    btn.onclick = () => selectAnswer(option, btn);
    optionsGrid.appendChild(btn);
  });
}

function selectAnswer(selectedOptionEntry, btnElement) {
  if (answerSubmitted) return;

  answerSubmitted = true;
  const correctEntry = currentQuestion.vocab;

  // Disable all buttons
  document.querySelectorAll('.option-btn').forEach(btn => {
    btn.classList.add('disabled');
    btn.disabled = true;
  });

  // Show JP/arti helper text only after user has answered
  document.querySelectorAll('.option-btn').forEach(btn => {
    btn.classList.add('show-detail');
  });

  // Check if correct
  const isCorrect = selectedOptionEntry === correctEntry;

  if (isCorrect) {
    btnElement.classList.add('correct');
    correctAnswers++;
    showFeedback(true);
  } else {
    btnElement.classList.add('wrong');
    wrongAnswers++;
    
    // Highlight correct answer
    document.querySelectorAll('.option-btn').forEach((btn) => {
      const idx = Number(btn.dataset.optionIndex);
      if (currentQuestion.options[idx] === correctEntry) {
        btn.classList.add('correct');
      }
    });
    
    showFeedback(false);
  }

  updateStats();
}

function showFeedback(isCorrect) {
  const vocab = currentQuestion.vocab;
  const feedbackArea = document.getElementById('feedbackArea');
  const feedbackContent = document.getElementById('feedbackContent');

  let html = '';
  
  if (isCorrect) {
    html += '<span class="feedback-correct">✓ Benar!</span>';
  } else {
    html += '<span class="feedback-wrong">✗ Salah</span>';
  }

  html += '<div class="feedback-details">';
  
  if (currentQuestion.isJpToId) {
    html += `<strong>Jepang:</strong> ${vocab.type === 'kanji' ? vocab.kanji : vocab.jp}<br>`;
    if (vocab.rom) html += `<strong>Romaji:</strong> ${vocab.rom}<br>`;
    html += `<strong>Arti:</strong> ${vocab.id}`;
  } else {
    html += `<strong>Arti:</strong> ${vocab.id}<br>`;
    html += `<strong>Jepang:</strong> ${vocab.type === 'kanji' ? vocab.kanji : vocab.jp}<br>`;
    if (vocab.rom) html += `<strong>Romaji:</strong> ${vocab.rom}`;
  }

  html += '</div>';
  
  feedbackContent.innerHTML = html;
  feedbackArea.style.display = 'block';
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

function handleKeyPress(event) {
  if (event.key === 'Enter') {
    submitTextAnswer();
  }
}

function submitTextAnswer() {
  if (answerSubmitted) return;

  const userAnswer = document.getElementById('answerInput').value.trim().toLowerCase();
  const correctAnswer = currentQuestion.correctAnswer.toLowerCase();

  answerSubmitted = true;

  // Simple text matching (could be enhanced with fuzzy matching)
  const isCorrect = userAnswer === correctAnswer;

  if (isCorrect) {
    correctAnswers++;
    document.getElementById('answerInput').style.borderColor = '#4caf50';
    showFeedback(true, userAnswer, correctAnswer);
  } else {
    wrongAnswers++;
    document.getElementById('answerInput').style.borderColor = '#f44336';
    showFeedback(false, userAnswer, correctAnswer);
  }

  document.getElementById('answerInput').disabled = true;
  document.querySelector('.submit-btn').disabled = true;
  updateStats();
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  // Set up initial state
  document.getElementById('exerciseContainer').style.display = 'none';
  document.getElementById('noDataMessage').style.display = 'block';
});
