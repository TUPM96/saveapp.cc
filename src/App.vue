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
      image: `${siteUrl}${app.icon}`,
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
    image: `${siteUrl}/app-icons/koi.svg`,
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
        <img class="brand-mark" :src="assetUrl('/app-icons/koi.svg')" alt="" />
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
      <section v-if="isHome" class="catalog" aria-labelledby="catalog-title">
        <div class="catalog-head">
          <div>
            <p class="eyebrow">Danh sách ứng dụng</p>
            <h1 id="catalog-title">Các app đang phát triển</h1>
            <p>
              Tổng hợp trạng thái phát hành, nền tảng hỗ trợ và đường dẫn store cho từng sản phẩm.
            </p>
          </div>
          <div class="catalog-stats" aria-label="Tổng quan danh sách app">
            <span>{{ apps.length }}</span>
            <small>ứng dụng</small>
          </div>
        </div>

        <div class="toolbar" aria-label="Bộ lọc ứng dụng">
          <label class="search-box">
            <span>Tìm kiếm</span>
            <input v-model="query" type="search" placeholder="Tên app, package, danh mục" />
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

        <div class="app-table" role="table" aria-label="Danh sách ứng dụng">
          <div class="table-head" role="row">
            <span role="columnheader">Ứng dụng</span>
            <span role="columnheader">Người dùng</span>
            <span role="columnheader">Trạng thái</span>
            <span role="columnheader">Cập nhật trạng thái</span>
            <span role="columnheader">Cập nhật lần cuối</span>
            <span role="columnheader">Chi tiết</span>
          </div>

          <article
            v-for="app in filteredApps"
            :key="app.slug"
            class="app-row"
            role="row"
            tabindex="0"
            @click="navigate(appPath(app))"
            @keydown.enter="navigate(appPath(app))"
          >
            <div class="app-cell app-info" role="cell">
              <img class="app-icon" :src="assetUrl(app.icon)" :alt="`${app.name} icon`" />
              <div>
                <h2>{{ app.name }}</h2>
                <p>{{ app.packageName }}</p>
              </div>
            </div>
            <div class="app-cell metric" role="cell">
              <span>{{ app.installCount }}</span>
            </div>
            <div class="app-cell" role="cell">
              <span class="status-pill" :class="app.statusTone">{{ app.status }}</span>
            </div>
            <div class="app-cell" role="cell">
              <span>{{ app.releaseChannel }}</span>
            </div>
            <div class="app-cell" role="cell">
              <time :datetime="app.updatedAtMachine">{{ app.updatedAt }}</time>
            </div>
            <div class="app-cell row-action-cell" role="cell">
              <a
                class="row-action"
                :href="withBase(appPath(app))"
                :aria-label="`Xem chi tiết ${app.name}`"
                @click.stop="onInternalLink($event, appPath(app))"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M5 12h13m-5-5 5 5-5 5" />
                </svg>
              </a>
            </div>
          </article>
        </div>

        <p v-if="filteredApps.length === 0" class="empty-state">
          Không có ứng dụng phù hợp với bộ lọc hiện tại.
        </p>
      </section>

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
                <dd>{{ selectedApp.installCount }}</dd>
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
  </div>
</template>
