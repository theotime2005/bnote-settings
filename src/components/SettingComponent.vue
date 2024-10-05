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
  <label :for="label_id">{{name}}</label>
  <!-- Checkbox -->
  <input
    v-if="setting.type === 'checkbox'"
    type="checkbox"
    :id="label_id"
    :name="name"
    :checked="setting_value"
    @change="updateSetting"
    v-model="settingValue"
  />

  <!-- Dropdown menu -->
  <select
      v-else-if="setting.type === 'menu'"
      :id="label_id"
      :value="setting_value"
      :name="name"
      @change="updateSetting"
      v-model="settingValue"
    >
      <option
        v-for="option in setting.values"
        :key="option"
        :value="option"
        :name="option"
      >
        {{ $t(`settingsValues.${option}`) }}
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
  />
</template>

<style scoped>
/* Styles personnalisés ici */
</style>
