/* =============================================
   BIRTHDAY WEB — SCRIPT.JS (ES Module)
   ============================================= */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

// ── FIREBASE CONFIG ──────────────────────────────────────
const firebaseConfig = {
  apiKey: "AIzaSyD0zNcrTjHg7K7X_2jW7XtUys2CQYxQ5Nc",
  authDomain: "letters-for-me.firebaseapp.com",
  projectId: "letters-for-me",
  storageBucket: "letters-for-me.firebasestorage.app",
  messagingSenderId: "1037502814265",
  appId: "1:1037502814265:web:60b59d292d1e9c339095e8"
};

const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);

// ── CONFIG ───────────────────────────────────────────────
const UNLOCK_DATE = new Date(Date.now() + 3000);

// ── DOM REFS ─────────────────────────────────────────────
const lockedScreen   = document.getElementById('locked-screen');
const birthdayPage   = document.getElementById('birthday-page');
const lockedCanvas   = document.getElementById('locked-particles');
const birthdayCanvas = document.getElementById('particle-canvas');

// ── MAIN INIT ────────────────────────────────────────────
(function init() {
  const now = new Date();
  if (now >= UNLOCK_DATE) {
    lockedScreen.classList.add('hidden');
    birthdayPage.classList.remove('hidden');
    startBirthdayParticles();
    initScrollEffects();
    initMessageForm();
  } else {
    startCountdown();
    startLockedParticles();
  }
})();

// ── COUNTDOWN ────────────────────────────────────────────
function startCountdown() {
  const daysEl    = document.getElementById('days');
  const hoursEl   = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');

  function tick() {
    const diff = UNLOCK_DATE - new Date();
    if (diff <= 0) {
      lockedScreen.style.opacity = '0';
      lockedScreen.style.transition = 'opacity 1.5s ease';
      setTimeout(() => {
        lockedScreen.classList.add('hidden');
        birthdayPage.classList.remove('hidden');
        startBirthdayParticles();
        initScrollEffects();
        initMessageForm();
      }, 1500);
      return;
    }
    const totalSeconds = Math.floor(diff / 1000);
    const s = totalSeconds % 60;
    const m = Math.floor(totalSeconds / 60) % 60;
    const h = Math.floor(totalSeconds / 3600) % 24;
    const d = Math.floor(totalSeconds / 86400);
    daysEl.textContent    = String(d).padStart(2, '0');
    hoursEl.textContent   = String(h).padStart(2, '0');
    minutesEl.textContent = String(m).padStart(2, '0');
    secondsEl.textContent = String(s).padStart(2, '0');
    setTimeout(tick, 1000);
  }
  tick();
}

// ── AUTO TRANSITION: hero → letter ───────────────────────
function initScrollEffects() {
  const hero       = document.querySelector('.hero');
  const heroInner  = document.querySelector('.hero-inner');
  const letterCard = document.querySelector('.letter-card');

  setTimeout(() => {
    if (heroInner) {
      heroInner.style.transition = 'transform 1.4s cubic-bezier(0.4,0,0.2,1), opacity 1.4s ease';
      heroInner.style.transform  = 'translateY(-80px)';
      heroInner.style.opacity    = '0';
    }
    setTimeout(() => {
      if (hero) {
        hero.style.transition = 'min-height 1.2s cubic-bezier(0.4,0,0.2,1), height 1.2s cubic-bezier(0.4,0,0.2,1)';
        hero.style.minHeight  = '0';
        hero.style.height     = '0';
        hero.style.overflow   = 'hidden';
      }
      setTimeout(() => {
        if (letterCard) {
          letterCard.classList.add('visible');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 600);
    }, 1000);
  }, 2500);
}

// ── FORM KIRIM PESAN ─────────────────────────────────────
function initMessageForm() {
  const input    = document.getElementById('msg-input');
  const sendBtn  = document.getElementById('send-btn');
  const status   = document.getElementById('send-status');
  const charLeft = document.getElementById('char-left');

  if (!input || !sendBtn) return;

  input.addEventListener('input', () => {
    charLeft.textContent = 500 - input.value.length;
  });

  sendBtn.addEventListener('click', async () => {
    const text = input.value.trim();
    if (!text) {
      status.textContent = 'Tulis sesuatu dulu ya 🌸';
      return;
    }

    sendBtn.disabled  = true;
    sendBtn.textContent = 'Mengirim...';
    status.textContent  = '';

    try {
      await addDoc(collection(db, 'messages'), {
        text,
        from: 'Riska',
        createdAt: serverTimestamp()
      });
      input.value          = '';
      charLeft.textContent = '500';
      status.textContent   = 'Pesanmu sudah terkirim 🤍';
      sendBtn.textContent  = 'Terkirim ✓';
      setTimeout(() => {
        sendBtn.disabled    = false;
        sendBtn.textContent = 'Kirim Pesan';
        status.textContent  = '';
      }, 4000);
    } catch (err) {
      console.error(err);
      status.textContent  = 'Gagal kirim, coba lagi ya.';
      sendBtn.disabled    = false;
      sendBtn.textContent = 'Kirim Pesan';
    }
  });
}

// ── LOCKED PARTICLES ─────────────────────────────────────
function startLockedParticles() {
  const canvas = lockedCanvas;
  const ctx    = canvas.getContext('2d');
  let W, H;

  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);

  function createParticle() {
    return { x: Math.random()*W, y: H+20, size: Math.random()*14+6, speedY: Math.random()*1.2+0.5, speedX: (Math.random()-0.5)*0.6, opacity: Math.random()*0.5+0.2, sway: Math.random()*Math.PI*2, swaySpeed: Math.random()*0.02+0.008 };
  }

  let particles = Array.from({ length: 30 }, createParticle).map(p => { p.y = Math.random()*H; return p; });

  function drawHeart(ctx, x, y, size, opacity) {
    ctx.save(); ctx.globalAlpha = opacity; ctx.fillStyle = 'rgba(242,184,198,1)';
    ctx.beginPath(); ctx.moveTo(x, y+size*0.3);
    ctx.bezierCurveTo(x,y,x-size*0.5,y,x-size*0.5,y+size*0.3);
    ctx.bezierCurveTo(x-size*0.5,y+size*0.65,x,y+size*0.9,x,y+size);
    ctx.bezierCurveTo(x,y+size*0.9,x+size*0.5,y+size*0.65,x+size*0.5,y+size*0.3);
    ctx.bezierCurveTo(x+size*0.5,y,x,y,x,y+size*0.3);
    ctx.closePath(); ctx.fill(); ctx.restore();
  }

  function loop() {
    ctx.clearRect(0,0,W,H);
    particles.forEach(p => {
      p.y -= p.speedY; p.sway += p.swaySpeed; p.x += Math.sin(p.sway)*0.5+p.speedX;
      drawHeart(ctx, p.x-p.size*0.5, p.y-p.size*0.5, p.size, p.opacity);
      if (p.y < -30) { Object.assign(p, createParticle()); p.y = H+20; }
    });
    requestAnimationFrame(loop);
  }
  loop();
}

// ── BIRTHDAY PARTICLES ───────────────────────────────────
function startBirthdayParticles() {
  const canvas = birthdayCanvas;
  const ctx    = canvas.getContext('2d');
  let W, H;

  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);

  const COLORS = ['rgba(212,116,142,','rgba(242,184,198,','rgba(201,149,106,','rgba(124,74,92,','rgba(255,180,200,','rgba(255,220,230,'];

  function createParticle() {
    const color = COLORS[Math.floor(Math.random()*COLORS.length)];
    return { x: Math.random()*W, y: -20, size: Math.random()*18+6, speedY: Math.random()*1.5+0.4, speedX: (Math.random()-0.5)*0.8, opacity: Math.random()*0.6+0.25, sway: Math.random()*Math.PI*2, swaySpeed: Math.random()*0.025+0.01, color, rotation: Math.random()*Math.PI*2, rotSpeed: (Math.random()-0.5)*0.03 };
  }

  let particles = Array.from({ length: 55 }, createParticle).map(p => { p.y = Math.random()*H; return p; });

  function drawHeart(ctx, cx, cy, size, color, opacity, rotation) {
    ctx.save(); ctx.translate(cx,cy); ctx.rotate(rotation); ctx.globalAlpha = opacity; ctx.fillStyle = color+'1)';
    const s = size*0.5;
    ctx.beginPath(); ctx.moveTo(0,s*0.6);
    ctx.bezierCurveTo(0,0,-s,0,-s,s*0.6); ctx.bezierCurveTo(-s,s*1.3,0,s*1.8,0,s*2);
    ctx.bezierCurveTo(0,s*1.8,s,s*1.3,s,s*0.6); ctx.bezierCurveTo(s,0,0,0,0,s*0.6);
    ctx.closePath(); ctx.fill(); ctx.restore();
  }

  function loop() {
    ctx.clearRect(0,0,W,H);
    particles.forEach(p => {
      p.y += p.speedY; p.sway += p.swaySpeed; p.x += Math.sin(p.sway)*0.7+p.speedX; p.rotation += p.rotSpeed;
      drawHeart(ctx,p.x,p.y,p.size,p.color,p.opacity,p.rotation);
      if (p.y > H+30) { Object.assign(p, createParticle()); p.y = -20; }
    });
    requestAnimationFrame(loop);
  }
  loop();
}
