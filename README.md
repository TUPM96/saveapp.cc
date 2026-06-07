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

## Deploy GitHub Pages

Workflow `.github/workflows/deploy.yml` tự build và deploy thư mục `dist` khi push vào branch `main`. Nếu dùng GitHub Pages theo đường dẫn repo thay vì custom domain, đặt secret hoặc biến môi trường `VITE_BASE_PATH=/saveapp.cc/`.
