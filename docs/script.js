/* ============================================================
   Portfolio — script.js
   ============================================================

   GOOGLE APPS SCRIPT SETUP (one-time, ~5 minutes):
   ─────────────────────────────────────────────────
   1. Go to https://script.google.com and create a New Project.
   2. Paste the code from docs/appsscript.gs into the editor.
   3. Click Deploy → New deployment → Web app.
      - Execute as: Me
      - Who has access: Anyone
   4. Click Deploy, copy the Web App URL.
   5. Replace APPS_SCRIPT_URL below with that URL.
   ─────────────────────────────────────────────────
*/

(function () {
  'use strict';

  /* ── CONFIG ─────────────────────────────────────────────── */
  var APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxG4vTawxZX4s4z-s_TdvLSrQ86_j71tb9QgVBbgjofXUlsa7i4jOiD2PeBGA9rWMLR/exec';

  /* ── Year ───────────────────────────────────────────────── */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ── Reading progress bar ───────────────────────────────── */
  var progressBar = document.getElementById('reading-progress');
  if (progressBar) {
    window.addEventListener('scroll', function () {
      var scrollTop  = window.scrollY;
      var docHeight  = document.documentElement.scrollHeight - window.innerHeight;
      var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = pct + '%';
    }, { passive: true });
  }

  /* ── Mobile nav toggle ──────────────────────────────────── */
  var navToggle = document.getElementById('nav-toggle');
  var mainNav   = document.getElementById('main-nav');
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', function () {
      var open = mainNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(open));
    });
    mainNav.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        mainNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ── Sticky header ──────────────────────────────────────── */
  var header = document.getElementById('site-header');
  if (header) {
    window.addEventListener('scroll', function () {
      header.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  /* ── Active nav link on scroll ──────────────────────────── */
  var sections = Array.from(document.querySelectorAll('section[id]'));
  var navLinks  = Array.from(document.querySelectorAll('.nav-link'));

  function updateActiveLink() {
    var scrollY = window.scrollY + 100;
    var current = '';
    sections.forEach(function (sec) {
      if (sec.offsetTop <= scrollY) current = sec.id;
    });
    navLinks.forEach(function (link) {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  }
  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();

  /* ── Scroll-reveal ──────────────────────────────────────── */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -36px 0px' });
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ── Animated stat counters ─────────────────────────────── */
  var statEls = document.querySelectorAll('.stat-number[data-target]');
  if ('IntersectionObserver' in window && statEls.length) {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        counterObserver.unobserve(entry.target);
        animateCounter(entry.target);
      });
    }, { threshold: 0.5 });
    statEls.forEach(function (el) { counterObserver.observe(el); });
  } else {
    statEls.forEach(function (el) {
      el.textContent = el.getAttribute('data-target') + (el.getAttribute('data-suffix') || '');
    });
  }

  function animateCounter(el) {
    var target  = parseInt(el.getAttribute('data-target'), 10);
    var suffix  = el.getAttribute('data-suffix') || '';
    var duration = 1400;
    var start    = null;
    var startVal = 0;

    function step(timestamp) {
      if (!start) start = timestamp;
      var progress = Math.min((timestamp - start) / duration, 1);
      // ease-out cubic
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = Math.round(startVal + eased * (target - startVal));
      el.textContent = current.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ── Skill progress bars ────────────────────────────────── */
  var barEls = document.querySelectorAll('.skill-bar-fill[data-width]');
  if ('IntersectionObserver' in window && barEls.length) {
    var barObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        barObserver.unobserve(entry.target);
        // Small delay so transition is visible after paint
        setTimeout(function () {
          entry.target.style.width = entry.target.getAttribute('data-width') + '%';
        }, 120);
      });
    }, { threshold: 0.3 });
    barEls.forEach(function (el) { barObserver.observe(el); });
  } else {
    barEls.forEach(function (el) {
      el.style.width = el.getAttribute('data-width') + '%';
    });
  }

  /* ── Typewriter role ────────────────────────────────────── */
  var typedEl = document.getElementById('typed-role');
  if (typedEl) {
    var roles = [
      'Application Architect at IBM',
      'Enterprise Digital Transformation',
      'AI Strategy & Architecture',
      'E-Commerce Platform Expert'
    ];
    var ri = 0, ci = 0, deleting = false;

    function type() {
      var current = roles[ri];
      if (!deleting) {
        typedEl.textContent = current.slice(0, ci + 1);
        ci++;
        if (ci === current.length) { deleting = true; setTimeout(type, 2400); return; }
        setTimeout(type, 62);
      } else {
        typedEl.textContent = current.slice(0, ci - 1);
        ci--;
        if (ci === 0) {
          deleting = false;
          ri = (ri + 1) % roles.length;
          setTimeout(type, 450);
          return;
        }
        setTimeout(type, 34);
      }
    }
    setTimeout(type, 1000);
  }

  /* ── Booking modal ──────────────────────────────────────── */
  var modalOverlay      = document.getElementById('booking-modal');
  var modalClose        = document.getElementById('modal-close');
  var modalCancel       = document.getElementById('modal-cancel');
  var modalFormView     = document.getElementById('modal-form-view');
  var modalSuccessView  = document.getElementById('modal-success-view');
  var modalServiceLabel = document.getElementById('modal-service-label');
  var serviceHiddenInput = document.getElementById('f-service');
  var submitBtn         = document.getElementById('submit-btn');
  var bookingForm       = document.getElementById('booking-form');

  function openModal(serviceName) {
    if (!modalOverlay) return;
    if (modalFormView)    modalFormView.style.display   = '';
    if (modalSuccessView) modalSuccessView.style.display = 'none';
    if (bookingForm) bookingForm.reset();
    if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Send Booking Request'; }

    if (modalServiceLabel) modalServiceLabel.textContent = serviceName || 'Session';
    if (serviceHiddenInput) serviceHiddenInput.value = serviceName || '';

    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';

    var firstInput = modalOverlay.querySelector('input, textarea');
    if (firstInput) setTimeout(function () { firstInput.focus(); }, 80);
  }

  function closeModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.service-card .btn-book-card').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var card = btn.closest('.service-card');
      var serviceName = card ? (card.dataset.service || 'Session') : 'Session';
      openModal(serviceName);
    });
  });

  document.querySelectorAll('.service-card').forEach(function (card) {
    card.addEventListener('click', function (e) {
      if (e.target.closest('.btn-book-card')) return;
      var serviceName = card.dataset.service || 'Session';
      openModal(serviceName);
    });
  });

  if (modalClose)  modalClose.addEventListener('click', closeModal);
  if (modalCancel) modalCancel.addEventListener('click', closeModal);

  if (modalOverlay) {
    modalOverlay.addEventListener('click', function (e) {
      if (e.target === modalOverlay) closeModal();
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });

  /* ── Form submission → Google Apps Script ───────────────── */
  if (bookingForm) {
    bookingForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var name    = document.getElementById('f-name');
      var email   = document.getElementById('f-email');
      var topic   = document.getElementById('f-topic');
      var service = document.getElementById('f-service');

      if (!name.value.trim() || !email.value.trim() || !topic.value.trim()) {
        [name, email, topic].forEach(function (field) {
          if (!field.value.trim()) {
            field.style.borderColor = '#dc2626';
            field.addEventListener('input', function () {
              field.style.borderColor = '';
            }, { once: true });
          }
        });
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';

      // URLSearchParams is a "simple request" — no CORS preflight, Apps Script receives the data.
      var params = new URLSearchParams({
        name:           name.value.trim(),
        email:          email.value.trim(),
        topic:          topic.value.trim(),
        service:        service.value,
        timezone:       (document.getElementById('f-timezone') || {}).value || '',
        preferred_time: (document.getElementById('f-preferred') || {}).value || '',
        timestamp:      new Date().toISOString()
      });

      fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        body: params,
        mode: 'no-cors'
      })
      .then(function () { showSuccess(); })
      .catch(function () { showSuccess(); });
    });
  }

  function showSuccess() {
    if (modalFormView)    modalFormView.style.display    = 'none';
    if (modalSuccessView) modalSuccessView.style.display = 'block';
  }

})();
