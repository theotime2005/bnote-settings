import { beforeEach, describe, expect, it, vi } from "vitest";

import { useNotifications } from "@/composables/useNotifications.js";

describe("useNotifications", () => {
  let notificationInstance;

  beforeEach(() => {
    vi.useFakeTimers();
    notificationInstance = useNotifications();
    notificationInstance.clearAll();
    vi.advanceTimersByTime(300);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should add a notification", () => {
    const { notifications, addNotification } = useNotifications();

    const id = addNotification({ type: "info", message: "Test notification" });

    expect(notifications.value.length).toBe(1);
    expect(notifications.value[0].id).toBe(id);
    expect(notifications.value[0].type).toBe("info");
    expect(notifications.value[0].message).toBe("Test notification");
    expect(notifications.value[0].visible).toBe(true);
  });

  it("should add notification with default properties", () => {
    const { notifications, addNotification } = useNotifications();

    addNotification({ message: "Test" });

    expect(notifications.value[0].visible).toBe(true);
    expect(notifications.value[0].dismissible).toBe(true);
    expect(notifications.value[0].duration).toBe(5000);
  });

  it("should auto-remove notification after duration", () => {
    const { notifications, addNotification } = useNotifications();

    addNotification({ message: "Test", duration: 1000 });

    expect(notifications.value.length).toBe(1);

    vi.advanceTimersByTime(1000);

    expect(notifications.value[0].visible).toBe(false);

    vi.advanceTimersByTime(300);

    expect(notifications.value.length).toBe(0);
  });

  it("should not auto-remove notification with duration 0", () => {
    const { notifications, addNotification } = useNotifications();

    addNotification({ message: "Test", duration: 0 });

    expect(notifications.value.length).toBe(1);

    vi.advanceTimersByTime(10000);

    expect(notifications.value.length).toBe(1);
    expect(notifications.value[0].visible).toBe(true);
  });

  it("should remove notification by id", () => {
    const { notifications, addNotification, removeNotification } = useNotifications();

    const id = addNotification({ message: "Test", duration: 0 });

    expect(notifications.value.length).toBe(1);

    removeNotification(id);

    expect(notifications.value[0].visible).toBe(false);

    vi.advanceTimersByTime(300);

    expect(notifications.value.length).toBe(0);
  });

  it("should clear all notifications", () => {
    const { notifications, addNotification, clearAll } = useNotifications();

    addNotification({ message: "Test 1", duration: 0 });
    addNotification({ message: "Test 2", duration: 0 });
    addNotification({ message: "Test 3", duration: 0 });

    expect(notifications.value.length).toBe(3);

    clearAll();

    notifications.value.forEach(n => {
      expect(n.visible).toBe(false);
    });

    vi.advanceTimersByTime(300);

    expect(notifications.value.length).toBe(0);
  });

  it("should add success notification", () => {
    const { notifications, success } = useNotifications();

    success("Success message");

    expect(notifications.value.length).toBe(1);
    expect(notifications.value[0].type).toBe("success");
    expect(notifications.value[0].message).toBe("Success message");
  });

  it("should add error notification", () => {
    const { notifications, error } = useNotifications();

    error("Error message");

    expect(notifications.value.length).toBe(1);
    expect(notifications.value[0].type).toBe("error");
    expect(notifications.value[0].message).toBe("Error message");
  });

  it("should add warning notification", () => {
    const { notifications, warning } = useNotifications();

    warning("Warning message");

    expect(notifications.value.length).toBe(1);
    expect(notifications.value[0].type).toBe("warning");
    expect(notifications.value[0].message).toBe("Warning message");
  });

  it("should add info notification", () => {
    const { notifications, info } = useNotifications();

    info("Info message");

    expect(notifications.value.length).toBe(1);
    expect(notifications.value[0].type).toBe("info");
    expect(notifications.value[0].message).toBe("Info message");
  });

  it("should handle custom options in convenience methods", () => {
    const { notifications, success } = useNotifications();

    success("Success", { duration: 3000, dismissible: false });

    expect(notifications.value[0].duration).toBe(3000);
    expect(notifications.value[0].dismissible).toBe(false);
  });

  it("should handle removing non-existent notification gracefully", () => {
    const { notifications, removeNotification } = useNotifications();

    removeNotification(999);

    expect(notifications.value.length).toBe(0);
  });
});
