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

export default i18n;
