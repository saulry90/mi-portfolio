import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: './tests',
    timeout: 60000,
    use: {
        baseURL: 'http://localhost:4173',
        channel: 'msedge',
        headless: true,
        viewport: { width: 1280, height: 900 },
    },
    webServer: {
        command: 'npm run preview -- --port 4173 --strictPort',
        url: 'http://localhost:4173',
        reuseExistingServer: !process.env.CI,
        timeout: 60000,
    },
    reporter: [['list']],
});
