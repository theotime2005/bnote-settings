<script>
import settings from "@/settings.js";

export default {
  name: "SettingComponent",
  props: {
    name: {
      type: String,
      required: true,
    },
    setting: {
      type: Object,
      required: true,
    },
    setting_value: {
      required: true,
    },
  },
  data() {
    return {
      settings_value: settings.settings_value,
      settingValue: this.setting_value,
    };
  },
  methods: {
    updateSetting(value) {
      this.$emit("setting-change", this.settingValue);
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
      :checked="setting_value"
      @change="updateSetting"
      v-model="settingValue"
    />
  </div>

  <!-- Dropdown menu -->
  <div v-else-if="setting.type === 'menu'">
    <label :for="name">{{ name }}</label>
    <select
      :id="name"
      :value="setting_value"
      @change="updateSetting"
      v-model="settingValue"
    >
      <option
        v-for="option in setting.values"
        :key="option"
        :value="option"
      >
        {{ settings_value[option] }}
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
      :value="setting_value"
      @input="updateSetting"
      v-model="settingValue"
    />
  </div>
</template>

<style scoped>
/* Styles personnalisés ici */
</style>
