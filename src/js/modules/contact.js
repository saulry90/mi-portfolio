export const initContactForm = () => {
    const $form = document.getElementById('contact-form');
    const $successMsg = document.getElementById('contact-success');
    const $btnReset = document.getElementById('btn-reset-form');

    if (!$form || !$successMsg) return;

    const fields = [
        { input: $form.name, errorId: 'name-error' },
        { input: $form.email, errorId: 'email-error' },
        { input: $form.message, errorId: 'message-error' },
    ];

    const setFieldInvalid = (input, invalid) => {
        if (invalid) {
            input.setAttribute('aria-invalid', 'true');
        } else {
            input.removeAttribute('aria-invalid');
        }
    };

    const setErrorVisible = (errorId, visible) => {
        const $error = document.getElementById(errorId);
        if (!$error) return;
        $error.classList.toggle('is-visible', visible);
    };

    const validateField = (input, errorId) => {
        const hasValue = input.value.trim().length > 0;
        const valid = input.validity.valid;
        setFieldInvalid(input, hasValue && !valid);
        setErrorVisible(errorId, hasValue && !valid);
        return hasValue && valid;
    };

    fields.forEach(({ input, errorId }) => {
        if (!input) return;
        input.addEventListener('invalid', () => setFieldInvalid(input, true));
        input.addEventListener('input', () => validateField(input, errorId));
        input.addEventListener('blur', () => validateField(input, errorId));
    });

    $form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Validación
        const allValid = fields.every(({ input }) => validateField(input, input.id + '-error'));
        const nameValue = $form.name.value.trim();
        const emailValue = $form.email.value.trim();
        const messageValue = $form.message.value.trim();

        if (!nameValue || !emailValue || messageValue.length < 20 || !allValid) {
            return;
        }

        const $btn = $form.querySelector('.form__submit');

        // 1. Estado "Enviando"
        $btn.disabled = true;
        $btn.innerHTML = '<span class="form__spinner" aria-hidden="true"></span>Enviando...';

        const formData = new FormData($form);

        try {
            const response = await fetch($form.action, {
                method: 'POST',
                body: formData,
                headers: { Accept: 'application/json' },
            });

            if (response.ok) {
                $form.setAttribute('hidden', '');
                $successMsg.removeAttribute('hidden');
                $form.reset();
                fields.forEach(({ input, errorId }) => {
                    input?.removeAttribute('aria-invalid');
                    setErrorVisible(errorId, false);
                });
            } else if (response.status === 429) {
                // Rate limit de Formspree (20 posts/min por formulario)
                $btn.textContent =
                    'Demasiados envíos seguidos. Espera un momento e inténtalo de nuevo.';
                $btn.disabled = false;
            } else {
                throw new Error();
            }
        } catch {
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

        fields.forEach(({ input, errorId }) => {
            input?.removeAttribute('aria-invalid');
            setErrorVisible(errorId, false);
        });
    });
};
