import { createRouter, createWebHashHistory } from "vue-router";
import { useI18n } from "vue-i18n";
import routesList from "@/router/router-list";
import { useLocaleCookie } from "@/scripts/useLocaleCookie";

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: routesList,
});

router.afterEach((to) => {
  const { t } = useI18n();
  if (useLocaleCookie.getLocaleCookie()) {
    document.title = `${t(`${to.name as string}.title`)} | ${t("title")}`;
  } else {
    document.title = "B.note";
  }
});

export default router;