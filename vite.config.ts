import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base: './' works for both Electron (file://) and Vercel (HashRouter always at /)
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    assetsInlineLimit: 4096,
  },
})
