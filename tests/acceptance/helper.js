import { createTestingPinia } from "@pinia/testing";
import { mount } from "@vue/test-utils";
import { vi } from "vitest";
import { createRouter, createWebHistory } from "vue-router";

import FooterComponent from "~/components/FooterComponent.vue";
import LanguageComponent from "~/components/LanguageComponent.vue";
import LoadingSpinner from "~/components/LoadingSpinner.vue";
import NavBarComponent from "~/components/NavBarComponent.vue";
import NotificationToast from "~/components/NotificationToast.vue";
import SettingComponent from "~/components/SettingComponent.vue";
import ToolBar from "~/components/ToolBar.vue";
import UploadFileComponent from "~/components/UploadFileComponent.vue";
import AboutView from "~/pages/about.vue";
import DownloadView from "~/pages/download.vue";
import FaqView from "~/pages/faq.vue";
import HomeView from "~/pages/index.vue";
import SettingsView from "~/pages/settings.vue";
import i18n from "~/tests/i18n.js";

const { t } = i18n.global;

const routes = [
  { path: "/", name: "home", component: HomeView },
  { path: "/download", name: "download", component: DownloadView },
  { path: "/settings", name: "settings.page", component: SettingsView },
  { path: "/faq", name: "faq", component: FaqView },
  { path: "/about", name: "about", component: AboutView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

vi.mock("~/composables/useNotifications.js", () => ({
  useNotifications: () => ({
    notifications: { value: [] },
    addNotification: vi.fn(),
    removeNotification: vi.fn(),
    clearAll: vi.fn(),
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
  }),
}));

vi.mock("@unhead/vue", async (importOriginal) => {
  const original = await importOriginal();
  return {
    ...original,
    useHead: vi.fn(),
  };
});

async function render(route = "/", initialState = {}) {
  router.push(route);
  await router.isReady();

  const App = {
    components: { NavBarComponent, FooterComponent },
    template: `
      <div>
        <NavBarComponent />
        <div class="container">
          <main id="main-content" tabindex="-1" class="mt-4">
            <router-view />
          </main>
        </div>
        <FooterComponent />
      </div>
    `,
  };

  return mount(App, {
    global: {
      plugins: [
        router,
        createTestingPinia({
          createSpy: vi.fn,
          initialState,
        }),
        i18n,
      ],
      components: {
        FooterComponent,
        LanguageComponent,
        LoadingSpinner,
        NavBarComponent,
        NotificationToast,
        SettingComponent,
        ToolBar,
        UploadFileComponent,
        NuxtLink: { template: "<a :href='to'><slot /></a>", props: ["to"] },
        NuxtPage: { template: "<router-view />" },
      },
    },
  });
}

export { render, router, t };
