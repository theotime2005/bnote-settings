// eslint-disable-next-line no-undef
export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },

  modules: [
    "@pinia/nuxt",
    "@nuxtjs/i18n",
  ],

  css: ["@/assets/css/style.css"],

  i18n: {
    legacy: false,
    locales: [
      { code: "fr", name: "Français", file: "fr.json" },
      { code: "en", name: "English", file: "en.json" },
      { code: "it", name: "Italiano", file: "it.json" },
      { code: "es", name: "Español", file: "es.json" },
    ],
    defaultLocale: "fr",
    lazy: false,
    bundle: {
      optimizeTranslationDirective: false,
    },
    strategy: "prefix",
    langDir: "locales/",
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "locale",
      redirectOn: "all",
    },
  },

  app: {
    head: {
      title: "B.note",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "google-site-verification", content: process.env.GOOGLE_SITE_VERIFICATION },
      ],
      link: [
        { rel: "icon", href: "/favicon.ico" },
      ],
    },
  },
});
