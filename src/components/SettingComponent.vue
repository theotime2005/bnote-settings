<script>
import { useSettingsStore } from "@/stores/settingsStore.js";

export default {
  name: "SettingComponent",
  props: {
    settingSection: {
      type: String,
      description: "The setting section",
      required: true,
    },
    settingKey: {
      type: String,
      description: "The key setting",
      required: true,
    },
    setting: {
      type: Object,
      description: "The setting informations",
      required: true,
    },
  },
  data() {
    return {
      settingValue: useSettingsStore().getSetting(this.settingSection, this.settingKey),
      label_id: `${this.settingSection}.${this.settingKey}`,
      name: this.$t(`settings.id.${this.settingKey}`),
      settingsStore: useSettingsStore(),
    };
  },
  methods: {
    updateSetting() {
      if (this.setting.type === "number") {
        this.settingValue = parseInt(this.settingValue);
      }
      useSettingsStore().updateSetting(this.settingSection, this.settingKey, this.settingValue);
    },
    setDefault() {
      this.settingValue = this.setting.default;
      this.updateSetting();
    },
  },
};
</script>

<template>
  <div class="setting-container">
    <!-- Label -->
    <label :for="label_id" class="setting-label">
      {{ name }}
    </label>

    <!-- Checkbox -->
    <input
      v-if="setting.type === 'checkbox'"
      :id="label_id"
      v-model="settingValue"
      type="checkbox"
      :name="name"
      :checked="settingValue"
      class="setting-checkbox"
      @change="updateSetting"
    />

    <!-- Dropdown menu -->
    <select
      v-else-if="setting.type === 'menu'"
      :id="label_id"
      v-model="settingValue"
      :value="settingValue"
      :name="name"
      class="setting-select"
      @change="updateSetting"
    >
      <option v-for="option in setting.values" :key="option" :value="option" :name="option">
        {{ !setting.isTranslate ? $t(`settings.values.${option}`) : option }}
      </option>
    </select>

    <!-- Number input -->
    <div v-else-if="setting.type === 'number'">
      <input
        :id="label_id"
        v-model="settingValue"
        type="range"
        :name="name"
        :min="setting.min"
        :max="setting.max"
        :value="settingValue"
        class="setting-input"
        :list="label_id+'tickmarks'"
        @input="updateSetting"
      />
      <datalist :id="label_id+'tickmarks'">
        <option :value="setting.min"></option>
        <option :value="setting.default"></option>
        <option :value="setting.max"></option>
      </datalist>
    </div>

    <!-- Text input -->
    <input
      v-else-if="setting.type === 'text'"
      :id="label_id"
      v-model="settingValue"
      type="text"
      :name="name"
      :value="settingValue"
      class="setting-input"
      @input="updateSetting"
    />

    <!-- Button to set the default value -->
    <button
      v-if="settingValue!==setting.default"
      class="default-button"
      @click="setDefault">
      {{ $t("settings.values.default") }}
    </button>
  </div>
  <br />
</template>

<style scoped>
.setting-container {
  margin-bottom: 1.5rem;
}

.setting-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #4b5563;
  margin-bottom: 0.5rem;
}

.setting-checkbox {
  height: 1rem;
  width: 1rem;
  color: #2563eb;
  border-color: #d1d5db;
  border-radius: 0.125rem;
  cursor: pointer;
}

.setting-checkbox:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

.setting-select,
.setting-input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  margin-top: 0.25rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background-color: white;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  font-size: 0.875rem;
}

.setting-select:focus,
.setting-input:focus {
  outline: none;
  box-shadow: 0 0 0 2px #3b82f6;
}

.default-button {
  margin-top: 0.5rem;
  background-color: #3b82f6;
  color: white;
  font-weight: 700;
  padding: 0.5rem 1rem;
  border-radius: 0.125rem;
  transition: background-color 0.2s;
  cursor: pointer;
  border: none;
}

.default-button:hover {
  background-color: #1d4ed8;
}

.default-button:focus {
  outline: 2px solid #93c5fd;
  outline-offset: 2px;
}
</style>
