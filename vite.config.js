import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    base: env.VITE_BASE_PATH || '/',
    plugins: [vue()],
    server: {
      host: '0.0.0.0'
    },
    preview: {
      host: '0.0.0.0'
    },
    build: {
      sourcemap: true
    }
  };
});
