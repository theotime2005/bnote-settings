<script>
import SettingComponent from "@/components/SettingComponent.vue";
import UploadFileComponent from "@/components/UploadFileComponent.vue";
import all_settings from "@/settings.js";
import { useSettingsStore } from "@/stores/settingsStore.js";

export default {
  name: "SettingsView",
  components: {
    UploadFileComponent,
    SettingComponent,
  },
  data() {
    return {
      file_name: "",
      fileIsImported: false,
      all_settings: all_settings,
      // menu variables
      display_menu: {
        system: false,
        bluetooth: false,
        explorer: false,
        editor: false,
        music: false,
        speech: false,
        radio: false,
        agenda: false,
        braille_learning: false,
      },
    };
  },
  methods: {
    clean_data() {
      const confirm = window.confirm(
        this.$t("settings.page.resetQuestion"),
      );
      if (confirm) {
        this.fileIsImported = false;
        useSettingsStore().removeAll();
      }
    },
    complete_empty_values() {
      // Check data and complete if there are not all values
      for (let section in this.all_settings) {
        for (let setting in this.all_settings[section]) {
          if (useSettingsStore().getSetting(section, setting) === null) {
            useSettingsStore().updateSetting(
              section,
              setting,
              this.all_settings[section][setting].default,
            );
          }
        }
      }
    },
    createBasicData() {
      const data = {};
      for (let section in this.all_settings) {
        data[section] = {};
        for (let setting in this.all_settings[section]) {
          data[section][setting] = this.all_settings[section][setting].default;
        }
      }
      useSettingsStore().loadSettings(data);
      this.file_name = this.$t("settings.page.defaultName");
      this.fileIsImported = true;
    },
    showFile() {
      this.file_name = this.$refs.upload.file_name;
      this.fileIsImported = true;
    },
    togle_menu(key) {
      this.display_menu[key] = !this.display_menu[key];
    },
    save() {
      const question = window.confirm(this.$t("settings.page.question"));
      return question ? this.download_file() : null;
    },
    download_file() {
      const stringData = JSON.stringify(useSettingsStore().getAllSettings, null, 2);
      const blob_data = new Blob([stringData], { type: "application/json" });
      const url_object = URL.createObjectURL(blob_data);
      // Create link
      const link = document.createElement("a");
      link.href = url_object;
      const file_date = `${new Date().getDate()}-${new Date().getMonth()}-${new Date().getFullYear()}`;
      const file_name = this.$t("settings.page.downloadName", { date: file_date }) + ".bnote";
      link.download = file_name;
      link.click();
      URL.revokeObjectURL(url_object);
    },
    // Method to close all menus
    closeAllMenus() {
      for (let key in this.display_menu) {
        this.display_menu[key] = false;
      }
    },
    // Gestion of the "Escape" key
    handleKeyPress(event) {
      if (event.key === "Escape") {
        this.closeAllMenus();
      }
    },
  },
  mounted() {
    // Add listener to the "Escape" key
    window.addEventListener("keydown", this.handleKeyPress);
  },
  beforeUnmount() {
    // Remove listener to the "Escape" key
    window.removeEventListener("keydown", this.handleKeyPress);
  },
};
</script>

<template>
  <div class="p-6 bg-gray-50">
    <h1 class="text-3xl font-bold text-gray-800 mb-4">{{ $t("settings.page.title") }}</h1>

    <div v-if="!fileIsImported" class="bg-white p-4 rounded-md shadow-md">
      <h2 class="text-2xl font-semibold text-gray-800 mb-6">{{ $t("settings.page.how") }}</h2>
      <p class="text-gray-600 mb-4">{{ $t("settings.page.explication") }}</p>
      <UploadFileComponent ref="upload" @file-uploaded="showFile" />
      <hr class="my-4 border-gray-300" />
      <button
        type="button"
        @click="createBasicData"
        class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        {{ $t("settings.page.create") }}
      </button>
    </div>

    <div
      v-if="fileIsImported"
      class="bg-white p-6 rounded-lg shadow-lg border border-gray-200"
    >
      <h2 class="text-2xl font-semibold text-gray-800 mb-6 text-center">
        {{ file_name }}
      </h2>

      <form
        class="space-y-6"
        :aria-label="$t('settings.page.title2')"
        @submit.prevent="save"
      >
        <section
          v-for="(settings, section) in all_settings"
          :key="section"
          class="border-b border-gray-300 pb-4"
        >
          <h3 class="text-xl font-medium text-gray-700">{{ $t(`settings.id.${section}`) }}</h3>
          <button
            type="button"
            @click="togle_menu(section)"
            class="mt-2 text-sm text-blue-600 hover:underline focus:outline-none"
          >
            {{ display_menu[section] ? $t('settings.page.hide') : $t('settings.page.show') }}
          </button>

          <div v-if="display_menu[section]" class="mt-4 space-y-4">
            <SettingComponent
              v-for="(setting, key) in settings"
              :key="section+'.'+key"
              :settingSection="section"
              :settingKey="key"
              :setting="setting"
              class="p-4 bg-gray-100 rounded-md"
            />
          </div>
        </section>

        <button
          type="submit"
          class="w-full px-4 py-2 bg-green-500 text-white font-medium rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          {{ $t("settings.page.download") }}
        </button>
      </form>

      <button
        type="button"
        @click="clean_data"
        class="mt-4 w-full px-4 py-2 bg-red-500 text-white font-medium rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
      >
        {{ $t("settings.page.openOther") }}
      </button>
    </div>
  </div>
</template>

<style scoped></style>
