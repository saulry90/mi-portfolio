# AGENTS.md

Instrucciones para cualquier agente de IA (o persona) que trabaje en este repositorio. El objetivo: mantener el nivel de calidad actual sin tener que redescubrirlo cada vez.

## El proyecto en 30 segundos

Portfolio estático: **Vite** + **SCSS por capas** (BEM) + **JavaScript vanilla** (ES modules, sin frameworks). Deploy automático en Netlify con cada push a `master`. Suite de calidad obligatoria: ESLint + Stylelint + Prettier + Playwright (a11y/responsive) + Lighthouse.

## Comandos

```bash
npm run dev          # desarrollo
npm run build        # producción → dist/
npm run lint         # ESLint + Stylelint
npm run format       # Prettier
npm test             # build + 16 tests Playwright (~25s)
npm run test:a11y    # solo accesibilidad
npm run test:perf    # Lighthouse vs baseline (falla si baja de mínimos)
```

## Reglas no negociables

1. **Nada llega a `master` con lint o tests en rojo.** Los hooks de git ya lo fuerzan; nunca usar `--no-verify` salvo emergencia justificada en el mensaje del commit.
2. **Accesibilidad WCAG 2.1 AA**: todo elemento interactivo nuevo necesita foco visible, aria solo donde haga falta, contraste ≥4.5:1 (texto normal) y respetar `prefers-reduced-motion` si anima. Verificar con `npm run test:a11y`.
3. **Responsive**: cero desbordamiento horizontal entre 320–1440px. Breakpoints del proyecto: 480 / 768 / 1024 — probar también sus bordes ±1px.
4. **Rendimiento**: nada bloqueante nuevo en `<head>`; imágenes nuevas en WebP con fallback; no añadir pesos de fuente fuera de `_fonts.scss`; iconos FontAwesome importados uno a uno.
5. **Seguridad**: la CSP de `netlify.toml` es estricta a propósito. Cualquier script inline nuevo, estilo inline o servicio de terceros exige revisar y actualizar la CSP explícitamente — nunca "abrir huecos" para que algo funcione.
6. **Contraste de marca**: el color primario `#505bda` NO vale como texto sobre fondo oscuro (ratio 3.19); usar `var(--text-accent)` (token ya definido en `_variables.scss`).

## Convenciones de código

- **SCSS**: tokens desde `_variables.scss` (prohibido hardcodear colores/espaciados/breakpoints). Nomenclatura BEM (`bloque__elemento--modificador`, stylelint la valida). Cada concepto en su parcial y capa: `base/` → `layout/` → `components/` → `ui/`.
- **JS**: un módulo por responsabilidad en `src/js/modules/`, inicializados desde `main.js`, sin variables globales, comentarios solo cuando aporten contexto no obvio.
- **HTML**: semántico primero (`nav`, `main`, `section`, landmarks correctos).

## Al añadir una sección o página nueva (checklist)

- [ ] HTML semántico con landmarks
- [ ] Estilos en parcial SCSS de su capa, BEM, tokens existentes
- [ ] Animaciones vía IntersectionObserver con fallback `reduced-motion`
- [ ] `npm run test:a11y` sigue en 0 violaciones
- [ ] `npm test` sigue en verde (sin overflow en ningún viewport)
- [ ] Si cambia contenido principal: actualizar `<lastmod>` de `public/sitemap.xml`
- [ ] Decisión técnica notable → añadir entrada en `docs/DECISIONES.md`
- [ ] Cambio visible para usuarios → entrada bajo `[Unreleased]` en `CHANGELOG.md`

## Git y versiones

- Commits convencionales en español: `feat:` `fix:` `chore:` `docs:` `test:` `ci:` `refactor:`
- SemVer: PATCH = fixes · MINOR = features/secciones nuevas · MAJOR = cambios que rompen
- Al publicar versión: sellar `[Unreleased]` del CHANGELOG con `[X.Y.Z] - fecha`, subir versión con `npm version X.Y.Z --no-git-tag-version`, tag anotado `vX.Y.Z`

## Prohibido

- Introducir frameworks o librerías runtime sin antes registrar el porqué en `docs/DECISIONES.md`
- Añadir dependencias sin correr `npm audit` después
- Commitear `dist/`, `reports/`, `node_modules` ni `tests/lighthouse-baseline.json` editado a mano (lo genera `test:perf`)

## Referencias

- `docs/DECISIONES.md` — el porqué de cada decisión técnica (leer antes de proponer alternativas)
- `README.md` — comandos completos y estructura
- `CHANGELOG.md` — historial versionado del proyecto
