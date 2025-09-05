import { createRouter, createWebHashHistory } from "vue-router";

import i18n from "@/i18n.js";
import routesList from "@/router/router-list.js";

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: routesList,
});
const { t, locale } = i18n.global;
router.afterEach((to) => {
  if (locale.value) {
    document.title = `${t(`${to.name}.title`)} | ${t("title")}`;
  } else {
    document.title = "B.note";
  }
});

export default router;
