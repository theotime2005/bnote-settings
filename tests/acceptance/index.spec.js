import { mount } from "@vue/test-utils";
import { vi } from "vitest";
import { createRouter, createWebHistory } from "vue-router";

import FooterComponent from "~/components/FooterComponent.vue";
import LanguageComponent from "~/components/LanguageComponent.vue";
import NavBarComponent from "~/components/NavBarComponent.vue";
import AboutView from "~/pages/about.vue";
import DownloadView from "~/pages/download.vue";
import FaqView from "~/pages/faq.vue";
import HomeView from "~/pages/index.vue";
import SettingsView from "~/pages/settings.vue";
import i18n from "~/tests/i18n.js";

const { t } = i18n.global;

vi.mock("@unhead/vue", async (importOriginal) => {
  const original = await importOriginal();
  return {
    ...original,
    useHead: vi.fn(),
  };
});

const routes = [
  { path: "/", name: "home", component: HomeView },
  { path: "/download", name: "download", component: DownloadView },
  { path: "/settings", name: "settings.page", component: SettingsView },
  { path: "/faq", name: "faq", component: FaqView },
  { path: "/about", name: "about", component: AboutView },
];

describe("Acceptance | HomeView", async () => {
  let wrapper, router;

  beforeEach(async () => {
    router = createRouter({
      history: createWebHistory(),
      routes,
    });

    router.push("/");
    await router.isReady();

    Object.defineProperty(window, "innerWidth", { value: 1024, writable: true });

    const App = {
      components: { NavBarComponent, FooterComponent },
      template: `
        <div>
          <NavBarComponent />
          <main id="main-content" tabindex="-1" class="mt-4">
            <router-view />
          </main>
          <FooterComponent />
        </div>
      `,
    };

    wrapper = mount(App, {
      global: {
        plugins: [router, i18n],
        components: {
          FooterComponent,
          LanguageComponent,
          NavBarComponent,
          NuxtLink: { template: "<a :href='to'><slot /></a>", props: ["to"] },
        },
      },
    });

    await wrapper.vm.$nextTick();
  });

  it("Show the home page", async () => {
    // then
    expect(wrapper.find("header").exists()).toBe(true);
    expect(wrapper.find("main").exists()).toBe(true);
    expect(wrapper.find("footer").exists()).toBe(true);
  });

  it("should display the home link with aria-current", async () => {
    // given
    const navComponent = wrapper.findComponent(NavBarComponent);
    navComponent.vm.navBarIsVisible = true;
    await wrapper.vm.$nextTick();

    // when
    const nav = wrapper.find("header nav");
    const links = nav.findAll("a");
    const homeLink = links.find((link) => link.text() === t("home.title"));

    // then
    expect(homeLink).toBeTruthy();
    expect(homeLink.attributes("aria-current")).toBe("page");
  });

  it("should displays the about link without aria-current", async () => {
    // given
    const navComponent = wrapper.findComponent(NavBarComponent);
    navComponent.vm.navBarIsVisible = true;
    await wrapper.vm.$nextTick();

    // when
    const nav = wrapper.find("header nav");
    const links = nav.findAll("a");
    const aboutLink = links.find((link) => link.text() === t("about.title"));

    // then
    expect(aboutLink).toBeTruthy();
    expect(aboutLink.attributes("aria-current")).toBe(undefined);
  });
});
