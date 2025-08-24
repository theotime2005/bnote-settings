// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  
  // Enable SSR for better SEO and performance
  ssr: true,

  // Modules
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/i18n',
    '@nuxt/eslint'
  ],

  // CSS
  css: ['~/assets/style.css'],

  // Build configuration
  nitro: {
    preset: 'vercel'
  },

  // App configuration
  app: {
    head: {
      title: 'B.note',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'google-site-verification', content: 'HWlT_6pqqqCebAbwZ14UfYiNST45zFc0U_EdQadtbvU' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },

  // Compatibility
  compatibilityDate: '2024-12-20'
})