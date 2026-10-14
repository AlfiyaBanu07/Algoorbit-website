document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  const header = document.querySelector('.site-header');
  const scrollBar = document.getElementById('bar');

  // Mobile menu toggle
  if (toggleBtn && navLinks) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navLinks.classList.toggle('open');
      toggleBtn.setAttribute('aria-expanded', isOpen);
    });
  }

  // Dropdown toggles
  document.querySelectorAll('.dropdown-trigger').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const parent = trigger.closest('.has-dropdown');
      const isOpen = parent.classList.contains('open');
      
      document.querySelectorAll('.has-dropdown.open').forEach(el => {
        if (el !== parent) el.classList.remove('open');
      });
      
      parent.classList.toggle('open', !isOpen);
      trigger.setAttribute('aria-expanded', !isOpen);
    });
  });

  // Close menus on outside click
  document.addEventListener('click', () => {
    document.querySelectorAll('.has-dropdown.open').forEach(el => el.classList.remove('open'));
    if (navLinks && navLinks.classList.contains('open')) {
      navLinks.classList.remove('open');
      if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'false');
    }
  });

  // Scroll indicator & sticky header shadow
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (header) {
      header.classList.toggle('scrolled', scrollY > 15);
    }
    if (scrollBar) {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
      scrollBar.style.width = progress + '%';
    }
  }, { passive: true });
});