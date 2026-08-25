# Changelog

Todos los cambios notables de este proyecto se documentan en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/)
y este proyecto se adhiere al [Versionado Semántico](https://semver.org/lang/es/).

## [Unreleased]

## [1.0.0] - 2026-08-24

### Añadido

- **Portfolio completo**: hero con avatar, navegación responsive con menú móvil accesible,
  sección de proyectos, about con skills, experiencia laboral con timeline animado al hacer
  scroll y formulario de contacto vía Formspree con validación en vivo, honeypot y manejo
  de rate limit.
- **Tema claro / oscuro** con toggle y preferencia persistida en `localStorage`.
- **SEO**: meta Open Graph/Twitter, datos estructurados JSON-LD, `sitemap.xml`, `robots.txt`
  y URL canónica.
- **Accesibilidad (WCAG 2.1 AA)**: skip-link, foco visible, errores de formulario anunciados
  en vivo con `aria-live`, soporte para `prefers-reduced-motion` y contraste verificado.
- **Seguridad**: Content Security Policy sin `unsafe-inline` en scripts, `X-Frame-Options`,
  `X-Content-Type-Options` y límites de longitud en inputs.
- **Rendimiento**: fuentes Poppins autoalojadas en woff2, imágenes WebP con fallback,
  tree-shaking y code splitting de FontAwesome.
- **Tests automatizados**: Playwright + axe-core (accesibilidad en tema claro y oscuro),
  pruebas responsive en 7 viewports (320–1440px) y auditoría Lighthouse programática con
  baseline versionado (`tests/lighthouse-baseline.json`).
- **Calidad de código**: ESLint, Stylelint y Prettier con scripts `lint`, `lint:fix`,
  `format` y `format:check`.
- **Hooks de git**: pre-commit con lint-staged (lint + formato sobre archivos modificados)
  y pre-push que ejecuta la suite completa de tests.
- **Deploy en Netlify** configurado vía `netlify.toml`: build automático en push a `master`,
  Node 22 fijado, headers de seguridad y cache immutable para assets.
- Badge de estado de deploy de Netlify en el README.

### Cambiado

- Migración de CSS plano a SCSS con arquitectura por capas (`base`, `layout`, `components`,
  `ui`) y tokens de diseño centralizados en `_variables.scss`.
- README reescrito con el stack real, scripts disponibles, estructura del proyecto y flujo
  de deploy.

### Corregido

- Favicon, enlace al CV, rutas de assets tras la migración a Vite y build de SCSS.

[Unreleased]: https://github.com/saulry90/mi-portfolio/compare/v1.0.0...HEAD
