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
  // Fusion of the global options with no default mocks to avoid conflicts with i18n plugin
  const global_component = {
    ...global,
    plugins: [i18n, ...(global.plugins || [])], // Add i18n plugin for Composition API support
    mocks: {
      ...(global.mocks || {}), // Only add mocks from the global options
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
