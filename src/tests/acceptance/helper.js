import { createTestingPinia } from "@pinia/testing";
import { mount } from "@vue/test-utils";
import { vi } from "vitest";

import App from "@/App.vue";
import i18n from "@/i18n.js";
import router from "@/router/index.js";

// Mock global pour les composables
vi.mock("@/composables/useNotifications.js", () => ({
  useNotifications: () => ({
    notifications: { value: [] },
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
  }),
}));

/**
 * Helper pour monter un composant Vue avec une configuration par défaut.
 *
 * @param {Object} [options] - Options pour personnaliser le rendu.
 * @param {string} [options.route='/'] - Route initiale à charger dans le routeur.
 * @param {Object} [options.initialState={}] - État initial pour les magasins Pinia.
 * @returns {Object} - Retourne le wrapper monté et le router.
 */
async function render(route = "/", initialState = {}) {
  // Définir la route initiale
  router.push(route);
  await router.isReady();

  // Assurez-vous que le routeur est prêt avant de monter
  return mount(App, {
    global: {
      plugins: [
        router,
        createTestingPinia({
          createSpy: vi.fn, // Utilise Vitest pour espionner les actions
          initialState, // Passe un état initial pour Pinia
        }),
      ],
      mocks: {
        $i18n: i18n,
        $t: (msg) => msg,
      },
    },
  });
}

export { render, router };
