import i18n from "~/tests/i18n.js";

import { render } from "./helper.js";

const { t } = i18n.global;
describe("Acceptance | HomeView", async () => {
  let wrapper;
  beforeEach(async () => {
    wrapper = await render("/");
  });
  it("Show the home page", async () => {
    // then
    expect(wrapper.find("header").exists()).toBe(true);
    expect(wrapper.find("main").exists()).toBe(true);
    expect(wrapper.find("footer").exists()).toBe(true);
  });

  it("should display the home link with aria-current", async () => {
    // when
    const nav = wrapper.find("header nav");
    const links = nav.findAll("a");
    const homeLink = links.find((link) => link.text() === t("home.title"));
    // then
    expect(homeLink).toBeTruthy();
    expect(homeLink.attributes("aria-current")).toBe("page");
  });

  it("should displays the about link without aria-current", async () => {
    // when
    const nav = wrapper.find("header nav");
    const links = nav.findAll("a");
    const aboutLink = links.find((link) => link.text() === t("about.title"));
    // then
    expect(aboutLink).toBeTruthy();
    expect(aboutLink.attributes("aria-current")).toBe(undefined);
  });
});
