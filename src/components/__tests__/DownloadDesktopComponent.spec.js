import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import DownloadDesktopComponent from "@/components/DownloadDesktopComponent.vue";

describe("DownloadDesktopComponent", () => {
  it("fetches version information and sets it correctly", async () => {
    // Mock the fetch call
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve([
            {
              tag_name: "v1.0.0",
              prerelease: false,
              assets: [
                { browser_download_url: "https://example.com/mac" },
                { browser_download_url: "https://example.com/windows" },
              ],
            },
          ]),
      }),
    );

    const wrapper = mount(DownloadDesktopComponent, {
      global: {
        mocks: {
          $t: (msg) => msg,
        },
      },
    });

    // Wait for async method to complete
    await wrapper.vm.get_information();
    expect(wrapper.vm.versionInformation).toEqual({
      tag_name: "v1.0.0",
      prerelease: false,
      assets: [
        { browser_download_url: "https://example.com/mac" },
        { browser_download_url: "https://example.com/windows" },
      ],
    });

    // Check if the rendered template has correct links
    const macDownloadLink = wrapper.find("a[href=\"https://example.com/mac\"]");
    const windowsDownloadLink = wrapper.find("a[href=\"https://example.com/windows\"]");

    expect(macDownloadLink.exists()).toBe(true);
    expect(windowsDownloadLink.exists()).toBe(true);

    // Clean up the mock
    global.fetch.mockRestore();
  });
});
