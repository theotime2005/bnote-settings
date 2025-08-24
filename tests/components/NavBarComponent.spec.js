import { mount } from "@vue/test-utils";
import { createRouter, createWebHistory } from "vue-router";

import NavBarComponent from "../../components/NavBarComponent.vue";
import routes from "../../router/router-list.js";

describe("NavBarComponent", () => {
  let router, wrapper;

  beforeEach(() => {
    router = createRouter({
      history: createWebHistory(),
      routes,
    });
    wrapper = mount(NavBarComponent, {
      global: {
        plugins: [router, i18n],
      },
    });
  });

  it("renders a menu item for each route", async () => {
    // Wait for the router to be ready
    await router.isReady();

    const menuItems = wrapper.findAllComponents({ name: "RouterLink" });
    expect(menuItems.length).toBe(routes.length);
  });

  it("renders the correct route paths", async () => {
    await router.isReady();

    const menuItems = wrapper.findAllComponents({ name: "RouterLink" });
    if (menuItems.length > 0) {
      menuItems.forEach((item, index) => {
        expect(item.props("to")).toBe(routes[index].path);
      });
    }
  });
});
