<script setup>
import { computed } from "vue";
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
const settingValue = computed({
  get() {
    return settingsStore.getSetting(props.settingSection, props.settingKey);
  },
  set(value) {
    if (props.setting.type === "number") {
      value = parseInt(value);
    }
    settingsStore.updateSetting(props.settingSection, props.settingKey, value);
  },
});
const rangeProgress = computed(() => {
  const { min, max } = props.setting;
  if (props.setting.type !== "number" || max === min) {
    return 0;
  }
  return ((settingValue.value - min) / (max - min)) * 100;
});
const labelId = `${props.settingSection}.${props.settingKey}`;
const name = t(`settings.id.${props.settingKey}`);

function setDefault() {
  settingValue.value = props.setting.default;
}
</script>

<template>
  <div class="setting-container" :class="[setting.type, { 'setting-container--modified': settingValue !== setting.default }]">
    <div class="setting-header">
      <label :for="labelId" class="setting-label">
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
        :id="labelId"
        v-model="settingValue"
        type="checkbox"
        :name="name"
        class="setting-checkbox focus-ring"
      />
      <label :for="labelId" class="setting-checkbox-label">
        <span class="setting-checkbox-indicator"></span>
      </label>
    </div>

    <!-- Dropdown -->
    <div v-else-if="props.setting.type === 'menu'" class="setting-control">
      <select
        :id="labelId"
        v-model="settingValue"
        :name="name"
        class="setting-select focus-ring">
        <option
          v-for="option in props.setting.values"
          :key="option"
          :value="option"
        >
          {{ !props.setting.isTranslate ? t(`settings.values.${option}`) : option }}
        </option>
      </select>
    </div>

    <!-- Number Input -->
    <div v-else-if="props.setting.type === 'number'" class="setting-control setting-number">
      <input
        :id="labelId"
        v-model="settingValue"
        type="range"
        :name="name"
        :min="props.setting.min"
        :max="props.setting.max"
        class="setting-range focus-ring"
        :style="{ '--progress': `${rangeProgress}%` }"
        :list="labelId + 'tickmarks'"
      />
      <output class="setting-value">{{ settingValue }}</output>
      <datalist :id="labelId + 'tickmarks'">
        <option :value="props.setting.min" :label="props.setting.min"></option>
        <option :value="props.setting.default" :label="props.setting.default"></option>
        <option :value="props.setting.max" :label="props.setting.max"></option>
      </datalist>
    </div>

    <!-- Text Input -->
    <div v-else-if="props.setting.type === 'text'" class="setting-control">
      <input
        :id="labelId"
        v-model="settingValue"
        type="text"
        :name="name"
        class="setting-input focus-ring"
        :placeholder="t('settings.values.default')"
      />
    </div>
  </div>
</template>

<style scoped>
.setting-container {
  display: grid;
  gap: var(--space-3);
  align-content: start;
  padding: var(--space-4) var(--space-5);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}

.setting-container:hover {
  border-color: var(--text-muted);
}

.setting-container:focus-within {
  border-color: var(--border-strong);
  box-shadow: var(--shadow-md);
}

.setting-container--modified {
  box-shadow: inset 3px 0 0 var(--accent);
}

.setting-container.checkbox {
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
}

.setting-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2);
  min-height: 1.75rem;
}

.setting-label {
  font-weight: 600;
  line-height: 1.35;
  cursor: pointer;
}

.setting-default-button {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  min-height: 1.75rem;
  padding: 0 var(--space-3);
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--accent);
  background: var(--accent-soft);
  border: 0;
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: background-color var(--transition-fast), color var(--transition-fast);
}

.setting-default-button::before {
  content: "↺";
  font-size: 0.875rem;
}

.setting-default-button:hover {
  color: var(--accent-contrast);
  background: var(--accent);
}

.setting-control {
  position: relative;
}

.setting-checkbox {
  position: absolute;
  opacity: 0;
  width: 1px;
  height: 1px;
}

.setting-checkbox-label {
  display: flex;
  cursor: pointer;
}

.setting-checkbox-indicator {
  position: relative;
  width: 3rem;
  height: 1.75rem;
  background: var(--surface-2);
  border: 1.5px solid var(--border);
  border-radius: var(--radius-full);
  transition: background-color var(--transition-base), border-color var(--transition-base);
}

.setting-checkbox-indicator::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 0.1875rem;
  width: 1.25rem;
  height: 1.25rem;
  background: var(--text-muted);
  border-radius: 50%;
  transform: translateY(-50%);
  transition: transform var(--transition-base), background-color var(--transition-base);
}

.setting-checkbox:checked + .setting-checkbox-label .setting-checkbox-indicator {
  background: var(--accent);
  border-color: var(--accent);
}

.setting-checkbox:checked + .setting-checkbox-label .setting-checkbox-indicator::after {
  background: var(--accent-contrast);
  transform: translate(1.25rem, -50%);
}

.setting-checkbox:focus-visible + .setting-checkbox-label .setting-checkbox-indicator {
  outline: 3px solid var(--focus);
  outline-offset: 3px;
}

.setting-select,
.setting-input {
  width: 100%;
  min-height: 2.75rem;
  padding: 0 var(--space-4);
  font-size: 0.9375rem;
  color: var(--text);
  background-color: var(--surface-2);
  border: 1.5px solid transparent;
  border-radius: var(--radius-sm);
  transition: border-color var(--transition-fast), background-color var(--transition-fast);
}

.setting-select {
  appearance: none;
  padding-right: 2.5rem;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' fill='none' stroke='%23888' stroke-width='2' stroke-linecap='round'%3E%3Cpath d='m1 1.5 5 5 5-5'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  cursor: pointer;
}

.setting-select:hover,
.setting-input:hover {
  border-color: var(--border);
}

.setting-select:focus-visible,
.setting-input:focus-visible {
  outline: none;
  background-color: var(--surface);
  border-color: var(--focus);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--focus) 30%, transparent);
}

.setting-number {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.setting-range {
  flex: 1;
  height: 0.375rem;
  appearance: none;
  -webkit-appearance: none;
  background: linear-gradient(to right, var(--accent) var(--progress, 0%), var(--surface-2) var(--progress, 0%));
  border-radius: var(--radius-full);
  cursor: pointer;
}

.setting-range::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 1.375rem;
  height: 1.375rem;
  background: var(--surface);
  border: 2px solid var(--accent);
  border-radius: 50%;
  box-shadow: var(--shadow-sm);
  transition: transform var(--transition-fast);
}

.setting-range::-moz-range-thumb {
  width: 1.375rem;
  height: 1.375rem;
  background: var(--surface);
  border: 2px solid var(--accent);
  border-radius: 50%;
  box-shadow: var(--shadow-sm);
  transition: transform var(--transition-fast);
}

.setting-range:hover::-webkit-slider-thumb {
  transform: scale(1.12);
}

.setting-range:hover::-moz-range-thumb {
  transform: scale(1.12);
}

.setting-range:focus-visible {
  outline: 3px solid var(--focus);
  outline-offset: 6px;
}

.setting-value {
  min-width: 3rem;
  padding: var(--space-1) var(--space-2);
  font-family: var(--font-mono);
  font-weight: 600;
  text-align: center;
  background: var(--surface-2);
  border-radius: var(--radius-sm);
}
</style>
