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
  // TODO: Replace with your deployed Google Apps Script Web App URL
  var APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwZ7YX4CmY0Asljd812V0kp55-i9Oh3NVSlyzOF5dgsMxr1RjgpwBq1S-9hNh1NJVMAJg/exec';

  /* ── Year ───────────────────────────────────────────────── */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

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

  /* ── Typewriter role ────────────────────────────────────── */
  var typedEl = document.getElementById('typed-role');
  if (typedEl) {
    var roles = [
      'Forward-Deployed AI Architect',
      'Enterprise Solution Architect',
      'Platform Engineering Leader',
      'Applied AI Engineer'
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
  var modalOverlay   = document.getElementById('booking-modal');
  var modalClose     = document.getElementById('modal-close');
  var modalCancel    = document.getElementById('modal-cancel');
  var modalFormView  = document.getElementById('modal-form-view');
  var modalSuccessView = document.getElementById('modal-success-view');
  var modalServiceLabel = document.getElementById('modal-service-label');
  var serviceHiddenInput = document.getElementById('f-service');
  var submitBtn      = document.getElementById('submit-btn');
  var bookingForm    = document.getElementById('booking-form');

  function openModal(serviceName) {
    if (!modalOverlay) return;
    // Reset to form view
    if (modalFormView)    modalFormView.style.display   = '';
    if (modalSuccessView) modalSuccessView.style.display = 'none';
    if (bookingForm) bookingForm.reset();
    if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Send Booking Request'; }

    // Pre-fill service name
    if (modalServiceLabel) modalServiceLabel.textContent = serviceName || 'Session';
    if (serviceHiddenInput) serviceHiddenInput.value = serviceName || '';

    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';

    // Focus first field
    var firstInput = modalOverlay.querySelector('input, textarea');
    if (firstInput) setTimeout(function () { firstInput.focus(); }, 80);
  }

  function closeModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Open modal on service card "Book" button click
  document.querySelectorAll('.service-card .btn-book-card').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var card = btn.closest('.service-card');
      var serviceName = card ? (card.dataset.service || 'Session') : 'Session';
      openModal(serviceName);
    });
  });

  // Also open on clicking the card itself
  document.querySelectorAll('.service-card').forEach(function (card) {
    card.addEventListener('click', function (e) {
      if (e.target.closest('.btn-book-card')) return; // handled above
      var serviceName = card.dataset.service || 'Session';
      openModal(serviceName);
    });
  });

  if (modalClose)  modalClose.addEventListener('click', closeModal);
  if (modalCancel) modalCancel.addEventListener('click', closeModal);

  // Close on overlay backdrop click
  if (modalOverlay) {
    modalOverlay.addEventListener('click', function (e) {
      if (e.target === modalOverlay) closeModal();
    });
  }

  // Close on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });

  /* ── Form submission → Google Apps Script ───────────────── */
  if (bookingForm) {
    bookingForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // Simple validation
      var name     = document.getElementById('f-name');
      var email    = document.getElementById('f-email');
      var topic    = document.getElementById('f-topic');
      var service  = document.getElementById('f-service');

      if (!name.value.trim() || !email.value.trim() || !topic.value.trim()) {
        // Highlight empty required fields
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

      // Disable submit while sending
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';

      // Build form-encoded body — this is a "simple request" so no CORS preflight,
      // which means Apps Script actually receives the data (JSON+no-cors does NOT work).
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
