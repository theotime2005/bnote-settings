import { render, t } from "@/tests/acceptance/helper.js";

describe("Acceptance | AboutView", () => {
  let wrapper;

  beforeEach(async () => {
    wrapper = await render("/about");
  });

  it("should display the about page title", () => {
    const title = wrapper.find(".about-title");
    expect(title.exists()).toBe(true);
    expect(title.text()).toBe(t("about.title"));
  });

  it("should display the main about message", () => {
    const text = wrapper.find(".about-text");
    expect(text.exists()).toBe(true);
    expect(text.text()).toBe(t("about.message1"));
  });

  it("should display contribution section", () => {
    const sectionTitle = wrapper.findAll(".section-title")[0];
    expect(sectionTitle.exists()).toBe(true);
    expect(sectionTitle.text()).toBe(t("about.contribution"));
  });

  it("should display GitHub repository link", () => {
    const links = wrapper.findAll(".about-link");
    const githubLink = links.find(link => link.attributes("href") === "https://github.com/theotime2005/bnote-settings");

    expect(githubLink).toBeDefined();
    expect(githubLink.text()).toBe(t("about.github"));
  });

  it("should display feature-bug section", () => {
    const sectionTitles = wrapper.findAll(".section-title");
    const featureBugSection = sectionTitles.find(title => title.text() === t("about.feature-bug"));

    expect(featureBugSection).toBeDefined();
  });

  it("should display feature request link", () => {
    const links = wrapper.findAll(".about-link");
    const featureLink = links.find(link =>
      link.attributes("href")?.includes("template=feature_request.md"),
    );

    expect(featureLink).toBeDefined();
    expect(featureLink.text()).toBe(t("about.feature"));
    expect(featureLink.attributes("target")).toBe("_blank");
  });

  it("should display bug report link", () => {
    const links = wrapper.findAll(".about-link");
    const bugLink = links.find(link =>
      link.attributes("href")?.includes("template=bug_report.md"),
    );

    expect(bugLink).toBeDefined();
    expect(bugLink.text()).toBe(t("about.bug_report"));
    expect(bugLink.attributes("target")).toBe("_blank");
  });

  it("should have all sections in the correct structure", () => {
    const sections = wrapper.findAll(".about-section");
    expect(sections.length).toBe(2);
  });

  it("should have link container with multiple links", () => {
    const linkContainer = wrapper.find(".link-container");
    expect(linkContainer.exists()).toBe(true);

    const linksInContainer = linkContainer.findAll(".about-link");
    expect(linksInContainer.length).toBe(2);
  });
});
