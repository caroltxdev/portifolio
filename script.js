document.addEventListener('DOMContentLoaded', () => {
  const btn  = document.getElementById('menu-btn');
  const menu = document.getElementById('menu');

  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    menu.classList.toggle('is-open');
  });

  menu.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') menu.classList.remove('is-open');
  });
});


