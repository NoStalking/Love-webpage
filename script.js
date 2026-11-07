/**
 * A + D | 6 MONTHS ANNIVERSARY - ROMANTIC EXPERIENCE
 * Interactive logic: Particles, Web Audio Synth, Padlock, Draggable Polaroids, Finale
 */

document.addEventListener('DOMContentLoaded', () => {

  // =========================================================================
  // 1. CONFIGURATION & STATE
  // =========================================================================
  const CONFIG = {
    PASSCODE: '1201', // November 17 (17.11) - 6 months anniversary date
    COUNTDOWN_SECONDS: 5,
    AUTOPLAY_ATTEMPT: true,
    // TELEGRAM BOT CONFIGURATION FOR HER VOICE NOTES
    TELEGRAM_BOT_TOKEN: '9256969705:AAHO6zpWtuvJpXBxusPdmPtDRR1Gxh-oHDc',
    TELEGRAM_CHAT_ID: '8639377699'
  };

  const STATE = {
    isMusicPlaying: false,
    giftOpened: false,
    isUnlocked: false,
    currentPasscode: '',
    draggedCard: null,
    highestZIndex: 30,
    loveMapInitialized: false
  };

  // DOM Elements
  const body = document.body;
  const musicToggle = document.getElementById('music-toggle');
  const giftBox = document.getElementById('gift-box');
  const giftWrapper = document.getElementById('gift-box-wrapper');
  const openedCard = document.getElementById('opened-card');
  const sceneLock = document.getElementById('scene-lock');
  const padlock = document.getElementById('padlock');
  const keypad = document.getElementById('keypad');
  const passcodeDisplay = document.getElementById('passcode-display');
  const slots = passcodeDisplay.querySelectorAll('.slot');
  const lockMessage = document.getElementById('lock-message');
  const btnHint = document.getElementById('btn-hint');
  const hintPopup = document.getElementById('hint-popup');
  const btnBackspace = document.getElementById('btn-backspace');
  const sceneGallery = document.getElementById('scene-gallery');
  const sceneReasonsJar = document.getElementById('scene-reasons-jar');
  const polaroidCards = document.querySelectorAll('.polaroid-card');
  const btnOpenLetter = document.getElementById('btn-open-letter');
  const sceneLetter = document.getElementById('scene-letter');
  const btnILoveYou = document.getElementById('btn-i-love-you');
  const finaleOverlay = document.getElementById('finale-overlay');
  const countdownNumber = document.getElementById('countdown-number');
  const closedScreen = document.getElementById('closed-screen');
  const btnReplay = document.getElementById('btn-replay');
  const touchContainer = document.getElementById('touch-effects-container');

  // Live Timer DOM Elements
  const cntDays = document.getElementById('cnt-days');
  const cntHours = document.getElementById('cnt-hours');
  const cntMinutes = document.getElementById('cnt-minutes');
  const cntSeconds = document.getElementById('cnt-seconds');

  // =========================================================================
  // 2. SYNTHESIZED AUDIO SYSTEM (WEB AUDIO API)
  // No external mp3 files needed - 100% reliable, zero network latency!
  // =========================================================================
  let audioCtx = null;
  let ambientMelodyTimer = null;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // Play a soft sweet tone with envelope
  function playNote(freq, type = 'sine', duration = 0.5, volume = 0.15) {
    if (!audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(volume, audioCtx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // Audio autoplay policy fallback
    }
  }

  // Sound Effects
  const SOUNDS = {
    giftOpen() {
      if (!audioCtx) return;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((n, i) => {
        setTimeout(() => playNote(n, 'triangle', 0.8, 0.12), i * 110);
      });
    },
    clickKey() {
      playNote(784, 'sine', 0.08, 0.06);
      if (navigator.vibrate) navigator.vibrate(15);
    },
    keyError() {
      if (!audioCtx) return;
      playNote(220, 'sawtooth', 0.25, 0.1);
      setTimeout(() => playNote(196, 'sawtooth', 0.35, 0.1), 120);
      if (navigator.vibrate) navigator.vibrate([40, 60, 40]);
    },
    lockSuccess() {
      if (!audioCtx) return;
      const notes = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5
      notes.forEach((n, i) => {
        setTimeout(() => playNote(n, 'sine', 0.7, 0.12), i * 130);
      });
      if (navigator.vibrate) navigator.vibrate([50, 100, 150]);
    },
    loveExplosion() {
      if (!audioCtx) return;
      // Grand warm chord
      const chord = [261.63, 329.63, 392.00, 523.25, 659.25];
      chord.forEach((n) => playNote(n, 'triangle', 2.5, 0.1));
      if (navigator.vibrate) navigator.vibrate([100, 100, 200, 100, 300]);
    },
    paperUnfold() {
      if (!audioCtx) return;
      // Delicate paper rustle / chime sound
      const notes = [659.25, 783.99, 987.77, 1318.51]; // E5, G5, B5, E6
      notes.forEach((n, i) => {
        setTimeout(() => playNote(n, 'sine', 0.5, 0.08), i * 70);
      });
      if (navigator.vibrate) navigator.vibrate([25, 40]);
    }
  };

  // Romantic Ambient Synth Melody Loop (Soft Kalimba / Music Box style)
  const ROMANTIC_MELODY = [
    { note: 392.00, dur: 0.6 }, // G4
    { note: 440.00, dur: 0.6 }, // A4
    { note: 523.25, dur: 1.2 }, // C5
    { note: 493.88, dur: 0.8 }, // B4
    { note: 392.00, dur: 0.8 }, // G4
    { note: 329.63, dur: 1.2 }, // E4
    { note: 349.23, dur: 0.6 }, // F4
    { note: 392.00, dur: 0.6 }, // G4
    { note: 440.00, dur: 1.2 }, // A4
    { note: 392.00, dur: 0.8 }, // G4
    { note: 329.63, dur: 0.8 }, // E4
    { note: 261.63, dur: 1.5 }, // C4
  ];

  let melodyIndex = 0;
  function scheduleNextNote() {
    if (!STATE.isMusicPlaying) return;
    const current = ROMANTIC_MELODY[melodyIndex];
    playNote(current.note, 'sine', current.dur, 0.08);
    // Harmonize with soft bass octave
    if (melodyIndex % 3 === 0) {
      playNote(current.note / 2, 'triangle', current.dur * 1.5, 0.04);
    }
    melodyIndex = (melodyIndex + 1) % ROMANTIC_MELODY.length;
    ambientMelodyTimer = setTimeout(scheduleNextNote, current.dur * 1000 * 0.95);
  }

  function toggleMusic() {
    initAudio();
    STATE.isMusicPlaying = !STATE.isMusicPlaying;
    if (STATE.isMusicPlaying) {
      musicToggle.classList.add('playing');
      musicToggle.querySelector('.music-label').textContent = 'Playing ♪';
      scheduleNextNote();
    } else {
      musicToggle.classList.remove('playing');
      musicToggle.querySelector('.music-label').textContent = 'Music';
      clearTimeout(ambientMelodyTimer);
    }
  }

  musicToggle.addEventListener('click', toggleMusic);

  // =========================================================================
  // 3. AMBIENT CANVAS (ROSE PETALS & FLOATING GLOWING HEARTS)
  // =========================================================================
  const canvas = document.getElementById('ambient-canvas');
  const ctx = canvas.getContext('2d');
  let width, height;
  const particles = [];
  const MAX_PARTICLES = window.innerWidth < 600 ? 28 : 45;

  function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  class RomanticParticle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.type = Math.random() > 0.4 ? 'petal' : 'heart';
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : -20;
      this.size = this.type === 'petal' ? (Math.random() * 9 + 8) : (Math.random() * 12 + 10);
      this.speedY = Math.random() * 1.2 + 0.6;
      this.speedX = Math.random() * 1.2 - 0.6;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.03;
      this.tilt = Math.random() * Math.PI;
      this.tiltSpeed = Math.random() * 0.04 + 0.01;
      this.opacity = Math.random() * 0.45 + 0.35;

      // Petal colors: soft rose, velvet ruby, blush pink
      const petalColors = ['#ff4d6d', '#ff758f', '#ffb3c1', '#c9184a'];
      this.color = petalColors[Math.floor(Math.random() * petalColors.length)];
    }

    update() {
      this.y += this.speedY;
      this.x += Math.sin(this.tilt) * 0.9 + this.speedX;
      this.rotation += this.rotSpeed;
      this.tilt += this.tiltSpeed;

      if (this.y > height + 30 || this.x < -30 || this.x > width + 30) {
        this.reset(false);
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.scale(Math.cos(this.tilt), 1);
      ctx.globalAlpha = this.opacity;

      if (this.type === 'petal') {
        // Draw elegant rose petal
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-this.size / 2, -this.size / 2, -this.size, this.size / 3, 0, this.size);
        ctx.bezierCurveTo(this.size, this.size / 3, this.size / 2, -this.size / 2, 0, 0);
        ctx.fill();
      } else {
        // Draw floating heart
        ctx.fillStyle = this.color;
        ctx.font = `${this.size}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('❤️', 0, 0);
      }

      ctx.restore();
    }
  }

  for (let i = 0; i < MAX_PARTICLES; i++) {
    particles.push(new RomanticParticle());
  }

  function animateParticles() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    requestAnimationFrame(animateParticles);
  }
  animateParticles();

  // =========================================================================
  // 4. SCREEN TAP INTERACTIVE BURSTS
  // =========================================================================
  function spawnTapHeart(x, y) {
    const heart = document.createElement('div');
    heart.className = 'tap-heart';
    const hearts = ['❤️', '💖', '✨', '💕', '🌹'];
    heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;
    heart.style.setProperty('--angle', `${(Math.random() - 0.5) * 50}deg`);
    touchContainer.appendChild(heart);

    setTimeout(() => {
      heart.remove();
    }, 1200);
  }

  window.addEventListener('click', (e) => {
    // Avoid double spawning on key/btn clicks
    if (e.target.closest('button') || e.target.closest('.key-btn')) return;
    spawnTapHeart(e.clientX, e.clientY);
  });

  window.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    if (e.target.closest('button') || e.target.closest('.key-btn')) return;
    spawnTapHeart(touch.clientX, touch.clientY);
  }, { passive: true });

  // =========================================================================
  // 5. SCENE 1: THE FALLING GIFT BOX (A + D)
  // =========================================================================
  function openGift() {
    if (STATE.giftOpened) return;
    STATE.giftOpened = true;

    initAudio();
    SOUNDS.giftOpen();

    // Trigger opening animation on the gift
    giftWrapper.classList.add('opened');

    // Confetti / sparkle explosion around gift
    const rect = giftBox.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    for (let i = 0; i < 20; i++) {
      setTimeout(() => {
        spawnTapHeart(centerX + (Math.random() - 0.5) * 160, centerY + (Math.random() - 0.5) * 160);
      }, i * 35);
    }

    // Reveal the opened greeting card
    setTimeout(() => {
      openedCard.classList.remove('hidden');
      requestAnimationFrame(() => {
        openedCard.classList.add('visible');
      });

      // UNLOCK PAGE SCROLL (After opening gift)
      body.classList.remove('scroll-locked');

      // Auto start music softly on first interaction if not yet started
      if (!STATE.isMusicPlaying) {
        toggleMusic();
      }
    }, 450);
  }

  giftBox.addEventListener('click', openGift);
  giftBox.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      openGift();
    }
  });

  // =========================================================================
  // 6. SCENE 2: THE ROMANTIC PADLOCK
  // =========================================================================
  function updateSlots() {
    slots.forEach((slot, index) => {
      if (index < STATE.currentPasscode.length) {
        slot.classList.add('filled');
      } else {
        slot.classList.remove('filled');
      }
    });
  }

  function handleKeypadInput(key) {
    if (STATE.isUnlocked) return;
    initAudio();

    if (STATE.currentPasscode.length < 4) {
      STATE.currentPasscode += key;
      SOUNDS.clickKey();
      updateSlots();

      if (STATE.currentPasscode.length === 4) {
        verifyPasscode();
      }
    }
  }

  function handleBackspace() {
    if (STATE.isUnlocked || STATE.currentPasscode.length === 0) return;
    initAudio();
    SOUNDS.clickKey();
    STATE.currentPasscode = STATE.currentPasscode.slice(0, -1);
    updateSlots();
    passcodeDisplay.classList.remove('error');
    lockMessage.textContent = 'Enter the 4-digit date';
  }

  function verifyPasscode() {
    if (STATE.currentPasscode === CONFIG.PASSCODE) {
      // SUCCESS!
      STATE.isUnlocked = true;
      SOUNDS.lockSuccess();

      lockMessage.innerHTML = '✨ <strong>Code correct! Lock opened ❤️</strong>';
      lockMessage.style.color = '#ffd166';
      padlock.classList.add('unlocked');

      // Padlock Sparkles
      const rect = padlock.getBoundingClientRect();
      for (let i = 0; i < 15; i++) {
        setTimeout(() => {
          spawnTapHeart(rect.left + rect.width / 2 + (Math.random() - 0.5) * 100, rect.top + (Math.random() - 0.5) * 80);
        }, i * 40);
      }

      // Unlock Gallery Scene & Reasons Jar Scene
      setTimeout(() => {
        sceneGallery.classList.remove('hidden-until-unlocked');
        if (sceneReasonsJar) {
          sceneReasonsJar.classList.remove('hidden-until-unlocked');
        }
        sceneGallery.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // Initialize or refresh interactive distance map
        setTimeout(() => {
          initLoveMap();
        }, 500);
      }, 900);

    } else {
      // WRONG CODE
      SOUNDS.keyError();
      passcodeDisplay.classList.add('error');
      lockMessage.textContent = 'Try again, my love 💖';
      lockMessage.style.color = '#ff4d6d';

      setTimeout(() => {
        STATE.currentPasscode = '';
        updateSlots();
        passcodeDisplay.classList.remove('error');
      }, 700);
    }
  }

  // Keypad event delegation
  keypad.addEventListener('click', (e) => {
    const keyBtn = e.target.closest('.key-btn');
    if (!keyBtn) return;

    const key = keyBtn.getAttribute('data-key');
    if (key !== null) {
      handleKeypadInput(key);
    }
  });

  btnBackspace.addEventListener('click', handleBackspace);

  btnHint.addEventListener('click', () => {
    initAudio();
    SOUNDS.clickKey();
    hintPopup.classList.toggle('hidden');
  });

  // Keyboard support for desktop
  window.addEventListener('keydown', (e) => {
    if (STATE.isUnlocked) return;
    if (e.key >= '0' && e.key <= '9') {
      handleKeypadInput(e.key);
    } else if (e.key === 'Backspace') {
      handleBackspace();
    }
  });

  // =========================================================================
  // 7. SCENE 3: SCATTERED POLAROIDS INTERACTION & PHOTO LIGHTBOX
  // =========================================================================
  const photoModal = document.getElementById('photo-modal');
  const modalImg = document.getElementById('modal-img');
  const modalCaption = document.getElementById('modal-caption');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalBackdrop = document.getElementById('modal-backdrop');

  function openPhotoModal(src, captionText) {
    if (!photoModal || !modalImg) return;
    initAudio();
    SOUNDS.giftOpen();

    modalImg.src = src;
    if (modalCaption) {
      modalCaption.textContent = captionText || '';
    }

    photoModal.classList.remove('hidden');
    photoModal.setAttribute('aria-hidden', 'false');
    requestAnimationFrame(() => {
      photoModal.classList.add('active');
    });
  }

  function closePhotoModal() {
    if (!photoModal) return;
    photoModal.classList.remove('active');
    photoModal.setAttribute('aria-hidden', 'true');
    setTimeout(() => {
      photoModal.classList.add('hidden');
      if (modalImg) modalImg.src = '';
    }, 350);
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closePhotoModal();
    });
  }

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', closePhotoModal);
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && photoModal && photoModal.classList.contains('active')) {
      closePhotoModal();
    }
  });

  polaroidCards.forEach((card) => {
    let wasDragged = false;

    // Tap or click brings card to front and opens zoomed modal
    card.addEventListener('click', (e) => {
      if (wasDragged) {
        wasDragged = false;
        return;
      }

      STATE.highestZIndex += 1;
      card.style.zIndex = STATE.highestZIndex;

      // Toggle active state
      polaroidCards.forEach(c => c.classList.remove('is-active'));
      card.classList.add('is-active');

      // Spawn small celebratory heart at card position
      const rect = card.getBoundingClientRect();
      spawnTapHeart(rect.left + rect.width / 2, rect.top + 30);

      // Open in full-screen zoom modal
      const img = card.querySelector('img');
      const caption = card.querySelector('.polaroid-text');
      if (img && img.src) {
        openPhotoModal(img.src, caption ? caption.textContent : '');
      }
    });

    // Desktop dragging support
    card.addEventListener('mousedown', (e) => {
      if (window.innerWidth < 640) return; // on mobile, prefer tap & natural scroll
      STATE.highestZIndex += 1;
      card.style.zIndex = STATE.highestZIndex;

      let hasMoved = false;
      const startX = e.clientX;
      const startY = e.clientY;
      const startLeft = parseFloat(card.style.left) || 0;
      const startTop = parseFloat(card.style.top) || 0;

      function onMouseMove(moveEvent) {
        const dx = moveEvent.clientX - startX;
        const dy = moveEvent.clientY - startY;
        if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
          hasMoved = true;
          wasDragged = true;
          card.style.left = `${startLeft + dx}px`;
          card.style.top = `${startTop + dy}px`;
          card.style.transform = 'rotate(0deg) scale(1.05)';
        }
      }

      function onMouseUp() {
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
        if (hasMoved) {
          setTimeout(() => { wasDragged = false; }, 100);
        }
      }

      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    });
  });

  // =========================================================================
  // JAR OF REASONS WHY I LOVE YOU (25 FRESH ROMANTIC REASONS)
  // Completely unique from the final notebook letter to preserve surprise!
  // =========================================================================
  const LOVE_REASONS = [
    "Because hearing your voice is my favorite sound in the whole world 🎶",
    "Because you make ordinary moments feel like something straight out of a movie ✨",
    "Because you support my dreams and make me believe I can achieve anything 🚀",
    "Because of your pure, genuine laugh that instantly brightens my whole day 🌸",
    "Because when I think of my future, you are the first person I see in it 💍",
    "Because you always know how to make me laugh when I least expect it 😂",
    "Because your sweet \"good morning\" message is the highlight of my start to the day ☀️",
    "Because simply holding your virtual hand gives me total peace of mind 🫂",
    "Because you have the kindest, most radiant heart I have ever known 💖",
    "Because with you, even complete silence feels comfortable and warm ☕",
    "Because you inspire me every single day to become the best version of myself 🌟",
    "Because of the sparkle in your eyes that outshines all the stars in the night sky 🌌",
    "Because you are not only my beloved girlfriend, but my absolute best friend 🤍",
    "Because of your sweet sense of humor that always matches mine perfectly 💫",
    "Because your hugs — even sent through the phone — feel warmer than anything else 🧸",
    "Because you notice and appreciate even the smallest little efforts I make 🌷",
    "Because seeing your name appear on my notification screen gives me butterflies every single time 🦋",
    "Because you make me feel safe, understood, and truly valued ❤️",
    "Because you love me for who I truly am, with all my imperfections 🕊️",
    "Because every song I listen to now reminds me of you 🎧",
    "Because of the gentle and soft way you say my name 🍯",
    "Because you make distance feel so small compared to what we share 🌎",
    "Because just knowing you are mine makes me feel like the luckiest guy alive 🍀",
    "Because every new day with you feels like a brand-new blessing 🌅",
    "Because my heart chose you, and it will keep choosing you every single day ❤️"
  ];

  let unreadReasons = [...LOVE_REASONS];
  let openedReasonsCount = 0;

  const loveJarContainer = document.getElementById('love-jar-container');
  const btnDrawReason = document.getElementById('btn-draw-reason');
  const reasonModal = document.getElementById('reason-modal');
  const reasonBackdrop = document.getElementById('reason-backdrop');
  const reasonCloseBtn = document.getElementById('reason-close-btn');
  const modalReasonNumber = document.getElementById('modal-reason-number');
  const modalReasonText = document.getElementById('modal-reason-text');
  const btnNextReason = document.getElementById('btn-next-reason');
  const openedReasonsCountEl = document.getElementById('opened-reasons-count');
  const totalReasonsCountEl = document.getElementById('total-reasons-count');

  if (totalReasonsCountEl) {
    totalReasonsCountEl.textContent = LOVE_REASONS.length;
  }

  function drawLoveReason() {
    initAudio();
    SOUNDS.paperUnfold();

    if (loveJarContainer) {
      loveJarContainer.classList.add('jar-shake');
      setTimeout(() => loveJarContainer.classList.remove('jar-shake'), 600);
    }

    // Pick a reason
    if (unreadReasons.length === 0) {
      unreadReasons = [...LOVE_REASONS]; // cycle through after all opened
    }

    const randomIndex = Math.floor(Math.random() * unreadReasons.length);
    const chosenReason = unreadReasons.splice(randomIndex, 1)[0];
    const reasonIndex = LOVE_REASONS.indexOf(chosenReason) + 1;

    if (openedReasonsCount < LOVE_REASONS.length) {
      openedReasonsCount++;
      if (openedReasonsCountEl) {
        openedReasonsCountEl.textContent = openedReasonsCount;
      }
    }

    // Set modal content
    if (modalReasonNumber) {
      modalReasonNumber.textContent = `Reason #${reasonIndex}`;
    }
    if (modalReasonText) {
      modalReasonText.innerHTML = chosenReason;
    }

    // Spawn tiny festive heart bursts around the jar
    if (loveJarContainer) {
      const rect = loveJarContainer.getBoundingClientRect();
      for (let i = 0; i < 6; i++) {
        setTimeout(() => {
          spawnTapHeart(rect.left + rect.width / 2 + (Math.random() - 0.5) * 60, rect.top + rect.height / 2 + (Math.random() - 0.5) * 60);
        }, i * 60);
      }
    }

    // Open Modal
    if (reasonModal) {
      reasonModal.classList.remove('hidden');
      reasonModal.setAttribute('aria-hidden', 'false');
    }
  }

  function closeReasonModal() {
    if (reasonModal) {
      reasonModal.classList.add('hidden');
      reasonModal.setAttribute('aria-hidden', 'true');
    }
  }

  if (loveJarContainer) {
    loveJarContainer.addEventListener('click', drawLoveReason);
  }
  if (btnDrawReason) {
    btnDrawReason.addEventListener('click', drawLoveReason);
  }
  if (btnNextReason) {
    btnNextReason.addEventListener('click', drawLoveReason);
  }
  if (reasonCloseBtn) {
    reasonCloseBtn.addEventListener('click', closeReasonModal);
  }
  if (reasonBackdrop) {
    reasonBackdrop.addEventListener('click', closeReasonModal);
  }

  // Keyboard Escape for reason modal
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && reasonModal && !reasonModal.classList.contains('hidden')) {
      closeReasonModal();
    }
  });

  // "I have something to tell you" Button Click
  btnOpenLetter.addEventListener('click', () => {
    initAudio();
    SOUNDS.giftOpen();
    sceneLetter.classList.remove('hidden-until-requested');

    // Smoothly scroll down to the huge realistic notebook letter
    setTimeout(() => {
      sceneLetter.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
  });

  // =========================================================================
  // LIVE TIMER (COUNTING FROM MAY 17)
  // =========================================================================
  function initLiveTimer() {
    function getMay17StartDate() {
      const now = new Date();
      let year = now.getFullYear();
      if (now.getMonth() < 4) { // Before May
        year -= 1;
      }
      return new Date(year, 4, 17, 0, 0, 0);
    }

    const startDate = getMay17StartDate();

    function updateCounter() {
      const now = new Date();
      const diffMs = Math.max(0, now - startDate);

      const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diffMs / (1000 * 60)) % 60);
      const seconds = Math.floor((diffMs / 1000) % 60);

      if (cntDays) cntDays.textContent = String(days).padStart(2, '0');
      if (cntHours) cntHours.textContent = String(hours).padStart(2, '0');
      if (cntMinutes) cntMinutes.textContent = String(minutes).padStart(2, '0');
      if (cntSeconds) cntSeconds.textContent = String(seconds).padStart(2, '0');
    }

    updateCounter();
    setInterval(updateCounter, 1000);
  }
  initLiveTimer();

  // =========================================================================
  // INTERACTIVE DISTANCE MAP (LEAFLET + CARTODB DARK)
  // Her: 40°13'54.6"N 69°16'13.5"E (40.231833, 69.270417)
  // Him: 41°20'22.9"N 69°13'54.0"E (41.339694, 69.231667)
  // =========================================================================
  const HER_COORDS = [40.231833, 69.270417];
  const HIM_COORDS = [41.339694, 69.231667];
  let loveMapInstance = null;

  function initLoveMap() {
    if (STATE.loveMapInitialized) {
      if (loveMapInstance) {
        loveMapInstance.invalidateSize();
      }
      return;
    }

    const mapContainer = document.getElementById('love-map');
    if (!mapContainer || typeof L === 'undefined') return;

    try {
      STATE.loveMapInitialized = true;

      const centerLat = (HER_COORDS[0] + HIM_COORDS[0]) / 2;
      const centerLon = (HER_COORDS[1] + HIM_COORDS[1]) / 2;

      loveMapInstance = L.map('love-map', {
        center: [centerLat, centerLon],
        zoom: 8,
        zoomControl: true,
        attributionControl: true,
        scrollWheelZoom: false
      });

      // Free OpenStreetMap Tiles (Works 100% without any API key or restrictions)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 18
      }).addTo(loveMapInstance);

      // Custom marker for Her (D)
      const iconHer = L.divIcon({
        className: 'love-custom-marker-wrapper',
        html: `
          <div class="love-custom-marker">
            <div class="marker-pin marker-pin-d">
              <div class="marker-pulse-ring"></div>
              <span class="marker-initial">D</span>
            </div>
            <div class="marker-tag-popup">Dilnura 💖</div>
          </div>
        `,
        iconSize: [40, 58],
        iconAnchor: [20, 36],
        popupAnchor: [0, -36]
      });

      // Custom marker for Him (A)
      const iconHim = L.divIcon({
        className: 'love-custom-marker-wrapper',
        html: `
          <div class="love-custom-marker">
            <div class="marker-pin marker-pin-a">
              <div class="marker-pulse-ring"></div>
              <span class="marker-initial">A</span>
            </div>
            <div class="marker-tag-popup">Asliddin 💙</div>
          </div>
        `,
        iconSize: [40, 58],
        iconAnchor: [20, 36],
        popupAnchor: [0, -36]
      });

      const markerHer = L.marker(HER_COORDS, { icon: iconHer }).addTo(loveMapInstance);
      markerHer.bindPopup("<b>D (My Universe) 💖</b><br>40°13'54.6\"N, 69°16'13.5\"E<br><i>Where all my thoughts fly every single night</i>");

      const markerHim = L.marker(HIM_COORDS, { icon: iconHim }).addTo(loveMapInstance);
      markerHim.bindPopup("<b>A (Forever Yours) 💙</b><br>41°20'22.9\"N, 69°13'54.0\"E<br><i>Counting down the moments until we meet</i>");

      // Glowing dashed flight path connecting the two coordinates
      L.polyline([HER_COORDS, HIM_COORDS], {
        color: '#ff4d6d',
        weight: 4,
        opacity: 0.85,
        dashArray: '8, 8',
        lineCap: 'round'
      }).addTo(loveMapInstance);

      // Fit bounds with comfortable padding
      loveMapInstance.fitBounds([HER_COORDS, HIM_COORDS], {
        padding: [45, 45]
      });

      // Traveling heart along the distance line
      const heartIcon = L.divIcon({
        className: 'traveling-heart',
        html: '<span style="font-size: 20px; filter: drop-shadow(0 0 6px #ff4d6d); display: inline-block;">❤️</span>',
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      const travelingHeartMarker = L.marker(HER_COORDS, { icon: heartIcon }).addTo(loveMapInstance);

      let progress = 0;
      let direction = 1;
      function animateTravelingHeart() {
        progress += 0.004 * direction;
        if (progress >= 1) {
          progress = 1;
          direction = -1;
        } else if (progress <= 0) {
          progress = 0;
          direction = 1;
        }

        const currentLat = HER_COORDS[0] + (HIM_COORDS[0] - HER_COORDS[0]) * progress;
        const currentLon = HER_COORDS[1] + (HIM_COORDS[1] - HER_COORDS[1]) * progress;
        travelingHeartMarker.setLatLng([currentLat, currentLon]);

        requestAnimationFrame(animateTravelingHeart);
      }
      animateTravelingHeart();

    } catch (e) {
      console.warn("Map initialization info:", e);
    }
  }

  window.addEventListener('resize', () => {
    if (loveMapInstance) {
      loveMapInstance.invalidateSize();
    }
  });

  // =========================================================================
  // NIGHT SKY & CONSTELLATION CANVAS (MAY 17 NIGHT SKY)
  // =========================================================================
  function initNightSky() {
    const skyCanvas = document.getElementById('constellation-canvas');
    if (!skyCanvas) return;
    const sCtx = skyCanvas.getContext('2d');
    let sW, sH;

    function resizeSky() {
      const rect = skyCanvas.parentElement.getBoundingClientRect();
      sW = skyCanvas.width = rect.width || 400;
      sH = skyCanvas.height = rect.height || 290;
    }
    window.addEventListener('resize', resizeSky);
    resizeSky();

    // Generate accurate aesthetic starry sky
    const backgroundStars = [];
    for (let i = 0; i < 90; i++) {
      backgroundStars.push({
        x: Math.random(),
        y: Math.random(),
        r: Math.random() * 1.6 + 0.3,
        baseAlpha: Math.random() * 0.6 + 0.2,
        twinkleSpeed: Math.random() * 0.04 + 0.015,
        phase: Math.random() * Math.PI * 2,
        color: Math.random() > 0.8 ? '#ffd166' : (Math.random() > 0.6 ? '#ffb3c1' : '#ffffff')
      });
    }

    // Constellations in Spring/May sky: Ursa Major (Big Dipper) & Corona Borealis (The Northern Crown / Romantic Garland)
    // Normalized coordinates (0 to 1)
    const bigDipper = [
      { x: 0.16, y: 0.22, name: 'Alkaid' },
      { x: 0.23, y: 0.27, name: 'Mizar' },
      { x: 0.28, y: 0.33, name: 'Alioth' },
      { x: 0.37, y: 0.37, name: 'Megrez' },
      { x: 0.45, y: 0.34, name: 'Dubhe' },
      { x: 0.44, y: 0.48, name: 'Merak' },
      { x: 0.36, y: 0.49, name: 'Phecda' }
    ];
    const bigDipperLines = [
      [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 3]
    ];

    // Corona Borealis (Heart-shaped Crown of Love)
    const crownOfLove = [
      { x: 0.66, y: 0.46 },
      { x: 0.72, y: 0.36 },
      { x: 0.79, y: 0.30, main: true, name: 'Alphecca (Gemma)' }, // Bright gem
      { x: 0.86, y: 0.34 },
      { x: 0.91, y: 0.43 },
      { x: 0.89, y: 0.52 },
      { x: 0.80, y: 0.58 }
    ];
    const crownLines = [
      [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6]
    ];

    // Mouse interactive sparkle
    let mouse = { x: -100, y: -100, active: false };
    skyCanvas.addEventListener('mousemove', (e) => {
      const rect = skyCanvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    });
    skyCanvas.addEventListener('mouseleave', () => { mouse.active = false; });
    skyCanvas.addEventListener('touchstart', (e) => {
      const rect = skyCanvas.getBoundingClientRect();
      const t = e.touches[0];
      mouse.x = t.clientX - rect.left;
      mouse.y = t.clientY - rect.top;
      mouse.active = true;
    }, { passive: true });

    // Shooting stars
    const shootingStars = [];
    function maybeSpawnShootingStar() {
      if (Math.random() < 0.015 && shootingStars.length < 2) {
        shootingStars.push({
          x: Math.random() * sW * 0.7 + sW * 0.1,
          y: Math.random() * sH * 0.4,
          len: Math.random() * 80 + 50,
          speed: Math.random() * 8 + 6,
          angle: Math.PI / 4 + (Math.random() - 0.5) * 0.2,
          alpha: 1,
          decay: 0.02
        });
      }
    }

    let frame = 0;
    function renderSky() {
      frame++;
      sCtx.clearRect(0, 0, sW, sH);

      // Background ambient galactic nebula glow
      const nebGrad = sCtx.createRadialGradient(sW * 0.78, sH * 0.32, 10, sW * 0.78, sH * 0.32, 160);
      nebGrad.addColorStop(0, 'rgba(255, 77, 109, 0.14)');
      nebGrad.addColorStop(0.5, 'rgba(114, 9, 183, 0.08)');
      nebGrad.addColorStop(1, 'transparent');
      sCtx.fillStyle = nebGrad;
      sCtx.fillRect(0, 0, sW, sH);

      // Draw background stars
      backgroundStars.forEach(st => {
        st.phase += st.twinkleSpeed;
        const currentAlpha = st.baseAlpha + Math.sin(st.phase) * 0.35;
        sCtx.fillStyle = st.color;
        sCtx.globalAlpha = Math.max(0.1, Math.min(1, currentAlpha));
        sCtx.beginPath();
        sCtx.arc(st.x * sW, st.y * sH, st.r, 0, Math.PI * 2);
        sCtx.fill();
      });
      sCtx.globalAlpha = 1;

      // Draw Big Dipper lines
      sCtx.strokeStyle = 'rgba(255, 209, 102, 0.35)';
      sCtx.lineWidth = 1.2;
      sCtx.setLineDash([3, 3]);
      bigDipperLines.forEach(([i1, i2]) => {
        const p1 = bigDipper[i1];
        const p2 = bigDipper[i2];
        sCtx.beginPath();
        sCtx.moveTo(p1.x * sW, p1.y * sH);
        sCtx.lineTo(p2.x * sW, p2.y * sH);
        sCtx.stroke();
      });

      // Draw Corona Borealis (Crown of Love) lines
      sCtx.strokeStyle = 'rgba(255, 117, 143, 0.45)';
      sCtx.lineWidth = 1.4;
      sCtx.setLineDash([4, 4]);
      crownLines.forEach(([i1, i2]) => {
        const p1 = crownOfLove[i1];
        const p2 = crownOfLove[i2];
        sCtx.beginPath();
        sCtx.moveTo(p1.x * sW, p1.y * sH);
        sCtx.lineTo(p2.x * sW, p2.y * sH);
        sCtx.stroke();
      });
      sCtx.setLineDash([]);

      // Draw constellation star nodes
      function drawConstellationNodes(starsList, color) {
        starsList.forEach(st => {
          const sx = st.x * sW;
          const sy = st.y * sH;

          // Star glow
          const glow = sCtx.createRadialGradient(sx, sy, 0, sx, sy, st.main ? 14 : 8);
          glow.addColorStop(0, color);
          glow.addColorStop(1, 'transparent');
          sCtx.fillStyle = glow;
          sCtx.beginPath();
          sCtx.arc(sx, sy, st.main ? 14 : 8, 0, Math.PI * 2);
          sCtx.fill();

          // Star core
          sCtx.fillStyle = '#ffffff';
          sCtx.beginPath();
          sCtx.arc(sx, sy, st.main ? 3.5 : 2.2, 0, Math.PI * 2);
          sCtx.fill();

          // Sparkle spikes on main gem star
          if (st.main) {
            sCtx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
            sCtx.lineWidth = 1;
            const spikeLen = 8 + Math.sin(frame * 0.08) * 3;
            sCtx.beginPath();
            sCtx.moveTo(sx - spikeLen, sy);
            sCtx.lineTo(sx + spikeLen, sy);
            sCtx.moveTo(sx, sy - spikeLen);
            sCtx.lineTo(sx, sy + spikeLen);
            sCtx.stroke();
          }
        });
      }

      drawConstellationNodes(bigDipper, 'rgba(255, 209, 102, 0.6)');
      drawConstellationNodes(crownOfLove, 'rgba(255, 77, 109, 0.7)');

      // Constellation text labels in sky
      sCtx.font = "10px 'Montserrat', sans-serif";
      sCtx.fillStyle = 'rgba(255, 209, 102, 0.75)';
      sCtx.fillText('Ursa Major', bigDipper[3].x * sW - 15, bigDipper[3].y * sH - 12);

      sCtx.fillStyle = 'rgba(255, 182, 193, 0.85)';
      sCtx.fillText('Corona Borealis (Crown of Love)', crownOfLove[2].x * sW - 55, crownOfLove[2].y * sH - 14);

      // Shooting stars animation
      maybeSpawnShootingStar();
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const ss = shootingStars[i];
        ss.x += Math.cos(ss.angle) * ss.speed;
        ss.y += Math.sin(ss.angle) * ss.speed;
        ss.alpha -= ss.decay;

        if (ss.alpha <= 0) {
          shootingStars.splice(i, 1);
          continue;
        }

        const tailX = ss.x - Math.cos(ss.angle) * ss.len;
        const tailY = ss.y - Math.sin(ss.angle) * ss.len;

        const ssGrad = sCtx.createLinearGradient(tailX, tailY, ss.x, ss.y);
        ssGrad.addColorStop(0, 'transparent');
        ssGrad.addColorStop(1, `rgba(255, 255, 255, ${ss.alpha})`);

        sCtx.strokeStyle = ssGrad;
        sCtx.lineWidth = 2;
        sCtx.beginPath();
        sCtx.moveTo(tailX, tailY);
        sCtx.lineTo(ss.x, ss.y);
        sCtx.stroke();
      }

      // Cursor connection to nearest star
      if (mouse.active) {
        let nearest = null;
        let minDist = 80;
        [...bigDipper, ...crownOfLove].forEach(st => {
          const d = Math.hypot(st.x * sW - mouse.x, st.y * sH - mouse.y);
          if (d < minDist) {
            minDist = d;
            nearest = st;
          }
        });

        if (nearest) {
          sCtx.strokeStyle = 'rgba(255, 209, 102, 0.4)';
          sCtx.lineWidth = 1;
          sCtx.setLineDash([2, 2]);
          sCtx.beginPath();
          sCtx.moveTo(mouse.x, mouse.y);
          sCtx.lineTo(nearest.x * sW, nearest.y * sH);
          sCtx.stroke();
          sCtx.setLineDash([]);
        }
      }

      requestAnimationFrame(renderSky);
    }
    renderSky();
  }
  initNightSky();

  // =========================================================================
  // 8. SCENE 4 & 5: "I LOVE YOU" BUTTON & GRAND FINALE
  // =========================================================================
  btnILoveYou.addEventListener('click', () => {
    initAudio();
    SOUNDS.loveExplosion();

    // Show grand finale overlay with falling huge heart
    finaleOverlay.classList.remove('hidden');

    // Spawn massive shower of hearts
    for (let i = 0; i < 40; i++) {
      setTimeout(() => {
        spawnTapHeart(Math.random() * window.innerWidth, Math.random() * window.innerHeight * 0.8);
      }, i * 60);
    }

    // Auto-close countdown timer (5 seconds)
    let remaining = CONFIG.COUNTDOWN_SECONDS;
    countdownNumber.textContent = remaining;

    const timer = setInterval(() => {
      remaining -= 1;
      if (remaining >= 0) {
        countdownNumber.textContent = remaining;
      }

      if (remaining <= 0) {
        clearInterval(timer);

        // Attempt window.close() (Exact user request)
        try {
          window.close();
        } catch (e) {
          // Modern browsers often block window.close() on scripts that didn't open the window
        }

        // Seamless fallback: fade to romantic closed-screen
        setTimeout(() => {
          closedScreen.classList.remove('hidden');
        }, 500);
      }
    }, 1000);
  });

  // Replay / Re-open Button in case browser blocks window.close
  btnReplay.addEventListener('click', () => {
    finaleOverlay.classList.add('hidden');
    closedScreen.classList.add('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // =========================================================================
  // VOICE RECORDER & TELEGRAM DISPATCHER
  // =========================================================================
  const vrIdleView = document.getElementById('vr-idle-view');
  const vrRecordingView = document.getElementById('vr-recording-view');
  const vrPreviewView = document.getElementById('vr-preview-view');
  const vrSendingView = document.getElementById('vr-sending-view');
  const vrSuccessView = document.getElementById('vr-success-view');

  const btnStartRecord = document.getElementById('btn-start-record');
  const btnStopRecord = document.getElementById('btn-stop-record');
  const vrRecordTimer = document.getElementById('vr-record-timer');
  const btnPlayPreview = document.getElementById('btn-play-preview');
  const vrPlayIcon = document.getElementById('vr-play-icon');
  const vrPreviewDuration = document.getElementById('vr-preview-duration');
  const vrProgressFill = document.getElementById('vr-progress-fill');
  const vrProgressBg = document.getElementById('vr-progress-bg');
  const btnDiscardRecord = document.getElementById('btn-discard-record');
  const btnSendRecord = document.getElementById('btn-send-record');
  const btnRecordAnother = document.getElementById('btn-record-another');

  let mediaRecorder = null;
  let audioChunks = [];
  let recordedAudioBlob = null;
  let previewAudio = null;
  let recordTimerInterval = null;
  let recordSeconds = 0;
  const MAX_RECORD_SECONDS = 120; // 2 minutes

  function formatTime(totalSec) {
    const mins = Math.floor(totalSec / 60).toString().padStart(2, '0');
    const secs = (totalSec % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  }

  function showVrView(viewToShow) {
    [vrIdleView, vrRecordingView, vrPreviewView, vrSendingView, vrSuccessView].forEach(v => {
      if (v) v.classList.add('hidden');
    });
    if (viewToShow) viewToShow.classList.remove('hidden');
  }

  // Start Recording
  async function startRecording() {
    initAudio();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunks = [];
      recordSeconds = 0;

      // Determine mimeType support
      let mimeType = 'audio/webm';
      if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
        mimeType = 'audio/webm;codecs=opus';
      } else if (MediaRecorder.isTypeSupported('audio/ogg;codecs=opus')) {
        mimeType = 'audio/ogg;codecs=opus';
      } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
        mimeType = 'audio/mp4';
      }

      mediaRecorder = new MediaRecorder(stream, { mimeType });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        // Stop stream tracks
        stream.getTracks().forEach(track => track.stop());

        recordedAudioBlob = new Blob(audioChunks, { type: mimeType });
        setupPreviewPlayer(recordedAudioBlob);
        showVrView(vrPreviewView);
      };

      mediaRecorder.start(200);
      showVrView(vrRecordingView);

      // Start Recording Timer
      vrRecordTimer.textContent = '00:00';
      clearInterval(recordTimerInterval);
      recordTimerInterval = setInterval(() => {
        recordSeconds++;
        vrRecordTimer.textContent = formatTime(recordSeconds);

        if (recordSeconds >= MAX_RECORD_SECONDS) {
          stopRecording();
        }
      }, 1000);

    } catch (err) {
      alert('Microphone access is needed to record your voice reaction. Please allow microphone permission in your browser! 🎙️');
    }
  }

  // Stop Recording
  function stopRecording() {
    clearInterval(recordTimerInterval);
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
    }
  }

  // Setup Preview Player
  function setupPreviewPlayer(blob) {
    if (previewAudio) {
      previewAudio.pause();
      previewAudio = null;
    }

    const audioUrl = URL.createObjectURL(blob);
    previewAudio = new Audio(audioUrl);

    previewAudio.onloadedmetadata = () => {
      const dur = Math.round(previewAudio.duration) || recordSeconds;
      vrPreviewDuration.textContent = formatTime(dur);
    };

    previewAudio.ontimeupdate = () => {
      if (previewAudio.duration) {
        const pct = (previewAudio.currentTime / previewAudio.duration) * 100;
        vrProgressFill.style.width = `${pct}%`;
        vrPreviewDuration.textContent = formatTime(Math.round(previewAudio.currentTime));
      }
    };

    previewAudio.onended = () => {
      vrPlayIcon.textContent = '▶';
      vrProgressFill.style.width = '0%';
      vrPreviewDuration.textContent = formatTime(recordSeconds);
    };
  }

  // Play / Pause Preview
  function togglePreviewPlayback() {
    if (!previewAudio) return;
    if (previewAudio.paused) {
      previewAudio.play();
      vrPlayIcon.textContent = '⏸';
    } else {
      previewAudio.pause();
      vrPlayIcon.textContent = '▶';
    }
  }

  // Discard and Reset
  function discardRecording() {
    if (previewAudio) {
      previewAudio.pause();
      previewAudio = null;
    }
    recordedAudioBlob = null;
    audioChunks = [];
    recordSeconds = 0;
    vrProgressFill.style.width = '0%';
    showVrView(vrIdleView);
  }

  // Send to Telegram Bot API
  async function sendVoiceToTelegram() {
    if (!recordedAudioBlob) return;

    if (previewAudio) {
      previewAudio.pause();
      vrPlayIcon.textContent = '▶';
    }

    showVrView(vrSendingView);

    // Fallback if user hasn't configured BOT_TOKEN yet:
    if (!CONFIG.TELEGRAM_BOT_TOKEN || CONFIG.TELEGRAM_BOT_TOKEN === 'YOUR_BOT_TOKEN_HERE') {
      // Allow graceful simulated send + instant download fallback so audio is never lost!
      setTimeout(() => {
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(recordedAudioBlob);
        downloadLink.download = `voice_reaction_${Date.now()}.webm`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        downloadLink.remove();

        showVrView(vrSuccessView);
      }, 1500);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('chat_id', CONFIG.TELEGRAM_CHAT_ID);
      formData.append('voice', recordedAudioBlob, 'love_page_reaction.ogg');
      formData.append('caption', '💌 New Voice Reaction from your Love Page! ❤️\nDuration: ' + formatTime(recordSeconds));

      const response = await fetch(`https://api.telegram.org/bot${CONFIG.TELEGRAM_BOT_TOKEN}/sendVoice`, {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      if (result.ok) {
        showVrView(vrSuccessView);
        // Play success tone
        SOUNDS.lockSuccess();
      } else {
        // If sendVoice failed (e.g. format constraint), fallback to sendDocument
        const docForm = new FormData();
        docForm.append('chat_id', CONFIG.TELEGRAM_CHAT_ID);
        docForm.append('document', recordedAudioBlob, 'love_reaction_audio.webm');
        docForm.append('caption', '💌 New Audio Reaction from your Love Page! ❤️');

        const docRes = await fetch(`https://api.telegram.org/bot${CONFIG.TELEGRAM_BOT_TOKEN}/sendDocument`, {
          method: 'POST',
          body: docForm
        });
        const docResult = await docRes.json();
        if (docResult.ok) {
          showVrView(vrSuccessView);
          SOUNDS.lockSuccess();
        } else {
          alert('Could not send to Telegram: ' + (docResult.description || 'Unknown error. Voice saved locally!'));
          showVrView(vrPreviewView);
        }
      }
    } catch (e) {
      alert('Network error while sending voice note. Check internet connection or Telegram Bot Token!');
      showVrView(vrPreviewView);
    }
  }

  // Event Listeners for Voice Recorder
  if (btnStartRecord) btnStartRecord.addEventListener('click', startRecording);
  if (btnStopRecord) btnStopRecord.addEventListener('click', stopRecording);
  if (btnPlayPreview) btnPlayPreview.addEventListener('click', togglePreviewPlayback);
  if (btnDiscardRecord) btnDiscardRecord.addEventListener('click', discardRecording);
  if (btnSendRecord) btnSendRecord.addEventListener('click', sendVoiceToTelegram);
  if (btnRecordAnother) btnRecordAnother.addEventListener('click', discardRecording);

  // Click on progress bar to seek
  if (vrProgressBg) {
    vrProgressBg.addEventListener('click', (e) => {
      if (!previewAudio || !previewAudio.duration) return;
      const rect = vrProgressBg.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const newPct = Math.max(0, Math.min(1, clickX / rect.width));
      previewAudio.currentTime = newPct * previewAudio.duration;
    });
  }

});
