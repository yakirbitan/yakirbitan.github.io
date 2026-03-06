/* ═══ Mobile PWA Enhancements ═══ */
(function() {
  if (window.innerWidth > 500) return;

  const guideNav = document.querySelector('.guide-nav');
  if (!guideNav) return; // index page has no guide-nav

  const topbar = document.querySelector('.topbar');
  const pageTitle = topbar ? topbar.querySelector('h1').textContent : 'Interview Hub';
  const stepCounter = document.getElementById('stepCounter');

  // ─── Build mobile topbar ───
  const mobileTopbar = document.createElement('div');
  mobileTopbar.className = 'mobile-topbar';
  mobileTopbar.innerHTML = `
    <button class="hamburger-btn" id="hamburgerBtn" aria-label="Menu">☰</button>
    <span class="page-title">${pageTitle}</span>
    <span class="step-info" id="mobileStepInfo">${stepCounter ? stepCounter.textContent : ''}</span>
  `;
  document.body.prepend(mobileTopbar);

  // Sync step counter
  if (stepCounter) {
    const observer = new MutationObserver(() => {
      document.getElementById('mobileStepInfo').textContent = stepCounter.textContent;
    });
    observer.observe(stepCounter, { childList: true, characterData: true, subtree: true });
  }

  // ─── Build hamburger menu ───
  const links = guideNav.querySelectorAll('a');
  const menuIcons = {
    'index.html': '🏠',
    'learning-tiers.html': '⚔️',
    'leetcode-patterns.html': '🧠',
    'system-design.html': '🏗️',
    'cloud-explained.html': '☁️',
    'llm-explained.html': '🤖'
  };
  const menuLabels = {
    'index.html': 'Home',
    'learning-tiers.html': 'Learning Tiers',
    'leetcode-patterns.html': 'LeetCode Patterns',
    'system-design.html': 'System Design',
    'cloud-explained.html': 'Cloud Computing',
    'llm-explained.html': 'How LLMs Work'
  };

  let menuLinksHTML = '';
  links.forEach(link => {
    const href = link.getAttribute('href');
    const isActive = link.classList.contains('active') ? ' active' : '';
    const icon = menuIcons[href] || '';
    const label = menuLabels[href] || link.textContent;
    menuLinksHTML += `<a href="${href}" class="${isActive}"><span class="menu-icon">${icon}</span>${label}</a>`;
  });

  const menu = document.createElement('div');
  menu.className = 'mobile-menu';
  menu.id = 'mobileMenu';
  menu.innerHTML = `
    <div class="mobile-menu-overlay" id="menuOverlay"></div>
    <div class="mobile-menu-content">${menuLinksHTML}</div>
  `;
  document.body.prepend(menu);

  // Toggle menu
  document.getElementById('hamburgerBtn').addEventListener('click', () => {
    menu.classList.toggle('open');
  });
  document.getElementById('menuOverlay').addEventListener('click', () => {
    menu.classList.remove('open');
  });

  // ─── Swipe gestures ───
  let touchStartX = 0;
  let touchStartY = 0;
  let touchEndX = 0;
  let touchEndY = 0;

  const slidesWrapper = document.querySelector('.slides-wrapper');
  const swipeTarget = slidesWrapper || document.body;

  swipeTarget.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
  }, { passive: true });

  swipeTarget.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
  }, { passive: true });

  function handleSwipe() {
    const dx = touchEndX - touchStartX;
    const dy = touchEndY - touchStartY;
    // Only trigger if horizontal swipe is dominant and long enough
    if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy) * 1.5) return;

    if (dx < 0) {
      // Swipe left → next
      if (typeof navigate === 'function') navigate(1);
      else if (typeof nextSlide === 'function') nextSlide();
    } else {
      // Swipe right → prev
      if (typeof navigate === 'function') navigate(-1);
      else if (typeof prevSlide === 'function') prevSlide();
    }
  }
})();
