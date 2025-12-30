export const initContactForm = () => {
    const $form = document.getElementById('contact-form');
    const $successMsg = document.getElementById('contact-success');
    const $btnReset = document.getElementById('btn-reset-form');

    if (!$form || !$successMsg) return;

    $form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Validación
        const nameValue = $form.name.value.trim();
        const emailValue = $form.email.value.trim();
        const messageValue = $form.message.value.trim();

        if (!nameValue || !emailValue || messageValue.length < 20) {
            return; 
        }

        const $btn = $form.querySelector('.form__submit');

        // 1. Estado "Enviando"
        $btn.disabled = true;
        $btn.innerHTML = '<span>Enviando...</span>';

        const formData = new FormData($form);

        try {
            const response = await fetch($form.action, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                // 2. Estado "Éxito"
                $form.setAttribute('hidden', '');
                $successMsg.removeAttribute('hidden');
                $form.reset();
            } else {
                throw new Error();
            }
        } catch (error) {
            $btn.textContent = 'Error al enviar';
            $btn.disabled = false;
        }
    });

    // Lógica para el botón "Aceptar / Volver"
    $btnReset.addEventListener('click', () => {
        $successMsg.setAttribute('hidden', '');
        $form.removeAttribute('hidden');
        
        // Reset del botón de envío a su estado original
        const $btn = $form.querySelector('.form__submit');
        $btn.disabled = false;
        $btn.textContent = 'Enviar Mensaje';
    });
};