export const initContactForm = () => {
    const $form = document.getElementById('contact-form');
    const $successMsg = document.getElementById('contact-success');
    const $btnReset = document.getElementById('btn-reset-form');

    if (!$form || !$successMsg) return;

    const fields = [
        { input: $form.name, errorId: 'name-error' },
        { input: $form.email, errorId: 'email-error' },
        { input: $form.message, errorId: 'message-error' }
    ];

    const setFieldInvalid = (input, invalid) => {
        if (invalid) {
            input.setAttribute('aria-invalid', 'true');
        } else {
            input.removeAttribute('aria-invalid');
        }
    };

    fields.forEach(({ input, errorId }) => {
        if (!input) return;
        input.addEventListener('invalid', () => setFieldInvalid(input, true));
        input.addEventListener('input', () => setFieldInvalid(input, !input.validity.valid));
        input.addEventListener('blur', () => setFieldInvalid(input, !input.validity.valid && input.value.length > 0));
    });

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
                $form.setAttribute('hidden', '');
                $successMsg.removeAttribute('hidden');
                $form.reset();
                fields.forEach(({ input }) => input?.removeAttribute('aria-invalid'));
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

        const $btn = $form.querySelector('.form__submit');
        $btn.disabled = false;
        $btn.textContent = 'Enviar Mensaje';

        fields.forEach(({ input }) => input?.removeAttribute('aria-invalid'));
    });
};