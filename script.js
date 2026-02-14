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
        /*
          Integre com um serviço real quando quiser:
          - FormSubmit: https://formsubmit.co/
          - EmailJS:    https://www.emailjs.com/
        */
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
