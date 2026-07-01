/* ===== HERO SLIDESHOW (fallback when video not playing) ===== */
(function () {
  const video = document.querySelector('.hero-video');
  const slides = document.querySelectorAll('.hero-slide');

  // If video plays fine, keep slides hidden; if it fails, show slideshow
  if (video) {
    video.addEventListener('playing', () => {
      const slidesWrap = document.getElementById('heroSlides');
      if (slidesWrap) slidesWrap.style.opacity = '0';
    });
    video.addEventListener('error', () => showSlideshow());
    // If video doesn't start within 3s, fall back
    const fallbackTimer = setTimeout(showSlideshow, 3000);
    video.addEventListener('playing', () => clearTimeout(fallbackTimer));
  }

  function showSlideshow() {
    const slidesWrap = document.getElementById('heroSlides');
    if (slidesWrap) { slidesWrap.style.opacity = '1'; slidesWrap.style.pointerEvents = 'auto'; }
    if (!slides.length) return;
    let current = 0;
    setInterval(() => {
      slides[current].classList.remove('active');
      current = (current + 1) % slides.length;
      slides[current].classList.add('active');
    }, 6000);
  }

  // Also run slideshow independently if no video element
  if (!video && slides.length) {
    let current = 0;
    setInterval(() => {
      slides[current].classList.remove('active');
      current = (current + 1) % slides.length;
      slides[current].classList.add('active');
    }, 6000);
  }
})();

/* ===== NAVBAR SCROLL ===== */
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
}

/* ===== MOBILE NAV TOGGLE ===== */
(function () {
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (!navToggle || !navLinks) return;

  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    if (navbar) navbar.classList.toggle('menu-open');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      if (navbar) navbar.classList.remove('menu-open');
    });
  });
})();

/* ===== SCROLL REVEAL ===== */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
  revealObserver.observe(el);
});

/* ===== HERO: trigger reveals on load ===== */
window.addEventListener('load', () => {
  document.querySelectorAll('#hero .reveal').forEach((el, i) => {
    setTimeout(() => el.classList.add('revealed'), 300 + i * 180);
  });
});

/* ===== HERO PARTICLES ===== */
(function () {
  const container = document.getElementById('heroParticles');
  if (!container) return;
  for (let i = 0; i < 30; i++) {
    const p = document.createElement('span');
    p.classList.add('particle');
    p.style.setProperty('--dur', (4 + Math.random() * 6) + 's');
    p.style.setProperty('--delay', (Math.random() * 8) + 's');
    p.style.left = (Math.random() * 100) + '%';
    p.style.top = (40 + Math.random() * 50) + '%';
    p.style.width = (1 + Math.random() * 3) + 'px';
    p.style.height = p.style.width;
    container.appendChild(p);
  }
})();

/* ===== MENU TABS ===== */
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const tab = btn.dataset.tab;
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.menu-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    const panel = document.getElementById('tab-' + tab);
    if (panel) {
      panel.classList.add('active');
      panel.querySelectorAll('.reveal').forEach(el => {
        el.classList.remove('revealed');
        setTimeout(() => revealObserver.observe(el), 10);
      });
    }
  });
});

/* ===== RESERVATION FORM ===== */
(function () {
  const form = document.getElementById('reservationForm');
  const success = document.getElementById('formSuccess');
  if (!form) return;

  const dateInput = document.getElementById('date');
  if (dateInput) {
    const today = new Date();
    const maxDay = new Date(today);
    maxDay.setDate(today.getDate() + 60);
    dateInput.setAttribute('min', today.toISOString().split('T')[0]);
    dateInput.setAttribute('max', maxDay.toISOString().split('T')[0]);
  }

  function setError(id, msg) {
    const errEl = document.getElementById(id + '-error');
    const input = document.getElementById(id);
    if (errEl) errEl.textContent = msg;
    if (input) {
      input.classList.toggle('input-error', !!msg);
      input.classList.toggle('input-ok', !msg && input.value.trim() !== '');
      const stepper = input.closest('.guest-stepper');
      if (stepper) {
        stepper.classList.toggle('input-error', !!msg);
        stepper.classList.toggle('input-ok', !msg && input.value.trim() !== '');
      }
    }
  }

  function clearError(id) { setError(id, ''); }

  ['fname', 'lname', 'email', 'date', 'time', 'guests'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('input', () => clearError(id));
    el.addEventListener('change', () => {
      clearError(id);
      if (id === 'guests') {
        const note = document.getElementById('guests-note');
        const v = parseInt(el.value, 10);
        if (note) note.style.display = (v > 12 && el.value) ? 'block' : 'none';
      }
    });
  });

  function validateForm() {
    let valid = true;
    const fname = document.getElementById('fname');
    if (!fname || !fname.value.trim()) { setError('fname', 'First name is required.'); valid = false; } else clearError('fname');
    const lname = document.getElementById('lname');
    if (!lname || !lname.value.trim()) { setError('lname', 'Last name is required.'); valid = false; } else clearError('lname');
    const email = document.getElementById('email');
    if (!email || !email.value.trim()) { setError('email', 'Email address is required.'); valid = false; }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) { setError('email', 'Please enter a valid email address.'); valid = false; }
    else clearError('email');
    const date = document.getElementById('date');
    if (!date || !date.value) { setError('date', 'Please choose a date.'); valid = false; } else clearError('date');
    const time = document.getElementById('time');
    if (!time || !time.value) { setError('time', 'Please select a time.'); valid = false; } else clearError('time');
    const guests = document.getElementById('guests');
    if (guests) {
      const gVal = parseInt(guests.value, 10);
      if (!guests.value || isNaN(gVal) || gVal < 1) { setError('guests', 'Please enter at least 1 guest.'); valid = false; }
      else if (gVal > 100) { setError('guests', 'For very large events, please contact us directly.'); valid = false; }
      else clearError('guests');
    }
    return valid;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const submitBtn = form.querySelector('[type="submit"]');
    submitBtn.textContent = 'Sending…';
    submitBtn.style.opacity = '0.7';
    submitBtn.disabled = true;
    setTimeout(() => {
      if (success) success.classList.add('visible');
      form.reset();
      const gNote = document.getElementById('guests-note');
      if (gNote) gNote.style.display = 'none';
      ['fname', 'lname', 'email', 'date', 'time', 'guests'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.remove('input-ok', 'input-error');
      });
      const stepper = document.getElementById('guestStepper');
      if (stepper) stepper.classList.remove('input-ok', 'input-error');
      submitBtn.textContent = 'Confirm Reservation';
      submitBtn.style.opacity = '';
      submitBtn.disabled = false;
      if (success) success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 1200);
  });
})();

/* ===== SMOOTH ACTIVE NAV LINK ===== */
(function () {
  const sections = document.querySelectorAll('section[id]');
  if (!sections.length) return;
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        document.querySelectorAll('.nav-links a').forEach(a => {
          a.style.color = '';
          if (a.getAttribute('href') === '#' + id) a.style.color = 'var(--gold)';
        });
      }
    });
  }, { threshold: 0.45 });
  sections.forEach(s => navObserver.observe(s));
})();

/* ===== PARALLAX on Experience Section ===== */
(function () {
  const sec = document.getElementById('experience');
  if (!sec) return;
  window.addEventListener('scroll', () => {
    const rect = sec.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      const offset = (window.scrollY - sec.offsetTop) * 0.3;
      sec.style.backgroundPositionY = `calc(50% + ${offset}px)`;
    }
  }, { passive: true });
})();

/* ===== WHATSAPP WIDGET ===== */
(function () {
  const fab = document.getElementById('waFab');
  const popup = document.getElementById('waPopup');
  const closeBtn = document.getElementById('waClose');
  if (!fab || !popup) return;

  fab.addEventListener('click', () => popup.classList.toggle('open'));
  if (closeBtn) closeBtn.addEventListener('click', (e) => { e.stopPropagation(); popup.classList.remove('open'); });

  if (!sessionStorage.getItem('waShown')) {
    setTimeout(() => {
      popup.classList.add('open');
      sessionStorage.setItem('waShown', '1');
    }, 8000);
  }
})();

/* ===== SCROLL PROGRESS BAR ===== */
(function () {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100;
    bar.style.width = pct + '%';
  }, { passive: true });
})();

/* ===== PRELOADER ===== */
(function () {
  const loader = document.getElementById('preloader');
  if (!loader) return;

  function hide() { loader.classList.add('hidden'); }

  // Hard cap: always dismiss within 2.5s regardless of network
  const maxTimer = setTimeout(hide, 2500);

  if (document.readyState === 'complete') {
    clearTimeout(maxTimer);
    setTimeout(hide, 400);
  } else {
    window.addEventListener('load', () => {
      clearTimeout(maxTimer);
      setTimeout(hide, 400);
    });
  }
})();

/* ===== CUSTOM CURSOR ===== */
(function () {
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  let mx = -200, my = -200, rx = -200, ry = -200;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top = my + 'px';
  });

  (function loop() {
    rx += (mx - rx) * 0.13;
    ry += (my - ry) * 0.13;
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    requestAnimationFrame(loop);
  })();

  document.querySelectorAll('a, button, .gallery-item, .feature-card, input, select, textarea').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
})();

/* ===== COUNTER ANIMATION ===== */
(function () {
  const el = document.querySelector('.badge-num[data-count]');
  if (!el) return;
  const target = parseInt(el.dataset.count, 10);
  new IntersectionObserver((entries, obs) => {
    if (!entries[0].isIntersecting) return;
    obs.disconnect();
    let n = 0;
    const step = () => {
      n = Math.min(n + 1, target);
      el.textContent = n + '+';
      if (n < target) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, { threshold: 0.8 }).observe(el);
})();

/* ===== FLOATING LABELS ===== */
document.querySelectorAll('.form-group.floating').forEach(group => {
  const input = group.querySelector('input, textarea');
  if (!input) return;
  const update = () => group.classList.toggle('has-value', input.value.trim() !== '');
  input.addEventListener('focus', () => group.classList.add('focused'));
  input.addEventListener('blur', () => { group.classList.remove('focused'); update(); });
  input.addEventListener('input', update);
  update();
});

/* ===== GUEST STEPPER ===== */
(function () {
  const input = document.getElementById('guests');
  const minus = document.getElementById('guestMinus');
  const plus = document.getElementById('guestPlus');
  if (!input || !minus || !plus) return;

  function update(val) {
    input.value = val;
    input.dispatchEvent(new Event('change'));
    const note = document.getElementById('guests-note');
    if (note) note.style.display = val > 12 ? 'block' : 'none';
  }

  minus.addEventListener('click', () => { const v = parseInt(input.value || '1', 10); if (v > 1) update(v - 1); });
  plus.addEventListener('click', () => { const v = parseInt(input.value || '0', 10); if (v < 100) update(v + 1); });
})();

/* ===== GALLERY LIGHTBOX ===== */
(function () {
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightboxImg');
  const lbCap = document.getElementById('lightboxCaption');
  const lbX = document.getElementById('lightboxClose');
  if (!lb) return;

  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const cap = item.querySelector('.gallery-overlay span');
      lbImg.src = img.src.replace(/w=\d+/, 'w=1600');
      lbImg.alt = img.alt;
      if (lbCap) lbCap.textContent = cap ? cap.textContent : '';
      lb.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  function close() { lb.classList.remove('open'); document.body.style.overflow = ''; }
  if (lbX) lbX.addEventListener('click', close);
  lb.addEventListener('click', e => { if (e.target === lb) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && lb.classList.contains('open')) close(); });
})();

/* ===== TESTIMONIALS CAROUSEL ===== */
(function () {
  const track = document.getElementById('testiTrack');
  const carousel = document.getElementById('testiCarousel');
  const dotsWrap = document.getElementById('testiDots');
  const prevBtn = document.getElementById('testiPrev');
  const nextBtn = document.getElementById('testiNext');
  if (!track || !carousel) return;

  const cards = Array.from(track.children);
  let current = 0;
  let perView = getPerView();
  let total = Math.ceil(cards.length / perView);

  function getPerView() {
    if (window.innerWidth <= 768) return 1;
    if (window.innerWidth <= 1024) return 2;
    return 3;
  }

  function buildDots() {
    if (!dotsWrap) return;
    dotsWrap.innerHTML = '';
    total = Math.ceil(cards.length / perView);
    for (let i = 0; i < total; i++) {
      const btn = document.createElement('button');
      btn.classList.add('testi-dot-btn');
      if (i === current) btn.classList.add('active');
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      btn.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(btn);
    }
  }

  function updateDots() {
    if (!dotsWrap) return;
    dotsWrap.querySelectorAll('.testi-dot-btn').forEach((b, i) => b.classList.toggle('active', i === current));
  }

  function getCardWidth() {
    if (!cards[0]) return 0;
    return cards[0].offsetWidth + 24; // gap = 1.5rem = 24px
  }

  function goTo(n) {
    current = Math.max(0, Math.min(n, total - 1));
    track.style.transform = 'translateX(-' + (current * perView * getCardWidth()) + 'px)';
    updateDots();
    if (prevBtn) prevBtn.disabled = current === 0;
    if (nextBtn) nextBtn.disabled = current >= total - 1;
  }

  if (prevBtn) prevBtn.addEventListener('click', () => goTo(current - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => goTo(current + 1));

  let autoTimer = setInterval(() => goTo((current + 1) % total), 6000);
  carousel.addEventListener('mouseenter', () => clearInterval(autoTimer));
  carousel.addEventListener('mouseleave', () => { autoTimer = setInterval(() => goTo((current + 1) % total), 6000); });

  let touchStartX = 0;
  carousel.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  carousel.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) goTo(dx < 0 ? current + 1 : current - 1);
  }, { passive: true });

  // Animate rating bars
  document.querySelectorAll('.testi-bar-fill').forEach(b => {
    new IntersectionObserver((entries, obs) => {
      if (entries[0].isIntersecting) { b.classList.add('animated'); obs.disconnect(); }
    }, { threshold: 0.5 }).observe(b);
  });

  window.addEventListener('resize', () => {
    const newPer = getPerView();
    if (newPer !== perView) { perView = newPer; current = 0; buildDots(); goTo(0); }
  }, { passive: true });

  buildDots();
  goTo(0);
})();

/* ===== BOOKING TYPE TOGGLE ===== */
(function () {
  const btns = document.querySelectorAll('.btoggle-btn');
  const occasionGrp = document.getElementById('occasionGroup');
  const eventTypeGrp = document.getElementById('eventTypeGroup');
  const eventExtraRow = document.getElementById('eventExtraRow');
  const submitBtn = document.getElementById('submitBtn');
  const successMsg = document.getElementById('successMsg');
  const notesLabel = document.getElementById('notesLabel');
  const notesTA = document.getElementById('notes');
  if (!btns.length) return;

  function switchType(type) {
    btns.forEach(b => b.classList.toggle('active', b.dataset.type === type));
    const isEvent = type === 'event';
    if (occasionGrp) occasionGrp.style.display = isEvent ? 'none' : '';
    if (eventTypeGrp) eventTypeGrp.style.display = isEvent ? '' : 'none';
    if (eventExtraRow) eventExtraRow.style.display = isEvent ? '' : 'none';
    if (submitBtn) submitBtn.textContent = isEvent ? 'Submit Event Enquiry' : 'Confirm Reservation';
    if (notesLabel) notesLabel.textContent = isEvent ? 'Event Details & Special Requirements' : 'Special Requests or Dietary Requirements';
    if (notesTA) notesTA.placeholder = isEvent ? 'Describe your event vision, any theming, dietary needs, AV requirements…' : 'Any allergies, dietary restrictions, or special requests…';
    if (successMsg) successMsg.textContent = isEvent ? 'Thank you. Your event enquiry has been received. Our events team will be in touch within 24 hours.' : "Thank you. Your reservation request has been received. We'll confirm by email within 2 hours.";
  }

  btns.forEach(btn => btn.addEventListener('click', () => switchType(btn.dataset.type)));
})();
