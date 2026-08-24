import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import lighthouse from 'lighthouse';
import { launch } from 'chrome-launcher';

// --- Configuración ---
const PORT = 4175;
const URL_TEST = `http://localhost:${PORT}/`;
const EDGE_PATH = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const BASELINE_PATH = path.resolve('tests/lighthouse-baseline.json');
const REPORTS_DIR = path.resolve('reports');

// Puntuaciones mínimas exigidas (0-100). Ajustar si cambia la estrategia del sitio.
const MIN_SCORES = {
    performance: 90,
    accessibility: 100,
    'best-practices': 95,
    seo: 100,
};

const METRICS = [
    'first-contentful-paint',
    'largest-contentful-paint',
    'total-blocking-time',
    'cumulative-layout-shift',
    'speed-index',
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

if (!existsSync(EDGE_PATH)) {
    console.error(`No se encontró Edge en: ${EDGE_PATH}`);
    process.exit(1);
}

// --- Servidor de preview ---
console.log('Iniciando vite preview...');
const server = spawn(process.execPath, [
    'node_modules/vite/bin/vite.js',
    'preview',
    '--port',
    String(PORT),
    '--strictPort',
]);
server.stdout.on('data', () => {});
server.stderr.on('data', (d) => process.stderr.write(d));

let up = false;
for (let i = 0; i < 50; i++) {
    try {
        await fetch(URL_TEST);
        up = true;
        break;
    } catch {
        await sleep(200);
    }
}
if (!up) {
    console.error('El servidor de preview no arrancó');
    server.kill();
    process.exit(1);
}

try {
    // --- Lighthouse ---
    console.log('Ejecutando Lighthouse (emulación móvil, puede tardar ~30s)...');
    const chrome = await launch({
        chromePath: EDGE_PATH,
        chromeFlags: ['--headless=new', '--no-first-run', '--disable-gpu'],
    });

    let result;
    try {
        result = await lighthouse(URL_TEST, {
            port: chrome.port,
            output: ['html', 'json'],
            logLevel: 'error',
            onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
        });
    } finally {
        await chrome.kill();
    }

    const lhr = result.lhr;

    const scores = {};
    for (const [key, cat] of Object.entries(lhr.categories)) {
        scores[key] = Math.round(cat.score * 100);
    }

    const metrics = {};
    for (const id of METRICS) {
        metrics[id] = Math.round(lhr.audits[id].numericValue * 100) / 100;
    }

    const current = {
        date: new Date().toISOString(),
        url: lhr.finalDisplayedUrl,
        formFactor: lhr.configSettings.formFactor,
        scores,
        metrics,
    };

    // --- Informe completo (HTML + JSON), no se versiona ---
    await mkdir(REPORTS_DIR, { recursive: true });
    await writeFile(path.join(REPORTS_DIR, 'lighthouse.html'), result.report[0]);
    await writeFile(path.join(REPORTS_DIR, 'lighthouse.json'), result.report[1]);

    // --- Resumen por consola ---
    console.log('\n=== Lighthouse (' + current.formFactor + ') ===');
    for (const [key, value] of Object.entries(scores)) {
        const min = MIN_SCORES[key] ?? 0;
        const ok = value >= min ? 'OK ' : 'LOW';
        console.log(`${ok} ${key.padEnd(15)} ${String(value).padStart(3)}  (mínimo ${min})`);
    }
    console.log('\nMétricas:');
    for (const [id, value] of Object.entries(metrics)) {
        const unit = id === 'cumulative-layout-shift' ? '' : ' ms';
        console.log(`  ${lhr.audits[id].title.padEnd(28)} ${value}${unit}`);
    }

    // --- Comparativa con el baseline previo, si existe ---
    if (existsSync(BASELINE_PATH)) {
        const baseline = JSON.parse(await readFile(BASELINE_PATH, 'utf8'));
        console.log(`\nComparado con baseline (${baseline.date}):`);
        for (const key of Object.keys(scores)) {
            const delta = scores[key] - (baseline.scores[key] ?? scores[key]);
            if (delta !== 0) {
                console.log(`  ${key}: ${delta > 0 ? '+' : ''}${delta}`);
            }
        }
        for (const id of METRICS) {
            const delta = metrics[id] - (baseline.metrics?.[id] ?? metrics[id]);
            if (Math.abs(delta) >= 1) {
                const unit = id === 'cumulative-layout-shift' ? '' : ' ms';
                console.log(
                    `  ${lhr.audits[id].title}: ${delta > 0 ? '+' : ''}${delta.toFixed(2)}${unit}`,
                );
            }
        }
    } else {
        await writeFile(BASELINE_PATH, JSON.stringify(current, null, 4) + '\n');
        console.log(`\nBaseline guardado en ${BASELINE_PATH}`);
    }

    // --- Criterio de pase ---
    const failures = Object.entries(MIN_SCORES).filter(([key, min]) => scores[key] < min);
    if (failures.length > 0) {
        console.error(
            `\nFALLA: puntuaciones por debajo del mínimo: ` +
                failures.map(([k, m]) => `${k} (${scores[k]} < ${m})`).join(', '),
        );
        process.exitCode = 1;
    } else {
        console.log('\nTodas las puntuaciones cumplen los mínimos.');
    }
} finally {
    server.kill();
}
