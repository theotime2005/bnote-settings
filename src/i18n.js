import { createI18n } from "vue-i18n";

import en from "../locales/en.json";
import fr from "../locales/fr.json";
import it from "../locales/it.json";

const i18n = createI18n({
  locale: "fr",
  messages: {
    fr,
    en,
    it,
  },
});

export default i18n;
