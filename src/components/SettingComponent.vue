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
    };
  },
  methods: {
    updateSetting(value) {
      console.log(this.setting.values);
      this.$emit("update:setting_value", this.setting_value); // Émet la nouvelle valeur vers le parent
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
      @change="updateSetting($event.target.checked)"
    />
  </div>

  <!-- Dropdown menu -->
  <div v-else-if="setting.type === 'menu'">
    <label :for="name">{{ name }}</label>
    <select
      :id="name"
      :value="setting_value"
      @change="updateSetting($event.target.value)"
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
      @input="updateSetting($event.target.value)"
    />
  </div>
</template>

<style scoped>
/* Styles personnalisés ici */
</style>
