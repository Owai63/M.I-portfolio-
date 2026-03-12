'use strict';
/* ══════════════════════════════════════════════════════════
   MUHAMMAD IQBAL PMP® — PORTFOLIO APP.JS 2026
   Saudi Futurism 2030 Theme
   ══════════════════════════════════════════════════════════ */

const isTouchDevice = () => window.matchMedia('(hover: none), (pointer: coarse)').matches;

/* ══ 1. LOADER ══ */
const loader   = document.getElementById('loader');
const ldFill   = document.getElementById('ldFill');
const ldPctEl  = document.getElementById('ldPct');

document.body.classList.add('no-scroll');

let pct = 0;
const loadInterval = setInterval(() => {
  pct = Math.min(pct + Math.random() * 14 + 2, 100);
  const floor = Math.floor(pct);
  if (ldPctEl) ldPctEl.textContent = floor;
  if (ldFill)  ldFill.style.width  = pct + '%';

  if (pct >= 100) {
    clearInterval(loadInterval);
    setTimeout(() => {
      loader.classList.add('out');
      document.body.classList.remove('no-scroll');
      setTimeout(revealHero, 350);
    }, 380);
  }
}, 65);

function revealHero() {
  document.querySelectorAll('#hero [data-reveal]').forEach(el => el.classList.add('revealed'));
  setTimeout(startTypewriter, 300);
}

/* ══ 2. TYPEWRITER (morphing roles) ══ */
const PHRASES = [
  'PMO & Operations Manager',
  'Program Delivery Executive',
  'Digital Transformation Leader',
  'ISO 9001 · 27001 Champion',
  'Saudi Vision 2030 Enabler',
  'Multi-Million Dollar Portfolio Lead'
];
const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789·—';

let phraseIdx = 0, charIdx = 0, isDeleting = false;
const roleEl = document.getElementById('roleText');

function startTypewriter() {
  if (!roleEl) return;
  roleEl.textContent = '';
  typeStep();
}

function typeStep() {
  if (!roleEl) return;
  const phrase = PHRASES[phraseIdx];

  if (!isDeleting) {
    const target = phrase.slice(0, charIdx + 1);
    let scrambleCount = 0;
    const interval = setInterval(() => {
      roleEl.textContent = target.slice(0, -1) + (scrambleCount < 3
        ? SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
        : target.slice(-1));
      scrambleCount++;
      if (scrambleCount >= 4) {
        clearInterval(interval);
        roleEl.textContent = phrase.slice(0, charIdx + 1);
        charIdx++;
        if (charIdx >= phrase.length) {
          isDeleting = true;
          setTimeout(typeStep, 2200);
        } else {
          setTimeout(typeStep, 65);
        }
      }
    }, 28);

  } else {
    roleEl.textContent = phrase.slice(0, charIdx--);
    if (charIdx < 0) {
      isDeleting = false;
      phraseIdx = (phraseIdx + 1) % PHRASES.length;
      charIdx = 0;
      setTimeout(typeStep, 180);
    } else {
      setTimeout(typeStep, 32);
    }
  }
}

/* ══ 3. CUSTOM CURSOR ══ */
const curDot  = document.getElementById('cursor-dot');
const curGlow = document.getElementById('cursor-glow');
let mx = 0, my = 0;

if (!isTouchDevice() && curDot) {
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    curDot.style.left  = mx + 'px';
    curDot.style.top   = my + 'px';
    curGlow.style.left = mx + 'px';
    curGlow.style.top  = my + 'px';
  });

  document.addEventListener('mousedown', () => curDot.style.transform = 'translate(-50%,-50%) scale(.6)');
  document.addEventListener('mouseup',   () => curDot.style.transform = 'translate(-50%,-50%) scale(1)');
}

/* ══ 4. SCROLL PROGRESS ══ */
const progressBar = document.getElementById('scroll-progress');
const btRingFill  = document.getElementById('btRing');
const backTopBtn  = document.getElementById('backTop');

window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const p = maxScroll > 0 ? scrolled / maxScroll : 0;

  if (progressBar) progressBar.style.width = (p * 100) + '%';
  if (btRingFill)  btRingFill.style.strokeDashoffset = 125.66 - (p * 125.66);
  if (backTopBtn)  backTopBtn.classList.toggle('show', scrolled > 600);
}, { passive: true });

/* ══ 5. BACK TO TOP ══ */
if (backTopBtn) {
  backTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ══ 6. NAV STICKY + ACTIVE LINKS ══ */
const navEl    = document.getElementById('nav');
const navLinks = document.querySelectorAll('.nav-links a');
const sdDots   = document.querySelectorAll('.sd');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  const sy = window.scrollY;
  if (navEl) navEl.classList.toggle('stuck', sy > 60);

  let current = '';
  sections.forEach(s => {
    if (sy >= s.offsetTop - 300) current = s.id;
  });

  navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current));
  sdDots.forEach(d  => d.classList.toggle('active',  d.getAttribute('href') === '#' + current));
}, { passive: true });

/* ══ 7. MOBILE DRAWER ══ */
const hamburger     = document.getElementById('hamburger');
const drawer        = document.getElementById('drawer');
const drawerClose   = document.getElementById('drawerClose');
const drawerOverlay = document.getElementById('drawerOverlay');

function openDrawer() {
  drawer.classList.add('open');
  drawerOverlay.classList.add('visible');
  hamburger.classList.add('open');
  hamburger.setAttribute('aria-expanded', 'true');
  drawer.setAttribute('aria-hidden', 'false');
  document.body.classList.add('no-scroll');
}

function closeDrawer() {
  drawer.classList.remove('open');
  drawerOverlay.classList.remove('visible');
  hamburger.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  drawer.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('no-scroll');
}

if (hamburger) hamburger.addEventListener('click', openDrawer);
if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);

document.querySelectorAll('.dl').forEach(a => {
  a.addEventListener('click', closeDrawer);
});

/* ══ 8. SMOOTH ANCHOR SCROLL ══ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* ══ 9. INTERSECTION OBSERVER — SCROLL REVEALS ══ */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('revealed');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('[data-reveal]').forEach(el => revealObs.observe(el));

/* ══ 10. STATS RING COUNTERS ══ */
function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

const statObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const ring = e.target;
    const numEl  = ring.querySelector('[data-count]');
    const fillEl = ring.querySelector('.sr-fill');

    if (!numEl || !fillEl) return;

    const target  = parseInt(numEl.dataset.count, 10);
    const prefix  = numEl.dataset.prefix  || '';
    const suffix  = numEl.dataset.suffix  || '';
    const pct     = parseFloat(fillEl.dataset.pct || 100);
    const C       = 326.73;
    const duration = 2000;
    const start = performance.now();

    requestAnimationFrame(function tick(now) {
      const t = Math.min((now - start) / duration, 1);
      const ease = easeOutCubic(t);
      numEl.textContent = prefix + Math.round(ease * target).toLocaleString() + suffix;
      fillEl.style.strokeDashoffset = C - (ease * pct / 100) * C;
      if (t < 1) requestAnimationFrame(tick);
    });

    statObs.unobserve(e.target);
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-ring').forEach(el => statObs.observe(el));

/* ══ 11. SKILL BARS ══ */
const skillObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.querySelectorAll('.sk-fill').forEach((fill, i) => {
      setTimeout(() => { fill.style.width = fill.dataset.w + '%'; }, i * 100);
    });
    skillObs.unobserve(e.target);
  });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-col').forEach(el => skillObs.observe(el));

/* ══ 12. DOMAIN CLOUD REVEAL ══ */
const cloudObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const spans = e.target.querySelectorAll('.domain-cloud span');
    spans.forEach((s, i) => {
      setTimeout(() => {
        s.style.transition = 'opacity .5s ease, transform .5s ease';
        s.style.opacity = '1';
        s.style.transform = 'none';
      }, i * 70);
    });
    cloudObs.unobserve(e.target);
  });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-col').forEach(el => {
  el.querySelectorAll('.domain-cloud span').forEach(s => {
    s.style.opacity = '0';
    s.style.transform = 'translateY(8px)';
  });
  cloudObs.observe(el);
});

/* ══ 13. TIMELINE SPINE DRAW ══ */
const spineFill = document.getElementById('spineFill');
if (spineFill) {
  const spineObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      spineFill.style.height = '100%';
      spineObs.unobserve(e.target);
    });
  }, { threshold: 0.05 });
  const timeline = document.querySelector('.timeline');
  if (timeline) spineObs.observe(timeline);
}

/* ══ 14. ACCORDION ══ */
document.querySelectorAll('.ac-head').forEach(head => {
  head.addEventListener('click', () => {
    const item   = head.closest('.ac-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.ac-item.open').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

/* ══ 15. FLIP CARDS TOUCH ══ */
document.querySelectorAll('.fc').forEach(card => {
  card.addEventListener('touchend', e => {
    e.preventDefault();
    card.classList.toggle('flipped');
  }, { passive: false });
});

/* ══ 16. MONOGRAM CARD PARALLAX ══ */
const monoCard = document.getElementById('monoCard');
if (monoCard && !isTouchDevice()) {
  document.addEventListener('mousemove', e => {
    const dx = ((e.clientX / window.innerWidth) - 0.5) * 22;
    const dy = ((e.clientY / window.innerHeight) - 0.5) * 14;
    monoCard.style.transform = `perspective(1000px) rotateY(${dx}deg) rotateX(${-dy}deg)`;
  });
  document.addEventListener('mouseleave', () => {
    monoCard.style.transform = '';
  });
}

/* ══ 17. GLOW ORB MOUSE FOLLOW ══ */
const go1 = document.querySelector('.go-1');
const go2 = document.querySelector('.go-2');
if (!isTouchDevice() && go1 && go2) {
  let ox1 = 0, oy1 = 0;
  (function animOrb() {
    ox1 += (mx - ox1) * 0.04;
    oy1 += (my - oy1) * 0.04;
    go1.style.left = (ox1 * 0.04) + 'px';
    go1.style.top  = (oy1 * 0.03) + 'px';
    requestAnimationFrame(animOrb);
  })();
}

/* ══ 18. 3D TILT ON CARDS ══ */
if (!isTouchDevice()) {
  function attachTilt(selector, strength = 10) {
    document.querySelectorAll(selector).forEach(card => {
      let af;
      card.addEventListener('mousemove', e => {
        cancelAnimationFrame(af);
        af = requestAnimationFrame(() => {
          const r = card.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width  - 0.5;
          const y = (e.clientY - r.top)  / r.height - 0.5;
          card.style.transform = `perspective(700px) rotateX(${-y * strength}deg) rotateY(${x * strength}deg) translateY(-4px)`;
          card.style.transition = 'none';
        });
      });
      card.addEventListener('mouseleave', () => {
        cancelAnimationFrame(af);
        card.style.transform = '';
        card.style.transition = '';
      });
    });
  }
  attachTilt('.award-card', 8);
  attachTilt('.personal-card', 7);
  attachTilt('.hkpi', 5);
  attachTilt('.tl-card', 3);
}

/* ══ 19. PARTICLE BURST ══ */
const pContainer = document.getElementById('particleContainer');

function spawnParticles(x, y, count = 16) {
  if (!pContainer) return;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const angle = (Math.PI * 2 / count) * i + Math.random() * 0.6;
    const dist  = 40 + Math.random() * 80;
    p.style.setProperty('--tx', `${Math.cos(angle) * dist}px`);
    p.style.setProperty('--ty', `${Math.sin(angle) * dist - 30}px`);
    p.style.setProperty('--dur', `${0.5 + Math.random() * 0.5}s`);
    p.style.left = x + 'px';
    p.style.top  = y + 'px';
    p.style.background = Math.random() > .5 ? 'var(--cyan)' : 'var(--sand)';
    pContainer.appendChild(p);
    setTimeout(() => p.remove(), 1200);
  }
}

document.querySelectorAll('.btn-primary, .btn-outline, .ct-link, .nav-hire').forEach(btn => {
  btn.addEventListener('click', e => spawnParticles(e.clientX, e.clientY, 14));
});

/* ══ 20. AWARD CONFETTI ON HOVER ══ */
if (!isTouchDevice()) {
  document.querySelectorAll('.award-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      const r = card.getBoundingClientRect();
      spawnParticles(r.left + r.width / 2, r.top + 10, 8);
    });
  });
}

/* ══ 21. COMP-ITEM STAGGER ══ */
document.querySelectorAll('.comp-item').forEach((item, i) => {
  item.style.transitionDelay = `${i * 22}ms`;
});

/* ══ 22. VIEWPORT HEIGHT FIX (mobile) ══ */
function setVH() {
  document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
}
setVH();
window.addEventListener('resize', setVH);

/* ══ 23. ESCAPE KEY CLOSES DRAWER ══ */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && drawer && drawer.classList.contains('open')) {
    closeDrawer();
  }
});

/* ══ 24. FOOTER FADE ══ */
const ftObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.style.opacity = '1';
    ftObs.unobserve(e.target);
  });
}, { threshold: 0.5 });

const ftCopy = document.querySelector('.ft-copy');
if (ftCopy) {
  ftCopy.style.opacity = '0';
  ftCopy.style.transition = 'opacity 1.2s ease';
  ftObs.observe(ftCopy);
}