import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import seoPlugin from './scripts/seo-plugin.js'

export default defineConfig({
  plugins: [react(), tailwindcss(), seoPlugin()],
  build: {
    rollupOptions: {
      output: {
        // GSAP gets its own long-cached chunk. framer-motion is left to Rollup so the
        // LazyMotion feature bundle (motionFeatures.js) stays a separate on-demand chunk.
        manualChunks(id) {
          if (id.includes('node_modules/gsap')) return 'gsap'
        },
      },
    },
  },
})
