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

function startNewExercise() {
  const selectedBabs = getSelectedBabs();
  
  if (selectedBabs.length === 0) {
    document.getElementById('exerciseContainer').style.display = 'none';
    document.getElementById('noDataMessage').style.display = 'block';
    return;
  }

  // Filter kanji by selected Babs
  const filtered = kanjiDatabase.filter(k => selectedBabs.includes(k.bab));
  
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

  const kanji = currentExerciseList[currentQuestionIndex];
  let questionType = document.querySelector('input[name="questionType"]:checked').value;
  
  if (questionType === 'campur') {
    const types = [
      'kanji-to-meaning',
      'kanji-to-onyomi',
      'kanji-to-kunyomi',
      'meaning-to-kanji',
      'onyomi-to-kanji',
      'kunyomi-to-kanji',
      'sentence-furigana'
    ];
    questionType = types[Math.floor(Math.random() * types.length)];
  }

  let questionDisplay = '';
  let correctAnswer = '';
  let questionLabel = '';

  switch(questionType) {
    case 'kanji-to-meaning':
      questionDisplay = kanji.kanji;
      correctAnswer = kanji.meaning;
      questionLabel = 'Apa arti kanji ini?';
      break;
    case 'kanji-to-onyomi':
      questionDisplay = kanji.kanji;
      correctAnswer = kanji.onyomi;
      questionLabel = 'Apa on\'yomi kanji ini?';
      break;
    case 'kanji-to-kunyomi':
      questionDisplay = kanji.kanji;
      correctAnswer = kanji.kunyomi;
      questionLabel = 'Apa kun\'yomi kanji ini?';
      break;
    case 'meaning-to-kanji':
      questionDisplay = kanji.meaning;
      correctAnswer = kanji.kanji;
      questionLabel = 'Kanji mana artinya ini?';
      break;
    case 'onyomi-to-kanji':
      questionDisplay = kanji.onyomi;
      correctAnswer = kanji.kanji;
      questionLabel = 'Kanji mana yang on\'yomi-nya ini?';
      break;
    case 'kunyomi-to-kanji':
      questionDisplay = kanji.kunyomi;
      correctAnswer = kanji.kanji;
      questionLabel = 'Kanji mana yang kun\'yomi-nya ini?';
      break;
    case 'sentence-furigana': {
      const exParts = kanji.example.split(' (');
      const exWord = exParts[0];
      const exFurigana = exParts[1] ? exParts[1].replace(')', '') : '';
      questionDisplay = exWord;
      correctAnswer = exFurigana;
      questionLabel = 'Pilih furigana yang benar!';
      break;
    }
  }

  currentQuestion = {
    kanji: kanji,
    questionType: questionType,
    questionDisplay: questionDisplay,
    correctAnswer: correctAnswer,
    questionLabel: questionLabel
  };

  renderQuestion();
  answerSubmitted = false;
}

function renderQuestion() {
  const kanji = currentQuestion.kanji;
  const questionDisplay = currentQuestion.questionDisplay;
  const questionLabel = currentQuestion.questionLabel;

  // Update question
  document.getElementById('questionLabel').textContent = questionLabel;
  document.getElementById('questionContent').textContent = questionDisplay;
  
  // Determine if this is a kanji display
  const isKanjiQuestion = ['meaning-to-kanji', 'onyomi-to-kanji', 'kunyomi-to-kanji', 'sentence-furigana'].includes(currentQuestion.questionType);
  
  if (isKanjiQuestion) {
    document.getElementById('questionContent').className = 'question-content kanji-question';
  } else {
    document.getElementById('questionContent').className = 'question-content';
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

  // Update stats
  updateStats();
}

function renderMultipleChoice() {
  const correctAnswer = currentQuestion.correctAnswer;
  const allKanji = currentExerciseList;
  const questionType = currentQuestion.questionType;
  
  // Get 3 random wrong answers based on question type
  const wrongAnswers = [];
  const kanjiPool = allKanji.filter(k => k !== currentQuestion.kanji);
  
  while (wrongAnswers.length < 3 && kanjiPool.length > 0) {
    const randomIdx = Math.floor(Math.random() * kanjiPool.length);
    const wrongKanji = kanjiPool.splice(randomIdx, 1)[0];
    
    let wrongAnswer = '';
    switch(questionType) {
      case 'kanji-to-meaning':
        wrongAnswer = wrongKanji.meaning;
        break;
      case 'kanji-to-onyomi':
        wrongAnswer = wrongKanji.onyomi;
        break;
      case 'kanji-to-kunyomi':
        wrongAnswer = wrongKanji.kunyomi;
        break;
      case 'meaning-to-kanji':
        wrongAnswer = wrongKanji.kanji;
        break;
      case 'onyomi-to-kanji':
        wrongAnswer = wrongKanji.kanji;
        break;
      case 'kunyomi-to-kanji':
        wrongAnswer = wrongKanji.kanji;
        break;
      case 'sentence-furigana': {
        const wParts = wrongKanji.example.split(' (');
        wrongAnswer = wParts[1] ? wParts[1].replace(')', '') : wrongKanji.onyomi;
        break;
      }
    }
    
    if (!wrongAnswers.includes(wrongAnswer)) {
      wrongAnswers.push(wrongAnswer);
    }
  }

  // Create options array with correct answer
  let options = [correctAnswer, ...wrongAnswers];
  options = shuffleArray(options);

  // Render options
  const optionsGrid = document.getElementById('optionsGrid');
  optionsGrid.innerHTML = '';

  const isKanjiAnswer = ['meaning-to-kanji', 'onyomi-to-kanji', 'kunyomi-to-kanji'].includes(questionType);

  options.forEach(option => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    if (isKanjiAnswer) {
      btn.className += ' kanji-option';
    }
    btn.textContent = option;
    btn.onclick = () => selectAnswer(option, correctAnswer, btn);
    optionsGrid.appendChild(btn);
  });
}

function selectAnswer(selectedOption, correctAnswer, btnElement) {
  if (answerSubmitted) return;

  answerSubmitted = true;

  // Disable all buttons
  document.querySelectorAll('.option-btn').forEach(btn => {
    btn.classList.add('disabled');
  });

  // Check if correct
  const isCorrect = selectedOption === correctAnswer;

  if (isCorrect) {
    btnElement.classList.add('correct');
    correctAnswers++;
    showFeedback(true, selectedOption, correctAnswer);
  } else {
    btnElement.classList.add('wrong');
    wrongAnswers++;
    
    // Highlight correct answer
    document.querySelectorAll('.option-btn').forEach(btn => {
      if (btn.textContent === correctAnswer) {
        btn.classList.add('correct');
      }
    });
    
    showFeedback(false, selectedOption, correctAnswer);
  }

  updateStats();
}

function showFeedback(isCorrect, selectedOption, correctAnswer) {
  const kanji = currentQuestion.kanji;
  const feedbackArea = document.getElementById('feedbackArea');
  const feedbackContent = document.getElementById('feedbackContent');

  let html = '';
  
  if (isCorrect) {
    html += '<span class="feedback-correct">✓ Benar!</span>';
  } else {
    html += '<span class="feedback-wrong">✗ Salah</span>';
  }

  html += '<div class="feedback-details">';
  
  html += `<strong>Kanji:</strong> <span style="font-size: 28px; color: #667eea;">${kanji.kanji}</span><br>`;
  html += `<strong>Arti:</strong> ${kanji.meaning}<br>`;
  html += `<strong>On'yomi:</strong> ${kanji.onyomi}<br>`;
  html += `<strong>Kun'yomi:</strong> ${kanji.kunyomi}<br>`;
  html += `<strong>Contoh:</strong> ${kanji.example}<br>`;
  html += `<strong>Tip:</strong> ${kanji.mnemonic}`;

  html += '</div>';
  
  feedbackContent.innerHTML = html;
  feedbackArea.style.display = 'block';
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

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  // Set up initial state
  document.getElementById('exerciseContainer').style.display = 'none';
  document.getElementById('noDataMessage').style.display = 'block';
});
