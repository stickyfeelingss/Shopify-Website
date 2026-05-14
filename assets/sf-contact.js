/* Sticky Feelings — Contact Us: copy email + FAQ accordion */
(function () {
  'use strict';

  // ── Copy email buttons ────────────────────────────────────────────
  document.querySelectorAll('.sf-copy-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const email = btn.dataset.email || 'hello@stickyfeelings.in';
      navigator.clipboard.writeText(email).then(() => {
        const original = btn.innerHTML;
        btn.innerHTML = `
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
          Copied!
        `;
        btn.classList.add('is-copied');
        setTimeout(() => {
          btn.innerHTML = original;
          btn.classList.remove('is-copied');
        }, 2000);
      }).catch(() => {
        // Fallback for older browsers
        const ta = document.createElement('textarea');
        ta.value = email;
        ta.style.cssText = 'position:fixed;opacity:0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        btn.textContent = 'Copied!';
        btn.classList.add('is-copied');
        setTimeout(() => {
          btn.textContent = 'Copy Email';
          btn.classList.remove('is-copied');
        }, 2000);
      });
    });
  });

  // ── FAQ — category accordion ──────────────────────────────────────
  document.querySelectorAll('.sf-faq-category-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const category = btn.closest('.sf-faq-category');
      const isOpen   = category.classList.contains('is-open');
      const panel    = category.querySelector('.sf-faq-panel');

      // Close all other categories
      document.querySelectorAll('.sf-faq-category.is-open').forEach((el) => {
        el.classList.remove('is-open');
        el.querySelector('.sf-faq-category-btn').setAttribute('aria-expanded', 'false');
        el.querySelector('.sf-faq-panel').hidden = true;
      });

      if (!isOpen) {
        category.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
        panel.hidden = false;
      }
    });
  });

  // ── FAQ — question accordion ──────────────────────────────────────
  document.querySelectorAll('.sf-faq-q-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const item   = btn.closest('.sf-faq-item');
      const isOpen = item.classList.contains('is-open');
      const answer = item.querySelector('.sf-faq-answer');

      // Close siblings
      const siblings = item.closest('.sf-faq-panel').querySelectorAll('.sf-faq-item.is-open');
      siblings.forEach((el) => {
        el.classList.remove('is-open');
        el.querySelector('.sf-faq-q-btn').setAttribute('aria-expanded', 'false');
        el.querySelector('.sf-faq-answer').hidden = true;
      });

      if (!isOpen) {
        item.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
        answer.hidden = false;
      }
    });
  });
})();
