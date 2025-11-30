import { mount } from "@vue/test-utils";

import NotificationToast from "@/components/NotificationToast.vue";
import i18n from "@/tests/i18n.js";


describe("NotificationToast.vue", () => {
  beforeEach(() => {
    // Create a div element to act as the teleport target
    const teleportTarget = document.createElement("div");
    teleportTarget.id = "teleport-target";
    document.body.appendChild(teleportTarget);
  });

  afterEach(() => {
    // Clean up the teleport target
    const teleportTarget = document.getElementById("teleport-target");
    if (teleportTarget) {
      document.body.removeChild(teleportTarget);
    }
    // Clean up any remaining toast elements
    const toastElements = document.querySelectorAll(".toast");
    toastElements.forEach(element => element.remove());
  });
  it("renders the toast with the correct type and message", async () => {
    // given
    const wrapper = mount(NotificationToast, {
      global: {
        plugins: [i18n],
      },
      props: {
        visible: true,
        type: "success",
        message: "Operation successful",
      },
    });

    // when & then
    await wrapper.vm.$nextTick();
    expect(document.querySelector(".toast--success")).toBeTruthy();
    expect(document.querySelector(".toast__message")?.textContent).toBe("Operation successful");
  });

  it("emits close event after duration", async () => {
    // given
    vi.useFakeTimers();
    const wrapper = mount(NotificationToast, {
      global: {
        plugins: [i18n],
      },
      props: {
        visible: true,
        message: "Auto close",
        duration: 1000,
      },
    });

    // when
    vi.advanceTimersByTime(1000);

    // then
    expect(wrapper.emitted("close")).toBeTruthy();
    vi.useRealTimers();
  });

  it("does not emit close event if duration is 0", () => {
    // given
    vi.useFakeTimers();
    const wrapper = mount(NotificationToast, {
      global: {
        plugins: [i18n],
      },
      props: {
        visible: true,
        message: "No auto close",
        duration: 0,
      },
    });

    // when
    vi.advanceTimersByTime(5000);

    // then
    expect(wrapper.emitted("close")).toBeFalsy();
    vi.useRealTimers();
  });

  it("renders the title if provided", async () => {
    // given
    const wrapper = mount(NotificationToast, {
      global: {
        plugins: [i18n],
      },
      props: {
        visible: true,
        title: "Notification Title",
        message: "Notification message",
      },
    });

    // when & then
    await wrapper.vm.$nextTick();
    expect(document.querySelector(".toast__title")?.textContent).toBe("Notification Title");
  });

  it("does not render the title if not provided", async () => {
    // given
    const wrapper = mount(NotificationToast, {
      global: {
        plugins: [i18n],
      },
      props: {
        visible: true,
        message: "Notification message",
      },
    });

    // when & then
    await wrapper.vm.$nextTick();
    expect(document.querySelector(".toast__title")).toBeFalsy();
  });

  it("renders the close button if dismissible is true", async () => {
    // given
    const wrapper = mount(NotificationToast, {
      global: {
        plugins: [i18n],
      },
      props: {
        visible: true,
        dismissible: true,
        message: "Dismissible toast",
      },
    });

    // when & then
    await wrapper.vm.$nextTick();
    expect(document.querySelector(".toast__close")).toBeTruthy();
  });

  it("does not render the close button if dismissible is false", async () => {
    // given
    const wrapper = mount(NotificationToast, {
      global: {
        plugins: [i18n],
      },
      props: {
        visible: true,
        dismissible: false,
        message: "Non-dismissible toast",
      },
    });

    // when & then
    await wrapper.vm.$nextTick();
    expect(document.querySelector(".toast__close")).toBeFalsy();
  });

  it("emits close event when close button is clicked", async () => {
    // given
    const wrapper = mount(NotificationToast, {
      global: {
        plugins: [i18n],
      },
      props: {
        visible: true,
        dismissible: true,
        message: "Dismissible toast",
      },
    });

    // when
    await wrapper.vm.$nextTick();
    const closeButton = document.querySelector(".toast__close");
    closeButton?.click();

    // then
    expect(wrapper.emitted("close")).toBeTruthy();
  });
});
