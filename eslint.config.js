import js from '@eslint/js';
import globals from 'globals';
import prettier from 'eslint-config-prettier';

export default [
    {
        ignores: ['dist/**', 'node_modules/**', 'coverage/**'],
    },
    js.configs.recommended,
    {
        files: ['**/*.js'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                ...globals.browser,
                ...globals.es2024,
            },
        },
    },
    {
        files: ['**/*.cjs'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'commonjs',
            globals: {
                ...globals.node,
            },
        },
    },
    {
        files: ['playwright.config.js', 'tests/**/*.js'],
        languageOptions: {
            globals: {
                ...globals.node,
            },
        },
    },
    // Desactiva las reglas de ESLint que chocan con Prettier (debe ir al final)
    prettier,
];
