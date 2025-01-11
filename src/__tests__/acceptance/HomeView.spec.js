import { render, router } from "@/__tests__/acceptance/helper.js";
import { expect } from "vitest";

describe("Acceptance | HomeView", async () => {
  it("Show the home page", async () => {
    // when
    const wrapper = await render("/");

    // then
    expect(wrapper.find("header").exists()).toBe(true);
    expect(wrapper.find("main").exists()).toBe(true);
    expect(wrapper.find("footer").exists()).toBe(true);
  });

  it("should displays the home link with aria-current", async () => {
    // given
    const wrapper = await render("/");
    // when
    const nav = wrapper.find("header nav");
    const links = nav.findAll("a");
    const homeLink = links.find((link) => link.text() === "home.title");
    // then
    expect(homeLink).toBeTruthy();
    expect(homeLink.attributes("aria-current")).toBe("page");
  });
});
