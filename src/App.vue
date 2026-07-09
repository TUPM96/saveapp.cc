<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { apps, site } from './data/apps';

const query = ref('');
const activeStatus = ref('Tất cả');
const currentPath = ref(normalizePath(window.location.pathname));
const basePath = normalizeBase(import.meta.env.BASE_URL || '/');
const siteUrl = normalizeSiteUrl(import.meta.env.VITE_SITE_URL || site.url);

const statusFilters = computed(() => [
  'Tất cả',
  ...Array.from(new Set(apps.map((app) => app.status)))
]);

const currentSlug = computed(() => {
  const match = currentPath.value.match(/^\/apps\/([^/]+)$/);
  return match ? decodeURIComponent(match[1]) : '';
});

const selectedApp = computed(() => apps.find((app) => app.slug === currentSlug.value));
const isHome = computed(() => currentPath.value === '/');

const platformCount = computed(
  () => new Set(apps.flatMap((app) => app.platforms)).size
);
const storeCount = computed(
  () => apps.filter((app) => app.storeLinks.length > 0).length
);
const heroApps = computed(() => apps.slice(0, 6));

const filteredApps = computed(() => {
  const search = query.value.trim().toLowerCase();

  return apps.filter((app) => {
    const matchesStatus = activeStatus.value === 'Tất cả' || app.status === activeStatus.value;
    const matchesSearch =
      !search ||
      [app.name, app.packageName, app.category, app.tagline]
        .join(' ')
        .toLowerCase()
        .includes(search);

    return matchesStatus && matchesSearch;
  });
});

const relatedApps = computed(() => {
  if (!selectedApp.value) {
    return apps.slice(0, 3);
  }

  return apps
    .filter((app) => app.slug !== selectedApp.value.slug)
    .filter((app) => app.category === selectedApp.value.category || app.status === selectedApp.value.status)
    .concat(apps.filter((app) => app.slug !== selectedApp.value.slug))
    .filter((app, index, list) => list.findIndex((item) => item.slug === app.slug) === index)
    .slice(0, 3);
});

function normalizeBase(path) {
  if (!path || path === '/') {
    return '';
  }

  return path.endsWith('/') ? path.slice(0, -1) : path;
}

function normalizeSiteUrl(url) {
  return url.endsWith('/') ? url.slice(0, -1) : url;
}

function normalizePath(path) {
  const normalizedBase = normalizeBase(import.meta.env.BASE_URL || '/');
  let nextPath = path || '/';

  if (normalizedBase && nextPath.startsWith(normalizedBase)) {
    nextPath = nextPath.slice(normalizedBase.length) || '/';
  }

  if (nextPath.length > 1 && nextPath.endsWith('/')) {
    nextPath = nextPath.slice(0, -1);
  }

  return nextPath || '/';
}

function withBase(path) {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${basePath}${cleanPath}` || '/';
}

function assetUrl(path) {
  if (!path || path.startsWith('http') || path.startsWith('data:')) {
    return path;
  }

  return withBase(path);
}

function appPath(app) {
  return `/apps/${app.slug}`;
}

const numberFormatter = new Intl.NumberFormat('vi-VN');

function installLabel(app) {
  return app.installCount > 0 ? numberFormatter.format(app.installCount) : '—';
}

const currentYear = new Date().getFullYear();

function navigate(path) {
  const target = normalizePath(path);
  window.history.pushState({}, '', withBase(target));
  currentPath.value = target;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function onInternalLink(event, path) {
  event.preventDefault();
  navigate(path);
}

function onPopState() {
  currentPath.value = normalizePath(window.location.pathname);
}

function pageMeta() {
  if (selectedApp.value) {
    const app = selectedApp.value;
    return {
      title: `${app.name} - ${app.category} | ${site.name}`,
      description: app.description,
      url: `${siteUrl}${appPath(app)}`,
      image: `${siteUrl}/og/${app.slug}.png`,
      imageAlt: `${app.name} - ${app.tagline}`,
      robots: 'index, follow',
      schema: softwareSchema(app)
    };
  }

  return {
    title: isHome.value ? `${site.name} - Danh sách ứng dụng` : `Không tìm thấy ứng dụng | ${site.name}`,
    description: isHome.value
      ? site.description
      : 'Ứng dụng này chưa có trong danh sách hiện tại của SaveApp.cc.',
    url: isHome.value ? `${siteUrl}/` : `${siteUrl}${currentPath.value}`,
    image: `${siteUrl}/og/home.png`,
    imageAlt: `${site.name} - Danh sách ứng dụng đang phát triển`,
    robots: isHome.value ? 'index, follow' : 'noindex, follow',
    schema: isHome.value ? itemListSchema() : webPageSchema()
  };
}

function softwareSchema(app) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: app.name,
    applicationCategory: app.category,
    operatingSystem: app.platforms.join(', '),
    description: app.description,
    url: `${siteUrl}${appPath(app)}`,
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
  };
}

function itemListSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${site.name} app catalog`,
    itemListElement: apps.map((app, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${siteUrl}${appPath(app)}`,
      name: app.name
    }))
  };
}

function webPageSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `Không tìm thấy ứng dụng | ${site.name}`,
    url: `${siteUrl}${currentPath.value}`,
    isPartOf: {
      '@type': 'WebSite',
      name: site.name,
      url: siteUrl
    }
  };
}

function setMeta(selector, attribute, value) {
  let tag = document.head.querySelector(selector);

  if (!tag) {
    tag = document.createElement(selector.startsWith('meta') ? 'meta' : 'link');
    const nameMatch = selector.match(/\[(name|property|rel)="([^"]+)"\]/);
    if (nameMatch) {
      tag.setAttribute(nameMatch[1], nameMatch[2]);
    }
    document.head.appendChild(tag);
  }

  tag.setAttribute(attribute, value);
}

function updateSeo() {
  const meta = pageMeta();
  document.title = meta.title;
  setMeta('meta[name="description"]', 'content', meta.description);
  setMeta('meta[property="og:title"]', 'content', meta.title);
  setMeta('meta[property="og:description"]', 'content', meta.description);
  setMeta('meta[property="og:url"]', 'content', meta.url);
  setMeta('meta[property="og:image"]', 'content', meta.image);
  setMeta('meta[property="og:image:alt"]', 'content', meta.imageAlt || meta.title);
  setMeta('meta[name="twitter:title"]', 'content', meta.title);
  setMeta('meta[name="twitter:description"]', 'content', meta.description);
  setMeta('meta[name="twitter:image"]', 'content', meta.image);
  setMeta('meta[name="robots"]', 'content', meta.robots || 'index, follow');
  setMeta('link[rel="canonical"]', 'href', meta.url);

  const schema = document.getElementById('seo-schema');
  if (schema) {
    schema.textContent = JSON.stringify(meta.schema);
  }
}

onMounted(() => {
  window.addEventListener('popstate', onPopState);
  updateSeo();
});

onBeforeUnmount(() => {
  window.removeEventListener('popstate', onPopState);
});

watch([currentPath, selectedApp], updateSeo);
</script>

<template>
  <div class="shell">
    <header class="site-header">
      <a class="brand" :href="withBase('/')" @click="onInternalLink($event, '/')">
        <img class="brand-mark" :src="assetUrl('/favicon.svg')" alt="" />
        <span>
          <strong>SaveApp.cc</strong>
          <small>App catalog</small>
        </span>
      </a>
      <nav class="site-nav" aria-label="Điều hướng chính">
        <a :href="withBase('/')" @click="onInternalLink($event, '/')">Ứng dụng</a>
        <a href="mailto:support@saveapp.cc">Liên hệ</a>
      </nav>
    </header>

    <main>
      <div v-if="isHome" class="home">
        <section class="hero" aria-labelledby="hero-title">
          <div class="hero-copy">
            <p class="eyebrow">{{ site.owner }}</p>
            <h1 id="hero-title">Các ứng dụng <span>đang phát triển</span></h1>
            <p class="hero-sub">
              Nơi tổng hợp sản phẩm của {{ site.owner }} — trạng thái phát hành, nền tảng
              hỗ trợ và liên kết tải trên store cho từng ứng dụng.
            </p>
            <div class="hero-cta">
              <a class="btn-primary" :href="withBase('/#apps')" @click="onInternalLink($event, '/')">
                Xem ứng dụng
              </a>
              <a class="btn-ghost" :href="`mailto:${site.email}`">Liên hệ hợp tác</a>
            </div>
            <dl class="hero-stats">
              <div>
                <dt>{{ apps.length }}</dt>
                <dd>ứng dụng</dd>
              </div>
              <div>
                <dt>{{ platformCount }}</dt>
                <dd>nền tảng</dd>
              </div>
              <div>
                <dt>{{ storeCount }}</dt>
                <dd>đã lên store</dd>
              </div>
            </dl>
          </div>
          <div class="hero-visual" aria-hidden="true">
            <div class="hero-grid">
              <div v-for="app in heroApps" :key="app.slug" class="hero-tile">
                <img :src="assetUrl(app.icon)" :alt="`${app.name} icon`" />
              </div>
            </div>
          </div>
        </section>

        <section id="apps" class="catalog" aria-labelledby="catalog-title">
          <div class="section-head">
            <div>
              <p class="eyebrow">Danh mục</p>
              <h2 id="catalog-title">Danh sách ứng dụng</h2>
            </div>
            <div class="toolbar" aria-label="Bộ lọc ứng dụng">
              <label class="search-box">
                <input v-model="query" type="search" placeholder="Tìm tên app, package, danh mục…" />
              </label>
              <div class="status-tabs" role="tablist" aria-label="Lọc theo trạng thái">
                <button
                  v-for="status in statusFilters"
                  :key="status"
                  type="button"
                  :class="{ active: activeStatus === status }"
                  @click="activeStatus = status"
                >
                  {{ status }}
                </button>
              </div>
            </div>
          </div>

          <div class="card-grid">
            <article
              v-for="app in filteredApps"
              :key="app.slug"
              class="app-card"
              tabindex="0"
              role="link"
              :aria-label="`Xem chi tiết ${app.name}`"
              @click="navigate(appPath(app))"
              @keydown.enter="navigate(appPath(app))"
            >
              <div class="card-top">
                <img class="app-icon" :src="assetUrl(app.icon)" :alt="`${app.name} icon`" />
                <span class="status-pill" :class="app.statusTone">{{ app.status }}</span>
              </div>
              <p class="card-cat">{{ app.category }}</p>
              <h3>{{ app.name }}</h3>
              <p class="card-tagline">{{ app.tagline }}</p>
              <div class="card-foot">
                <div class="card-platforms">
                  <span v-for="platform in app.platforms" :key="platform">{{ platform }}</span>
                </div>
                <span class="card-link">
                  Chi tiết
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M5 12h13m-5-5 5 5-5 5" />
                  </svg>
                </span>
              </div>
            </article>
          </div>

          <p v-if="filteredApps.length === 0" class="empty-state">
            Không có ứng dụng phù hợp với bộ lọc hiện tại.
          </p>
        </section>

        <section class="about" aria-labelledby="about-title">
          <div class="about-inner">
            <p class="eyebrow">Về chúng tôi</p>
            <h2 id="about-title">{{ site.owner }}</h2>
            <p>{{ site.description }}</p>
            <a class="btn-primary" :href="`mailto:${site.email}`">Liên hệ: {{ site.email }}</a>
          </div>
        </section>
      </div>

      <section v-else-if="selectedApp" class="detail" aria-labelledby="detail-title">
        <a class="back-link" :href="withBase('/')" @click="onInternalLink($event, '/')">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M19 12H6m5 5-5-5 5-5" />
          </svg>
          Danh sách app
        </a>

        <div class="detail-hero">
          <div class="detail-title">
            <img class="detail-icon" :src="assetUrl(selectedApp.icon)" :alt="`${selectedApp.name} icon`" />
            <div>
              <p class="eyebrow">{{ selectedApp.category }}</p>
              <h1 id="detail-title">{{ selectedApp.name }}</h1>
              <p>{{ selectedApp.tagline }}</p>
            </div>
          </div>

          <div v-if="selectedApp.storeLinks.length" class="store-actions" aria-label="Liên kết store">
            <a
              v-for="link in selectedApp.storeLinks"
              :key="link.label"
              class="store-button"
              :href="link.url"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>{{ link.label }}</span>
              <small v-if="link.note">{{ link.note }}</small>
            </a>
          </div>
          <div v-else class="store-empty" aria-live="polite">
            {{ selectedApp.storeStatus || 'Sắp cập nhật link store chính thức' }}
          </div>
        </div>

        <div class="detail-grid">
          <section class="detail-panel app-summary">
            <h2>Tổng quan</h2>
            <p>{{ selectedApp.description }}</p>
            <div class="platform-list" aria-label="Nền tảng hỗ trợ">
              <span v-for="platform in selectedApp.platforms" :key="platform">{{ platform }}</span>
            </div>
          </section>

          <section class="detail-panel app-facts">
            <h2>Thông tin</h2>
            <dl>
              <div>
                <dt>Package</dt>
                <dd>{{ selectedApp.packageName }}</dd>
              </div>
              <div>
                <dt>Trạng thái</dt>
                <dd>{{ selectedApp.status }}</dd>
              </div>
              <div>
                <dt>Người dùng</dt>
                <dd>{{ installLabel(selectedApp) }}</dd>
              </div>
              <div>
                <dt>Cập nhật</dt>
                <dd>
                  <time :datetime="selectedApp.updatedAtMachine">{{ selectedApp.updatedAt }}</time>
                </dd>
              </div>
            </dl>
          </section>

          <section class="detail-panel feature-list">
            <h2>Tính năng chính</h2>
            <ul>
              <li v-for="feature in selectedApp.features" :key="feature">{{ feature }}</li>
            </ul>
          </section>

          <section class="detail-panel related-list">
            <h2>App khác</h2>
            <a
              v-for="app in relatedApps"
              :key="app.slug"
              :href="withBase(appPath(app))"
              @click="onInternalLink($event, appPath(app))"
            >
              <img class="related-icon" :src="assetUrl(app.icon)" :alt="`${app.name} icon`" />
              <span>
                <strong>{{ app.name }}</strong>
                <small>{{ app.category }}</small>
              </span>
            </a>
          </section>
        </div>
      </section>

      <section v-else class="not-found" aria-labelledby="not-found-title">
        <h1 id="not-found-title">Không tìm thấy ứng dụng</h1>
        <p>Ứng dụng này chưa có trong danh sách hiện tại của SaveApp.cc.</p>
        <a class="primary-link" :href="withBase('/')" @click="onInternalLink($event, '/')">
          Về danh sách app
        </a>
      </section>
    </main>

    <footer class="site-footer">
      <div class="footer-inner">
        <a class="footer-brand" :href="withBase('/')" @click="onInternalLink($event, '/')">
          <img :src="assetUrl('/favicon.svg')" alt="" />
          <span>
            <strong>SaveApp.cc</strong>
            <small>{{ site.owner }}</small>
          </span>
        </a>
        <nav class="footer-links" aria-label="Liên kết chân trang">
          <a :href="withBase('/')" @click="onInternalLink($event, '/')">Ứng dụng</a>
          <a :href="`mailto:${site.email}`">{{ site.email }}</a>
          <span>© {{ currentYear }} {{ site.owner }}</span>
        </nav>
      </div>
    </footer>
  </div>
</template>
