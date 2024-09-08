const routes =  [
  {
    path: "/",
    name: "Accueil",
    component: () => import("@/views/HomeView.vue"),
  },
  {
    path: "/settings",
    name: "Gestion des préférences",
    component: () => import("../views/SettingsView.vue"),
  },
];

export default routes;
