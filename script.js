(function() {
  const root = document.documentElement;
  const nav = document.getElementById('nav-menu');
  const navToggleBtn = document.querySelector('.nav-toggle');
  const themeToggleBtn = document.getElementById('themeToggle');
  const dots = Array.from(document.querySelectorAll('.dot'));
  const slides = Array.from(document.querySelectorAll('.testimonial'));
  const toTopBtn = document.getElementById('toTop');
  const yearEl = document.getElementById('year');

  // Mobile nav toggle
  function setNavExpanded(expanded) {
    if (!nav) return;
    nav.setAttribute('aria-expanded', String(expanded));
    navToggleBtn?.setAttribute('aria-expanded', String(expanded));
  }
  navToggleBtn?.addEventListener('click', () => {
    const isExpanded = nav.getAttribute('aria-expanded') === 'true';
    setNavExpanded(!isExpanded);
  });
  document.addEventListener('click', (e) => {
    if (!nav || !navToggleBtn) return;
    const isExpanded = nav.getAttribute('aria-expanded') === 'true';
    if (!isExpanded) return;
    const target = e.target;
    if (!nav.contains(target) && !navToggleBtn.contains(target)) {
      setNavExpanded(false);
    }
  });

  // Dark mode
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const savedTheme = localStorage.getItem('coursiya-theme');
  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    root.classList.add('theme-dark');
  }
  function toggleTheme() {
    root.classList.toggle('theme-dark');
    const isDark = root.classList.contains('theme-dark');
    localStorage.setItem('coursiya-theme', isDark ? 'dark' : 'light');
    themeToggleBtn?.querySelector('i')?.classList.toggle('ri-sun-line', isDark);
    themeToggleBtn?.querySelector('i')?.classList.toggle('ri-moon-line', !isDark);
  }
  themeToggleBtn?.addEventListener('click', toggleTheme);
  // Initialize icon state
  (() => {
    const isDark = root.classList.contains('theme-dark');
    if (isDark) {
      themeToggleBtn?.querySelector('i')?.classList.remove('ri-moon-line');
      themeToggleBtn?.querySelector('i')?.classList.add('ri-sun-line');
    }
  })();

  // Testimonials carousel
  let activeIndex = 0;
  let autoTimer = null;

  function setActiveSlide(index) {
    slides.forEach((s, i) => s.classList.toggle('is-active', i === index));
    dots.forEach((d, i) => {
      d.classList.toggle('is-active', i === index);
      d.setAttribute('aria-selected', String(i === index));
    });
    activeIndex = index;
  }

  function nextSlide() {
    const next = (activeIndex + 1) % slides.length;
    setActiveSlide(next);
  }

  function startAuto() {
    if (autoTimer) clearInterval(autoTimer);
    if (slides.length > 1) autoTimer = setInterval(nextSlide, 6000);
  }

  dots.forEach((dot, i) => dot.addEventListener('click', () => {
    setActiveSlide(i);
    startAuto();
  }));

  if (slides.length) {
    setActiveSlide(0);
    startAuto();
  }

  // Back to top
  function onScroll() {
    const y = window.scrollY || document.documentElement.scrollTop;
    if (y > 400) {
      toTopBtn?.classList.add('is-visible');
    } else {
      toTopBtn?.classList.remove('is-visible');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  toTopBtn?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // Current year
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();