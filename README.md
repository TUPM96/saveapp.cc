# SaveApp.cc

Web giới thiệu danh sách ứng dụng bằng Vue 3 + Vite, có trang chi tiết từng app, metadata SEO, sitemap và workflow deploy lên GitHub Pages.

## Chạy local

```bash
npm install
npm run dev
```

## Build production

```bash
npm run build
```

Sau khi build, script `scripts/postbuild-seo.mjs` sẽ tạo thêm các trang tĩnh cho từng app tại `dist/apps/<slug>/index.html`, sitemap và robots.

## Cập nhật danh sách app

Sửa dữ liệu trong `src/data/apps.js`. Mỗi app có `slug`, thông tin hiển thị, tính năng và `storeLinks`.

## Ảnh chia sẻ (Open Graph) & icon

Link preview khi chia sẻ (Facebook, Zalo, Messenger, LinkedIn, X…) dùng ảnh PNG 1200×630 trong `public/og/`, favicon và app icon trong `public/`. Các ảnh này được commit sẵn nên CI/GitHub Pages không cần Chromium khi build.

Khi đổi icon app, tagline hoặc thêm app mới, tạo lại asset (cần Chromium/Chrome cục bộ):

```bash
node scripts/generate-og.mjs      # ảnh OG: public/og/home.png + từng app
node scripts/generate-icons.mjs   # favicon PNG, apple-touch-icon, icon manifest từ favicon.svg
```

Đặt `CHROME_BIN` nếu binary Chrome/Chromium không nằm ở đường dẫn mặc định.

## Deploy GitHub Pages

Workflow `.github/workflows/deploy.yml` tự build và deploy thư mục `dist` khi push vào branch `main`. Nếu dùng GitHub Pages theo đường dẫn repo thay vì custom domain, đặt secret hoặc biến môi trường `VITE_BASE_PATH=/saveapp.cc/`.
