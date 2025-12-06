import { flushPromises, mount } from "@vue/test-utils";
import { createRouter, createWebHistory } from "vue-router";

import NavBarComponent from "@/components/NavBarComponent.vue";
import i18n from "@/tests/helpers/i18n.js";

const routes = [
  { path: "/", name: "home", component: { template: "<div>Home</div>" } },
  { path: "/download", name: "download", component: { template: "<div>Download</div>" } },
  { path: "/settings", name: "settings.page", component: { template: "<div>Settings</div>" } },
  { path: "/faq", name: "faq", component: { template: "<div>FAQ</div>" } },
  { path: "/about", name: "about", component: { template: "<div>About</div>" } },
];

describe("NavBarComponent", () => {
  let router, wrapper;

  beforeEach(async () => {
    router = createRouter({
      history: createWebHistory(),
      routes,
    });
    await router.push("/");
    await router.isReady();

    Object.defineProperty(window, "innerWidth", { value: 1024, writable: true });

    wrapper = mount(NavBarComponent, {
      global: {
        plugins: [router, i18n],
      },
    });

    await wrapper.vm.$nextTick();
  });

  it("renders a menu item for each route when nav is visible", async () => {
    wrapper.vm.navBarIsVisible = true;
    await wrapper.vm.$nextTick();

    const menuItems = wrapper.findAll(".nav-link");
    expect(menuItems.length).toBe(routes.length);
  });

  it("renders the correct route paths when nav is visible", async () => {
    await flushPromises();
    wrapper.vm.navBarIsVisible = true;
    await wrapper.vm.$nextTick();

    const menuItems = wrapper.findAll(".nav-link");

    expect(menuItems.length).toBe(routes.length);
  });
});
