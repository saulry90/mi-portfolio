// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
    css: {
        // Esto asegura que los Source Maps se generen para el CSS
        devSourcemap: true,
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('@fortawesome')) {
                        return 'fontawesome';
                    }
                },
            },
        },
    },
});
