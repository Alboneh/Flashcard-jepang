
let filtered = [...vocab];
let idx = 0;
let flipped = false;
let mode = 'flash';
let strokeWriter = null;
let currentStrokeKanji = '';
let voicesReady = false;
let autoVoiceRunning = false;
let autoVoiceRunId = 0;
const JAPANESE_TO_MEANING_DELAY_MS = 1000;
const AUTO_NEXT_DELAY_MS = 1500;
let reverseMode = false;

function getSelectedBabs() {
  const checkboxes = document.querySelectorAll('.multi-option input[type="checkbox"]:checked');
  return Array.from(checkboxes).map((cb) => cb.value);
}

function updateBabFilterButtonLabel() {
  const btn = document.getElementById('babFilterBtn');
  if(!btn) return;
  const selected = getSelectedBabs();

  if(selected.length === 0) {
    btn.textContent = 'Filter Bab: Semua';
    return;
  }

  if(selected.length <= 2) {
    btn.textContent = 'Filter Bab: ' + selected.join(', ');
    return;
  }

  btn.textContent = 'Filter Bab: ' + selected.length + ' Bab dipilih';
}

function toggleBabDropdown() {
  const panel = document.getElementById('babFilterPanel');
  if(!panel) return;
  panel.classList.toggle('show');
}

function closeBabDropdown() {
  const panel = document.getElementById('babFilterPanel');
  if(!panel) return;
  panel.classList.remove('show');
}

function onBabSelectionChange() {
  updateBabFilterButtonLabel();
  filterCards();
}

function waitMs(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function loadVoices() {
  if(!('speechSynthesis' in window)) return;
  window.speechSynthesis.getVoices();
  voicesReady = true;
}

function findVoice(langPrefix) {
  if(!('speechSynthesis' in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  if(!voices || !voices.length) return null;
  return voices.find(v => v.lang && v.lang.toLowerCase().startsWith(langPrefix.toLowerCase())) || null;
}

function speakText(text, lang, voice) {
  return new Promise((resolve) => {
    if(!('speechSynthesis' in window)) {
      resolve();
      return;
    }
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = lang;
    if(voice) utt.voice = voice;
    utt.rate = 0.95;
    utt.pitch = 1;
    utt.onend = () => resolve();
    utt.onerror = () => resolve();
    window.speechSynthesis.speak(utt);
  });
}

function getJapaneseReadText(v) {
  if(v.type === 'kanji') {
    return v.kanji + '。おんよみ ' + v.unyomi + '。くんよみ ' + v.kunyomi;
  }
  return v.jp;
}

function getMeaningReadText(v) {
  return v.id;
}

async function speakCurrentCard() {
  return speakCurrentCardSequence(false);
}

async function speakCurrentCardSequence(flipBeforeSecondAudio) {
  if(!filtered.length) return;
  if(!('speechSynthesis' in window)) {
    alert('Browser tidak mendukung voice synthesis.');
    return;
  }

  if(!voicesReady) loadVoices();
  window.speechSynthesis.cancel();

  const v = filtered[idx];
  const jpText = getJapaneseReadText(v);
  const meaningText = getMeaningReadText(v);
  const jaVoice = findVoice('ja');
  const idVoice = findVoice('id') || findVoice('en');

  const firstText = reverseMode ? meaningText : jpText;
  const firstLang = reverseMode ? 'id-ID' : 'ja-JP';
  const firstVoice = reverseMode ? idVoice : jaVoice;
  const secondText = reverseMode ? jpText : meaningText;
  const secondLang = reverseMode ? 'ja-JP' : 'id-ID';
  const secondVoice = reverseMode ? jaVoice : idVoice;

  await speakText(firstText, firstLang, firstVoice);
  if(flipBeforeSecondAudio && !flipped) {
    flipCard();
  }
  await waitMs(JAPANESE_TO_MEANING_DELAY_MS);
  await speakText(secondText, secondLang, secondVoice);
}

if('speechSynthesis' in window) {
  loadVoices();
  window.speechSynthesis.onvoiceschanged = loadVoices;
}

function setMode(m) {
  if(mode === 'auto' && m !== 'auto') {
    stopAutoVoice();
  }

  mode = m;
  document.querySelectorAll('.tab').forEach((t)=>{
    t.classList.toggle('active', t.dataset.mode === m);
  });

  document.getElementById('flashMode').style.display = '';
  renderCard();

  if(m === 'auto') {
    startAutoVoice(true);
  } else {
    updateAutoVoiceStatus();
  }
}

function filterCards() {
  const selectedBabs = getSelectedBabs();
  const q = document.getElementById('search').value.toLowerCase();
  filtered = vocab.filter(v => {
    const matchCat = selectedBabs.length === 0 || selectedBabs.includes(v.cat);
    const isKanji = v.type === 'kanji';
    let matchQ = !q;
    if(q && !matchQ) {
      if(isKanji) {
        matchQ = v.kanji.includes(q) || v.unyomi.toLowerCase().includes(q) || v.kunyomi.toLowerCase().includes(q) || v.id.toLowerCase().includes(q);
      } else {
        matchQ = v.jp.includes(q) || v.rom.toLowerCase().includes(q) || v.id.toLowerCase().includes(q);
      }
    }
    return matchCat && matchQ;
  });
  idx = 0;
  document.getElementById('stats').textContent = filtered.length + ' kata';
  renderCard();

  if(mode==='auto') {
    renderCard();
    startAutoVoice(true);
  }
}

function selectAllBabs() {
  const checkboxes = document.querySelectorAll('.multi-option input[type="checkbox"]');
  checkboxes.forEach((cb) => {
    cb.checked = true;
  });
  updateBabFilterButtonLabel();
  filterCards();
}

function clearAllBabs() {
  const checkboxes = document.querySelectorAll('.multi-option input[type="checkbox"]');
  checkboxes.forEach((cb) => {
    cb.checked = false;
  });
  updateBabFilterButtonLabel();
  filterCards();
}

function renderCard() {
  document.querySelector('.card-hint').textContent = reverseMode ? 'Ketuk untuk melihat Jepang' : 'Ketuk untuk melihat arti';

  if(!filtered.length) {
    document.getElementById('fcJp').textContent = '–';
    document.getElementById('fcRomaji').textContent = '';
    document.getElementById('fcMeaning').textContent = 'Tidak ada kata';
    document.getElementById('fcCat').textContent = '';
    document.getElementById('prog').textContent = '0 / 0';
    updateStrokePanel(null, false);
    return;
  }
  const v = filtered[idx];
  const isKanji = v.type === 'kanji';
  const jpDisplay = isKanji ? v.kanji : v.jp;
  flipped = false;
  document.getElementById('front').classList.remove('hide');
  document.getElementById('back').classList.remove('show');
  document.getElementById('fcJp').textContent = reverseMode ? v.id : jpDisplay;
  
  if(isKanji) {
    document.getElementById('fcRomaji').textContent = 'On: ' + v.unyomi + ' | Kun: ' + v.kunyomi;
  } else {
    document.getElementById('fcRomaji').textContent = v.rom;
  }
  document.getElementById('fcMeaning').textContent = reverseMode ? jpDisplay : v.id;
  
  // Add example for kanji
  if(isKanji && v.example) {
    document.getElementById('fcCat').innerHTML = v.cat + '<br><span style="margin-top: 6px; display: block; font-size: 11px; font-weight: normal; margin-top: 8px; border-top: 1px solid rgba(0,0,0,0.1); padding-top: 6px;">📝 ' + v.example + '</span>';
  } else {
    document.getElementById('fcCat').textContent = v.cat;
  }
  document.getElementById('prog').textContent = (idx+1) + ' / ' + filtered.length;

  updateStrokePanel(v, isKanji);
}

function updateStrokePanel(v, isKanji) {
  const panel = document.getElementById('strokePanel');
  const note = document.getElementById('strokeNote');
  const target = document.getElementById('strokeTarget');

  if(!panel || !note || !target) {
    return;
  }

  if(!isKanji) {
    panel.style.display = 'none';
    return;
  }

  panel.style.display = 'flex';

  if(typeof HanziWriter === 'undefined') {
    target.textContent = v.kanji;
    note.textContent = 'Animasi tidak tersedia (library belum termuat).';
    return;
  }

  note.textContent = 'Stroke order akan berjalan otomatis saat ganti kartu kanji.';

  if(currentStrokeKanji !== v.kanji || !strokeWriter) {
    target.innerHTML = '';
    currentStrokeKanji = v.kanji;
    strokeWriter = HanziWriter.create('strokeTarget', v.kanji, {
      width: 180,
      height: 180,
      padding: 8,
      strokeAnimationSpeed: 1,
      delayBetweenStrokes: 250,
      strokeColor: '#1f2b6d',
      radicalColor: '#667eea',
      outlineColor: '#d8ddff'
    });
  }

  strokeWriter.animateCharacter();
}

function replayStrokeAnimation() {
  if(strokeWriter) {
    strokeWriter.animateCharacter();
  }
}

function flipCard() {
  flipped = !flipped;
  document.getElementById('front').classList.toggle('hide', flipped);
  document.getElementById('back').classList.toggle('show', flipped);
}

function next() { 
  if(filtered.length){
    idx=(idx+1)%filtered.length; 
    renderCard();
  } 
}

function prev() { 
  if(filtered.length){
    idx=(idx-1+filtered.length)%filtered.length; 
    renderCard();
  } 
}

function updateAutoVoiceStatus() {
  const el = document.getElementById('autoVoiceStatus');
  if(!el) return;
  if(mode !== 'auto') {
    el.textContent = '';
    return;
  }
  el.textContent = autoVoiceRunning
    ? ('Auto Voice aktif: ' + (reverseMode ? 'arti -> jeda 1 detik -> Jepang' : 'Jepang -> jeda 1 detik -> arti') + ' -> jeda 1.5 detik -> kartu berikutnya')
    : 'Auto Voice siap';
}

function updateReverseButton() {
  const btn = document.getElementById('reverseBtn');
  if(!btn) return;
  btn.textContent = reverseMode ? '↔ Reverse: ON (Arti dulu)' : '↔ Reverse: OFF (Jepang dulu)';
}

function toggleReverseMode() {
  reverseMode = !reverseMode;
  updateReverseButton();
  renderCard();
  if(mode === 'auto') {
    startAutoVoice(true);
  }
}

function stopAutoVoice() {
  autoVoiceRunning = false;
  autoVoiceRunId += 1;
  if('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  updateAutoVoiceStatus();
}

function shouldContinueAuto(runId) {
  return autoVoiceRunning && mode === 'auto' && runId === autoVoiceRunId;
}

async function runAutoVoiceLoop(runId) {
  while(shouldContinueAuto(runId)) {
    renderCard();
    await speakCurrentCardSequence(true);
    if(!shouldContinueAuto(runId)) break;
    await waitMs(AUTO_NEXT_DELAY_MS);
    if(!shouldContinueAuto(runId)) break;
    idx = (idx + 1) % filtered.length;
  }
}

function startAutoVoice(restart) {
  if(!filtered.length) {
    updateAutoVoiceStatus();
    return;
  }
  if(!('speechSynthesis' in window)) {
    alert('Browser tidak mendukung voice synthesis.');
    return;
  }

  if(restart) {
    stopAutoVoice();
  }

  if(autoVoiceRunning) return;
  autoVoiceRunning = true;
  autoVoiceRunId += 1;
  const runId = autoVoiceRunId;
  updateAutoVoiceStatus();
  runAutoVoiceLoop(runId);
}

function shuffle() {
  for(let i=filtered.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [filtered[i],filtered[j]]=[filtered[j],filtered[i]];
  }
  idx=0;
  renderCard();
}

function isTypingElement(el) {
  if(!el) return false;
  const tag = el.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || el.isContentEditable;
}

function handleArrowNavigation(e) {
  if(isTypingElement(e.target)) return;

  if(e.key === 'ArrowLeft') {
    e.preventDefault();
    prev();
    if(mode === 'auto') startAutoVoice(true);
  } else if(e.key === 'ArrowRight') {
    e.preventDefault();
    next();
    if(mode === 'auto') startAutoVoice(true);
  }
}

document.addEventListener('click', (e) => {
  const root = document.getElementById('babFilter');
  if(!root) return;
  if(!root.contains(e.target)) {
    closeBabDropdown();
  }
});

updateBabFilterButtonLabel();
filterCards();
renderCard();
updateReverseButton();
updateAutoVoiceStatus();
document.addEventListener('keydown', handleArrowNavigation);
