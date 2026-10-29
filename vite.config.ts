import { existsSync } from 'node:fs'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { contentPlugin } from './build/content-plugin'

export default defineConfig({
  plugins: [react(), contentPlugin()],
  // the CV download only appears when the PDF is actually shipped (no dead link)
  define: {
    __HAS_CV__: JSON.stringify(existsSync('public/cv.pdf')),
    // the Impressum e-mail comes from the environment (repo variable in CI), never from the repo
    __IMPRESSUM_EMAIL__: JSON.stringify(process.env.IMPRESSUM_EMAIL ?? ''),
  },
  // GitHub Pages serves the site under /homepage/; override for other hosts (see ADR 0005)
  base: process.env.VITE_BASE ?? '/homepage/',
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    watch: {
      // set in the dev container: bind mounts on macOS do not always propagate file events
      usePolling: process.env.VITE_USE_POLLING === 'true',
    },
  },
})
