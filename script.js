/* ============================================================
   script.js — Portfólio Ana Teixeira
============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ----------------------------------------------------------
     1. MENU MOBILE
  ---------------------------------------------------------- */
  const menuBtn  = document.getElementById('menu-btn');
  const menuList = document.getElementById('menu');

  menuBtn?.addEventListener('click', () => {
    menuList.classList.toggle('is-open');
  });

  menuList?.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') menuList.classList.remove('is-open');
  });

  document.addEventListener('click', (e) => {
    if (
      menuList?.classList.contains('is-open') &&
      !menuList.contains(e.target) &&
      e.target !== menuBtn
    ) {
      menuList.classList.remove('is-open');
    }
  });

  /* ----------------------------------------------------------
     2. REVEAL
  ---------------------------------------------------------- */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const siblings = [...entry.target.parentElement.querySelectorAll('.reveal')];
      const index = siblings.indexOf(entry.target);
      entry.target.style.transitionDelay = `${index * 80}ms`;
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

  /* ----------------------------------------------------------
     6. CARROSSEL DE PROJETOS
     Estratégia: scroll-based com scrollLeft — sem truques de width
  ---------------------------------------------------------- */
  const wrapper  = document.querySelector('.carousel-wrapper');
  const grid     = document.getElementById('projects-grid');
  const btnPrev  = document.getElementById('carousel-prev');
  const btnNext  = document.getElementById('carousel-next');
  const dotsWrap = document.getElementById('carousel-dots');

  if (wrapper && grid && btnPrev && btnNext) {
    const cards = [...grid.querySelectorAll('.project-card')];
    const total = cards.length;
    let current = 0;

    // Força cards visíveis (overflow:hidden bloqueia IntersectionObserver)
    cards.forEach(card => {
      card.classList.add('visible');
      card.style.transitionDelay = '0ms';
    });

    function buildDots() {
      dotsWrap.innerHTML = '';
      for (let i = 0; i < total; i++) {
        const dot = document.createElement('button');
        dot.className = 'carousel-dot' + (i === current ? ' active' : '');
        dot.setAttribute('aria-label', `Projeto ${i + 1}`);
        dot.addEventListener('click', () => goTo(i));
        dotsWrap.appendChild(dot);
      }
    }

    function updateDots() {
      dotsWrap.querySelectorAll('.carousel-dot').forEach((d, i) => {
        d.classList.toggle('active', i === current);
      });
    }

    function goTo(index) {
      current = Math.max(0, Math.min(index, total - 1));
      // Desloca pelo scrollWidth real de cada card
      const cardW = cards[0].offsetWidth;
      grid.style.transform = `translateX(-${current * cardW}px)`;
      btnPrev.disabled = current === 0;
      btnNext.disabled = current === total - 1;
      updateDots();
    }

    btnPrev.addEventListener('click', () => goTo(current - 1));
    btnNext.addEventListener('click', () => goTo(current + 1));

    // Swipe
    let touchStartX = 0;
    grid.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    grid.addEventListener('touchend',   e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) goTo(current + (diff > 0 ? 1 : -1));
    });

    window.addEventListener('resize', () => { buildDots(); goTo(0); });

    // Inicializa após render
    requestAnimationFrame(() => { buildDots(); goTo(0); });
  }

  /* ----------------------------------------------------------
     3. FORMULÁRIO DE CONTATO
  ---------------------------------------------------------- */
  const form       = document.getElementById('contact-form');
  const successMsg = document.getElementById('form-success');

  if (form) {
    const nameInput    = document.getElementById('contact-name');
    const emailInput   = document.getElementById('contact-email');
    const messageInput = document.getElementById('contact-message');
    const groupName    = document.getElementById('group-name');
    const groupEmail   = document.getElementById('group-email');
    const groupMessage = document.getElementById('group-message');

    [nameInput, emailInput, messageInput].forEach((input, i) => {
      const groups = [groupName, groupEmail, groupMessage];
      input?.addEventListener('input', () => groups[i].classList.remove('has-error'));
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;
      [groupName, groupEmail, groupMessage].forEach(g => g.classList.remove('has-error'));

      if (!nameInput.value.trim())    { groupName.classList.add('has-error');    isValid = false; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim())) { groupEmail.classList.add('has-error'); isValid = false; }
      if (!messageInput.value.trim()) { groupMessage.classList.add('has-error'); isValid = false; }

      if (isValid) {
        form.reset();
        successMsg.style.display = 'block';
        setTimeout(() => { successMsg.style.display = 'none'; }, 5000);
      }
    });
  }

  /* ----------------------------------------------------------
     5. ABAS QUALIFICAÇÕES
  ---------------------------------------------------------- */
  document.querySelectorAll('.qual-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-tab');
      document.querySelectorAll('.qual-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.qual-panel').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById('tab-' + target)?.classList.add('active');
    });
  });

});

/* ----------------------------------------------------------
   4. ATIVAR IFRAME
---------------------------------------------------------- */
function activateIframe(overlayEl) {
  overlayEl.style.pointerEvents = 'none';
  overlayEl.style.opacity = '0';
  const iframe = overlayEl.previousElementSibling;
  if (iframe?.tagName === 'IFRAME') iframe.style.pointerEvents = 'auto';
}