# Decisiones técnicas

Registro de las decisiones de arquitectura del proyecto y su porqué. Formato ligero basado en ADRs (Architecture Decision Records): contexto → decisión → alternativas → consecuencia.

Nota sobre las cifras: los tamaños y tiempos indicados son una foto aproximada tomada en la v1.0.0 (ago 2026). Sirven para justificar cada decisión en su momento; si el proyecto evoluciona y un valor cambia lo suficiente como para alterar la conclusión, este documento se actualiza igual que cualquier otro archivo versionado.

---

## 1. Vite como herramienta única de desarrollo y build

- **Contexto**: proyecto estático creado desde cero ya con Vite como andamiaje; hacía falta una sola herramienta que compilara SCSS, resolviera rutas de assets y produjera builds optimizables para deploy automático.
- **Decisión**: mantener [Vite](https://vite.dev/) como dev server y bundler único.
- **Alternativas**: Webpack (configuración pesada para lo que se necesita), Gulp (automatiza tareas pero no cubre bundling moderno), herramientas GUI tipo CodeKit (no reproducibles en CI/Netlify).
- **Consecuencia**: build con hash de contenido, minificado y code splitting sin configuración extra; hot-reload instantáneo; el build de Netlify es un simple `npm run build`.

## 2. SCSS con arquitectura por capas (no Tailwind)

- **Contexto**: el CSS crecía sin orden y los valores (colores, espaciados) estaban repetidos por todos los archivos.
- **Decisión**: SCSS organizado en capas (`base` → `layout` → `components` → `ui`) con tokens centralizados en `_variables.scss`, mixins propios y nomenclatura BEM.
- **Alternativas**: Tailwind CSS (rápido para prototipar pero acopla el HTML a clases utilitarias), CSS Modules (pensado para frameworks de componentes JS).
- **Consecuencia**: cambiar el color primario o un breakpoint toca un solo archivo, y Stylelint puede forzar las convenciones (patrón BEM, orden). El intercambio es consciente: SCSS invierte el esfuerzo inicial en diseñar y mantener un sistema propio (Sass + BEM), mientras que Tailwind delega ese sistema en la herramienta y se domina a base de utilidades. Ambos enfoques son perfectamente válidos; aquí se prioriza el control total del CSS generado.

## 3. JavaScript vanilla sin framework

- **Contexto**: el sitio es una página estática con interacciones puntuales (menú móvil, tema claro/oscuro, animaciones de scroll, formulario).
- **Decisión**: ES modules nativos organizados en módulos pequeños (`src/js/modules/`), sin React/Vue.
- **Alternativas**: cualquier framework SPA (añade runtime e hidratación para renderizar exactamente lo mismo).
- **Consecuencia**: bundle principal de ≈2.3KB gzip en v1.0.0 y cero mantenimiento de dependencias de framework.

## 4. Formspree para el formulario de contacto

- **Contexto**: un portfolio estático no tiene backend para procesar emails.
- **Decisión**: endpoint público de [Formspree](https://formspree.io/f/xqeknzwl) con validación en vivo en cliente, honeypot anti-spam, límites de longitud y manejo del rate limit 429.
- **Alternativas**: backend propio (coste/mantenimiento injustificado), Netlify Forms (acopla el proyecto al hosting actual), mailto: (experiencia pobre).
- **Consecuencia**: sin servidor que mantener; el endpoint es público por diseño (acepta POST desde orígenes autorizados); si Formspree cambiara condiciones habría que migrar, y esa migración tocaría un solo módulo (`contact.js`).

## 5. Fuentes autoalojadas en woff2

- **Contexto**: Google Fonts añade conexión DNS+TLS a terceros y fuga de IP del visitante.
- **Decisión**: Poppins autoalojada en woff2 con `font-display: swap`, solo los 5 pesos realmente usados (300–700) declarados vía mapa SCSS.
- **Alternativas**: Google Fonts CDN, fuentes del sistema (menos identidad visual).
- **Consecuencia**: primera carga más rápida y privada; la CSP no necesita permitir dominios de terceros. Vite solo empaqueta los pesos referenciados, así que añadir uno nuevo es una línea en el mapa `_fonts.scss`.

## 6. FontAwesome vía npm con tree-shaking

- **Contexto**: el CDN de FontAwesome carga decenas de KB aunque uses cinco iconos.
- **Decisión**: paquetes `@fortawesome/free-*-svg-icons` importados icono a icono, chunk separado vía `manualChunks`.
- **Alternativas**: CDN completo (peso muerto), SVG copiados inline a mano (sin mantenimiento centralizado).
- **Consecuencia**: solo viajan los iconos realmente usados (≈24KB gzip en v1.0.0) en un chunk no bloqueante. Añadir iconos puede mover ese valor — es aceptable mientras el chunk siga siendo diferible y el bundle principal no crezca.

## 7. Testing con Playwright + axe-core (y no unitarios)

- **Contexto**: la lógica JS pura es poca; el riesgo real está en la integración: accesibilidad, responsive y comportamiento del menú/formulario en navegadores reales.
- **Decisión**: Playwright con axe-core para auditoría WCAG 2.1 AA en ambos temas, tests responsive en 7 viewports incluyendo bordes de breakpoint, y Lighthouse programático con mínimo por categoría.
- **Alternativas**: Jest/Vitest unitarios (testearían trivialidades), auditorías manuales ocasionales (no reproducibles).
- **Consecuencia**: regresiones de accesibilidad/responsive se detectan antes del push; el baseline de Lighthouse hace visibles las degradaciones de rendimiento entre cambios.

## 8. Calidad obligatoria en git (Husky + lint-staged)

- **Contexto**: Netlify despliega automáticamente cada push a `master`; código roto llegaría a producción en minutos.
- **Decisión**: pre-commit lintea y formatea solo los archivos stageados; pre-push ejecuta la suite completa de tests. Los tiempos concretos dependen de la máquina (en local, segundos vs ~25s) — lo relevante es la proporción: commit rápido y frecuente, push exhaustivo y menos frecuente.
- **Alternativas**: CI externo (GitHub Actions) que bloquee el merge (más robusto para equipos; sobredimensionado para un maintainer único), confiar en disciplina manual (falla).
- **Consecuencia**: nada roto sale del repositorio; escape de emergencia documentado (`--no-verify`).

## 9. Seguridad sin backend

- **Contexto**: servir HTML estático no exime de cabeceras de seguridad; Netlify no aplica CSP por defecto.
- **Decisión**: CSP estricta sin `unsafe-inline` en scripts (los estilos inline que Vite inyecta exigieron permitirlos solo en `style-src`, riesgo bajo), `X-Frame-Options`, `X-Content-Type-Options`, cache immutable para assets hasheados y redirect HTTPS.
- **Alternativas**: meta tags CSP (no soportan todas las directivas), no hacer nada (Lighthouse penaliza y el sitio queda frameable/injectable).
- **Consecuencia**: 100/100 en Best Practices y SEO; cualquier nuevo tercero (analytics, mapas) requerirá revisar la CSP explícitamente — restricción consciente contra "añadir y olvidar".

## 10. Hosting gestionado con deploy desde git

- **Contexto**: se necesita HTTPS, CDN y deploy continuo sin administrar servidores; la configuración debe vivir versionada en el repo.
- **Decisión**: Netlify conectado al repo, deploy automático en push a `master`, configuración 100% en `netlify.toml`.
- **Alternativas**: VPS propio (más control, más mantenimiento), GitHub Pages (headers no personalizables al nivel necesario para la CSP).
- **Consecuencia**: todo el flujo (lint → test → deploy) cabe en `git push`; al estar toda la config en `netlify.toml`, migrar a otro hosting con soporte equivalente es traducir ese archivo, no rehacer el proyecto.
