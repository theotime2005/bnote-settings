import { mount, VueWrapper, MountingOptions } from "@vue/test-utils";
import { Component } from "vue";

function t(msg: string): string {
  return msg;
}

interface GlobalOptions {
  mocks?: Record<string, any>;
  plugins?: any[];
  [key: string]: any;
}

function render(
  component: Component, 
  global: GlobalOptions = {}, 
  properties: Record<string, any> = {}, 
  data: (() => Record<string, any>) | null = null
): VueWrapper<any> {
  // Initialize mocks with the default $t mock
  const defaultMocks = {
    $t: (msg: string) => msg,
  };

  // Fusion of the global options with the default mocks
  const global_component: GlobalOptions = {
    ...global,
    mocks: {
      ...defaultMocks,
      ...(global.mocks || {}), // Add the mocks from the global options
    },
  };

  // Prepare the options to mount the component
  const mountOptions: MountingOptions<any> = {
    global: global_component,
    props: properties,
  };

  // Add the data to the component if it is provided
  if (data) {
    mountOptions.data = data;
  }

  return mount(component, mountOptions);
}

export { render, t };