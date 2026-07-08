// Tạo ảnh Open Graph (1200×630 PNG) cho trang chủ và từng app.
// Chạy thủ công khi đổi icon/data:  node scripts/generate-og.mjs
// Ảnh xuất ra public/og/ và được commit như asset tĩnh, nên CI/GitHub Pages
// không cần Chromium khi build.
import { mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync } from 'node:fs';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { apps, site } from '../src/data/apps.js';

const run = promisify(execFile);
const root = dirname(fileURLToPath(import.meta.url));
const iconsDir = join(root, '..', 'public', 'app-icons');
const outDir = join(root, '..', 'public', 'og');
const tmpDir = join(root, '..', '.og-tmp');

const CHROME_CANDIDATES = [
  '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell',
  process.env.CHROME_BIN
].filter(Boolean);

const chrome = CHROME_CANDIDATES.find((p) => existsSync(p));
if (!chrome) {
  console.error('Không tìm thấy Chromium. Đặt CHROME_BIN trỏ tới binary Chrome/Chromium.');
  process.exit(1);
}

const STATUS_COLORS = {
  success: '#34d399',
  accent: '#fb7185',
  muted: '#94a3b8'
};

async function iconSvg(app) {
  const file = join(iconsDir, `${app.slug}.svg`);
  const svg = await readFile(file, 'utf8');
  // Bỏ khai báo width/height để icon co giãn theo khung.
  return svg.replace(/<title>[\s\S]*?<\/title>/i, '');
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

const baseStyles = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: 1200px; height: 630px; }
  body {
    font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif;
    color: #f8fafc;
    background: radial-gradient(1200px 700px at 78% -12%, rgba(45,212,191,.28), transparent 60%),
                radial-gradient(900px 700px at 8% 118%, rgba(190,24,93,.26), transparent 55%),
                linear-gradient(135deg, #0b1120 0%, #101a30 52%, #0b1428 100%);
    position: relative;
    overflow: hidden;
  }
  .grid-bg {
    position: absolute; inset: 0;
    background-image: linear-gradient(rgba(148,163,184,.06) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(148,163,184,.06) 1px, transparent 1px);
    background-size: 48px 48px;
    mask-image: radial-gradient(900px 600px at 60% 40%, #000, transparent 78%);
  }
  .brandbar {
    position: absolute; top: 56px; left: 72px;
    display: flex; align-items: center; gap: 16px;
  }
  .brandbar .logo { width: 56px; height: 56px; border-radius: 14px;
    box-shadow: 0 12px 30px rgba(0,0,0,.4); overflow: hidden; flex: 0 0 auto; }
  .brandbar .logo svg { display: block; width: 56px; height: 56px; }
  .brandbar .name { font-size: 27px; font-weight: 800; letter-spacing: -.3px; }
  .brandbar .name b { color: #5eead4; }
  .brandbar .name small { display: block; font-size: 15px; font-weight: 600;
    color: #94a3b8; letter-spacing: .4px; margin-top: 2px; text-transform: uppercase; }
  .stripe { position: absolute; bottom: 0; left: 0; right: 0; height: 12px;
    background: linear-gradient(90deg, #2dd4bf, #6366f1, #fb7185); }
`;

function appCardHtml(app, icon) {
  const color = STATUS_COLORS[app.statusTone] || STATUS_COLORS.muted;
  // Cỡ tiêu đề co giãn theo độ dài tên để thẻ nào cũng vừa khung 630px.
  const len = app.name.length;
  const h1Size = len <= 14 ? 74 : len <= 22 ? 60 : 52;
  return `<!doctype html><html><head><meta charset="utf-8"><style>${baseStyles}
    .wrap { position: absolute; left: 0; right: 0; top: 148px; bottom: 40px;
      display: flex; align-items: center; justify-content: space-between;
      padding: 0 96px; gap: 64px; }
    .left { max-width: 620px; }
    .eyebrow { display: inline-flex; align-items: center; gap: 10px; font-size: 20px;
      font-weight: 700; color: #5eead4; text-transform: uppercase; letter-spacing: 1.5px;
      margin-bottom: 22px; }
    .eyebrow .dot { width: 10px; height: 10px; border-radius: 50%; background: ${color};
      box-shadow: 0 0 16px ${color}; }
    h1 { font-size: ${h1Size}px; line-height: 1.05; font-weight: 800;
      letter-spacing: -1.4px; margin-bottom: 24px; }
    .tagline { font-size: 27px; line-height: 1.45; color: #cbd5e1; font-weight: 500; }
    .meta { display: flex; gap: 12px; margin-top: 40px; flex-wrap: wrap; }
    .pill { font-size: 20px; font-weight: 700; padding: 12px 22px; border-radius: 999px;
      background: rgba(148,163,184,.12); border: 1px solid rgba(148,163,184,.24);
      color: #e2e8f0; }
    .pill.status { background: ${color}1f; border-color: ${color}55; color: ${color}; }
    .iconwrap { flex: 0 0 auto; width: 320px; height: 320px; border-radius: 64px;
      background: linear-gradient(160deg, rgba(255,255,255,.14), rgba(255,255,255,.03));
      border: 1px solid rgba(255,255,255,.14); display: flex; align-items: center;
      justify-content: center; box-shadow: 0 40px 90px rgba(0,0,0,.5); }
    .iconwrap svg { width: 208px; height: 208px; border-radius: 44px;
      box-shadow: 0 20px 50px rgba(0,0,0,.45); }
  </style></head><body>
    <div class="grid-bg"></div>
    <div class="brandbar">
      <div class="logo">${icon}</div>
      <div class="name"><b>SaveApp</b>.cc<small>${escapeHtml(site.owner)}</small></div>
    </div>
    <div class="wrap">
      <div class="left">
        <div class="eyebrow"><span class="dot"></span>${escapeHtml(app.category)}</div>
        <h1>${escapeHtml(app.name)}</h1>
        <div class="tagline">${escapeHtml(app.tagline)}</div>
        <div class="meta">
          <span class="pill status">${escapeHtml(app.status)}</span>
          <span class="pill">${escapeHtml(app.platforms.join(' · '))}</span>
        </div>
      </div>
      <div class="iconwrap">${icon}</div>
    </div>
    <div class="stripe"></div>
  </body></html>`;
}

async function homeCardHtml() {
  const iconEls = await Promise.all(
    apps.slice(0, 4).map(async (app) => `<div class="tile">${await iconSvg(app)}</div>`)
  );
  const koi = await iconSvg({ slug: 'koi' });
  return `<!doctype html><html><head><meta charset="utf-8"><style>${baseStyles}
    .wrap { position: absolute; left: 0; right: 0; top: 150px; bottom: 44px;
      display: flex; align-items: center; justify-content: space-between;
      padding: 0 96px; gap: 56px; }
    .left { max-width: 600px; }
    .eyebrow { display: inline-flex; align-items: center; gap: 10px; font-size: 19px;
      font-weight: 700; color: #5eead4; text-transform: uppercase; letter-spacing: 1.5px;
      margin-bottom: 20px; }
    .eyebrow .dot { width: 10px; height: 10px; border-radius: 50%; background: #34d399;
      box-shadow: 0 0 16px #34d399; }
    h1 { font-size: 64px; line-height: 1.06; font-weight: 800; letter-spacing: -1.6px;
      margin-bottom: 24px; }
    h1 b { color: #5eead4; }
    .tagline { font-size: 25px; line-height: 1.45; color: #cbd5e1; font-weight: 500;
      max-width: 560px; }
    .count { margin-top: 34px; display: inline-flex; align-items: baseline; gap: 14px; }
    .count b { font-size: 52px; font-weight: 800; color: #fff; letter-spacing: -1px; }
    .count span { font-size: 21px; color: #94a3b8; font-weight: 600; }
    .grid { flex: 0 0 auto; display: grid; grid-template-columns: repeat(2, 152px);
      gap: 26px; }
    .tile { width: 152px; height: 152px; border-radius: 36px;
      background: linear-gradient(160deg, rgba(255,255,255,.12), rgba(255,255,255,.03));
      border: 1px solid rgba(255,255,255,.12); display: flex; align-items: center;
      justify-content: center; box-shadow: 0 26px 60px rgba(0,0,0,.45); overflow: hidden; }
    .tile svg { display: block; width: 98px; height: 98px; border-radius: 24px; }
  </style></head><body>
    <div class="grid-bg"></div>
    <div class="brandbar">
      <div class="logo">${koi}</div>
      <div class="name"><b>SaveApp</b>.cc<small>${escapeHtml(site.owner)}</small></div>
    </div>
    <div class="wrap">
      <div class="left">
        <div class="eyebrow"><span class="dot"></span>App catalog</div>
        <h1>Các ứng dụng<br><b>đang phát triển</b></h1>
        <div class="tagline">Trạng thái phát hành, nền tảng hỗ trợ và liên kết store cho từng sản phẩm.</div>
        <div class="count"><b>${apps.length}</b><span>ứng dụng đang xây dựng</span></div>
      </div>
      <div class="grid">${iconEls.join('')}</div>
    </div>
    <div class="stripe"></div>
  </body></html>`;
}

async function shoot(html, outPath) {
  const htmlPath = join(tmpDir, 'card.html');
  await writeFile(htmlPath, html);
  await run(chrome, [
    '--headless',
    '--no-sandbox',
    '--disable-gpu',
    '--hide-scrollbars',
    '--force-device-scale-factor=1',
    '--window-size=1200,630',
    `--screenshot=${outPath}`,
    `file://${htmlPath}`
  ]);
  console.log('✓', outPath.replace(join(root, '..') + '/', ''));
}

await rm(tmpDir, { recursive: true, force: true });
await mkdir(tmpDir, { recursive: true });
await mkdir(outDir, { recursive: true });

await shoot(await homeCardHtml(), join(outDir, 'home.png'));
for (const app of apps) {
  await shoot(appCardHtml(app, await iconSvg(app)), join(outDir, `${app.slug}.png`));
}

await rm(tmpDir, { recursive: true, force: true });
console.log('\nĐã tạo ảnh OG trong public/og/');
