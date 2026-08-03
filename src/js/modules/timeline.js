// Línea de la trayectoria profesional dibujada tramo a tramo, en ambos sentidos de scroll:
const TRIGGER_RATIO = 0.75;
const FADE_MS = 1200; // coincide con la duración del fade de .reveal (1.2s)

export const initTimeline = () => {
    const $items = document.querySelectorAll('.experience__item');
    if ($items.length === 0) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion) {
        // Sin animaciones: todo el contenido visible y todas las líneas dibujadas
        $items.forEach(($item) => {
            const $card = $item.querySelector('.experience__card');
            if ($card) $card.classList.add('reveal--active');
            $item.classList.add('is-drawn');
        });
        return;
    }

    // Marca si el item ha aparecido del todo (fade terminado).
    const fadeDone = new Array($items.length).fill(false);

    const drawSegments = (triggerLine, rects) => {
        for (let i = 0; i < $items.length - 1; i++) {
            const shouldDraw = fadeDone[i] && rects[i + 1].top <= triggerLine;
            $items[i].classList.toggle('is-drawn', shouldDraw);
        }
    };

    const update = () => {
        const triggerLine = window.innerHeight * TRIGGER_RATIO;
        const rects = [];

        $items.forEach(($item, index) => {
            const itemRect = $item.getBoundingClientRect();
            rects.push(itemRect);

            const $card = $item.querySelector('.experience__card');
            if (
                $card &&
                !$card.classList.contains('reveal--active') &&
                itemRect.top <= triggerLine
            ) {
                $card.classList.add('reveal--active');

                // La línea de este item espera a que termine su aparición
                setTimeout(() => {
                    fadeDone[index] = true;
                    update();
                }, FADE_MS);
            }
        });

        drawSegments(triggerLine, rects);
    };

    let ticking = false;
    const onScroll = () => {
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(() => {
                update();
                ticking = false;
            });
        }
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
};
