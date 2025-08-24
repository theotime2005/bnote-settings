<script setup>
import { ref } from "vue";
import { useI18n } from "vue-i18n";

import { useSettingsStore } from "@/stores/settingsStore.js";

const { t } = useI18n();
const settingsStore = useSettingsStore();
const props = defineProps({
  settingSection: {
    type: String,
    required: true,
  },
  settingKey: {
    type: String,
    required: true,
  },
  setting: {
    type: Object,
    required: true,
  },
});
const settingValue = ref(settingsStore.getSetting(props.settingSection, props.settingKey));
const label_id = `${props.settingSection}.${props.settingKey}`;
const name = t(`settings.id.${props.settingKey}`);

function updateSetting() {
  if (props.setting.type === "number") {
    settingValue.value = parseInt(settingValue.value);
  }
  settingsStore.updateSetting(props.settingSection, props.settingKey, settingValue.value);
}

function setDefault() {
  settingValue.value = props.setting.default;
  updateSetting();
}

</script>

<template>
  <div class="setting-container" :class="setting.type">
    <div class="setting-header">
      <label :for="label_id" class="setting-label">
        {{ name }}
      </label>
      <button
        v-if="settingValue !== setting.default"
        type="button"
        class="setting-default-button focus-ring"
        :title="t('settings.values.default')"
        @click="setDefault"
      >
        {{ t("settings.values.default") }}
      </button>
    </div>

    <!-- Checkbox -->
    <div v-if="props.setting.type === 'checkbox'" class="setting-control">
      <input
        :id="label_id"
        v-model="settingValue"
        type="checkbox"
        :name="name"
        :checked="settingValue"
        class="setting-checkbox focus-ring"
        @change="updateSetting"
      />
      <label :for="label_id" class="setting-checkbox-label">
        <span class="setting-checkbox-indicator"></span>
      </label>
    </div>

    <!-- Dropdown -->
    <div v-else-if="props.setting.type === 'menu'" class="setting-control">
      <select
        :id="label_id"
        v-model="settingValue"
        :name="name"
        class="setting-select focus-ring"
        @change="updateSetting"
      >
        <option
          v-for="option in props.setting.values"
          :key="option"
          :value="option"
        >
          {{ !props.setting.isTranslate ? $t(`settings.values.${option}`) : option }}
        </option>
      </select>
    </div>

    <!-- Number Input -->
    <div v-else-if="props.setting.type === 'number'" class="setting-control setting-number">
      <input
        :id="label_id"
        v-model="settingValue"
        type="range"
        :name="name"
        :min="props.setting.min"
        :max="props.setting.max"
        class="setting-range focus-ring"
        :list="label_id + 'tickmarks'"
        @input="updateSetting"
      />
      <output class="setting-value">{{ settingValue }}</output>
      <datalist :id="label_id + 'tickmarks'">
        <option :value="props.setting.min" :label="props.setting.min"></option>
        <option :value="props.setting.default" :label="props.setting.default"></option>
        <option :value="props.setting.max" :label="props.setting.max"></option>
      </datalist>
    </div>

    <!-- Text Input -->
    <div v-else-if="props.setting.type === 'text'" class="setting-control">
      <input
        :id="label_id"
        v-model="settingValue"
        type="text"
        :name="name"
        class="setting-input focus-ring"
        :placeholder="t('settings.values.default')"
        @input="updateSetting"
      />
    </div>
  </div>
</template>

<style scoped>
.setting-container {
  background: var(--color-white);
  border-radius: var(--radius-md);
  padding: 1rem;
  box-shadow: var(--shadow-sm);
  transition: var(--transition-base);
  border: 1px solid var(--color-gray-200);
}

.setting-container:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

.setting-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.setting-label {
  font-weight: 500;
  color: var(--color-gray-700);
  cursor: pointer;
}

.setting-default-button {
  padding: 0.25rem 0.75rem;
  font-size: 0.875rem;
  color: var(--color-blue-600);
  background: var(--color-blue-50);
  border: 1px solid var(--color-blue-200);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s;
}

.setting-default-button:hover {
  background: var(--color-blue-100);
  border-color: var(--color-blue-300);
  transform: scale(1.05);
}

.setting-control {
  position: relative;
}

.setting-checkbox {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.setting-checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.setting-checkbox-indicator {
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid var(--color-gray-300);
  border-radius: var(--radius-sm);
  transition: all 0.2s;
  position: relative;
  background: var(--color-white);
}

.setting-checkbox:checked + .setting-checkbox-label .setting-checkbox-indicator {
  background-color: var(--color-blue-500);
  border-color: var(--color-blue-500);
}

.setting-checkbox:checked + .setting-checkbox-label .setting-checkbox-indicator::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 0.875rem;
  font-weight: bold;
}

.setting-select,
.setting-input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--color-gray-300);
  border-radius: var(--radius-md);
  background-color: var(--color-white);
  transition: all 0.2s;
}

.setting-select:focus,
.setting-input:focus {
  outline: none;
  border-color: var(--color-blue-500);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
}

.setting-select:hover,
.setting-input:hover {
  border-color: var(--color-gray-400);
}

.setting-number {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.setting-range {
  flex: 1;
  height: 6px;
  -webkit-appearance: none;
  background: var(--color-gray-200);
  border-radius: var(--radius-full);
  outline: none;
  transition: all 0.2s;
}

.setting-range::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  background: var(--color-blue-500);
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: var(--shadow-sm);
}

.setting-range::-webkit-slider-thumb:hover {
  background: var(--color-blue-600);
  transform: scale(1.1);
  box-shadow: var(--shadow-md);
}

.setting-range::-moz-range-thumb {
  width: 18px;
  height: 18px;
  background: var(--color-blue-500);
  border-radius: 50%;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
  box-shadow: var(--shadow-sm);
}

.setting-range::-moz-range-thumb:hover {
  background: var(--color-blue-600);
  transform: scale(1.1);
  box-shadow: var(--shadow-md);
}

.setting-value {
  min-width: 3rem;
  text-align: center;
  font-weight: 500;
  color: var(--color-gray-700);
  background: var(--color-gray-100);
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-sm);
  font-family: monospace;
}

@media (max-width: 640px) {
  .setting-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .setting-number {
    flex-direction: column;
    gap: 0.5rem;
  }

  .setting-value {
    align-self: flex-end;
  }
}
</style>
