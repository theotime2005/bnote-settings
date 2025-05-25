import { mount } from "@vue/test-utils";

function t(msg) {
  return msg;
}

function render(component, global = {}, properties = {}, data = null) {
  // Initialize mocks with the default $t mock
  const defaultMocks = {
    $t: (msg) => msg,
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
};

export { render, t };
