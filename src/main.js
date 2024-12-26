import "./style.css";
import { createApp } from "vue";
import { createPinia } from "pinia";
import i18n from "@/i18n.js";
import App from "./App.vue";
import router from "./router";

const app = createApp(App);

// Vérifiez si vous êtes dans un environnement Electron
const isElectron = !!(window && window.process && window.process.versions && window.process.versions.electron);

// Définissez la variable globale
window.isElectron = isElectron;

app.use(createPinia());
app.use(router);

app.use(i18n);

app.mount("#app");
