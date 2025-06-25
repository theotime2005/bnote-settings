<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useSettingsStore } from "@/stores/settingsStore";
import type { Setting } from '@/types';

interface Props {
  settingSection: string;
  settingKey: string;
  setting: Setting;
}

const props = defineProps<Props>();
const { t } = useI18n();
const settingsStore = useSettingsStore();

const settingValue = ref<string | number | boolean>(
  settingsStore.getSetting(props.settingSection, props.settingKey) ?? props.setting.default
);

const label_id = computed(() => `${props.settingSection}.${props.settingKey}`);
const name = computed(() => t(`settings.id.${props.settingKey}`));

function updateSetting(): void {
  if (props.setting.type === "number") {
    settingValue.value = parseInt(settingValue.value as string);
  }
  settingsStore.updateSetting(props.settingSection, props.settingKey, settingValue.value);
}

function setDefault(): void {
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
        class="setting-default-button"
        @click="setDefault"
      >
        {{ $t("settings.values.default") }}
      </button>
    </div>

    <!-- Checkbox -->
    <div v-if="setting.type === 'checkbox'" class="setting-control">
      <input
        :id="label_id"
        v-model="settingValue"
        type="checkbox"
        :name="name"
        :checked="!!settingValue"
        class="setting-checkbox"
        @change="updateSetting"
      />
    </div>

    <!-- Dropdown -->
    <div v-else-if="setting.type === 'menu'" class="setting-control">
      <select
        :id="label_id"
        v-model="settingValue"
        :name="name"
        class="setting-select"
        @change="updateSetting"
      >
        <option
          v-for="option in setting.values"
          :key="option"
          :value="option"
        >
          {{ !setting.isTranslate ? $t(`settings.values.${option}`) : option }}
        </option>
      </select>
    </div>

    <!-- Number Input -->
    <div v-else-if="setting.type === 'number'" class="setting-control setting-number">
      <input
        :id="label_id"
        v-model="settingValue"
        type="range"
        :name="name"
        :min="setting.min"
        :max="setting.max"
        class="setting-range"
        :list="label_id + 'tickmarks'"
        @input="updateSetting"
      />
      <output class="setting-value">{{ settingValue }}</output>
      <datalist :id="label_id + 'tickmarks'">
        <option :value="setting.min" :label="String(setting.min)"></option>
        <option :value="setting.default" :label="String(setting.default)"></option>
        <option :value="setting.max" :label="String(setting.max)"></option>
      </datalist>
    </div>

    <!-- Text Input -->
    <div v-else-if="setting.type === 'text'" class="setting-control">
      <input
        :id="label_id"
        v-model="settingValue"
        type="text"
        :name="name"
        class="setting-input"
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
}

.setting-control {
  position: relative;
}

.setting-checkbox {
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid var(--color-gray-300);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all 0.2s;
}

.setting-checkbox:checked {
  background-color: var(--color-blue-500);
  border-color: var(--color-blue-500);
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
}

.setting-range::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  background: var(--color-blue-500);
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s;
}

.setting-range::-webkit-slider-thumb:hover {
  background: var(--color-blue-600);
  transform: scale(1.1);
}

.setting-value {
  min-width: 3rem;
  text-align: center;
  font-weight: 500;
  color: var(--color-gray-700);
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