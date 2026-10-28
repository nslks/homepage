import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { contentPlugin } from './build/content-plugin'

export default defineConfig({
  plugins: [react(), contentPlugin()],
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
