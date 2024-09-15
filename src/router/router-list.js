const routes =  [
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
    name: "settingsPage",
    component: () => import("../views/SettingsView.vue"),
  },
];

export default routes;
