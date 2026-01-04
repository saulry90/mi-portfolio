export const initScrollReveal = () => {
    const $revealElements = document.querySelectorAll('.reveal');

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