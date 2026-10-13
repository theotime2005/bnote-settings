import { mount } from "@vue/test-utils";
import { vi } from "vitest";
import { createRouter, createWebHistory } from "vue-router";

import BrandMark from "@/components/BrandMark.vue";

function getRaisedDots(wrapper) {
  return wrapper.findAll(".braille-dot").map((dot) => dot.classes().includes("braille-dot--raised"));
}

describe("Integration | Components | BrandMark", () => {
  let router, wrapper;

  beforeEach(async () => {
    vi.useFakeTimers();
    router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: "/", component: { template: "<div />" } },
        { path: "/faq", component: { template: "<div />" } },
      ],
    });
    await router.push("/");
    await router.isReady();

    const Host = {
      components: { BrandMark },
      template: "<a href='/' class='host'><BrandMark /></a>",
    };
    wrapper = mount(Host, { attachTo: document.body, global: { plugins: [router] } });
  });

  afterEach(() => {
    wrapper.unmount();
    vi.useRealTimers();
  });

  it("exposes the brand name to assistive technologies only once", () => {
    // then
    expect(wrapper.find(".sr-only").text()).toBe("B.note");
    expect(wrapper.find(".brand-mark-name").attributes("aria-hidden")).toBe("true");
  });

  it("displays the first two letters in braille at rest", () => {
    // then
    expect(wrapper.findAll(".braille-cell")).toHaveLength(2);
    expect(getRaisedDots(wrapper)).toEqual([
      true, false, true, false, false, false,
      true, true, false, true, true, false,
    ]);
  });

  it("reads the word letter by letter while hovered", async () => {
    // given
    const brandMark = wrapper.findComponent(BrandMark);

    // when
    await wrapper.find(".host").trigger("pointerenter");
    vi.advanceTimersByTime(260);
    await wrapper.vm.$nextTick();

    // then
    expect(brandMark.vm.isReading).toBe(true);
    expect(brandMark.vm.offset).toBe(1);
    expect(wrapper.findAll(".brand-mark-letter--active").map((letter) => letter.text())).toEqual(["n", "o"]);
  });

  it("stops at the end of the word once the pointer leaves", async () => {
    // given
    const brandMark = wrapper.findComponent(BrandMark);
    await wrapper.find(".host").trigger("pointerenter");
    await wrapper.find(".host").trigger("pointerleave");

    // when
    vi.advanceTimersByTime(260 * 5);
    await wrapper.vm.$nextTick();

    // then
    expect(brandMark.vm.isReading).toBe(false);
    expect(brandMark.vm.offset).toBe(0);
  });
  it("reads the word on its own after a while", async () => {
    // given
    const brandMark = wrapper.findComponent(BrandMark);

    // when
    vi.advanceTimersByTime(8000 + 260);
    await wrapper.vm.$nextTick();

    // then
    expect(brandMark.vm.isReading).toBe(true);
    expect(brandMark.vm.offset).toBe(1);
  });
});
