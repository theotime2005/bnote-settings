import { mount } from "@vue/test-utils";

import LoadingSpinner from "~/components/LoadingSpinner.vue";

describe("LoadingSpinner.vue", () => {
  it("renders with default props", () => {
    const wrapper = mount(LoadingSpinner);

    expect(wrapper.find(".loading-spinner").exists()).toBe(true);
    expect(wrapper.find(".loading-spinner__circle").exists()).toBe(true);
    expect(wrapper.find(".loading-spinner__text").exists()).toBe(false);
  });

  it("renders with text when provided", () => {
    const wrapper = mount(LoadingSpinner, {
      props: { text: "Loading..." },
    });

    expect(wrapper.find(".loading-spinner__text").exists()).toBe(true);
    expect(wrapper.find(".loading-spinner__text").text()).toBe("Loading...");
  });

  it("renders small size variant", () => {
    const wrapper = mount(LoadingSpinner, {
      props: { size: "small" },
    });

    expect(wrapper.find(".loading-spinner--small").exists()).toBe(true);
  });

  it("renders large size variant", () => {
    const wrapper = mount(LoadingSpinner, {
      props: { size: "large" },
    });

    expect(wrapper.find(".loading-spinner--large").exists()).toBe(true);
  });

  it("renders medium size by default", () => {
    const wrapper = mount(LoadingSpinner);

    expect(wrapper.find(".loading-spinner--small").exists()).toBe(false);
    expect(wrapper.find(".loading-spinner--large").exists()).toBe(false);
  });
});
