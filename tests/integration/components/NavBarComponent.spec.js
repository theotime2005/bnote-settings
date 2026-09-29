import { flushPromises, mount } from "@vue/test-utils";
import { createRouter, createWebHistory } from "vue-router";

import NavBarComponent from "@/components/NavBarComponent.vue";
import i18n from "@/tests/helpers/i18n.js";

const routes = [
  { path: "/", name: "home", component: { template: "<div>Home</div>" } },
  { path: "/download", name: "download", component: { template: "<div>Download</div>" }, meta: { heroTone: "light" } },
  { path: "/settings", name: "settings.page", component: { template: "<div>Settings</div>" } },
  { path: "/faq", name: "faq", component: { template: "<div>FAQ</div>" }, meta: { heroTone: "accent" } },
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
  describe("mobile menu", () => {
    beforeEach(async () => {
      window.innerWidth = 500;
      window.dispatchEvent(new Event("resize"));
      await wrapper.vm.$nextTick();
    });

    afterEach(() => {
      window.innerWidth = 1024;
    });

    it("places the links right after the menu button in the reading order", async () => {
      // when
      await wrapper.find(".nav-toggle-button").trigger("click");

      // then
      const toggle = wrapper.find(".nav-toggle-button").element;
      expect(toggle.nextElementSibling.id).toBe("main-navigation");
      expect(wrapper.findAll("#main-navigation .nav-link")).toHaveLength(routes.length);
    });

    it("notifies when the menu opens and closes", async () => {
      // when
      await wrapper.find(".nav-toggle-button").trigger("click");
      await wrapper.find(".nav-toggle-button").trigger("click");

      // then
      expect(wrapper.emitted("menu-change")).toEqual([[true], [false]]);
    });

    it("closes with Escape and gives the focus back to the menu button", async () => {
      // given
      const attachedWrapper = mount(NavBarComponent, {
        attachTo: document.body,
        global: { plugins: [router, i18n] },
      });
      await attachedWrapper.vm.$nextTick();
      await attachedWrapper.find(".nav-toggle-button").trigger("click");
      attachedWrapper.find(".nav-link").element.focus();

      // when
      await attachedWrapper.find(".nav-link").trigger("keydown", { key: "Escape" });
      await flushPromises();

      // then
      expect(attachedWrapper.find("#main-navigation").exists()).toBe(false);
      expect(document.activeElement).toBe(attachedWrapper.find(".nav-toggle-button").element);
      attachedWrapper.unmount();
    });
  });

  describe("hero tone", () => {
    it("uses the inverse palette at the top of pages with a dark hero", () => {
      expect(wrapper.find(".nav-header").classes()).toContain("on-inverse");
    });

    it("keeps the default palette on pages with a light hero", async () => {
      await router.push("/download");
      await flushPromises();

      const classes = wrapper.find(".nav-header").classes();
      expect(classes).toContain("nav-header--top");
      expect(classes).not.toContain("on-inverse");
    });

    it("uses the accent palette on pages with an accent hero", async () => {
      await router.push("/faq");
      await flushPromises();

      expect(wrapper.find(".nav-header").classes()).toContain("on-accent");
    });
  });
});
