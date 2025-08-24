import { createTestingPinia } from "@pinia/testing";
import { mount } from "@vue/test-utils";
import { vi } from "vitest";

import App from "../../app.vue";

// Mock global pour les composables
vi.mock("../../composables/useNotifications.js", () => ({
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

/**
 * Helper pour monter un composant Vue avec une configuration par défaut.
 *
 * @param {Object} [options] - Options pour personnaliser le rendu.
 * @param {string} [options.route='/'] - Route initiale à charger dans le routeur.
 * @param {Object} [options.initialState={}] - État initial pour les magasins Pinia.
 * @returns {Object} - Retourne le wrapper monté et le router.
 */
async function render(route = "/", initialState = {}) {
  // For Nuxt, we'll mount the app component directly
  return mount(App, {
    global: {
      plugins: [
        createTestingPinia({
          createSpy: vi.fn, // Utilise Vitest pour espionner les actions
          initialState, // Passe un état initial pour Pinia
        }),
      ],
    },
  });
}

export { render };
