import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { apps, site } from '../src/data/apps.js';

const root = dirname(fileURLToPath(import.meta.url));
const distDir = join(root, '..', 'dist');
const indexPath = join(distDir, 'index.html');
const sourceHtml = await readFile(indexPath, 'utf8');
const siteUrl = normalizeUrl(process.env.VITE_SITE_URL || site.url);

const homeMeta = {
  title: `${site.name} - Danh sách ứng dụng`,
  description: site.description,
  url: `${siteUrl}/`,
  image: `${siteUrl}/og/home.png`,
  imageAlt: `${site.name} - Danh sách ứng dụng đang phát triển`,
  robots: 'index, follow',
  schema: {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${site.name} app catalog`,
    itemListElement: apps.map((app, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${siteUrl}/apps/${app.slug}`,
      name: app.name
    }))
  }
};

await writeFile(indexPath, injectSeo(sourceHtml, homeMeta));

for (const app of apps) {
  const routeDir = join(distDir, 'apps', app.slug);
  const appMeta = {
    title: `${app.name} - ${app.category} | ${site.name}`,
    description: app.description,
    url: `${siteUrl}/apps/${app.slug}`,
    image: `${siteUrl}/og/${app.slug}.png`,
    imageAlt: `${app.name} - ${app.tagline}`,
    robots: 'index, follow',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: app.name,
      applicationCategory: app.category,
      operatingSystem: app.platforms.join(', '),
      description: app.description,
      url: `${siteUrl}/apps/${app.slug}`,
      image: `${siteUrl}${app.icon}`,
      dateModified: app.updatedAtMachine,
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'VND'
      },
      publisher: {
        '@type': 'Organization',
        name: site.owner,
        url: siteUrl
      }
    }
  };

  await mkdir(routeDir, { recursive: true });
  await writeFile(join(routeDir, 'index.html'), injectSeo(sourceHtml, appMeta));
}

await writeFile(
  join(distDir, '404.html'),
  injectSeo(sourceHtml, {
    title: `Không tìm thấy ứng dụng | ${site.name}`,
    description: 'Ứng dụng này chưa có trong danh sách hiện tại của SaveApp.cc.',
    url: `${siteUrl}/404`,
    image: `${siteUrl}/og/home.png`,
    imageAlt: `${site.name} - Danh sách ứng dụng`,
    robots: 'noindex, follow',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: `Không tìm thấy ứng dụng | ${site.name}`,
      url: `${siteUrl}/404`
    }
  })
);
await writeFile(join(distDir, 'sitemap.xml'), buildSitemap());
await writeFile(join(distDir, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n`);

function injectSeo(html, meta) {
  let output = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(meta.title)}</title>`);
  output = replaceMeta(output, 'name', 'description', meta.description);
  output = replaceMeta(output, 'property', 'og:title', meta.title);
  output = replaceMeta(output, 'property', 'og:description', meta.description);
  output = replaceMeta(output, 'property', 'og:url', meta.url);
  output = replaceMeta(output, 'property', 'og:image', meta.image);
  if (meta.imageAlt) {
    output = replaceMeta(output, 'property', 'og:image:alt', meta.imageAlt);
  }
  output = replaceMeta(output, 'name', 'twitter:title', meta.title);
  output = replaceMeta(output, 'name', 'twitter:description', meta.description);
  output = replaceMeta(output, 'name', 'twitter:image', meta.image);
  output = replaceMeta(output, 'name', 'robots', meta.robots || 'index, follow');
  output = replaceCanonical(output, meta.url);
  output = output.replace(
    /<script id="seo-schema" type="application\/ld\+json">[\s\S]*?<\/script>/i,
    `<script id="seo-schema" type="application/ld+json">${JSON.stringify(meta.schema)}</script>`
  );

  return output;
}

function replaceMeta(html, attr, key, content) {
  const pattern = new RegExp(`<meta\\s+[^>]*${attr}="${escapeRegExp(key)}"[^>]*>`, 'i');
  const tag = `<meta ${attr}="${key}" content="${escapeHtml(content)}" />`;

  if (pattern.test(html)) {
    return html.replace(pattern, tag);
  }

  return html.replace('</head>', `    ${tag}\n  </head>`);
}

function replaceCanonical(html, url) {
  const tag = `<link rel="canonical" href="${escapeHtml(url)}" />`;
  const pattern = /<link\s+[^>]*rel="canonical"[^>]*>/i;

  if (pattern.test(html)) {
    return html.replace(pattern, tag);
  }

  return html.replace('</head>', `    ${tag}\n  </head>`);
}

function buildSitemap() {
  const routes = [
    { path: '/', lastmod: latestDate(apps.map((app) => app.updatedAtMachine)) },
    ...apps.map((app) => ({ path: `/apps/${app.slug}`, lastmod: app.updatedAtMachine }))
  ];
  const urls = routes
    .map(
      (route) => `  <url>
    <loc>${siteUrl}${route.path === '/' ? '/' : route.path}</loc>
    <lastmod>${route.lastmod}</lastmod>
  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

function latestDate(dates) {
  return dates.sort().at(-1);
}

function normalizeUrl(url) {
  return url.endsWith('/') ? url.slice(0, -1) : url;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
