/* Sticky Feelings — Homepage JS */
(function () {
  'use strict';

  /* Ensure each marquee track has enough clones to fill the viewport */
  function padMarquee(track) {
    var minWidth = window.innerWidth * 2.5;
    var passes = 0;
    while (track.scrollWidth < minWidth && passes < 10) {
      var clone = track.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      track.parentElement.appendChild(clone);
      passes++;
    }
  }

  document.querySelectorAll('.sfh-marquee__track').forEach(padMarquee);

  /* Pause marquee on hover/focus for accessibility */
  document.querySelectorAll('.sfh-marquee').forEach(function (marquee) {
    marquee.addEventListener('mouseenter', function () {
      marquee.querySelectorAll('.sfh-marquee__track').forEach(function (t) {
        t.style.animationPlayState = 'paused';
      });
    });
    marquee.addEventListener('mouseleave', function () {
      marquee.querySelectorAll('.sfh-marquee__track').forEach(function (t) {
        t.style.animationPlayState = 'running';
      });
    });
  });

  /* Email CTA — lightweight success feedback */
  var form = document.querySelector('.sfh-cta__form');
  if (form) {
    form.addEventListener('submit', function () {
      var btn = form.querySelector('.sfh-cta__btn');
      if (btn) {
        btn.textContent = 'Sending…';
        btn.disabled = true;
      }
    });
  }
})();
