import { mount } from "@vue/test-utils";

const t = (msg) => msg;

const render = (component, global = {}, properties = {}, data = null) => {
  // Initialize mocks with the default $t mock
  const defaultMocks = {
    $t: (msg) => msg,
  };

  // Fusionner les mocks définis dans `global` avec les mocks par défaut
  const global_component = {
    ...global,
    mocks: {
      ...defaultMocks,
      ...(global.mocks || {}), // Ajouter ou fusionner les mocks personnalisés
    },
  };

  // Préparer les options pour le montage
  const mountOptions = {
    global: global_component,
    props: properties,
  };

  // Ajouter l'option `data` si elle est définie
  if (data) {
    mountOptions.data = () => data;
  }

  return mount(component, mountOptions);
};

export { render, t };
