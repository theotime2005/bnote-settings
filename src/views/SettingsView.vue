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
      activeSection: null,
      searchQuery: "",
      display_menu: {},
    };
  },
  computed: {
    filteredSettings() {
      if (!this.searchQuery) return this.all_settings;
      
      const query = this.searchQuery.toLowerCase();
      const filtered = {};
      
      for (const [section, settings] of Object.entries(this.all_settings)) {
        const sectionLabel = this.$t(`settings.id.${section}`).toLowerCase();
        const matchingSettings = {};
        
        for (const [key, value] of Object.entries(settings)) {
          const settingLabel = this.$t(`settings.id.${key}`).toLowerCase();
          if (settingLabel.includes(query) || sectionLabel.includes(query)) {
            matchingSettings[key] = value;
          }
        }
        
        if (Object.keys(matchingSettings).length > 0) {
          filtered[section] = matchingSettings;
        }
      }
      
      return filtered;
    }
  },
  mounted() {
    window.addEventListener("keydown", this.handleKeyPress);
    if (useSettingsStore().getAllSettings) {
      this.file_name = useSettingsStore().getFileName;
      this.fileIsImported = true;
      window.addEventListener("beforeunload", this.handleBeforeReload);
    }
  },
  beforeUnmount() {
    window.removeEventListener("keydown", this.handleKeyPress);
    window.removeEventListener("beforeunload", this.handleBeforeReload);
  },
  methods: {
    clean_data() {
      const confirm = window.confirm(this.$t("settings.page.resetQuestion"));
      if (confirm) {
        this.fileIsImported = false;
        useSettingsStore().removeAll();
        window.removeEventListener("beforeunload", this.handleBeforeReload);
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
    toggleSection(section) {
      this.activeSection = this.activeSection === section ? null : section;
    },
    save() {
      const question = window.confirm(this.$t("settings.page.question"));
      return question ? this.download_file() : null;
    },
    download_file() {
      const stringData = JSON.stringify(useSettingsStore().getAllSettings, null, 2);
      const blob_data = new Blob([stringData], { type: "application/json" });
      const url_object = URL.createObjectURL(blob_data);
      const link = document.createElement("a");
      link.href = url_object;
      const file_date = `${new Date().getDate()}-${new Date().getMonth()}-${new Date().getFullYear()}`;
      const file_name = this.$t("settings.page.downloadName", { date: file_date }) + ".bnote";
      link.download = file_name;
      link.click();
      URL.revokeObjectURL(url_object);
    },
    handleKeyPress(event) {
      if (event.key === "Escape") {
        this.activeSection = null;
        this.searchQuery = "";
      }
    },
    handleBeforeReload(event) {
      event.preventDefault();
      event.returnValue = "";
    }
  }
};
</script>

<template>
  <div class="settings-container">
    <h1 class="settings-title">{{ $t("settings.page.title") }}</h1>

    <!-- Initial Setup View -->
    <div v-if="!fileIsImported" class="settings-intro-card">
      <h2 class="settings-subtitle">{{ $t("settings.page.how") }}</h2>
      <p class="settings-explanation">{{ $t("settings.page.explication") }}</p>
      <UploadFileComponent ref="upload" @file-uploaded="showFile" />
      <hr class="settings-divider" />
      <button
        type="button"
        class="settings-button settings-button-primary"
        @click="createBasicData"
      >
        {{ $t("settings.page.create") }}
      </button>
    </div>

    <!-- Settings Management View -->
    <div v-if="fileIsImported" class="settings-manager">
      <header class="settings-header">
        <h2 class="settings-filename">{{ file_name }}</h2>
        
        <!-- Search Bar -->
        <div class="search-container">
          <label for="settings-search" class="sr-only">Search settings</label>
          <input
            id="settings-search"
            v-model="searchQuery"
            type="search"
            class="settings-search"
            :placeholder="$t('Search settings...')"
          />
        </div>
      </header>

      <form class="settings-form" @submit.prevent="save">
        <!-- Settings Navigation -->
        <nav class="settings-nav" aria-label="Settings sections">
          <ul class="settings-nav-list">
            <li v-for="(settings, section) in filteredSettings" :key="section">
              <button
                type="button"
                class="settings-nav-button"
                :class="{ 'active': activeSection === section }"
                :aria-expanded="activeSection === section"
                :aria-controls="`section-${section}`"
                @click="toggleSection(section)"
              >
                {{ $t(`settings.id.${section}`) }}
              </button>
            </li>
          </ul>
        </nav>

        <!-- Settings Content -->
        <div class="settings-content">
          <section
            v-for="(settings, section) in filteredSettings"
            :key="section"
            :id="`section-${section}`"
            class="settings-section"
            :class="{ 'active': activeSection === section }"
            :aria-hidden="activeSection !== section"
          >
            <h3 class="settings-section-title">{{ $t(`settings.id.${section}`) }}</h3>
            <div class="settings-grid">
              <SettingComponent
                v-for="(setting, key) in settings"
                :key="`${section}.${key}`"
                :setting-section="section"
                :setting-key="key"
                :setting="setting"
              />
            </div>
          </section>
        </div>

        <!-- Action Buttons -->
        <div class="settings-actions">
          <button type="submit" class="settings-button settings-button-success">
            {{ $t("settings.page.download") }}
          </button>
          <button
            type="button"
            class="settings-button settings-button-danger"
            @click="clean_data"
          >
            {{ $t("settings.page.openOther") }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.settings-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.settings-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: var(--color-gray-900);
}

.settings-intro-card {
  background: var(--color-white);
  border-radius: var(--radius-lg);
  padding: 2rem;
  box-shadow: var(--shadow-md);
}

.settings-subtitle {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.settings-manager {
  background: var(--color-white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
}

.settings-header {
  padding: 1.5rem;
  border-bottom: 1px solid var(--color-gray-200);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.settings-filename {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-gray-900);
}

.search-container {
  flex: 1;
  max-width: 400px;
}

.settings-search {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--color-gray-300);
  border-radius: var(--radius-md);
  font-size: 1rem;
}

.settings-search:focus {
  outline: none;
  border-color: var(--color-blue-500);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
}

.settings-form {
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 2rem;
  padding: 1.5rem;
}

.settings-nav {
  border-right: 1px solid var(--color-gray-200);
  padding-right: 1.5rem;
}

.settings-nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.settings-nav-button {
  width: 100%;
  padding: 0.75rem 1rem;
  text-align: left;
  border: none;
  background: transparent;
  border-radius: var(--radius-md);
  color: var(--color-gray-700);
  cursor: pointer;
  transition: all 0.2s;
}

.settings-nav-button:hover {
  background: var(--color-gray-100);
}

.settings-nav-button.active {
  background: var(--color-blue-100);
  color: var(--color-blue-700);
  font-weight: 500;
}

.settings-section {
  display: none;
  padding: 1rem;
  background: var(--color-gray-50);
  border-radius: var(--radius-lg);
}

.settings-section.active {
  display: block;
}

.settings-grid {
  display: grid;
  gap: 1.5rem;
  margin-top: 1rem;
}

.settings-actions {
  grid-column: 1 / -1;
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-gray-200);
}

.settings-button {
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius-md);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.settings-button-primary {
  background: var(--color-blue-500);
  color: white;
}

.settings-button-primary:hover {
  background: var(--color-blue-600);
}

.settings-button-success {
  background: var(--color-green-500);
  color: white;
}

.settings-button-success:hover {
  background: var(--color-green-600);
}

.settings-button-danger {
  background: var(--color-red-500);
  color: white;
}

.settings-button-danger:hover {
  background: var(--color-red-600);
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@media (max-width: 768px) {
  .settings-form {
    grid-template-columns: 1fr;
  }

  .settings-nav {
    border-right: none;
    border-bottom: 1px solid var(--color-gray-200);
    padding-right: 0;
    padding-bottom: 1.5rem;
  }

  .settings-actions {
    flex-direction: column;
  }

  .settings-button {
    width: 100%;
  }
}
</style>