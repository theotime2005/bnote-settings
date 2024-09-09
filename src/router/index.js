import { createRouter, createWebHashHistory } from "vue-router";
import routes from "@/router/router-list.js";

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: routes,
});

router.afterEach((to) => {
  document.title=`${to.name} | Gestion du B.note`;
});

export default router;
