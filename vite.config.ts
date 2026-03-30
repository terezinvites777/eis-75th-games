import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// VITE_DEPLOY_TARGET=web → Vercel/web build (base: '/')
// default → Electron kiosk build (base: './' for file:// loading)
const isWeb = process.env.VITE_DEPLOY_TARGET === 'web';

export default defineConfig({
  plugins: [react()],
  base: isWeb ? '/' : './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    assetsInlineLimit: 4096,
  },
})
