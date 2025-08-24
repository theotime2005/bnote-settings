import { createI18n } from "vue-i18n";

import en from "../locales/en.json";
import es from "../locales/es.json";
import fr from "../locales/fr.json";
import it from "../locales/it.json";

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
