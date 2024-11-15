<script>

export default {
  name: "SettingComponent",
  props: {
    name: {
      type: String,
      required: true,
    },
    label_id: {
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
      settingValue: this.setting_value,
    };
  },
  methods: {
    updateSetting() {
      this.$emit("setting-change", this.settingValue);
    },
  },
  emits: ["setting-change"],
};
</script>

<template>
  <div class="mb-4">
    <!-- Label -->
    <label :for="label_id" class="block text-sm font-medium text-gray-700 mb-2">
      {{ name }}
    </label>

    <!-- Checkbox -->
    <input
      v-if="setting.type === 'checkbox'"
      type="checkbox"
      :id="label_id"
      :name="name"
      :checked="setting_value"
      @change="updateSetting"
      v-model="settingValue"
      class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
    />

    <!-- Dropdown menu -->
    <select
      v-else-if="setting.type === 'menu'"
      :id="label_id"
      :value="setting_value"
      :name="name"
      @change="updateSetting"
      v-model="settingValue"
      class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
    >
      <option
        v-for="option in setting.values"
        :key="option"
        :value="option"
        :name="option"
      >
        {{ !setting.isTranslate ? $t(`settingsValues.${option}`) : option }}
      </option>
    </select>

    <!-- Number input -->
    <input
      v-else-if="setting.type === 'number'"
      type="number"
      :id="label_id"
      :name="name"
      :min="setting.min"
      :max="setting.max"
      :value="setting_value"
      @input="updateSetting"
      v-model="settingValue"
      class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
    />

    <!-- Text input -->
    <input
      v-else-if="setting.type === 'text'"
      type="text"
      :id="label_id"
      :name="name"
      :min="setting.min"
      :max="setting.max"
      :value="setting_value"
      @input="updateSetting"
      v-model="settingValue"
      class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
    />
  </div>
  <br>
</template>

<style scoped>
/* Styles personnalisés ici */
</style>
