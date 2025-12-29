export const initNavigation = () => {
    // --- Menú Mobile ---
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav');
    const MENU_VISIBLE_CLASS = 'nav--visible';

    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle(MENU_VISIBLE_CLASS);
            const isExpanded = nav.classList.contains(MENU_VISIBLE_CLASS);
            menuToggle.setAttribute('aria-expanded', isExpanded);
        });

        // Cerrar menú al hacer clic en un enlace
        nav.querySelectorAll('.nav__link').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove(MENU_VISIBLE_CLASS);
                menuToggle.setAttribute('aria-expanded', false);
            });
        });
    }

    // --- Header Scroll ---
    const header = document.querySelector('.header');
    const SCROLL_THRESHOLD = 50;

    if (header) {
        const toggleHeaderShadow = () => {
            if (window.scrollY > SCROLL_THRESHOLD) {
                header.classList.add('header--scrolled');
            } else {
                header.classList.remove('header--scrolled');
            }
        };

        window.addEventListener('scroll', toggleHeaderShadow);
        toggleHeaderShadow(); // Ejecutar al inicio por si refrescan en mitad de página
    }
};