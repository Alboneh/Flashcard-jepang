/* Background lo-fi music — procedural via Web Audio API
   I-V-vi-IV chord loop in C major, soft pad + sparse pentatonic melody + hi-hat offbeats. */
(function () {
  const KEY = 'kosakata-bgm-on';
  const VOL_KEY = 'kosakata-bgm-vol';

  let ctx = null;
  let masterGain = null;
  let isPlaying = false;
  let nextNoteTime = 0;
  let beatCount = 0;
  let scheduler = null;
  let volume = 0.35;

  try {
    const saved = parseFloat(localStorage.getItem(VOL_KEY));
    if (!isNaN(saved)) volume = Math.max(0, Math.min(1, saved));
  } catch (e) { /* ignore */ }

  const N = {
    C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.00, A3: 220.00, B3: 246.94,
    C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, B4: 493.88,
    C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.00,
  };

  // C - G - Am - F (very catchy, evergreen progression)
  const CHORDS = [
    { tones: [N.C3, N.E3, N.G3, N.C4], melody: [N.C4, N.D4, N.E4, N.G4, N.A4, N.C5] },
    { tones: [N.G3, N.B3, N.D4, N.G4], melody: [N.G4, N.A4, N.B4, N.D5, N.E5, N.G5] },
    { tones: [N.A3, N.C4, N.E4, N.A4], melody: [N.A4, N.C5, N.D5, N.E5, N.G5, N.A5] },
    { tones: [N.F3, N.A3, N.C4, N.F4], melody: [N.F4, N.G4, N.A4, N.C5, N.D5, N.F5] },
  ];

  const BPM = 72;
  const STEPS_PER_CHORD = 8;          // eighth notes
  const SEC_PER_STEP = 60 / BPM / 2;  // eighth-note duration

  function ensureCtx() {
    if (ctx) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
    masterGain = ctx.createGain();
    masterGain.gain.value = 0;
    masterGain.connect(ctx.destination);
  }

  function playPad(freq, duration, when) {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    g.gain.setValueAtTime(0, when);
    g.gain.linearRampToValueAtTime(0.07, when + 0.4);
    g.gain.linearRampToValueAtTime(0.05, when + duration * 0.6);
    g.gain.exponentialRampToValueAtTime(0.001, when + duration);
    osc.connect(g).connect(masterGain);
    osc.start(when);
    osc.stop(when + duration + 0.1);
  }

  function playMelody(freq, duration, when) {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.value = freq;
    // Soft attack
    g.gain.setValueAtTime(0, when);
    g.gain.linearRampToValueAtTime(0.11, when + 0.03);
    g.gain.exponentialRampToValueAtTime(0.001, when + duration);
    // Light low-pass for warmer tone
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 2400;
    osc.connect(filter).connect(g).connect(masterGain);
    osc.start(when);
    osc.stop(when + duration + 0.05);
  }

  function playBass(freq, duration, when) {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq / 2; // octave down
    g.gain.setValueAtTime(0, when);
    g.gain.linearRampToValueAtTime(0.16, when + 0.02);
    g.gain.exponentialRampToValueAtTime(0.001, when + duration);
    osc.connect(g).connect(masterGain);
    osc.start(when);
    osc.stop(when + duration + 0.05);
  }

  function playHat(when) {
    const len = 0.04;
    const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * len), ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 6000;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.035, when);
    g.gain.exponentialRampToValueAtTime(0.001, when + len);
    src.connect(filter).connect(g).connect(masterGain);
    src.start(when);
    src.stop(when + len);
  }

  function playKick(when) {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(110, when);
    osc.frequency.exponentialRampToValueAtTime(40, when + 0.15);
    g.gain.setValueAtTime(0.25, when);
    g.gain.exponentialRampToValueAtTime(0.001, when + 0.2);
    osc.connect(g).connect(masterGain);
    osc.start(when);
    osc.stop(when + 0.22);
  }

  let lastMelodyIdx = -1;

  function scheduleStep() {
    const chordIdx = Math.floor(beatCount / STEPS_PER_CHORD) % CHORDS.length;
    const stepInChord = beatCount % STEPS_PER_CHORD;
    const chord = CHORDS[chordIdx];
    const t = nextNoteTime;

    // Pad on chord change
    if (stepInChord === 0) {
      const chordDur = SEC_PER_STEP * STEPS_PER_CHORD;
      chord.tones.forEach((f) => playPad(f, chordDur, t));
      playBass(chord.tones[0], SEC_PER_STEP * 4, t);
    }
    // Bass on beat 5 too (halfway)
    if (stepInChord === 4) {
      playBass(chord.tones[0], SEC_PER_STEP * 4, t);
    }

    // Drum pattern: kick on 0,4 ; hat on offbeats (1,3,5,7)
    if (stepInChord === 0 || stepInChord === 4) playKick(t);
    if (stepInChord % 2 === 1) playHat(t);

    // Melody — sparse, avoid same note repeats, slight phrasing variation
    if (Math.random() < 0.5 && stepInChord !== 0) {
      const scale = chord.melody;
      let i = Math.floor(Math.random() * scale.length);
      if (i === lastMelodyIdx) i = (i + 1) % scale.length;
      lastMelodyIdx = i;
      const note = scale[i];
      const dur = stepInChord === 7 ? SEC_PER_STEP * 0.9 : SEC_PER_STEP * 1.7;
      playMelody(note, dur, t);
    }

    nextNoteTime += SEC_PER_STEP;
    beatCount++;
  }

  function tick() {
    if (!ctx || !isPlaying) return;
    while (nextNoteTime < ctx.currentTime + 0.25) scheduleStep();
  }

  function start() {
    ensureCtx();
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume();
    if (isPlaying) return;
    isPlaying = true;
    nextNoteTime = ctx.currentTime + 0.1;
    beatCount = 0;
    masterGain.gain.cancelScheduledValues(ctx.currentTime);
    masterGain.gain.setValueAtTime(0, ctx.currentTime);
    masterGain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 1.2);
    scheduler = setInterval(tick, 60);
    try { localStorage.setItem(KEY, '1'); } catch (e) { /* ignore */ }
  }

  function stop() {
    if (!isPlaying) return;
    isPlaying = false;
    if (ctx && masterGain) {
      masterGain.gain.cancelScheduledValues(ctx.currentTime);
      masterGain.gain.setValueAtTime(masterGain.gain.value, ctx.currentTime);
      masterGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.6);
    }
    clearInterval(scheduler);
    scheduler = null;
    try { localStorage.setItem(KEY, '0'); } catch (e) { /* ignore */ }
  }

  function toggle() {
    if (isPlaying) stop(); else start();
    return isPlaying;
  }

  function setVolume(v) {
    volume = Math.max(0, Math.min(1, v));
    try { localStorage.setItem(VOL_KEY, String(volume)); } catch (e) { /* ignore */ }
    if (ctx && masterGain && isPlaying) {
      masterGain.gain.cancelScheduledValues(ctx.currentTime);
      masterGain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.15);
    }
  }

  function getVolume() { return volume; }
  function isOn() { return isPlaying; }
  function wasOn() {
    try { return localStorage.getItem(KEY) === '1'; }
    catch (e) { return false; }
  }

  window.BGM = { start, stop, toggle, isOn, wasOn, setVolume, getVolume };
})();
