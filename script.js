// ── NAVBAR SCROLL ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ── MOBILE MENU ──
const hamburger = document.getElementById('hamburger-btn');
const mobileMenu = document.getElementById('mobile-menu');
const mobileClose = document.getElementById('mobile-close');

hamburger.addEventListener('click', () => mobileMenu.classList.add('open'));
mobileClose.addEventListener('click', () => mobileMenu.classList.remove('open'));

document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// ── SMOOTH SCROLL ──
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ── SCROLL ANIMATIONS ──
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-up, .fade-left, .fade-right').forEach(el => {
  observer.observe(el);
});

// ── COUNTER ANIMATION ──
function animateCounter(el) {
  const target = parseInt(el.dataset.count);
  if (!target) return;
  const duration = 2000;
  const step = target / (duration / 16);
  let current = 0;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      el.textContent = target.toLocaleString('ar-EG');
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(current).toLocaleString('ar-EG');
    }
  }, 16);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

// ── STEP ANIMATION ──
const steps = document.querySelectorAll('.step');
let currentStep = 0;
function cycleSteps() {
  steps.forEach(s => s.classList.remove('active'));
  steps[currentStep].classList.add('active');
  currentStep = (currentStep + 1) % steps.length;
}
if (steps.length) setInterval(cycleSteps, 2500);

// ── ACTIVE NAV LINK ──
const sections = document.querySelectorAll('section[id], div[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 120) {
      current = section.id;
    }
  });
  navLinks.forEach(link => {
    link.style.color = link.getAttribute('href') === `#${current}` ? 'var(--primary)' : '';
  });
});

// ── PARALLAX HERO GRID ──
const heroGrid = document.querySelector('.hero-grid');
window.addEventListener('scroll', () => {
  if (heroGrid) {
    heroGrid.style.transform = `translateY(${window.scrollY * 0.3}px)`;
  }
});

// ── CARD HOVER GLOW ──
document.querySelectorAll('.service-card, .feature-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(255,107,0,0.08), var(--card) 60%)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.background = '';
  });
});

// ── TYPING EFFECT HERO ──
const heroTitle = document.querySelector('.hero-title');

// ── RIDE REQUEST MODAL ──
function openRideModal() {
  const modal = document.getElementById('ride-modal');
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  // reset
  ['rf-name','rf-phone','rf-from','rf-to','rf-notes'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  document.getElementById('rf-success').style.display = 'none';
  document.getElementById('rf-error').style.display = 'none';
}

function closeRideModal() {
  document.getElementById('ride-modal').style.display = 'none';
  document.body.style.overflow = '';
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeRideModal();
});

function submitRideRequest() {
  const name  = document.getElementById('rf-name').value.trim();
  const phone = document.getElementById('rf-phone').value.trim();
  const from  = document.getElementById('rf-from').value.trim();
  const to    = document.getElementById('rf-to').value.trim();
  const type  = document.getElementById('rf-type').value;
  const notes = document.getElementById('rf-notes').value.trim();
  const err   = document.getElementById('rf-error');
  const ok    = document.getElementById('rf-success');

  err.style.display = 'none';
  ok.style.display  = 'none';

  if (!name || !phone || !from || !to) {
    err.style.display = 'block';
    return;
  }

  // 1) حفظ في Firebase Realtime Database
  try {
    const db = firebase.database();
    db.ref('requests').push({
      name, phone, from, to, type,
      notes: notes || '',
      status: 'pending',
      ts: Date.now()
    });
  } catch(e) {
    console.error('Firebase error:', e);
  }

  // 2) فتح واتساب فوراً
  const msg = encodeURIComponent(
    `🏍️ طلب رحلة جديد\nالاسم: ${name}\nالتليفون: ${phone}\nمن: ${from}\nإلى: ${to}${notes ? '\nملاحظات: ' + notes : ''}`
  );
  window.open(`https://wa.me/201233346179?text=${msg}`, '_blank');

  // 3) رسالة نجاح وإغلاق
  ok.style.display = 'block';
  setTimeout(() => closeRideModal(), 2000);
}
