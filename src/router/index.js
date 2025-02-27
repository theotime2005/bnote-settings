
import { createRouter, createWebHashHistory } from "vue-router";

import i18n from "@/i18n.js";
import routesList from "@/router/router-list.js";
import { useLocaleCookie } from "@/scripts/useLocaleCookie.js";


const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: routesList,
});
const t = i18n.global.t;
router.afterEach((to) => {
  if (useLocaleCookie.getLocaleCookie()) {
    document.title = `${t(`${to.name}.title`)} | ${t("title")}`;
  } else {
    document.title = "B.note";
  }
});

export default router;
