export const initNavigation = () => {
    // --- Menú Mobile ---
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav');
    const MENU_VISIBLE_CLASS = 'nav--visible';

    const updateMenuAriaLabel = (expanded) => {
        menuToggle.setAttribute('aria-label', expanded ? 'Cerrar menú' : 'Abrir menú');
    };

    if (menuToggle && nav) {
        const firstLink = nav.querySelector('.nav__link');
        const isMenuVisible = () => nav.classList.contains(MENU_VISIBLE_CLASS);

        const closeMenu = (returnFocus = false) => {
            nav.classList.remove(MENU_VISIBLE_CLASS);
            menuToggle.setAttribute('aria-expanded', false);
            updateMenuAriaLabel(false);
            if (returnFocus) menuToggle.focus();
        };

        menuToggle.addEventListener('click', () => {
            if (isMenuVisible()) {
                closeMenu(true);
            } else {
                nav.classList.add(MENU_VISIBLE_CLASS);
                menuToggle.setAttribute('aria-expanded', true);
                updateMenuAriaLabel(true);
                firstLink?.focus();
            }
        });

        document.addEventListener('click', (e) => {
            const isClickOutside = !nav.contains(e.target) && !menuToggle.contains(e.target);

            if (isMenuVisible() && isClickOutside) {
                closeMenu();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isMenuVisible()) {
                closeMenu(true);
            }
        });

        nav.querySelectorAll('.nav__link').forEach(link => {
            link.addEventListener('click', () => {
                closeMenu();
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