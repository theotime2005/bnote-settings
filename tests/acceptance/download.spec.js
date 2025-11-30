import { mount } from "@vue/test-utils";
import { vi } from "vitest";

import DownloadView from "@/pages/download.vue";
import i18n from "@/tests/i18n.js";

const { t } = i18n.global;

vi.mock("@unhead/vue", async (importOriginal) => {
  const original = await importOriginal();
  return {
    ...original,
    useHead: vi.fn(),
  };
});

vi.mock("@/utils/send-log-message-script.js", () => ({
  sendLog: vi.fn(),
}));

describe("Acceptance | DownloadPageView", () => {
  beforeEach(() => {
    global["fetch"] = vi.fn(() => Promise.resolve({}));
  });
  afterEach(() => {
    vi.resetAllMocks();
  });

  it("Displays the main title", async () => {
    // when
    const wrapper = mount(DownloadView, {
      global: {
        plugins: [i18n],
      },
    });

    // then
    expect(wrapper.html()).toContain(t("download.title"));
  });

  it("Displays eurobraille links", async () => {
    // when
    const wrapper = mount(DownloadView, {
      global: {
        plugins: [i18n],
      },
    });

    // then
    const eurobrailleLink = wrapper.find(
      "a[href=\"https://www.eurobraille.fr/supports-et-telechargements/produits-braille/b-note/\"]",
    );
    expect(eurobrailleLink.exists()).toBe(true);
    expect(eurobrailleLink.text()).toBe(t("download.downloadEurobraille"));
  });

  it("displays Theotime links", async () => {
    // when
    const wrapper = mount(DownloadView, {
      global: {
        plugins: [i18n],
      },
    });

    // then
    const theotimeGitHubLink = wrapper.find(
      "a[href=\"https://github.com/theotime2005/bnote\"]",
    );
    const theotimeReleasesLink = wrapper.find(
      "a[href=\"https://github.com/theotime2005/bnote/releases\"]",
    );

    expect(theotimeGitHubLink.exists()).toBe(true);
    expect(theotimeGitHubLink.text()).toContain(t("download.message-3-1"));
    expect(theotimeReleasesLink.exists()).toBe(true);
    expect(theotimeReleasesLink.text()).toBe(t("download.releases"));
  });

  it("Manage errors when loading last version", async () => {
    // given
    global.fetch = vi.fn(() => Promise.reject("Network error"));

    // when
    const wrapper = mount(DownloadView, {
      global: {
        plugins: [i18n],
      },
    });

    // then
    await wrapper.vm.$nextTick();
    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.github.com/repos/theotime2005/bnote/releases",
    );
  });

  it("should display correctly translations", async () => {
    // when
    const wrapper = mount(DownloadView, {
      global: {
        plugins: [i18n],
      },
    });

    // then
    expect(wrapper.html()).toContain(t("download.message-1"));
    expect(wrapper.html()).toContain(t("download.message2"));
    expect(wrapper.html()).toContain(t("download.message3"));
  });
});
