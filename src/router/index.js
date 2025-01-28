import { createRouter, createWebHashHistory } from "vue-router";

import i18n from "@/i18n.js";
import routesList from "@/router/router-list.js";


const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: routesList,
});

const t = i18n.global.t;
router.afterEach((to) => {
  document.title = `${t(`${to.name}.title`)} | ${t("title")}`;
});

export default router;
