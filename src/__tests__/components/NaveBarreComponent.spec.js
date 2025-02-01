import { createRouter, createWebHistory } from "vue-router";

import { render } from "@/__tests__/components/helpers.js";
import NaveBarreComponent from "@/components/NaveBarreComponent.vue";
import routes from "@/router/router-list.js";

describe("NaveBarreComponent", () => {
  // Create a router instance with the routes
  const router = createRouter({
    history: createWebHistory(),
    routes,
  });

  it("renders a menu item for each route", async () => {
    const wrapper = render(NaveBarreComponent, {
      plugins: [router],
    });

    // Wait for the router to be ready
    await router.isReady();

    const menuItems = wrapper.findAllComponents({ name: "RouterLink" });
    expect(menuItems.length).toBe(routes.length);
  });

  it("renders the correct route paths", async () => {
    const wrapper = render(NaveBarreComponent, {
      plugins: [router],
    });

    await router.isReady();

    const menuItems = wrapper.findAllComponents({ name: "RouterLink" });
    if (menuItems.length > 0) {
      menuItems.forEach((item, index) => {
        expect(item.props("to")).toBe(routes[index].path);
      });
    }
  });
  it("handles empty routes array", async () => {
    const wrapper = render(NaveBarreComponent, {
      plugins: [router],
    }, {}, {
      routes: [],
    });

    await router.isReady();

    const menuItems = wrapper.findAllComponents({ name: "RouterLink" });
    expect(menuItems.length).toBe(0);
  });
});
