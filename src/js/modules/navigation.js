export const initNavigation = () => {
    // --- Menú Mobile ---
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav');
    const MENU_VISIBLE_CLASS = 'nav--visible';

    const updateMenuAriaLabel = (expanded) => {
        menuToggle.setAttribute('aria-label', expanded ? 'Cerrar menú' : 'Abrir menú');
    };

    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle(MENU_VISIBLE_CLASS);
            const isExpanded = nav.classList.contains(MENU_VISIBLE_CLASS);
            menuToggle.setAttribute('aria-expanded', isExpanded);
            updateMenuAriaLabel(isExpanded);
        });

        document.addEventListener('click', (e) => {
            const isMenuVisible = nav.classList.contains(MENU_VISIBLE_CLASS);
            const isClickOutside = !nav.contains(e.target) && !menuToggle.contains(e.target);

            if (isMenuVisible && isClickOutside) {
                nav.classList.remove(MENU_VISIBLE_CLASS);
                menuToggle.setAttribute('aria-expanded', false);
                updateMenuAriaLabel(false);
            }
        });

        nav.querySelectorAll('.nav__link').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove(MENU_VISIBLE_CLASS);
                menuToggle.setAttribute('aria-expanded', false);
                updateMenuAriaLabel(false);
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