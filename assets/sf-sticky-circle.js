/* Sticky Feelings — Sticky Circle waitlist enhancements */
(function () {
  'use strict';

  // Animate checkbox tiles on selection
  document.querySelectorAll('.sc-checkbox-label').forEach((label) => {
    const input = label.querySelector('input[type="checkbox"]');
    if (!input) return;
    input.addEventListener('change', () => {
      label.style.transform = input.checked ? 'scale(1.03)' : '';
    });
  });

  // Submit button loading state
  const form   = document.getElementById('sc-waitlist-form');
  const submit = form && form.querySelector('.sc-submit-btn');

  if (form && submit) {
    form.addEventListener('submit', () => {
      submit.disabled = true;
      submit.querySelector('span').textContent = 'Sending…';
    });
  }
})();
