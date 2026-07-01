import { fileURLToPath, URL } from 'node:url'
import Components from 'unplugin-vue-components/vite'
import { defineConfig,loadEnv } from 'vite'

import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    base: '/',
    plugins: [
      vue(),
      Components({
        directoryAsNamespace: true,
        dts: true,
        dirs: ['src/components'],
      }),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      port: Number(env.VITE_APP_PORT) || 5173,
      strictPort: true,
    },
    preview: {
      allowedHosts: true,
    },
  }
})