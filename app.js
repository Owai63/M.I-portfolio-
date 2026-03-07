'use strict';
/* ══ DETECT TOUCH DEVICE ══ */
const isTouchDevice = () => window.matchMedia('(hover: none), (pointer: coarse)').matches;

/* ══ 1. LOADER ══ */
const loader = document.getElementById('loader');
const ldPctEl = document.getElementById('ldPct');
const ldFill = document.getElementById('ldFill');
const ldScan = loader ? loader.querySelector('.ld-scan') : null;
document.body.style.overflow = 'hidden';
let pct = 0;
const loadInterval = setInterval(() => {
  pct = Math.min(pct + Math.random() * 12 + 2, 100);
  const floor = Math.floor(pct);
  ldPctEl.textContent = floor;
  ldFill.style.width = pct + '%';
  if (ldScan) ldScan.setAttribute('x2', 10 + (pct / 100) * 190);
  if (pct >= 100) {
    clearInterval(loadInterval);
    setTimeout(() => {
      loader.classList.add('out');
      document.body.style.overflow = '';
      setTimeout(revealHero, 300);
    }, 400);
  }
}, 70);

function revealHero() {
  splitLetters();
  document.querySelectorAll('#hero [data-anim]').forEach(el => el.classList.add('revealed'));
  setTimeout(startTypewriter, 400);
  setTimeout(initGlitch, 1000);
}

/* ══ 2. LETTER SPLIT ══ */
function splitLetters() {
  document.querySelectorAll('[data-letters]').forEach(el => {
    const delayBase = parseFloat(el.closest('[data-anim]')?.style.getPropertyValue('--d') || '0') * 1000;
    const text = el.textContent.trim();
    el.innerHTML = '';
    text.split('').forEach((ch, i) => {
      const s = document.createElement('span');
      s.className = 'letter';
      s.textContent = ch === ' ' ? '\u00A0' : ch;
      s.style.animationDelay = `${delayBase + i * 50}ms`;
      el.appendChild(s);
    });
  });
}

/* ══ 3. TYPEWRITER ══ */
const phrases = ['PMO & Operations Manager','Program Delivery Executive','Digital Transformation Leader','ISO 9001 · 27001 Champion','Saudi Vision 2030 Enabler','Multi-Million Dollar Portfolio Lead'];
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789·—';
let pi = 0, ci = 0, deleting = false;
const roleEl = document.getElementById('roleText');
function startTypewriter() {
  if (!roleEl) return; roleEl.textContent = ''; twStep();
}
function twStep() {
  if (!roleEl) return;
  const phrase = phrases[pi];
  if (!deleting) {
    const target = phrase.slice(0, ci + 1); let sc = 0;
    const scramble = setInterval(() => {
      roleEl.textContent = target.slice(0, -1) + (sc < 3 ? CHARS[Math.floor(Math.random() * CHARS.length)] : target.slice(-1));
      sc++;
      if (sc >= 4) { clearInterval(scramble); roleEl.textContent = phrase.slice(0, ci + 1); ci++; if (ci >= phrase.length) { deleting = true; setTimeout(twStep, 2400); } else { setTimeout(twStep, 68); } }
    }, 30);
  } else {
    roleEl.textContent = phrase.slice(0, ci--);
    if (ci < 0) { deleting = false; pi = (pi + 1) % phrases.length; ci = 0; setTimeout(twStep, 200); } else { setTimeout(twStep, 36); }
  }
}
function initGlitch() { if (!roleEl) return; setInterval(() => { if (roleEl) roleEl.setAttribute('data-text', roleEl.textContent); }, 250); }

/* ══ 4. CURSOR (desktop only) ══ */
const curDot = document.getElementById('cursor-dot');
const curRing = document.getElementById('cursor-ring');
const curGlow = document.getElementById('cursor-glow');
let mx = 0, my = 0, rx = 0, ry = 0;
if (!isTouchDevice()) {
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    curDot.style.left = mx + 'px'; curDot.style.top = my + 'px';
    curGlow.style.left = mx + 'px'; curGlow.style.top = my + 'px';
  });
  (function animRing() {
    rx += (mx - rx) * 0.085; ry += (my - ry) * 0.085;
    curRing.style.left = rx + 'px'; curRing.style.top = ry + 'px';
    requestAnimationFrame(animRing);
  })();
  const hoverTargets = 'a,button,.fc,.cert-fc,.award-card,.comp-item,.ac-head,.hkpi,.h-badge,.domain-cloud span,.pc-tags span,.tc-tags span,.ac-tags span';
  document.querySelectorAll(hoverTargets).forEach(el => {
    el.addEventListener('mouseenter', () => { curDot.classList.add('hover'); curRing.classList.add('hover'); });
    el.addEventListener('mouseleave', () => { curDot.classList.remove('hover'); curRing.classList.remove('hover'); });
  });
  document.addEventListener('mousedown', () => curDot.classList.add('click'));
  document.addEventListener('mouseup', () => curDot.classList.remove('click'));
}

/* ══ 5. CURSOR TRAIL (desktop only) ══ */
const trailWrap = document.getElementById('trailWrap');
if (!isTouchDevice()) {
  const TRAIL_LEN = 12;
  const trailEls = [];
  const trailPos = Array(TRAIL_LEN).fill(null).map(() => ({ x: 0, y: 0 }));
  for (let i = 0; i < TRAIL_LEN; i++) {
    const d = document.createElement('div'); d.className = 'trail-dot';
    const size = Math.max(2, 5 - i * 0.3);
    d.style.cssText = `width:${size}px;height:${size}px;background:rgba(200,168,75,${0.5 - i * 0.04});opacity:${0.6 - i * 0.05};`;
    trailWrap.appendChild(d); trailEls.push(d);
  }
  (function animTrail() {
    trailPos.unshift({ x: mx, y: my }); trailPos.pop();
    trailEls.forEach((dot, i) => { dot.style.left = trailPos[i].x + 'px'; dot.style.top = trailPos[i].y + 'px'; });
    requestAnimationFrame(animTrail);
  })();
}

/* ══ 6. PARTICLE CANVAS ══ */
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let CW, CH;
function resizeCanvas() { CW = canvas.width = window.innerWidth; CH = canvas.height = window.innerHeight; }
resizeCanvas();
window.addEventListener('resize', resizeCanvas);
let cmx = -9999, cmy = -9999;
if (!isTouchDevice()) document.addEventListener('mousemove', e => { cmx = e.clientX; cmy = e.clientY; });
const nodeCount = window.innerWidth < 768 ? 40 : 90;
const NODES = Array.from({ length: nodeCount }, () => ({
  x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight,
  vx: (Math.random() - 0.5) * 0.28, vy: (Math.random() - 0.5) * 0.28,
  r: Math.random() * 1.4 + 0.5,
}));
(function drawCanvas() {
  ctx.clearRect(0, 0, CW, CH);
  NODES.forEach(n => {
    const dx = cmx - n.x, dy = cmy - n.y; const d = Math.sqrt(dx * dx + dy * dy);
    if (d < 180) { n.vx += (dx / d) * 0.016; n.vy += (dy / d) * 0.016; }
    n.vx *= 0.986; n.vy *= 0.986;
    const sp = Math.sqrt(n.vx * n.vx + n.vy * n.vy);
    if (sp > 1.2) { n.vx = (n.vx / sp) * 1.2; n.vy = (n.vy / sp) * 1.2; }
    n.x += n.vx; n.y += n.vy;
    if (n.x < 0 || n.x > CW) n.vx *= -1; if (n.y < 0 || n.y > CH) n.vy *= -1;
  });
  for (let i = 0; i < NODES.length; i++) {
    for (let j = i + 1; j < NODES.length; j++) {
      const dx = NODES[i].x - NODES[j].x, dy = NODES[i].y - NODES[j].y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < 140) { ctx.beginPath(); ctx.moveTo(NODES[i].x, NODES[i].y); ctx.lineTo(NODES[j].x, NODES[j].y); ctx.strokeStyle = `rgba(200,168,75,${0.1 * (1 - d / 140)})`; ctx.lineWidth = 0.6; ctx.stroke(); }
    }
  }
  NODES.forEach(n => { ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2); ctx.fillStyle = 'rgba(200,168,75,0.35)'; ctx.fill(); });
  requestAnimationFrame(drawCanvas);
})();

/* ══ 7. SCROLL PROGRESS ══ */
const scrollBar = document.getElementById('scroll-bar');
window.addEventListener('scroll', () => {
  const p = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
  scrollBar.style.width = Math.min(p * 100, 100) + '%';
  const btRing = document.getElementById('btRing');
  if (btRing) btRing.style.strokeDashoffset = 120 - (p * 120);
}, { passive: true });

/* ══ 8. NAV STICKY + SECTION DOTS ══ */
const navEl = document.getElementById('nav');
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section[id]');
const backTop = document.getElementById('backTop');
const sdDots = document.querySelectorAll('.sd-dot');
window.addEventListener('scroll', () => {
  const sy = window.scrollY;
  navEl.classList.toggle('sticky', sy > 80);
  backTop.classList.toggle('show', sy > 700);
  let cur = '';
  sections.forEach(s => { if (sy >= s.offsetTop - 280) cur = s.id; });
  navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + cur));
  sdDots.forEach(d => d.classList.toggle('active', d.getAttribute('href') === '#' + cur));
}, { passive: true });

/* ══ 9. BACK TO TOP ══ */
backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ══ 10. MOBILE DRAWER ══ */
const hamburger = document.getElementById('hamburger');
const drawer = document.getElementById('drawer');
hamburger.addEventListener('click', () => {
  const open = drawer.classList.toggle('open');
  hamburger.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
});
document.querySelectorAll('.drawer-link').forEach(l => l.addEventListener('click', () => {
  drawer.classList.remove('open'); hamburger.classList.remove('open'); document.body.style.overflow = '';
}));

/* ══ 11. SCROLL REVEAL ══ */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('revealed'); revealObs.unobserve(e.target); } });
}, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });
document.querySelectorAll('[data-anim]:not(#hero [data-anim])').forEach(el => revealObs.observe(el));

/* ══ 12. TIMELINE REVEAL ══ */
const tlObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); tlObs.unobserve(e.target); } });
}, { threshold: 0.1 });
document.querySelectorAll('.tl-left .tl-card, .tl-right .tl-card').forEach(el => tlObs.observe(el));
const expSection = document.getElementById('experience');
const tlLineEl = document.getElementById('tlLine');
const tlLineObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { animateTlLine(); tlLineObs.unobserve(expSection); } });
}, { threshold: 0.05 });
if (expSection) tlLineObs.observe(expSection);
function animateTlLine() { let h = 0; const int = setInterval(() => { h = Math.min(h + 0.4, 100); if (tlLineEl) tlLineEl.style.height = h + '%'; if (h >= 100) clearInterval(int); }, 14); }

/* ══ 13. STAT RING COUNTERS ══ */
function easeOut(t) { return 1 - Math.pow(1 - t, 3); }
const statObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const numEl = e.target.querySelector('[data-count]');
    const fillEl = e.target.querySelector('.sr-fill');
    if (!numEl || !fillEl) return;
    const target = parseInt(numEl.dataset.count);
    const prefix = numEl.dataset.prefix || ''; const suffix = numEl.dataset.suffix || '';
    const pctVal = parseFloat(fillEl.dataset.pct || 100);
    const C = 326.73; const dur = 2000; const start = performance.now();
    requestAnimationFrame(function tick(now) {
      const p = Math.min((now - start) / dur, 1); const ep = easeOut(p);
      numEl.textContent = prefix + Math.round(ep * target).toLocaleString() + suffix;
      fillEl.style.strokeDashoffset = C - (ep * pctVal / 100) * C;
      if (p < 1) requestAnimationFrame(tick);
    });
    statObs.unobserve(e.target);
  });
}, { threshold: 0.5 });
document.querySelectorAll('.stat-ring').forEach(el => statObs.observe(el));

/* ══ 14. SKILL BARS ══ */
const skillObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.querySelectorAll('.sk-fill').forEach((fill, index) => {
      setTimeout(() => { fill.style.width = fill.dataset.w + '%'; }, index * 120);
    });
    skillObs.unobserve(e.target);
  });
}, { threshold: 0.3 });
document.querySelectorAll('.skill-col').forEach(el => skillObs.observe(el));

/* ══ 15. ACCORDION ══ */
document.querySelectorAll('.ac-head').forEach(head => {
  head.addEventListener('click', () => {
    const item = head.closest('.ac-item'); const isOpen = item.classList.contains('open');
    document.querySelectorAll('.ac-item.open').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

/* ══ 16. FLIP CARDS — TOUCH ══ */
document.querySelectorAll('.fc, .cert-fc').forEach(card => {
  card.addEventListener('touchend', e => { e.preventDefault(); card.classList.toggle('flipped'); }, { passive: false });
});

/* ══ 17. 3D CARD TILT (desktop only) ══ */
if (!isTouchDevice()) {
  function attachTilt(selector, strength = 12) {
    document.querySelectorAll(selector).forEach(card => {
      let animFrame;
      card.addEventListener('mousemove', e => {
        cancelAnimationFrame(animFrame);
        animFrame = requestAnimationFrame(() => {
          const r = card.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width - 0.5; const y = (e.clientY - r.top) / r.height - 0.5;
          card.style.transform = `perspective(700px) rotateX(${-y * strength}deg) rotateY(${x * strength}deg) translateY(-5px)`;
          card.style.transition = 'none';
        });
      });
      card.addEventListener('mouseleave', () => { cancelAnimationFrame(animFrame); card.style.transform = ''; card.style.transition = ''; });
    });
  }
  attachTilt('.award-card', 10);
  attachTilt('.personal-card', 8);
  attachTilt('.hkpi', 6);
}

/* ══ 18. HERO MONOGRAM PARALLAX (desktop only) ══ */
const monoCard = document.getElementById('monoCard');
if (monoCard && !isTouchDevice()) {
  document.addEventListener('mousemove', e => {
    const dx = ((e.clientX / window.innerWidth) - 0.5) * 16;
    const dy = ((e.clientY / window.innerHeight) - 0.5) * 10;
    monoCard.style.transform = `perspective(1200px) rotateY(${dx}deg) rotateX(${-dy}deg)`;
  });
}

/* ══ 19. MAGNETIC ELEMENTS (desktop only) ══ */
if (!isTouchDevice()) {
  document.querySelectorAll('.magnetic').forEach(el => {
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width / 2) * 0.28;
      const dy = (e.clientY - r.top - r.height / 2) * 0.28;
      el.style.transform = `translate(${dx}px,${dy}px)`;
    });
    el.addEventListener('mouseleave', () => { el.style.transform = ''; });
  });
}

/* ══ 20. PARTICLE BURST ══ */
const pContainer = document.getElementById('particleContainer');
function spawnParticles(x, y, count = 18) {
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div'); p.className = 'particle';
    const angle = (Math.PI * 2 / count) * i + Math.random() * 0.4;
    const dist = 55 + Math.random() * 75;
    p.style.setProperty('--tx', `${Math.cos(angle) * dist}px`);
    p.style.setProperty('--ty', `${Math.sin(angle) * dist - 35}px`);
    p.style.setProperty('--dur', `${0.5 + Math.random() * 0.5}s`);
    p.style.left = x + 'px'; p.style.top = y + 'px';
    pContainer.appendChild(p); setTimeout(() => p.remove(), 1100);
  }
}
document.querySelectorAll('.btn-primary, .btn-outline, .ct-link, .nav-hire').forEach(btn => {
  btn.addEventListener('click', e => spawnParticles(e.clientX, e.clientY, 14));
});

/* ══ 21. SMOOTH ANCHOR SCROLL ══ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return; e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* ══ 22. HERO PARALLAX ORBS ══ */
if (!isTouchDevice()) {
  window.addEventListener('scroll', () => {
    const sy = window.scrollY;
    const o1 = document.querySelector('.hero-orb-1');
    const o2 = document.querySelector('.hero-orb-2');
    const o3 = document.querySelector('.hero-orb-3');
    if (o1) o1.style.transform = `translate(${sy * 0.04}px, ${sy * 0.03}px)`;
    if (o2) o2.style.transform = `translate(${-sy * 0.03}px, ${sy * 0.04}px)`;
    if (o3) o3.style.transform = `translate(${sy * 0.02}px, ${-sy * 0.02}px)`;
  }, { passive: true });
}

/* ══ 23. SECTION H2 GLOW ══ */
const h2Obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.style.textShadow = '0 0 60px rgba(200,168,75,0.1)'; });
}, { threshold: 0.5 });
document.querySelectorAll('.sec-h2').forEach(el => h2Obs.observe(el));

/* ══ 24. DOMAIN CLOUD ANIMATION ══ */
const cloudObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const spans = e.target.querySelectorAll('.domain-cloud span');
    spans.forEach((s, i) => {
      s.style.opacity = '0'; s.style.transform = 'translateY(10px)';
      setTimeout(() => { s.style.transition = 'opacity 0.4s ease, transform 0.4s ease'; s.style.opacity = '1'; s.style.transform = 'translateY(0)'; }, i * 55);
    });
    cloudObs.unobserve(e.target);
  });
}, { threshold: 0.3 });
document.querySelectorAll('.domain-cloud').forEach(el => {
  el.querySelectorAll('span').forEach(s => { s.style.opacity = '0'; });
  cloudObs.observe(el.closest('.skill-col'));
});

/* ══ 25. COMP-GRID STAGGER ══ */
document.querySelectorAll('.comp-item').forEach((item, i) => { item.style.transitionDelay = `${i * 20}ms`; });

/* ══ 26. STATUS DOT BLINK ══ */
const hsDot = document.querySelector('.hs-dot');
if (hsDot) { setInterval(() => { hsDot.style.transform = 'scale(1.4)'; setTimeout(() => { hsDot.style.transform = ''; }, 200); }, 3000); }

/* ══ 27. AWARD CARD CONFETTI ══ */
if (!isTouchDevice()) {
  document.querySelectorAll('.award-card').forEach(card => {
    card.addEventListener('mouseenter', e => {
      const r = card.getBoundingClientRect();
      spawnParticles(r.left + r.width / 2, r.top + 10, 6);
    });
  });
}

/* ══ 28. FOOTER FADE ══ */
const ftObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (!e.isIntersecting) return; e.target.style.opacity = '1'; ftObs.unobserve(e.target); });
}, { threshold: 0.5 });
document.querySelectorAll('footer .ft-copy').forEach(el => {
  el.style.transition = 'opacity 1.2s ease';
  ftObs.observe(el);
});

/* ══ 29. WINDOW RESIZE ══ */
window.addEventListener('resize', () => {
  resizeCanvas();
  NODES.forEach(n => { n.x = Math.min(n.x, CW); n.y = Math.min(n.y, CH); });
});

/* ══ 30. VIEWPORT HEIGHT FIX (mobile browsers) ══ */
function setVH() { document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`); }
setVH();
window.addEventListener('resize', setVH);