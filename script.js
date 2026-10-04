/* LADAM: scroll fade-up reveal for text content */
(function () {
  if (!('IntersectionObserver' in window)) return;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var els = Array.prototype.slice.call(document.querySelectorAll(
    'main h1, main h2, main h3, main p, main li, main .card, main .linkcard, main .btn, main .badge-navy, main .badge-sun'
  ));

  // Don't double-animate text that already lives inside a revealed card
  var keep = els.filter(function (el) {
    var p = el.parentElement;
    while (p && p !== document.body) {
      if (p.classList && (p.classList.contains('card') || p.classList.contains('linkcard'))) return false;
      p = p.parentElement;
    }
    return true;
  });

  if (reduce) return; /* CSS keeps everything visible without animation */

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });

  keep.forEach(function (el) {
    el.classList.add('reveal');
    io.observe(el);
  });

  /* Safety net: never leave content invisible */
  setTimeout(function () {
    document.querySelectorAll('.reveal:not(.in)').forEach(function (el) {
      el.classList.add('in');
    });
  }, 3000);
})();

/* LADAM: button sound effect from audio/sfx.mp3 */
(function () {
  var sfx = new Audio('audio/sfx.mp3');
  sfx.preload = 'auto';
  var navDelay = 650; /* fallback ms until metadata loads */
  sfx.addEventListener('loadedmetadata', function () {
    if (sfx.duration && isFinite(sfx.duration)) {
      navDelay = Math.min(Math.round(sfx.duration * 1000), 900);
    }
  });
  function playSfx() {
    try {
      sfx.currentTime = 0;
      var p = sfx.play();
      if (p && p.catch) p.catch(function () {});
    } catch (e) {}
  }

  document.addEventListener('click', function (e) {
    var el = e.target.closest ? e.target.closest('a.btn, button.btn, .drawer-links a') : null;
    if (!el) return;
    playSfx();
    // let the sound finish before same-tab navigation
    var href = el.getAttribute ? el.getAttribute('href') : null;
    var newTab = el.target === '_blank' || e.metaKey || e.ctrlKey || e.shiftKey;
    if (href && href.charAt(0) !== '#' && !newTab && el.tagName === 'A') {
      e.preventDefault();
      setTimeout(function () { window.location.href = href; }, navDelay);
    }
  });
})();
