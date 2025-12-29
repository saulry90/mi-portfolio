export const initTheme = () => {
    const toggleButton = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    if (!toggleButton) return;

    toggleButton.addEventListener('click', () => {
        htmlElement.classList.toggle('is-dark');
        
        // Guardar preferencia en localStorage
        const isDark = htmlElement.classList.contains('is-dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });

    // Cargar preferencia al iniciar
    if (localStorage.getItem('theme') === 'dark') {
        htmlElement.classList.add('is-dark');
    }
};