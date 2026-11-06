import { mount } from "@vue/test-utils";
import { vi } from "vitest";

import CursorFollower from "@/components/CursorFollower.vue";

function mockMatchMedia(matchingQueries) {
  window.matchMedia = vi.fn((query) => ({ matches: matchingQueries.includes(query) }));
}

describe("Integration | Components | CursorFollower", () => {
  const originalMatchMedia = window.matchMedia;

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
  });

  it("is not rendered on touch devices", () => {
    // given
    mockMatchMedia([]);

    // when
    const wrapper = mount(CursorFollower);

    // then
    expect(wrapper.find(".cursor").exists()).toBe(false);
  });

  it("is not rendered when reduced motion is requested", () => {
    // given
    mockMatchMedia(["(hover: hover) and (pointer: fine)", "(prefers-reduced-motion: reduce)"]);

    // when
    const wrapper = mount(CursorFollower);

    // then
    expect(wrapper.find(".cursor").exists()).toBe(false);
  });

  it("is rendered as a decorative element with a mouse", async () => {
    // given
    mockMatchMedia(["(hover: hover) and (pointer: fine)"]);

    // when
    const wrapper = mount(CursorFollower);
    await wrapper.vm.$nextTick();

    // then
    expect(wrapper.find(".cursor").attributes("aria-hidden")).toBe("true");
    expect(wrapper.findAll(".cursor-dot")).toHaveLength(6);
    wrapper.unmount();
  });
});
