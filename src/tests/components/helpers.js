import { mount } from "@vue/test-utils";
import { vi } from "vitest";

import i18n from "@/i18n.js";

// Mock global pour les composables
vi.mock("@/composables/useNotifications.js", () => ({
  useNotifications: () => ({
    notifications: { value: [] },
    addNotification: vi.fn(),
    removeNotification: vi.fn(),
    clearAll: vi.fn(),
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
  }),
}));

function t(msg) {
  return msg;
}

function render(component, global = {}, properties = {}, data = null) {
  // Initialize mocks with the default $t mock
  const defaultMocks = {
    $t: (msg) => msg,
    $i18n: i18n,
  };

  // Fusion of the global options with the default mocks
  const global_component = {
    ...global,
    mocks: {
      ...defaultMocks,
      ...(global.mocks || {}), // Add the mocks from the global options
    },
  };

  // Prepare the options to mount the component
  const mountOptions = {
    global: global_component,
    props: properties,
  };

  // Add the data to the component if it is provided
  if (data) {
    mountOptions.data = () => data;
  }

  return mount(component, mountOptions);
}

export { render, t };
