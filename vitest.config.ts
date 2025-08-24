import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    // We can exclude utils and other Nuxt-specific directories if needed
    exclude: ['**/e2e/**', '**/node_modules/**', '**/.nuxt/**'],
    reporters: process.env.GITHUB_ACTIONS ? ['dot', 'github-actions'] : ['dot'],
  },
})