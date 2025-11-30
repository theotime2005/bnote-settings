import { createI18n } from "vue-i18n";

import en from "../i18n/locales/en.json";
import es from "../i18n/locales/es.json";
import fr from "../i18n/locales/fr.json";
import it from "../i18n/locales/it.json";

const i18n = createI18n({
  legacy: false,
  locale: "fr",
  fallbackLocale: "en",
  messages: {
    fr,
    en,
    it,
    es,
  },
});

if (!i18n.global.setLocale) {
  Object.defineProperty(i18n.global, "setLocale", {
    value: async (locale) => {
      if (i18n.global.locale && typeof i18n.global.locale === "object" && "value" in i18n.global.locale) {
        i18n.global.locale.value = locale;
      } else {
        i18n.global.locale = locale;
      }
      return Promise.resolve();
    },
    configurable: true,
  });
}

export default i18n;
