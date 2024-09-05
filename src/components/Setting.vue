<script>
import { settings_value } from "@/settings.js";

export default {
  name: "Setting",
  props: {
    name: {
      type: String,
      required: true,
    },
    setting: {
      type: Object,
      required: true,
    },
    settingValue: {
      required: true,
    },
  },
  methods: {
    updateSetting(value) {
      this.$emit("update:settingValue", value); // Émet la nouvelle valeur vers le parent
    },
    getLabel(value) {
      // Utilisation de settings_value pour afficher le label
      return settings_value[value] || value;
    },
  },
};
</script>

<template>
  <!-- Checkbox -->
  <div v-if="setting.type === 'checkbox'">
    <label :for="name">{{ name }}</label>
    <input
      type="checkbox"
      :id="name"
      :checked="settingValue"
      @change="updateSetting($event.target.checked)"
    />
  </div>

  <!-- Dropdown menu -->
  <div v-else-if="setting.type === 'menu'">
    <label :for="name">{{ name }}</label>
    <select
      :id="name"
      :value="settingValue"
      @change="updateSetting($event.target.value)"
    >
      <option
        v-for="option in setting.values"
        :key="option"
        :value="option"
      >
        {{ getLabel(option) }}
      </option>
    </select>
  </div>

  <!-- Number input -->
  <div v-else-if="setting.type === 'number'">
    <label :for="name">{{ name }}</label>
    <input
      type="number"
      :id="name"
      :min="setting.min"
      :max="setting.max"
      :value="settingValue"
      @input="updateSetting($event.target.value)"
    />
  </div>
</template>

<style scoped>
/* Styles personnalisés ici */
</style>
