import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodeExternalsPlugin } from 'esbuild-node-externals'
import ViteCommonJS from 'vite-plugin-commonjs';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), nodeExternalsPlugin(),ViteCommonJS()],
  optimizeDeps: {
    exclude: ['js-big-decimal']
  },
  define: {
    'process.env': process.env
  }
})
