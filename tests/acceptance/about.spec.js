import { mount } from "@vue/test-utils";
import { vi } from "vitest";

import AboutView from "@/pages/about.vue";
import i18n from "@/tests/i18n.js";

const { t } = i18n.global;

vi.mock("@unhead/vue", async (importOriginal) => {
  const original = await importOriginal();
  return {
    ...original,
    useHead: vi.fn(),
  };
});

describe("Acceptance | AboutView", () => {
  let wrapper;

  beforeEach(async () => {
    wrapper = mount(AboutView, {
      global: {
        plugins: [i18n],
      },
    });
  });

  it("should display the about page title", () => {
    // when
    const title = wrapper.find(".about-title");

    // then
    expect(title.exists()).toBe(true);
    expect(title.text()).toBe(t("about.title"));
  });

  it("should display the main about message", () => {
    // when
    const text = wrapper.find(".about-text");

    // then
    expect(text.exists()).toBe(true);
    expect(text.text()).toBe(t("about.message1"));
  });

  it("should display contribution section", () => {
    // when
    const sectionTitle = wrapper.findAll(".section-title")[0];

    // then
    expect(sectionTitle.exists()).toBe(true);
    expect(sectionTitle.text()).toBe(t("about.contribution"));
  });

  it("should display GitHub repository link", () => {
    // when
    const links = wrapper.findAll(".about-link");
    const githubLink = links.find(link => link.attributes("href") === "https://github.com/theotime2005/bnote-settings");

    // then
    expect(githubLink).toBeDefined();
    expect(githubLink.text()).toBe(t("about.github"));
  });

  it("should display feature-bug section", () => {
    // when
    const sectionTitles = wrapper.findAll(".section-title");
    const featureBugSection = sectionTitles.find(title => title.text() === t("about.feature-bug"));

    // then
    expect(featureBugSection).toBeDefined();
  });

  it("should display feature request link", () => {
    // when
    const links = wrapper.findAll(".about-link");
    const featureLink = links.find(link =>
      link.attributes("href")?.includes("template=feature_request.md"),
    );

    // then
    expect(featureLink).toBeDefined();
    expect(featureLink.text()).toBe(t("about.feature"));
    expect(featureLink.attributes("target")).toBe("_blank");
  });

  it("should display bug report link", () => {
    // when
    const links = wrapper.findAll(".about-link");
    const bugLink = links.find(link =>
      link.attributes("href")?.includes("template=bug_report.md"),
    );

    // then
    expect(bugLink).toBeDefined();
    expect(bugLink.text()).toBe(t("about.bug_report"));
    expect(bugLink.attributes("target")).toBe("_blank");
  });

  it("should have all sections in the correct structure", () => {
    // when
    const sections = wrapper.findAll(".about-section");

    // then
    expect(sections.length).toBe(2);
  });

  it("should have link container with multiple links", () => {
    // when
    const linkContainer = wrapper.find(".link-container");
    const linksInContainer = linkContainer.findAll(".about-link");

    // then
    expect(linkContainer.exists()).toBe(true);
    expect(linksInContainer.length).toBe(2);
  });
});
