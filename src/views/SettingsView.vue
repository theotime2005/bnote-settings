<script>
import SettingComponent from "@/components/SettingComponent.vue";
import UploadFileComponent from "@/components/UploadFileComponent.vue";
import all_settings from "@/settings.json";
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
  mounted() {
    // Add listener to the "Escape" key
    window.addEventListener("keydown", this.handleKeyPress);
    // Check if store has content
    if (useSettingsStore().getAllSettings) {
      this.file_name = useSettingsStore().getFileName;
      this.fileIsImported = true;
      window.addEventListener("beforeunload", this.handleBeforeReload);
    }
  },
  beforeUnmount() {
    // Remove listener to the "Escape" key
    window.removeEventListener("keydown", this.handleKeyPress);
    window.removeEventListener("beforeunload", this.handleBeforeReload);
  },
  methods: {
    clean_data() {
      const confirm = window.confirm(
        this.$t("settings.page.resetQuestion"),
      );
      if (confirm) {
        this.fileIsImported = false;
        useSettingsStore().removeAll();
        window.removeEventListener("beforeunload", this.handleBeforeReload);
      }
    },
    complete_empty_values() {
      // Check data and complete if there are not all values
      for (const section in this.all_settings) {
        for (const setting in this.all_settings[section]) {
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
      for (const section in this.all_settings) {
        data[section] = {};
        for (const setting in this.all_settings[section]) {
          data[section][setting] = this.all_settings[section][setting].default;
        }
      }
      this.file_name = this.$t("settings.page.defaultName");
      useSettingsStore().loadSettings(data, this.file_name);
      this.fileIsImported = true;
      window.addEventListener("beforeunload", this.handleBeforeReload);
    },
    showFile() {
      this.file_name = useSettingsStore().getFileName;
      this.fileIsImported = true;
      window.addEventListener("beforeunload", this.handleBeforeReload);
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
      for (const key in this.display_menu) {
        this.display_menu[key] = false;
      }
    },
    // Gestion of the "Escape" key
    handleKeyPress(event) {
      if (event.key === "Escape") {
        this.closeAllMenus();
      }
    },
    handleBeforeReload(event) {
      event.preventDefault();
      event.returnValue = "";
    },
  },
};
</script>

<template>
  <div class="settings-container">
    <h1 class="settings-title">{{ $t("settings.page.title") }}</h1>

    <div v-if="!fileIsImported" class="settings-intro-card">
      <h2 class="settings-subtitle">{{ $t("settings.page.how") }}</h2>
      <p class="settings-explanation">{{ $t("settings.page.explication") }}</p>
      <UploadFileComponent ref="upload" @file-uploaded="showFile" />
      <hr class="settings-divider" />
      <button
        type="button"
        class="settings-button settings-button-blue custom-button"
        @click="createBasicData"
      >
        {{ $t("settings.page.create") }}
      </button>
    </div>

    <div
      v-if="fileIsImported"
      class="settings-card"
    >
      <h2 class="settings-filename">
        {{ file_name }}
      </h2>

      <form
        class="settings-form"
        :aria-label="$t('settings.page.title2')"
        @submit.prevent="save"
      >
        <section
          v-for="(settings, section) in all_settings"
          :key="section"
          class="settings-section"
        >
          <h3 class="settings-section-title">{{ $t(`settings.id.${section}`) }}</h3>
          <button
            type="button"
            class="settings-toggle-button custom-button"
            @click="togle_menu(section)"
          >
            {{ display_menu[section] ? $t('settings.page.hide') : $t('settings.page.show') }}
          </button>
          <div v-if="display_menu[section]" class="settings-group setting">
            <SettingComponent
              v-for="(setting, key) in settings"
              :key="section+'.'+key"
              :setting-section="section"
              :setting-key="key"
              :setting="setting"
              class="settings-item"
            />
          </div>
        </section>

        <button
          type="submit"
          class="settings-button settings-button-green custom-button"
        >
          {{ $t("settings.page.download") }}
        </button>
      </form>

      <button
        type="button"
        class="settings-button settings-button-red custom-button"
        @click="clean_data"
      >
        {{ $t("settings.page.openOther") }}
      </button>
    </div>

  </div>
</template>

<style scoped>
.settings-container {
  padding: 1.5rem;
  background-color: #f9fafb;
}

.settings-title {
  font-size: 1.875rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1rem;
}

.settings-intro-card {
  background-color: white;
  padding: 1rem;
  border-radius: 0.375rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.settings-subtitle {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1.5rem;
}

.settings-explanation {
  color: #4b5563;
  margin-bottom: 1rem;
}

.settings-divider {
  margin: 1rem 0;
  border-color: #d1d5db;
}

.settings-card {
  background-color: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.settings-filename {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1.5rem;
  text-align: center;
}

.settings-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.settings-section {
  border-bottom: 1px solid #d1d5db;
  padding-bottom: 1rem;
}

.settings-section-title {
  font-size: 1.25rem;
  font-weight: 500;
  color: #374151;
}

.settings-toggle-button {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #2563eb;
}

.settings-toggle-button:hover {
  text-decoration: underline;
}

.settings-group {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.settings-item {
  padding: 1rem;
  background-color: #f3f4f6;
  border-radius: 0.375rem;
}

.settings-button {
  width: 100%;
  padding: 0.5rem 1rem;
  font-weight: 500;
  border-radius: 0.375rem;
  color: white;
  transition: background-color 0.2s ease;
}

.settings-button-blue {
  background-color: #3b82f6;
}

.settings-button-blue:hover {
  background-color: #2563eb;
}

.settings-button-green {
  background-color: #10b981;
}

.settings-button-green:hover {
  background-color: #059669;
}

.settings-button-red {
  background-color: #ef4444;
  margin-top: 1rem;
}

.settings-button-red:hover {
  background-color: #dc2626;
}

.settings-button:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
}
</style>
