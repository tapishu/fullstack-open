import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   server: {
//     proxy: {
//       '/api': {
//         target: 'http://localhost:3003',
//         changeOrigin: true,
//       },
//     },
//   },
//   test: {
//     environment: 'jsdom',
//     globals: true,
//     setupFiles: './testSetup.js',
//   },
// })

// https://vite.dev/config/
export default defineConfig(() => {
  // NODE_ENV が 'test' のときは 3001、それ以外は 3003 にする
const targetPort = process.env.NODE_ENV === 'test' ? '3001' : '3003'
//const targetPort = "3001"
  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: `http://localhost:${targetPort}`,
          changeOrigin: true,
        },
      },
    },
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: './testSetup.js',
    },
  }
})
