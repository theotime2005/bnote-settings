const routes = [
  {
    path: "home",
    name: "home",
    component: () => import("@/views/HomeView.vue"),
  },
  {
    path: "download",
    name: "download",
    component: () => import("@/views/DownloadPageView.vue"),
  },
  {
    path: "settings",
    name: "settingsPage",
    component: () => import("../views/SettingsView.vue"),
  },
  {
    path: "faq",
    name: "faq",
    component: () => import("@/views/FaqView.vue"),
  },
];

export default routes;
