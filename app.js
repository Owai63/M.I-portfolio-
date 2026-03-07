'use strict';
/* ═══════════════════════════════════════════════════
   MUHAMMAD IQBAL PORTFOLIO — app.js
   All interactive features and animations
═══════════════════════════════════════════════════ */

/* ══ 1. LOADER ══════════════════════════════════ */
const loader  = document.getElementById('loader');
const ldPct   = document.getElementById('ldPct');
const ldFill  = document.getElementById('ldFill');
document.body.style.overflow = 'hidden';

let pct = 0;
const loadInterval = setInterval(() => {
  pct = Math.min(pct + Math.random() * 14, 100);
  ldPct.textContent = Math.floor(pct);
  const W = 240; // total path length for progress bar
  // animate the fill path — we target d directly via JS
  if (ldFill) {
    ldFill.setAttribute('d', `M20 140 L${20 + (pct / 100) * 240} 140`);
  }
  if (pct >= 100) {
    clearInterval(loadInterval);
    setTimeout(() => {
      loader.classList.add('out');
      document.body.style.overflow = '';
      revealHero();
    }, 400);
  }
}, 80);

function revealHero() {
  document.querySelectorAll('#hero [data-anim]').forEach(el => {
    el.classList.add('in');
  });
  splitNameLetters();
  setTimeout(startTypewriter, 600);
  setTimeout(startGlitch, 1200);
}

/* ══ 2. LETTER SPLIT ANIMATION ══════════════════ */
function splitNameLetters() {
  document.querySelectorAll('[data-anim="letters"]').forEach(el => {
    const delay = parseFloat(el.style.getPropertyValue('--d') || '0') * 1000;
    const text  = el.textContent.trim();
    el.innerHTML = '';
    text.split('').forEach((ch, i) => {
      const span = document.createElement('span');
      span.className = 'letter';
      span.textContent = ch === ' ' ? '\u00A0' : ch;
      span.style.animationDelay = `${delay + i * 55}ms`;
      el.appendChild(span);
    });
  });
}

/* ══ 3. TYPEWRITER ══════════════════════════════ */
const phrases = [
  'PMO & Operations Manager',
  'Program Delivery Executive',
  'Digital Transformation Leader',
  'ISO 9001 · 27001 Champion',
  'Saudi Vision 2030 Enabler',
  'Multi-Million Dollar Portfolio Lead',
];
let pi = 0, ci = 0, del = false;
const twEl = document.getElementById('roleGlitch');

function startTypewriter() {
  if (!twEl) return;
  twEl.textContent = '';
  typeStep();
}
function typeStep() {
  if (!twEl) return;
  const phrase = phrases[pi];
  if (!del) {
    twEl.textContent = phrase.slice(0, ci++);
    if (ci > phrase.length) { del = true; setTimeout(typeStep, 2200); return; }
  } else {
    twEl.textContent = phrase.slice(0, ci--);
    if (ci < 0) { del = false; pi = (pi + 1) % phrases.length; ci = 0; }
  }
  setTimeout(typeStep, del ? 38 : 72);
}

/* ══ 4. GLITCH TOGGLE ═══════════════════════════ */
function startGlitch() {
  if (!twEl) return;
  // The glitch CSS handles itself via data-text, just keep it updated
  setInterval(() => {
    if (twEl) twEl.setAttribute('data-text', twEl.textContent);
  }, 300);
}

/* ══ 5. CURSOR ══════════════════════════════════ */
const cur  = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cur.style.left  = mx + 'px';
  cur.style.top   = my + 'px';
});
(function animRing() {
  rx += (mx - rx) * 0.095;
  ry += (my - ry) * 0.095;
  ring.style.left = rx + 'px';
  ring.style.top  = ry + 'px';
  requestAnimationFrame(animRing);
})();

const hoverEls = 'a,button,.fc,.cert-fc,.award-card,.comp-item,.ac-head,.hfs-card,.h-pill,.pc-attrs span,.domain-tags span,.ac-tags span';
document.querySelectorAll(hoverEls).forEach(el => {
  el.addEventListener('mouseenter', () => { cur.classList.add('hover'); ring.classList.add('hover'); });
  el.addEventListener('mouseleave', () => { cur.classList.remove('hover'); ring.classList.remove('hover'); });
});
document.addEventListener('mousedown', () => cur.classList.add('click'));
document.addEventListener('mouseup',   () => cur.classList.remove('click'));

/* ══ 6. CURSOR TRAIL ═════════════════════════════ */
const trailWrap  = document.getElementById('trailWrap');
const TRAIL_LEN  = 10;
const trail      = [];
const trailPos   = Array(TRAIL_LEN).fill().map(() => ({ x: 0, y: 0 }));

for (let i = 0; i < TRAIL_LEN; i++) {
  const dot = document.createElement('div');
  dot.className = 'trail-dot';
  dot.style.opacity   = (1 - i / TRAIL_LEN) * 0.5;
  dot.style.width     = Math.max(2, 5 - i * 0.4) + 'px';
  dot.style.height    = dot.style.width;
  dot.style.background = `rgba(212,164,50,${0.6 - i * 0.06})`;
  trailWrap.appendChild(dot);
  trail.push(dot);
}

let lastTrailX = 0, lastTrailY = 0;
(function animTrail() {
  trailPos.unshift({ x: mx, y: my });
  trailPos.pop();
  trail.forEach((dot, i) => {
    dot.style.left = trailPos[i].x + 'px';
    dot.style.top  = trailPos[i].y + 'px';
  });
  requestAnimationFrame(animTrail);
})();

/* ══ 7. PARTICLE CANVAS ══════════════════════════ */
const canvas = document.getElementById('canvas');
const ctx    = canvas.getContext('2d');
let CW, CH;

function resizeCanvas() {
  CW = canvas.width  = window.innerWidth;
  CH = canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

let canvasMX = -1000, canvasMY = -1000;
document.addEventListener('mousemove', e => { canvasMX = e.clientX; canvasMY = e.clientY; });

const NODES = Array.from({ length: 100 }, () => ({
  x:  Math.random() * window.innerWidth,
  y:  Math.random() * window.innerHeight,
  vx: (Math.random() - .5) * 0.3,
  vy: (Math.random() - .5) * 0.3,
  r:  Math.random() * 1.6 + 0.4,
}));

(function drawCanvas() {
  ctx.clearRect(0, 0, CW, CH);
  NODES.forEach(n => {
    const dx = canvasMX - n.x, dy = canvasMY - n.y;
    const d  = Math.sqrt(dx*dx+dy*dy);
    if (d < 200) { n.vx += (dx/d)*.018; n.vy += (dy/d)*.018; }
    n.vx *= .985; n.vy *= .985;
    const sp = Math.sqrt(n.vx*n.vx+n.vy*n.vy);
    if (sp > 1.5) { n.vx = (n.vx/sp)*1.5; n.vy = (n.vy/sp)*1.5; }
    n.x += n.vx; n.y += n.vy;
    if (n.x < 0 || n.x > CW) n.vx *= -1;
    if (n.y < 0 || n.y > CH) n.vy *= -1;
  });
  for (let i = 0; i < NODES.length; i++) {
    for (let j = i+1; j < NODES.length; j++) {
      const dx = NODES[i].x - NODES[j].x, dy = NODES[i].y - NODES[j].y;
      const d  = Math.sqrt(dx*dx+dy*dy);
      if (d < 150) {
        ctx.beginPath();
        ctx.moveTo(NODES[i].x, NODES[i].y);
        ctx.lineTo(NODES[j].x, NODES[j].y);
        ctx.strokeStyle = `rgba(212,164,50,${0.12*(1-d/150)})`;
        ctx.lineWidth   = 0.5;
        ctx.stroke();
      }
    }
  }
  NODES.forEach(n => {
    ctx.beginPath();
    ctx.arc(n.x, n.y, n.r, 0, Math.PI*2);
    ctx.fillStyle = 'rgba(212,164,50,.4)';
    ctx.fill();
  });
  requestAnimationFrame(drawCanvas);
})();

/* ══ 8. SCROLL PROGRESS ══════════════════════════ */
const scrollBar = document.getElementById('scroll-bar');
window.addEventListener('scroll', () => {
  const pct = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
  scrollBar.style.width = Math.min(pct, 100) + '%';
}, { passive: true });

/* ══ 9. NAV STICKY + ACTIVE ══════════════════════ */
const nav      = document.getElementById('nav');
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section[id]');
const backTop  = document.getElementById('backTop');

window.addEventListener('scroll', () => {
  nav.classList.toggle('sticky', window.scrollY > 80);
  backTop.classList.toggle('show', window.scrollY > 700);
  let cur2 = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 260) cur2 = s.id; });
  navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + cur2));
}, { passive: true });

/* ══ 10. BACK TO TOP ══════════════════════════════ */
backTop.addEventListener('click', () => window.scrollTo({ top:0, behavior:'smooth' }));

/* ══ 11. MOBILE DRAWER ═══════════════════════════ */
const hamburger = document.getElementById('hamburger');
const drawer    = document.getElementById('drawer');

hamburger.addEventListener('click', () => {
  const open = drawer.classList.toggle('open');
  hamburger.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
});
document.querySelectorAll('.drawer-link').forEach(l => {
  l.addEventListener('click', () => {
    drawer.classList.remove('open');
    hamburger.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ══ 12. SCROLL REVEAL ═══════════════════════════ */
const revObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      revObs.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('[data-anim]:not(#hero [data-anim]):not([data-anim="letters"])').forEach(el => {
  revObs.observe(el);
});

/* ══ 13. TIMELINE REVEAL ═════════════════════════ */
const tlObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      tlObs.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.tl-left .tl-card, .tl-right .tl-card').forEach(el => tlObs.observe(el));

/* ══ 14. STAT RING COUNTERS ══════════════════════ */
function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

const statObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    // Animate number
    const numEl  = e.target.querySelector('.sr-num');
    const fillEl = e.target.querySelector('.sr-fill');
    if (!numEl || !fillEl) return;

    const target = parseInt(numEl.dataset.count);
    const prefix = numEl.dataset.prefix || '';
    const suffix = numEl.dataset.suffix || '';
    const pctVal = parseFloat(fillEl.dataset.pct || 100);
    const C      = 326.73; // 2π×52

    const dur    = 2000;
    const start  = performance.now();

    requestAnimationFrame(function tick(now) {
      const p   = Math.min((now - start) / dur, 1);
      const ep  = easeOutCubic(p);
      const num = Math.round(ep * target);
      numEl.textContent = prefix + num.toLocaleString() + suffix;
      fillEl.style.strokeDashoffset = C - (ep * pctVal / 100) * C;
      if (p < 1) requestAnimationFrame(tick);
    });
    statObs.unobserve(e.target);
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-ring').forEach(el => statObs.observe(el));

/* ══ 15. SKILL BARS ══════════════════════════════ */
const skillObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.querySelectorAll('.sk-fill,.lang-fill').forEach(fill => {
      fill.style.width = fill.dataset.w + '%';
    });
    skillObs.unobserve(e.target);
  });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-col').forEach(el => skillObs.observe(el));

/* ══ 16. ACCORDION ═══════════════════════════════ */
document.querySelectorAll('.ac-head').forEach(head => {
  head.addEventListener('click', () => {
    const item     = head.closest('.ac-item');
    const isOpen   = item.classList.contains('open');
    document.querySelectorAll('.ac-item.open').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

/* ══ 17. FLIP CARDS — TOUCH SUPPORT ═════════════ */
document.querySelectorAll('.fc, .cert-fc').forEach(card => {
  card.addEventListener('touchend', e => {
    e.preventDefault(); // prevent ghost click
    card.classList.toggle('flipped');
  }, { passive: false });
});

/* ══ 18. MAGNETIC ELEMENTS ═══════════════════════ */
document.querySelectorAll('.magnetic').forEach(el => {
  el.addEventListener('mousemove', e => {
    const r  = el.getBoundingClientRect();
    const dx = (e.clientX - r.left - r.width  / 2) * 0.3;
    const dy = (e.clientY - r.top  - r.height / 2) * 0.3;
    el.style.transform = `translate(${dx}px,${dy}px)`;
  });
  el.addEventListener('mouseleave', () => {
    el.style.transform = '';
  });
});

/* ══ 19. HERO CARD PARALLAX ══════════════════════ */
const monoCard = document.getElementById('monogramCard');
if (monoCard) {
  document.addEventListener('mousemove', e => {
    const dx = ((e.clientX / window.innerWidth)  - .5) * 18;
    const dy = ((e.clientY / window.innerHeight) - .5) * 12;
    monoCard.style.transform = `perspective(1200px) rotateY(${dx}deg) rotateX(${-dy}deg)`;
  });
}

/* ══ 20. PARTICLE BURST on CTA click ════════════ */
function spawnParticles(x, y, count = 20) {
  for (let i = 0; i < count; i++) {
    const p   = document.createElement('div');
    p.className = 'particle';
    const angle = (Math.PI * 2 / count) * i + Math.random() * .5;
    const dist  = 60 + Math.random() * 80;
    p.style.setProperty('--tx', `${Math.cos(angle) * dist}px`);
    p.style.setProperty('--ty', `${Math.sin(angle) * dist - 40}px`);
    p.style.setProperty('--dur', `${.6 + Math.random() * .5}s`);
    p.style.left = x + 'px';
    p.style.top  = y + 'px';
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 1200);
  }
}

document.querySelectorAll('.btn-gold, .ct-link, .nav-hire').forEach(btn => {
  btn.addEventListener('click', e => {
    spawnParticles(e.clientX, e.clientY, 16);
  });
});

/* ══ 21. SMOOTH ANCHOR SCROLL ════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (!t) return;
    e.preventDefault();
    t.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* ══ 22. AWARD CARD 3D TILT ══════════════════════ */
document.querySelectorAll('.award-card,.personal-card,.hfs-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r   = card.getBoundingClientRect();
    const x   = (e.clientX - r.left) / r.width  - .5;
    const y   = (e.clientY - r.top)  / r.height - .5;
    card.style.transform = `perspective(700px) rotateX(${-y*12}deg) rotateY(${x*12}deg) translateY(-5px)`;
    card.style.transition= 'none';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition= '';
  });
});

/* ══ 23. SECTION PARALLAX ════════════════════════ */
window.addEventListener('scroll', () => {
  const sy = window.scrollY;
  const glow1 = document.querySelector('.hero-glow-1');
  const glow2 = document.querySelector('.hero-glow-2');
  if (glow1) glow1.style.transform = `translate(${sy*.06}px,${sy*.04}px) scale(1)`;
  if (glow2) glow2.style.transform = `translate(${-sy*.04}px,${sy*.06}px) scale(1)`;
}, { passive: true });

/* ══ 24. WINDOW RESIZE HANDLER ═══════════════════ */
window.addEventListener('resize', () => {
  resizeCanvas();
  NODES.forEach(n => {
    n.x = Math.min(n.x, CW);
    n.y = Math.min(n.y, CH);
  });
});