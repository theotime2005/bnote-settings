const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("@/views/HomeView.vue"),
  },
  {
    path: "/download",
    name: "download",
    component: () => import("@/views/DownloadPageView.vue"),
  },
  {
    path: "/settings",
    name: "settings.page",

    component: () => import("../views/SettingsView.vue"),
  },
  {
    path: "/faq",
    name: "faq",
    component: () => import("@/views/FaqView.vue"),
  },
  {
    path: "/about",
    name: "about",
    component: () => import("@/views/AboutView.vue"),
  },
];

export default routes;
