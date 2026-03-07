'use strict';

const isTouchDevice = () =>
  window.matchMedia('(hover:none), (pointer:coarse)').matches || ('ontouchstart' in window);

const loader = document.getElementById('loader');
const ldPct = document.getElementById('ldPct');
const ldFill = document.getElementById('ldFill');
document.body.style.overflow = 'hidden';

let pct = 0;
const loadInterval = setInterval(() => {
  pct = Math.min(pct + Math.random() * 14, 100);
  if (ldPct) ldPct.textContent = Math.floor(pct);
  if (ldFill) ldFill.setAttribute('d', `M20 140 L${20 + (pct / 100) * 240} 140`);
  if (pct >= 100) {
    clearInterval(loadInterval);
    setTimeout(() => {
      if (loader) loader.classList.add('out');
      document.body.style.overflow = '';
      revealHero();
    }, 400);
  }
}, 80);

function revealHero() {
  document.querySelectorAll('#hero [data-anim]').forEach(el => el.classList.add('in'));
  splitNameLetters();
  setTimeout(startTypewriter, 600);
  setTimeout(startGlitch, 1200);
}

function splitNameLetters() {
  document.querySelectorAll('[data-anim="letters"]').forEach(el => {
    const delay = parseFloat(el.style.getPropertyValue('--d') || '0') * 1000;
    const text = el.textContent.trim();
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

const phrases = [
  'PMO & Operations Manager',
  'Program Delivery Executive',
  'Digital Transformation Leader',
  'ISO 9001 · 27001 Champion',
  'Saudi Vision 2030 Enabler',
  'Multi-Million Dollar Portfolio Lead'
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
    if (ci > phrase.length) {
      del = true;
      setTimeout(typeStep, 2200);
      return;
    }
  } else {
    twEl.textContent = phrase.slice(0, ci--);
    if (ci < 0) {
      del = false;
      pi = (pi + 1) % phrases.length;
      ci = 0;
    }
  }
  setTimeout(typeStep, del ? 38 : 72);
}

function startGlitch() {
  if (!twEl) return;
  setInterval(() => {
    twEl.setAttribute('data-text', twEl.textContent);
    twEl.classList.add('glitch');
  }, 300);
}

const cur = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

if (!isTouchDevice()) {
  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    if (cur) {
      cur.style.left = mx + 'px';
      cur.style.top = my + 'px';
    }
  });

  (function animRing() {
    rx += (mx - rx) * 0.095;
    ry += (my - ry) * 0.095;
    if (ring) {
      ring.style.left = rx + 'px';
      ring.style.top = ry + 'px';
    }
    requestAnimationFrame(animRing);
  })();

  const hoverEls = 'a,button,.fc,.cert-fc,.award-card,.comp-item,.ac-head,.hfs-card,.h-pill,.pc-attrs span,.domain-tags span,.ac-tags span';
  document.querySelectorAll(hoverEls).forEach(el => {
    el.addEventListener('mouseenter', () => {
      cur?.classList.add('hover');
      ring?.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
      cur?.classList.remove('hover');
      ring?.classList.remove('hover');
    });
  });

  document.addEventListener('mousedown', () => cur?.classList.add('click'));
  document.addEventListener('mouseup', () => cur?.classList.remove('click'));
}

const trailWrap = document.getElementById('trailWrap');
if (!isTouchDevice() && trailWrap) {
  const TRAIL_LEN = 10;
  const trail = [];
  const trailPos = Array(TRAIL_LEN).fill().map(() => ({ x: 0, y: 0 }));

  for (let i = 0; i < TRAIL_LEN; i++) {
    const dot = document.createElement('div');
    dot.className = 'trail-dot';
    dot.style.opacity = (1 - i / TRAIL_LEN) * 0.5;
    dot.style.width = Math.max(2, 5 - i * 0.4) + 'px';
    dot.style.height = dot.style.width;
    dot.style.background = `rgba(212,164,50,${0.6 - i * 0.06})`;
    trailWrap.appendChild(dot);
    trail.push(dot);
  }

  (function animTrail() {
    trailPos.unshift({ x: mx, y: my });
    trailPos.pop();
    trail.forEach((dot, i) => {
      dot.style.left = trailPos[i].x + 'px';
      dot.style.top = trailPos[i].y + 'px';
    });
    requestAnimationFrame(animTrail);
  })();
}

const canvas = document.getElementById('canvas');
let ctx, CW, CH, NODES = [];
if (!isTouchDevice() && canvas) {
  ctx = canvas.getContext('2d');

  function resizeCanvas() {
    CW = canvas.width = window.innerWidth;
    CH = canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  let canvasMX = -1000, canvasMY = -1000;
  document.addEventListener('mousemove', e => {
    canvasMX = e.clientX;
    canvasMY = e.clientY;
  });

  NODES = Array.from({ length: 100 }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    vx: (Math.random() - .5) * 0.3,
    vy: (Math.random() - .5) * 0.3,
    r: Math.random() * 1.6 + 0.4
  }));

  (function drawCanvas() {
    ctx.clearRect(0, 0, CW, CH);
    NODES.forEach(n => {
      const dx = canvasMX - n.x, dy = canvasMY - n.y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < 200 && d > 0) {
        n.vx += (dx / d) * .018;
        n.vy += (dy / d) * .018;
      }
      n.vx *= .985;
      n.vy *= .985;
      const sp = Math.sqrt(n.vx * n.vx + n.vy * n.vy);
      if (sp > 1.5) {
        n.vx = (n.vx / sp) * 1.5;
        n.vy = (n.vy / sp) * 1.5;
      }
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > CW) n.vx *= -1;
      if (n.y < 0 || n.y > CH) n.vy *= -1;
    });

    for (let i = 0; i < NODES.length; i++) {
      for (let j = i + 1; j < NODES.length; j++) {
        const dx = NODES[i].x - NODES[j].x;
        const dy = NODES[i].y - NODES[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 150) {
          ctx.beginPath();
          ctx.moveTo(NODES[i].x, NODES[i].y);
          ctx.lineTo(NODES[j].x, NODES[j].y);
          ctx.strokeStyle = `rgba(212,164,50,${0.12 * (1 - d / 150)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    NODES.forEach(n => {
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(212,164,50,.4)';
      ctx.fill();
    });
    requestAnimationFrame(drawCanvas);
  })();
}

const scrollBar = document.getElementById('scroll-bar');
window.addEventListener('scroll', () => {
  const p = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
  if (scrollBar) scrollBar.style.width = Math.min(p, 100) + '%';
}, { passive: true });

const nav = document.getElementById('nav');
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section[id]');
const backTop = document.getElementById('backTop');

window.addEventListener('scroll', () => {
  nav?.classList.toggle('sticky', window.scrollY > 80);
  backTop?.classList.toggle('show', window.scrollY > 700);
  let currentSection = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 260) currentSection = s.id;
  });
  navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + currentSection));
}, { passive: true });

backTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

const hamburger = document.getElementById('hamburger');
const drawer = document.getElementById('drawer');

hamburger?.addEventListener('click', () => {
  const open = drawer.classList.toggle('open');
  hamburger.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
});

document.querySelectorAll('.drawer-link, .drawer-contact-link').forEach(l => {
  l.addEventListener('click', () => {
    drawer?.classList.remove('open');
    hamburger?.classList.remove('open');
    document.body.style.overflow = '';
  });
});

const revObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      revObs.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('[data-anim]:not(#hero [data-anim]):not([data-anim="letters"])').forEach(el => revObs.observe(el));

const tlObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      tlObs.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.tl-left .tl-card, .tl-right .tl-card').forEach(el => tlObs.observe(el));

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

const statObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const numEl = e.target.querySelector('.sr-num');
    const fillEl = e.target.querySelector('.sr-fill');
    if (!numEl || !fillEl) return;

    const target = parseInt(numEl.dataset.count);
    const prefix = numEl.dataset.prefix || '';
    const suffix = numEl.dataset.suffix || '';
    const pctVal = parseFloat(fillEl.dataset.pct || 100);
    const C = 326.73;
    const dur = 2000;
    const start = performance.now();

    requestAnimationFrame(function tick(now) {
      const p = Math.min((now - start) / dur, 1);
      const ep = easeOutCubic(p);
      const num = Math.round(ep * target);
      numEl.textContent = prefix + num.toLocaleString() + suffix;
      fillEl.style.strokeDashoffset = C - (ep * pctVal / 100) * C;
      if (p < 1) requestAnimationFrame(tick);
    });
    statObs.unobserve(e.target);
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-ring').forEach(el => statObs.observe(el));

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

document.querySelectorAll('.ac-head').forEach(head => {
  head.addEventListener('click', () => {
    const item = head.closest('.ac-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.ac-item.open').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

document.querySelectorAll('.fc').forEach(card => {
  card.addEventListener('click', e => {
    if (window.matchMedia('(hover:none), (pointer:coarse)').matches) {
      e.preventDefault();
      document.querySelectorAll('.fc.flipped').forEach(openCard => {
        if (openCard !== card) openCard.classList.remove('flipped');
      });
      card.classList.toggle('flipped');
    }
  });
});

document.querySelectorAll('.cert-fc').forEach(card => {
  card.addEventListener('click', e => {
    if (window.matchMedia('(hover:none), (pointer:coarse)').matches) {
      e.preventDefault();
      card.classList.toggle('flipped');
    }
  });
});

if (!isTouchDevice()) {
  document.querySelectorAll('.magnetic').forEach(el => {
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width / 2) * 0.3;
      const dy = (e.clientY - r.top - r.height / 2) * 0.3;
      el.style.transform = `translate(${dx}px,${dy}px)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  });
}

const monoCard = document.getElementById('monogramCard');
if (monoCard && !isTouchDevice()) {
  document.addEventListener('mousemove', e => {
    const dx = ((e.clientX / window.innerWidth) - .5) * 18;
    const dy = ((e.clientY / window.innerHeight) - .5) * 12;
    monoCard.style.transform = `perspective(1200px) rotateY(${dx}deg) rotateX(${-dy}deg)`;
  });
}

function spawnParticles(x, y, count = 20) {
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const angle = (Math.PI * 2 / count) * i + Math.random() * .5;
    const dist = 60 + Math.random() * 80;
    p.style.setProperty('--tx', `${Math.cos(angle) * dist}px`);
    p.style.setProperty('--ty', `${Math.sin(angle) * dist - 40}px`);
    p.style.setProperty('--dur', `${.6 + Math.random() * .5}s`);
    p.style.left = x + 'px';
    p.style.top = y + 'px';
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 1200);
  }
}
document.querySelectorAll('.btn-gold,.ct-link,.nav-hire').forEach(btn => {
  btn.addEventListener('click', e => spawnParticles(e.clientX, e.clientY, 16));
});

document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (!t) return;
    e.preventDefault();
    t.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

if (!isTouchDevice()) {
  document.querySelectorAll('.award-card,.personal-card,.hfs-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5;
      const y = (e.clientY - r.top) / r.height - .5;
      card.style.transform = `perspective(700px) rotateX(${-y * 12}deg) rotateY(${x * 12}deg) translateY(-5px)`;
      card.style.transition = 'none';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = '';
    });
  });
}

window.addEventListener('scroll', () => {
  const sy = window.scrollY;
  const glow1 = document.querySelector('.hero-glow-1');
  const glow2 = document.querySelector('.hero-glow-2');
  if (glow1) glow1.style.transform = `translate(${sy * .06}px,${sy * .04}px) scale(1)`;
  if (glow2) glow2.style.transform = `translate(${-sy * .04}px,${sy * .06}px) scale(1)`;
}, { passive: true });

window.addEventListener('resize', () => {
  if (canvas && ctx && !isTouchDevice()) {
    CW = canvas.width = window.innerWidth;
    CH = canvas.height = window.innerHeight;
    NODES.forEach(n => {
      n.x = Math.min(n.x, CW);
      n.y = Math.min(n.y, CH);
    });
  }
});