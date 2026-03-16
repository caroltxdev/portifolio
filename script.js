/* ============================================================
   script.js — Portfólio Ana Teixeira
   Contém:
     1. Menu mobile (hamburguer)
     2. Animação de reveal ao rolar a página
     3. Validação e envio do formulário de contato
     4. Ativar interação com iframes dos projetos
     5. Abas de Qualificações (Educação / Experiência)
============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ----------------------------------------------------------
     1. MENU MOBILE (hamburguer)
  ---------------------------------------------------------- */
  const menuBtn  = document.getElementById('menu-btn');
  const menuList = document.getElementById('menu');

  menuBtn?.addEventListener('click', () => {
    menuList.classList.toggle('is-open');
  });

  menuList?.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
      menuList.classList.remove('is-open');
    }
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
     2. REVEAL AO ROLAR (IntersectionObserver)
  ---------------------------------------------------------- */
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const siblings = [
        ...entry.target.parentElement.querySelectorAll('.reveal')
      ];
      const index = siblings.indexOf(entry.target);
      entry.target.style.transitionDelay = `${index * 80}ms`;
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12 });

  revealElements.forEach((el) => revealObserver.observe(el));

  /* ----------------------------------------------------------
   CARROSSEL DE PROJETOS
---------------------------------------------------------- */
const grid      = document.getElementById('projects-grid');
const btnPrev   = document.getElementById('carousel-prev');
const btnNext   = document.getElementById('carousel-next');
const dotsWrap  = document.getElementById('carousel-dots');

if (grid && btnPrev && btnNext) {
  const cards        = [...grid.querySelectorAll('.project-card')];
  const visibleCount = () => window.innerWidth <= 768 ? 1 : 2;
  let current        = 0;

  // Cria os dots
  function buildDots() {
    dotsWrap.innerHTML = '';
    const total = cards.length - visibleCount() + 1;
    for (let i = 0; i < total; i++) {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot' + (i === current ? ' active' : '');
      dot.setAttribute('aria-label', `Ir para projeto ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    }
  }

  function updateDots() {
    [...dotsWrap.querySelectorAll('.carousel-dot')].forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  function goTo(index) {
    const total    = cards.length - visibleCount() + 1;
    current        = Math.max(0, Math.min(index, total - 1));
    const cardW    = cards[0].offsetWidth + 32; // largura + gap
    grid.style.transform = `translateX(-${current * cardW}px)`;
    btnPrev.disabled = current === 0;
    btnNext.disabled = current === total - 1;
    updateDots();
  }

  btnPrev.addEventListener('click', () => goTo(current - 1));
  btnNext.addEventListener('click', () => goTo(current + 1));

  // Swipe touch
  let touchStartX = 0;
  grid.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  grid.addEventListener('touchend',   e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) goTo(current + (diff > 0 ? 1 : -1));
  });

  // Recalcula ao redimensionar
  window.addEventListener('resize', () => {
    buildDots();
    goTo(0);
  });

  buildDots();
  goTo(0);
}

  /* ----------------------------------------------------------
     3. VALIDAÇÃO DO FORMULÁRIO DE CONTATO
  ---------------------------------------------------------- */
  const form       = document.getElementById('contact-form');
  const successMsg = document.getElementById('form-success');

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function clearErrorOnInput(inputEl, groupEl) {
    inputEl?.addEventListener('input', () => {
      groupEl.classList.remove('has-error');
    });
  }

  if (form) {
    const nameInput    = document.getElementById('contact-name');
    const emailInput   = document.getElementById('contact-email');
    const messageInput = document.getElementById('contact-message');
    const groupName    = document.getElementById('group-name');
    const groupEmail   = document.getElementById('group-email');
    const groupMessage = document.getElementById('group-message');

    clearErrorOnInput(nameInput,    groupName);
    clearErrorOnInput(emailInput,   groupEmail);
    clearErrorOnInput(messageInput, groupMessage);

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;

      [groupName, groupEmail, groupMessage].forEach((g) => {
        g.classList.remove('has-error');
      });

      if (!nameInput.value.trim()) {
        groupName.classList.add('has-error');
        isValid = false;
      }

      if (!isValidEmail(emailInput.value.trim())) {
        groupEmail.classList.add('has-error');
        isValid = false;
      }

      if (!messageInput.value.trim()) {
        groupMessage.classList.add('has-error');
        isValid = false;
      }

      if (isValid) {
  
        form.reset();
        successMsg.style.display = 'block';
        setTimeout(() => {
          successMsg.style.display = 'none';
        }, 5000);
      }
    });
  }


  /* ----------------------------------------------------------
     5. ABAS DE QUALIFICAÇÕES (Educação / Experiência)
  ---------------------------------------------------------- */
  const qualTabs   = document.querySelectorAll('.qual-tab');
  const qualPanels = document.querySelectorAll('.qual-panel');

  qualTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-tab');

      qualTabs.forEach(t   => t.classList.remove('active'));
      qualPanels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      document.getElementById('tab-' + target)?.classList.add('active');
    });
  });

});


/* ----------------------------------------------------------
   4. ATIVAR IFRAME DOS PROJETOS
   Chamada pelo onclick no HTML: onclick="activateIframe(this)"
---------------------------------------------------------- */
function activateIframe(overlayEl) {
  overlayEl.style.pointerEvents = 'none';
  overlayEl.style.opacity = '0';

  const iframe = overlayEl.previousElementSibling;
  if (iframe && iframe.tagName === 'IFRAME') {
    iframe.style.pointerEvents = 'auto';
  }
}
