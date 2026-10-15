/**
 * ALGO ORBIT — site behaviour
 * Mobile navigation, dropdown menus, and scroll feedback.
 */
document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  const header = document.querySelector('.site-header');
  const progressBar = document.getElementById('bar');

  const SCROLL_SHADOW_OFFSET = 15;

  /* ---------- Mobile menu ---------- */
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', (event) => {
      event.stopPropagation();
      const isOpen = navLinks.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', isOpen);
    });
  }

  /* ---------- Dropdown menus ---------- */
  document.querySelectorAll('.dropdown-trigger').forEach((trigger) => {
    trigger.addEventListener('click', (event) => {
      event.stopPropagation();
      const parent = trigger.closest('.has-dropdown');
      const wasOpen = parent.classList.contains('open');

      document.querySelectorAll('.has-dropdown.open').forEach((item) => {
        if (item !== parent) item.classList.remove('open');
      });

      parent.classList.toggle('open', !wasOpen);
      trigger.setAttribute('aria-expanded', !wasOpen);
    });
  });

  /* ---------- Close menus on outside click ---------- */
  document.addEventListener('click', () => {
    document.querySelectorAll('.has-dropdown.open').forEach((item) => item.classList.remove('open'));

    if (navLinks && navLinks.classList.contains('open')) {
      navLinks.classList.remove('open');
      if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
    }
  });

  /* ---------- Scroll progress and header shadow ---------- */
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    if (header) {
      header.classList.toggle('scrolled', scrollY > SCROLL_SHADOW_OFFSET);
    }

    if (progressBar) {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? (scrollY / scrollable) * 100 : 0;
      progressBar.style.width = `${progress}%`;
    }
  }, { passive: true });

  /* ---------- Scroll reveal and counters ---------- */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasObserver = 'IntersectionObserver' in window;

  if (!prefersReducedMotion && hasObserver) {
    const REVEAL_STEP_MS = 100;
    const REVEAL_DURATION_MS = 700;

    // Fade content in once as it enters the viewport.
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const target = entry.target;
        target.classList.add('is-visible');
        observer.unobserve(target);

        // Hand control back to the component's own hover transitions.
        const delay = parseFloat(target.style.getPropertyValue('--reveal-delay')) || 0;
        setTimeout(() => {
          target.classList.remove('reveal', 'is-visible');
          target.style.removeProperty('--reveal-delay');
        }, REVEAL_DURATION_MS + delay * 1000);
      });
    }, { threshold: 0.15 });

    const REVEAL_SELECTOR = '.section-head, .card, .prod-card, .track-card, .stats-band, .showcase-copy, .showcase-visual, .cta-band';

    document.querySelectorAll(REVEAL_SELECTOR).forEach((element) => {
      const siblings = Array.from(element.parentElement.children).filter((child) => child.matches(REVEAL_SELECTOR));
      const position = siblings.indexOf(element);
      element.style.setProperty('--reveal-delay', `${(position * REVEAL_STEP_MS) / 1000}s`);
      element.classList.add('reveal');
      revealObserver.observe(element);
    });

    // Count numbers up when they first appear.
    const COUNT_DURATION_MS = 1400;

    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const counter = entry.target;
        const finalValue = Number(counter.dataset.count);
        const startTime = performance.now();
        observer.unobserve(counter);

        const tick = (now) => {
          const progress = Math.min((now - startTime) / COUNT_DURATION_MS, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          counter.textContent = Math.round(finalValue * eased).toLocaleString('en-IN');
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.6 });

    document.querySelectorAll('[data-count]').forEach((counter) => counterObserver.observe(counter));
  }
});