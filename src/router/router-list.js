const routes =  [
  {
    path: "/",
    name: "Accueil",
    component: () => import("@/views/HomeView.vue"),
  },
  {
    path: "/download",
    name: "Téléchargement de version",
    component: () => import("@/views/DownloadPageView.vue"),
  },
  {
    path: "/settings",
    name: "Gestion des préférences",
    component: () => import("../views/SettingsView.vue"),
  },
];

export default routes;
