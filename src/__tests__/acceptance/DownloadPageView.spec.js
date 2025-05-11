import { render } from "@/__tests__/acceptance/helper.js";

describe("Acceptance | DownloadPageView", () => {
  beforeEach(() => {
    global["fetch"] = vi.fn(() => Promise.resolve({}));
  });
  afterEach(() => {
    vi.resetAllMocks();
  });

  it("Displays the main title", async () => {
    // when
    const wrapper = await render("/download");

    // then
    expect(wrapper.html()).toContain("download.title*");
  });

  it("Displays eurobraille links", async () => {
    // when
    const wrapper = await render("/download");

    // then
    const eurobrailleLink = wrapper.find(
      "a[href=\"https://www.eurobraille.fr/supports-et-telechargements/produits-braille/b-note/\"]",
    );
    expect(eurobrailleLink.exists()).toBe(true);
    expect(eurobrailleLink.text()).toBe("download.downloadEurobraille");
  });

  it("displays Theotime links", async () => {
    // when
    const wrapper = await render("/download");

    // then
    const theotimeGitHubLink = wrapper.find(
      "a[href=\"https://github.com/theotime2005/bnote\"]",
    );
    const theotimeReleasesLink = wrapper.find(
      "a[href=\"https://github.com/theotime2005/bnote/releases\"]",
    );

    expect(theotimeGitHubLink.exists()).toBe(true);
    expect(theotimeGitHubLink.text()).toContain("download.message-3-1");
    expect(theotimeReleasesLink.exists()).toBe(true);
    expect(theotimeReleasesLink.text()).toBe("download.releases");
  });

  it("Manage errors when loading last version", async () => {
    // given
    global.fetch = vi.fn(() => Promise.reject("Network error"));

    // when
    const wrapper = await render("/download");

    // then
    await wrapper.vm.$nextTick();
    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.github.com/repos/theotime2005/bnote/releases",
    );
  });

  it("should display correctly translations", async () => {
    // when
    const wrapper = await render("/download");

    // then
    expect(wrapper.html()).toContain("download.message-1");
    expect(wrapper.html()).toContain("download.message2");
    expect(wrapper.html()).toContain("download.message3");
  });
});
