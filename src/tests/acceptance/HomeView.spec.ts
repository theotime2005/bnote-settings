import { describe, it, expect, beforeEach } from "vitest";
import { VueWrapper } from "@vue/test-utils";
import { render } from "@/tests/acceptance/helper";

describe("Acceptance | HomeView", () => {
  let wrapper: VueWrapper<any>;
  
  beforeEach(async () => {
    wrapper = await render("/");
  });
  
  it("Show the home page", () => {
    // then
    expect(wrapper.find("header").exists()).toBe(true);
    expect(wrapper.find("main").exists()).toBe(true);
    expect(wrapper.find("footer").exists()).toBe(true);
  });

  it("should display the home link with aria-current", () => {
    // when
    const nav = wrapper.find("header nav");
    const links = nav.findAll("a");
    const homeLink = links.find((link) => link.text() === "home.title");
    
    // then
    expect(homeLink).toBeTruthy();
    expect(homeLink?.attributes("aria-current")).toBe("page");
  });

  it("should displays the about link without aria-current", () => {
    // when
    const nav = wrapper.find("header nav");
    const links = nav.findAll("a");
    const aboutLink = links.find((link) => link.text() === "about.title");
    
    // then
    expect(aboutLink).toBeTruthy();
    expect(aboutLink?.attributes("aria-current")).toBe(undefined);
  });
});