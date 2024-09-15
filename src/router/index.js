import { createRouter, createWebHistory } from "vue-router";
import i18n from "@/i18n.js";
import routes from "@/router/router-list.js";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
});

const t = i18n.global.t;
router.afterEach((to) => {
  document.title=`${t(`${to.name}.title`)} | ${t("title")}`;
});

export default router;
