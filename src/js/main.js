import { library, dom } from '@fortawesome/fontawesome-svg-core';
import { faMoon, faSun, faCheck, faEnvelope, faArrowUpRightFromSquare, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons';

import { initNavigation } from './modules/navigation.js';
import { initTheme } from './modules/theme.js';
import { initContactForm } from './modules/contact.js';
import { initScrollReveal } from './modules/animations.js';
import { initSmoothScroll } from './modules/scroll.js';
import { initFooter } from './modules/footer.js';

// Configuración Font Awesome
library.add(faMoon, faSun, faCheck, faLinkedin, faGithub, faEnvelope, faArrowUpRightFromSquare, faPaperPlane);
dom.watch();


document.addEventListener('DOMContentLoaded', () => {
  // Inicialización de módulos
  initNavigation();
  initTheme();
  initContactForm();
  initScrollReveal();
  initSmoothScroll()
  initFooter();
});
