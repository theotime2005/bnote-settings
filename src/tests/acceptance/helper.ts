import { createTestingPinia } from "@pinia/testing";
import { mount, VueWrapper } from "@vue/test-utils";
import { vi } from "vitest";
import { Router } from "vue-router";

import App from "@/App.vue";
import i18n from "@/i18n";
import router from "@/router/index";

interface RenderOptions {
  route?: string;
  initialState?: Record<string, any>;
}

/**
 * Helper pour monter un composant Vue avec une configuration par défaut.
 *
 * @param route - Route initiale à charger dans le routeur.
 * @param initialState - État initial pour les magasins Pinia.
 * @returns Retourne le wrapper monté et le router.
 */
async function render(route: string = "/", initialState: Record<string, any> = {}): Promise<VueWrapper<any>> {
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
        $t: (msg: string) => msg,
      },
    },
  });
}

export { render, router };