export const initSmoothScroll = () => {
    const internalLinks = document.querySelectorAll('a[href^="#"]');

    internalLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const id = link.getAttribute('href');

            if (id === '#') return;

            const targetElement = document.querySelector(id);

            if (targetElement) {
                e.preventDefault();

                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });

                // Gestión de Accesibilidad: Mover el foco al elemento destino
                // Añadir tabindex -1 para que elementos como <section> puedan recibir el foco
                targetElement.setAttribute('tabindex', '-1');
                targetElement.focus({ preventScroll: true });

                // Quitar el foco al salir para mantener el HTML limpio
                targetElement.addEventListener('blur', () => {
                    targetElement.removeAttribute('tabindex');
                }, { once: true });

                // Actualizar la URL (para que el historial funcione)
                window.history.pushState(null, null, id);
            }
        });
    });
};