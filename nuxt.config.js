// https://nuxt.com/docs/api/configuration/nuxt-config
export default{
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  modules: ["@nuxtjs/i18n"],
  i18n: {
    locales: [
      {
        "code": "en",
        "file": "en.json",
      },
      {
        code: "fr",
        file: "fr.json",
      },
    ],
    lazy: true,
    defaultLocale: "en",
    vueI18n: "./i18n.config.js",
  },
};
