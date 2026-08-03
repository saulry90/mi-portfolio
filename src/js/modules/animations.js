export const initScrollReveal = () => {
    // Los items de experiencia se animan con el timeline (timeline.js) para que su aparición coincida exactamente con el crecimiento de la línea.
    const $revealElements = document.querySelectorAll('.reveal:not(.experience__card)');

    // Si el usuario prefiere reducir movimiento, el contenido ya es visible por CSS (base/_animations.scss) y no hace falta observar nada.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        $revealElements.forEach($el => $el.classList.add('reveal--active'));
        return;
    }

    const observerOptions = {
        root: null, // usa el viewport
        threshold: 0.15, // se activa cuando el 15% del elemento es visible
        rootMargin: "0px 0px -80px 0px" // margen inferior para que no se active justo al borde
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal--active');
                // Una vez animado, dejamos de observarlo para ahorrar recursos
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    $revealElements.forEach($el => observer.observe($el));
};