import '../css/style.css';

// ===== MENÚ MÓVIL =====
document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.querySelector('.nav__toggle');
  const nav = document.querySelector('.nav');

  navToggle.addEventListener('click', () => {
    nav.classList.toggle('nav--visible');
  });
});
