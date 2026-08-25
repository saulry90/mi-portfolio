# Portfolio Personal – Saul Roldan

[![Netlify Status](https://api.netlify.com/api/v1/badges/5412b98b-dd31-4f36-8d75-fb74b96c374b/deploy-status)](https://app.netlify.com/sites/portfolio-saul/deploys)

Este proyecto es mi portfolio personal. Su objetivo es mostrar mis habilidades como maquetador web y desarrollador frontend.

## ✨ Características

- Tema claro / oscuro con preferencia guardada en `localStorage`
- Timeline de experiencia con animación al hacer scroll
- Formulario de contacto vía [Formspree](https://formspree.io) con validación en vivo y protección anti-spam (honeypot + rate limit)
- Accesibilidad: WCAG 2.1 AA verificado automáticamente (axe-core), skip-link, foco visible, `prefers-reduced-motion`
- SEO: meta OG/Twitter, JSON-LD, sitemap y canonical
- Rendimiento: fuentes self-hosted (woff2), imágenes WebP con fallback, code splitting

## 🧩 Tecnologías

- [Vite](https://vite.dev/) como bundler y dev server
- SCSS/Sass (arquitectura por capas: base → layout → components → ui)
- JavaScript vanilla (ES modules, sin frameworks)
- [FontAwesome](https://fontawesome.com) via npm (SVG inline, sin CDN)
- Playwright + axe-core para tests de accesibilidad y responsive
- Lighthouse para auditoría de rendimiento
- ESLint, Stylelint y Prettier para calidad de código

## 📋 Requisitos

- Node.js 22 (el mismo que usa el build de Netlify)

## 🚀 Empezar

```bash
npm install    # Instala dependencias (también activa los hooks de git de Husky)
npm run dev    # Servidor de desarrollo con hot-reload
npm run build  # Build de producción en dist/
npm run preview # Sirve el build localmente
```

## 🧪 Scripts disponibles

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción (minificado, assets con hash) |
| `npm run preview` | Sirve `dist/` en local |
| `npm run lint` | ESLint (JS) + Stylelint (SCSS) sobre todo el proyecto |
| `npm run lint:fix` | Igual, con autocorrección |
| `npm run format` | Prettier formatea JS y SCSS |
| `npm run format:check` | Verifica el formato sin modificar nada |
| `npm test` | Build + suite completa de Playwright |
| `npm run test:a11y` | Solo tests de accesibilidad |
| `npm run test:perf` | Lighthouse contra el build; compara con el baseline |
| `npm run prepare` | Activa los hooks de git de Husky (se ejecuta solo tras `npm install`) |

### Tests automatizados (`tests/`)

- **`a11y.spec.js`** — audita la página con axe-core (WCAG 2.1 AA) en tema claro y oscuro. Falla si hay cualquier violación.
- **`responsive.spec.js`** — en 7 tamaños de pantalla (320–1440px, incluyendo los breakpoints 480/768/1024 y sus bordes) comprueba que no hay desbordamiento horizontal y que el menú móvil se comporta bien.
- **`performance.js`** — ejecuta Lighthouse (emulación móvil) y falla si alguna categoría baja de su mínimo. Guarda el baseline en `lighthouse-baseline.json` e informa los cambios respecto a la ejecución anterior.

## 🪝 Hooks de git (Husky)

- **pre-commit**: lint + formato automático solo sobre los archivos modificados (lint-staged). Un error de lint cancela el commit.
- **pre-push**: suite completa de tests. Si algo falla, no se pushea.

Para saltárselos en un caso excepcional: `git commit --no-verify`.

## 📁 Estructura

```
src/
├── assets/          # Fuentes (Poppins woff2) e imágenes (WebP + fallback)
├── js/
│   ├── main.js      # Punto de entrada: inicializa los módulos
│   └── modules/     # navigation, theme, contact, animations, timeline, scroll, footer
└── scss/
    ├── main.scss    # Importa todo en orden
    ├── base/        # Variables, mixins, reset, tipografía, fuentes, animaciones
    ├── layout/      # Header, grid, footer
    ├── components/  # Secciones grandes: hero, nav, about, projects, contact
    └── ui/          # Piezas reutilizables: botones, forms, cards, toggle...
```

## 🔒 Seguridad

Headers configurados en `netlify.toml`: CSP sin `unsafe-inline` en scripts, `X-Frame-Options`, `X-Content-Type-Options` y cache immutable para `/assets/*`.

## Deploy

**Plataforma:** Netlify
**URL:** [portfolio-saul.netlify.app](https://portfolio-saul.netlify.app)
**Configuración:** `netlify.toml` en la raíz del repo (build command, publish dir, headers y redirects)
**Flujo:** Push a `master` → deploy automático. El pre-push hook garantiza que solo se publican builds con los tests en verde.
