<script>
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import SettingComponent from "@/components/SettingComponent.vue";
import UploadFileComponent from "@/components/UploadFileComponent.vue";
import { useNotifications } from "@/composables/useNotifications.js";
import all_settings from "@/settings.json";
import { useSettingsStore } from "@/stores/settingsStore.js";

export default {
  name: "SettingsView",
  components: {
    UploadFileComponent,
    SettingComponent,
    LoadingSpinner,
  },
  data() {
    return {
      file_name: "",
      fileIsImported: false,
      all_settings: all_settings,
      activeSection: null,
      searchQuery: "",
      isLoading: false,
      notifications: useNotifications(),
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
        const sectionMatch = sectionLabel.includes(query);
        for (const [key, value] of Object.entries(settings)) {
          const settingLabel = this.$t(`settings.id.${key}`).toLowerCase();
          if (settingLabel.includes(query) || sectionMatch) {
            matchingSettings[key] = value;
          }
        }
        if (Object.keys(matchingSettings).length > 0) {
          filtered[section] = matchingSettings;
        }
      }
      return filtered;
    },
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
        this.isLoading = true;
        this.fileIsImported = false;
        useSettingsStore().removeAll();
        window.removeEventListener("beforeunload", this.handleBeforeReload);
        this.activeSection = null;
        this.searchQuery = "";
        this.notifications.info(this.$t("settings.notifications.configurationReset"));
        Promise.resolve().then(() => {
          this.isLoading = false;
        });
      }
    },
    createBasicData() {
      this.isLoading = true;
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
      this.activeSection = null;
      this.searchQuery = "";
      this.notifications.success(this.$t("settings.notifications.defaultConfigurationLoaded"));
      setTimeout(() => {
        this.isLoading = false;
      }, 500);
    },
    showFile() {
      this.file_name = useSettingsStore().getFileName;
      this.fileIsImported = true;
      window.addEventListener("beforeunload", this.handleBeforeReload);
      this.activeSection = null;
      this.searchQuery = "";
      this.notifications.success(this.$t("settings.notifications.fileLoaded"));
    },
    toggleSection(section) {
      this.activeSection = this.activeSection === section ? null : section;
      this.$nextTick(() => {
        // Focus the first input of the opened section for accessibility
        if (this.activeSection) {
          const sectionEl = document.getElementById(`section-${section}`);
          if (sectionEl) {
            const input = sectionEl.querySelector("input, select, textarea, button");
            if (input) input.focus();
          }
        }
      });
    },
    save() {
      const question = window.confirm(this.$t("settings.page.question"));
      return question ? this.download_file() : null;
    },
    download_file() {
      try {
        this.isLoading = true;
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
        this.notifications.success(this.$t("settings.notifications.fileDownloaded"));
      } catch (error) {
        this.notifications.error(this.$t("settings.notifications.downloadError"));
        console.error("Download error:", error);
      } finally {
        setTimeout(() => {
          this.isLoading = false;
        }, 1000);
      }
    },
    handleKeyPress(event) {
      if (event.key === "Escape") {
        this.activeSection = null;
        this.searchQuery = "";
      }
      if ((event.key === "ArrowDown" || event.key === "ArrowUp") && this.fileIsImported) {
        // Keyboard navigation for nav buttons
        const navButtons = Array.from(document.querySelectorAll(".settings-nav-button"));
        const current = navButtons.findIndex(btn => btn === document.activeElement);
        if (current !== -1) {
          let next = event.key === "ArrowDown" ? current + 1 : current - 1;
          if (next < 0) next = navButtons.length - 1;
          if (next >= navButtons.length) next = 0;
          navButtons[next].focus();
          event.preventDefault();
        }
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

    <!-- Loading Overlay -->
    <div v-if="isLoading" class="loading-overlay">
      <LoadingSpinner size="large" :text="$t('common.loading')" />
    </div>

    <!-- Initial Setup View -->
    <div v-if="!fileIsImported" class="settings-intro-card fade-in">
      <h2 class="settings-subtitle">{{ $t("settings.page.how") }}</h2>
      <p class="settings-explanation">{{ $t("settings.page.explication") }}</p>
      <UploadFileComponent ref="upload" @file-uploaded="showFile" />
      <hr class="settings-divider" />
      <button
        type="button"
        class="settings-button settings-button-primary focus-ring"
        @click="createBasicData"
      >
        {{ $t("settings.page.create") }}
      </button>
    </div>

    <!-- Settings Management View -->
    <div v-if="fileIsImported" class="settings-manager fade-in">
      <header class="settings-header">
        <h2 class="settings-filename">{{ file_name }}</h2>

        <!-- Search Bar -->
        <div class="search-container">
          <label for="settings-search" class="sr-only">{{$t('settings.page.search')}}</label>
          <input
            id="settings-search"
            v-model="searchQuery"
            type="search"
            class="settings-search focus-ring"
            :placeholder="$t('settings.page.search')"
            @keydown.enter.prevent="() => { if (Object.keys(filteredSettings).length === 1) activeSection = Object.keys(filteredSettings)[0]; }"
          />
        </div>
      </header>

      <form v-if="filteredSettings && Object.keys(filteredSettings).length > 0" class="settings-form" @submit.prevent="save">
        <!-- Settings Navigation -->
        <nav class="settings-nav" :aria-label="$t('settings.page.navigation-section')">
          <ul class="settings-nav-list">
            <li v-for="(settings, section) in filteredSettings" :key="section">
              <button
                type="button"
                class="settings-nav-button focus-ring"
                :class="{ 'active': activeSection === section }"
                :aria-expanded="activeSection === section"
                :aria-controls="`section-${section}`"
                @click="toggleSection(section)"
                @keydown.enter.prevent="toggleSection(section)"
                @keydown.space.prevent="toggleSection(section)"
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
            :id="`section-${section}`"
            :key="section"
            class="settings-section slide-in"
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
          <button type="submit" class="settings-button settings-button-success focus-ring">
            {{ $t("settings.page.download") }}
          </button>
          <button
            type="button"
            class="settings-button settings-button-danger focus-ring"
            @click="clean_data"
          >
            {{ $t("settings.page.openOther") }}
          </button>
        </div>
      </form>
      <p v-else class="settings-no-results">
        {{ $t("settings.page.no-result") }}
      </p>
    </div>

    <!-- Notifications -->
    <div v-for="notification in notifications.notifications.value" :key="notification.id">
      <NotificationToast
        :visible="notification.visible"
        :type="notification.type"
        :title="notification.title"
        :message="notification.message"
        :dismissible="notification.dismissible"
        @close="notifications.removeNotification(notification.id)"
      />
    </div>
  </div>
</template>

<style scoped>
.settings-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  position: relative;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  backdrop-filter: blur(2px);
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
  transition: var(--transition-base);
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
  transform: translateX(2px);
}

.settings-nav-button.active {
  background: var(--color-blue-100);
  color: var(--color-blue-700);
  font-weight: 500;
  transform: translateX(4px);
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
  border: none;
}

.settings-button-primary {
  background: var(--color-blue-500);
  color: white;
}

.settings-button-primary:hover {
  background: var(--color-blue-600);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.settings-button-success {
  background: var(--color-green-500);
  color: white;
}

.settings-button-success:hover {
  background: var(--color-green-600);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.settings-button-danger {
  background: var(--color-red-500);
  color: white;
}

.settings-button-danger:hover {
  background: var(--color-red-600);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
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

.settings-no-results {
  text-align: center;
  color: var(--color-gray-500);
  font-style: italic;
  padding: 2rem;
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
