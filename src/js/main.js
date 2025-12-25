  // ===== ICONOS FONT AWESOME =====
import { library, dom } from '@fortawesome/fontawesome-svg-core';
import { faMoon, faSun, faBars, faCheck, faEnvelope, faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons';
library.add(faMoon, faSun, faBars, faCheck, faLinkedin, faGithub, faEnvelope, faArrowUpRightFromSquare);
dom.watch();

document.addEventListener('DOMContentLoaded', () => {
  // ===== MENU MOBILE =====
  const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav');
    const MENU_VISIBLE_CLASS = 'nav--visible';

    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle(MENU_VISIBLE_CLASS);
            
            const isExpanded = nav.classList.contains(MENU_VISIBLE_CLASS);
            menuToggle.setAttribute('aria-expanded', isExpanded);
        });
    }

  // ===== TOGGLE DEL MODO OSCURO =====
    const toggleButton = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    function toggleSwitchState() {
        htmlElement.classList.toggle('is-dark');
    }

    toggleButton.addEventListener('click', toggleSwitchState);

  // ===== SOMBRA EN EL HEADER AL HACER SCROLL =====
  const header = document.querySelector('.header');
    
    if (!header) return;

    const SCROLL_THRESHOLD = 150;

    function toggleHeaderShadow() {
        if (window.scrollY > SCROLL_THRESHOLD) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }
    }

    toggleHeaderShadow(); 
    
    window.addEventListener('scroll', toggleHeaderShadow);
});
