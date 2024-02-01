import {defineConfig} from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  base: '/ui',
  server: {
    port: 4500,
    host: true,
    proxy: {
      '/api': {
        target: 'http://0.0.0.0:4545',
        changeOrigin: true,
      },
    },
  },
  // css: {
  //   modules: {
  //     generateScopedName: '[hash:base64:5]',
  //     hashPrefix: ' ',
  //   },
  //   preprocessorOptions: {
  //     scss: {additionalData: '@import "./src/ui/theme";'},
  //   },
  // },
})
