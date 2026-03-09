import { mount } from "@vue/test-utils";

import Changelog from "@/components/Changelog.vue";
import i18n from "@/tests/helpers/i18n.js";

describe("Integration | Components | Changelog", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(Changelog, {
      global: {
        plugins: [i18n],
      },
    });
  });

  it("renders the changelog title with i18n translation", () => {
    // when
    const title = wrapper.find("h2");

    // then
    expect(title.exists()).toBe(true);
    expect(title.text()).toBe(i18n.global.t("changelog.title"));
  });

  it("renders an iframe with correct src attribute", () => {
    // when
    const iframe = wrapper.find("iframe");

    // then
    expect(iframe.exists()).toBe(true);
    expect(iframe.attributes("src")).toBe("/api/changelog");
  });

  it("renders iframe with correct dimensions", () => {
    // when
    const iframe = wrapper.find("iframe");

    // then
    expect(iframe.attributes("width")).toBe("100%");
    expect(iframe.attributes("height")).toBe("600px");
  });

  it("renders iframe with accessibility label", () => {
    // when
    const iframe = wrapper.find("iframe");

    // then
    expect(iframe.attributes("title")).toBe(i18n.global.t("changelog.aria"));
    expect(iframe.attributes("sandbox")).toBe("allow-same-origin");
  });


});


