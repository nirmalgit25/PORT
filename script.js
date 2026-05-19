/* ===== Portfolio — Nirmal Kumar ===== */

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// --- Loader ---
window.addEventListener('load', () => {
  setTimeout(() => {
    document.querySelector('.loader')?.classList.add('hidden');
    document.body.classList.add('loaded');
  }, 2000);
});

// --- Lenis smooth scroll ---
let lenis;
if (!prefersReducedMotion && typeof Lenis !== 'undefined') {
  lenis = new Lenis({
    duration: 1.4,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
}

// --- Typed text ---
const phrases = [
  'B.Tech Student · Android Developer',
  'Building mobile experiences',
  'Learning Kotlin & Java',
];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typedEl = document.getElementById('typed-text');

function typeEffect() {
  if (!typedEl || prefersReducedMotion) {
    if (typedEl) typedEl.textContent = phrases[0];
    return;
  }

  const current = phrases[phraseIndex];
  const speed = isDeleting ? 40 : 80;

  if (!isDeleting) {
    typedEl.textContent = current.substring(0, charIndex + 1);
    charIndex++;
    if (charIndex === current.length) {
      isDeleting = true;
      setTimeout(typeEffect, 2200);
      return;
    }
  } else {
    typedEl.textContent = current.substring(0, charIndex - 1);
    charIndex--;
    if (charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
    }
  }

  setTimeout(typeEffect, speed);
}

setTimeout(typeEffect, 2500);

// --- Particle canvas ---
const canvas = document.getElementById('particles');
if (canvas && !prefersReducedMotion) {
  const ctx = canvas.getContext('2d');
  let particles = [];
  let w, h;
  let mouse = { x: null, y: null };

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  function initParticles() {
    particles = [];
    const count = Math.min(80, Math.floor((w * h) / 15000));
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.5 + 0.2,
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    particles.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;

      if (mouse.x !== null) {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          p.x -= dx * 0.02;
          p.y -= dy * 0.02;
        }
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(61, 220, 132, ${p.opacity})`;
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const d = Math.hypot(p.x - p2.x, p.y - p2.y);
        if (d < 100) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(61, 220, 132, ${0.08 * (1 - d / 100)})`;
          ctx.stroke();
        }
      }
    });
    requestAnimationFrame(draw);
  }

  resize();
  initParticles();
  draw();
  window.addEventListener('resize', () => { resize(); initParticles(); });
  window.addEventListener('mousemove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
}

// --- Cursor glow ---
const cursorGlow = document.querySelector('.cursor-glow');
if (cursorGlow && window.matchMedia('(min-width: 769px)').matches) {
  let glowX = 0, glowY = 0, targetX = 0, targetY = 0;
  document.addEventListener('mousemove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
  });

  function animateGlow() {
    glowX += (targetX - glowX) * 0.08;
    glowY += (targetY - glowY) * 0.08;
    cursorGlow.style.left = glowX + 'px';
    cursorGlow.style.top = glowY + 'px';
    requestAnimationFrame(animateGlow);
  }
  animateGlow();
}

// --- Magnetic buttons ---
document.querySelectorAll('.magnetic').forEach((el) => {
  if (prefersReducedMotion) return;
  el.addEventListener('mousemove', (e) => {
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
  });
  el.addEventListener('mouseleave', () => {
    el.style.transform = '';
  });
});

// --- Scroll reveal ---
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        if (entry.target.classList.contains('skill-group')) {
          entry.target.querySelectorAll('.skill-tag').forEach((tag, i) => {
            tag.style.transitionDelay = `${i * 0.06}s`;
          });
        }
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.reveal, .timeline, .skill-group').forEach((el) => {
  revealObserver.observe(el);
});

// --- Skill bars ---
const barObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.skill-bar-fill').forEach((bar) => {
          bar.style.width = bar.dataset.width + '%';
        });
        barObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.3 }
);

document.querySelectorAll('.skill-bars').forEach((el) => barObserver.observe(el));

// --- Counter animation ---
function animateCounter(el, target) {
  const duration = 1800;
  const start = performance.now();
  function update(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 4);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target;
  }
  requestAnimationFrame(update);
}

const statObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const num = entry.target.querySelector('.stat-num');
        const target = parseInt(num.dataset.count, 10);
        animateCounter(num, target);
        statObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

document.querySelectorAll('.stat-card').forEach((el) => statObserver.observe(el));

// --- 3D tilt cards ---
document.querySelectorAll('.tilt-card').forEach((card) => {
  if (prefersReducedMotion) return;
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rotateX = (y - 0.5) * -12;
    const rotateY = (x - 0.5) * 12;
    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    card.style.setProperty('--mx', `${x * 100}%`);
    card.style.setProperty('--my', `${y * 100}%`);
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// --- Nav scroll + active link ---
const navWrap = document.querySelector('.nav-wrap');
const navLinks = document.querySelectorAll('[data-nav]');
const sections = ['hero', 'about', 'skills', 'work', 'contact'];
const navIndicator = document.querySelector('.nav-indicator');

function updateNav() {
  const scrollY = window.scrollY;
  navWrap?.classList.toggle('scrolled', scrollY > 50);

  let current = 'hero';
  sections.forEach((id) => {
    const el = document.getElementById(id);
    if (el && scrollY >= el.offsetTop - 120) current = id;
  });

  navLinks.forEach((link) => {
    const isActive = link.getAttribute('href') === `#${current}`;
    link.classList.toggle('active', isActive);
    if (isActive && navIndicator) {
      const linkRect = link.getBoundingClientRect();
      const navRect = link.closest('.nav')?.getBoundingClientRect();
      if (navRect) {
        navIndicator.style.width = linkRect.width + 'px';
        navIndicator.style.left = linkRect.left - navRect.left + 'px';
      }
    }
  });
}

window.addEventListener('scroll', updateNav, { passive: true });
updateNav();

// --- Mobile nav ---
const navToggle = document.querySelector('.nav-toggle');
const navLinksEl = document.querySelector('.nav-links');

navToggle?.addEventListener('click', () => {
  const open = navLinksEl.classList.toggle('open');
  navToggle.classList.toggle('open', open);
  navToggle.setAttribute('aria-expanded', open);
});

navLinksEl?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinksEl.classList.remove('open');
    navToggle?.classList.remove('open');
    navToggle?.setAttribute('aria-expanded', 'false');
  });
});

// --- Smooth anchor scroll with Lenis ---
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    const id = anchor.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    if (lenis) {
      lenis.scrollTo(target, { offset: -80 });
    } else {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
