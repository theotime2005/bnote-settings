import { describe, it, expect } from "vitest";
import { createRouter, createWebHistory } from "vue-router";
import NavBarComponent from "@/components/NavBarComponent.vue";
import routes from "@/router/router-list";
import { render } from "@/tests/components/helpers";

describe("NavBarComponent", () => {
  // Create a router instance with the routes
  const router = createRouter({
    history: createWebHistory(),
    routes,
  });

  it("renders a menu item for each route", async () => {
    const wrapper = render(NavBarComponent, {
      plugins: [router],
    });

    // Wait for the router to be ready
    await router.isReady();

    const menuItems = wrapper.findAllComponents({ name: "RouterLink" });
    expect(menuItems.length).toBe(routes.length);
  });

  it("renders the correct route paths", async () => {
    const wrapper = render(NavBarComponent, {
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
    const wrapper = render(NavBarComponent, {
      plugins: [router],
    }, {}, () => ({
      routes: [],
    }));

    await router.isReady();

    const menuItems = wrapper.findAllComponents({ name: "RouterLink" });
    expect(menuItems.length).toBe(0);
  });
});