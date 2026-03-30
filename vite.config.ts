import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

// Fix CSS url() paths that reference public/ images.
// CSS files use url('./images/...') which works in dev (served from root)
// but breaks in production because CSS is bundled into dist/assets/.
// This plugin rewrites './images/' → '../images/' in built CSS so paths
// resolve correctly from dist/assets/ → dist/images/.
function fixCssPublicUrls(): Plugin {
  return {
    name: 'fix-css-public-urls',
    enforce: 'post',
    generateBundle(_, bundle) {
      for (const file of Object.values(bundle)) {
        if (file.type === 'asset' && file.fileName.endsWith('.css')) {
          file.source = (file.source as string).replace(
            /url\(\s*\.\/images\//g,
            'url(../images/'
          );
        }
      }
    },
  };
}

// base: './' works for both Electron (file://) and Vercel (HashRouter always at /)
export default defineConfig({
  plugins: [react(), fixCssPublicUrls()],
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    assetsInlineLimit: 4096,
  },
})
