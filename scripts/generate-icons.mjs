// Tạo icon PNG (favicon fallback, apple-touch-icon, icon manifest) từ favicon.svg.
// Chạy thủ công khi đổi favicon:  node scripts/generate-icons.mjs
import { mkdir, writeFile, rm, readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync } from 'node:fs';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const run = promisify(execFile);
const root = dirname(fileURLToPath(import.meta.url));
const publicDir = join(root, '..', 'public');
const tmpDir = join(root, '..', '.icon-tmp');

const chrome = [
  '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell',
  process.env.CHROME_BIN
].filter(Boolean).find((p) => p && existsSync(p));

if (!chrome) {
  console.error('Không tìm thấy Chromium. Đặt CHROME_BIN.');
  process.exit(1);
}

const svg = await readFile(join(publicDir, 'favicon.svg'), 'utf8');
// Bản full-bleed (bo góc vuông) cho apple-touch-icon: iOS tự bo góc.
const fullBleed = svg.replace('rx="22"', 'rx="0"');

// { tên file, kích thước, có nền bo góc vuông hay không }
const targets = [
  { name: 'apple-touch-icon.png', size: 180, bleed: true },
  { name: 'icon-192.png', size: 192, bleed: false },
  { name: 'icon-512.png', size: 512, bleed: false },
  { name: 'favicon-32.png', size: 32, bleed: false },
  { name: 'favicon-16.png', size: 16, bleed: false }
];

async function shoot({ name, size, bleed }) {
  const markup = bleed ? fullBleed : svg;
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>
    *{margin:0;padding:0}html,body{width:${size}px;height:${size}px;background:transparent}
    svg{display:block;width:${size}px;height:${size}px}</style></head>
    <body>${markup}</body></html>`;
  const htmlPath = join(tmpDir, 'icon.html');
  await writeFile(htmlPath, html);
  await run(chrome, [
    '--headless', '--no-sandbox', '--disable-gpu', '--hide-scrollbars',
    '--force-device-scale-factor=1',
    '--default-background-color=00000000',
    `--window-size=${size},${size}`,
    `--screenshot=${join(publicDir, name)}`,
    `file://${htmlPath}`
  ]);
  console.log('✓ public/' + name);
}

await rm(tmpDir, { recursive: true, force: true });
await mkdir(tmpDir, { recursive: true });
for (const t of targets) await shoot(t);
await rm(tmpDir, { recursive: true, force: true });
console.log('\nĐã tạo icon trong public/');
