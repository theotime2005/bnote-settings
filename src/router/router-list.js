const routes =  [
  {
    path: "/",
    name: "homeTitle",
    component: () => import("@/views/HomeView.vue"),
  },
  {
    path: "/download",
    name: "downloadTitle",
    component: () => import("@/views/DownloadPageView.vue"),
  },
  {
    path: "/settings",
    name: "settingsTitle",
    component: () => import("../views/SettingsView.vue"),
  },
];

export default routes;
