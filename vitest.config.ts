import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'jsdom',
    exclude: ['**/e2e/**', '**/node_modules/**', '**/.nuxt/**'],
    reporters: process.env.GITHUB_ACTIONS ? ['dot', 'github-actions'] : ['dot'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './')
    }
  }
})