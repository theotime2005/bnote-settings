<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";

import { useNotifications } from "@/composables/useNotifications.js";
import all_settings from "@/settings.json";
import { useSettingsStore } from "@/stores/settingsStore.js";
import { useHead } from "#imports";

const { t } = useI18n();

useHead({
  title: () => `${t("settings.page.title")} | ${t("title")}`,
});

const TOOLBAR_ACTION = [
  {
    label: t("settings.page.download"),
    onClick: save,
  },
  {
    label: t("settings.page.openOther"),
    onClick: cleanData,
  },
];

const fileName = ref("");
const fileIsImported = ref(false);
const activeSection = ref(null);
const searchQuery = ref("");
const isLoading = ref(false);
const notifications = useNotifications();
const settingsStore = useSettingsStore();

const filteredSettings = computed(() => {
  if (!all_settings || typeof all_settings !== "object") {
    return {};
  }

  if (!searchQuery.value) return all_settings;
  const query = searchQuery.value.toLowerCase();
  const filtered = {};
  for (const [section, settings] of Object.entries(all_settings)) {
    if (!settings || typeof settings !== "object") {
      continue;
    }

    const sectionLabel = t(`settings.id.${section}`).toLowerCase();
    const matchingSettings = {};
    const sectionMatch = sectionLabel.includes(query);
    for (const [key, value] of Object.entries(settings)) {
      const settingLabel = t(`settings.id.${key}`).toLowerCase();
      if (settingLabel.includes(query) || sectionMatch) {
        matchingSettings[key] = value;
      }
    }
    if (Object.keys(matchingSettings).length > 0) {
      filtered[section] = matchingSettings;
    }
  }
  return filtered;
});

function cleanData() {
  const confirm = window.confirm(t("settings.page.resetQuestion"));
  if (confirm) {
    isLoading.value = true;
    fileIsImported.value = false;
    settingsStore.removeAll();
    window.removeEventListener("beforeunload", handleBeforeReload);
    activeSection.value = null;
    searchQuery.value = "";
    notifications.info(t("settings.notifications.configurationReset"));
    Promise.resolve().then(() => {
      isLoading.value = false;
    });
  }
}

function createBasicData() {
  isLoading.value = true;
  const data = {};
  for (const section in all_settings) {
    data[section] = {};
    for (const setting in all_settings[section]) {
      data[section][setting] = all_settings[section][setting].default;
    }
  }
  fileName.value = t("settings.page.defaultName");
  settingsStore.loadSettings(data, fileName.value);
  fileIsImported.value = true;
  window.addEventListener("beforeunload", handleBeforeReload);
  activeSection.value = null;
  searchQuery.value = "";
  notifications.success(t("settings.notifications.defaultConfigurationLoaded"));
  setTimeout(() => {
    isLoading.value = false;
  }, 500);
}

function showFile() {
  fileName.value = settingsStore.getFileName;
  fileIsImported.value = true;
  window.addEventListener("beforeunload", handleBeforeReload);
  activeSection.value = null;
  searchQuery.value = "";
  notifications.success(t("settings.notifications.fileLoaded"));
}

function toggleSection(section) {
  if (!section || typeof section !== "string") {
    return;
  }

  activeSection.value = activeSection.value === section ? null : section;

  nextTick(() => {
    if (activeSection.value) {
      const sectionEl = document.getElementById(`section-${activeSection.value}`);
      if (sectionEl) {
        const input = sectionEl.querySelector("input, select, textarea, button");
        if (input) input.focus();
      }
    }
  });
}

function save() {
  const question = window.confirm(t("settings.page.question"));
  return question ? downloadFile() : null;
}

function downloadFile() {
  try {
    isLoading.value = true;
    const stringData = JSON.stringify(settingsStore.getAllSettings, null, 2);
    const blobData = new Blob([stringData], { type: "application/json" });
    const urlObject = URL.createObjectURL(blobData);
    const link = document.createElement("a");
    link.href = urlObject;
    const fileDate = `${new Date().getDate()}-${new Date().getMonth()}-${new Date().getFullYear()}`;
    const fileNameValue = t("settings.page.downloadName", { date: fileDate }) + ".bnote";
    link.download = fileNameValue;
    link.click();
    URL.revokeObjectURL(urlObject);
    notifications.success(t("settings.notifications.fileDownloaded"));
  } catch (error) {
    notifications.error(t("settings.notifications.downloadError"));
    console.error("Download error:", error);
  } finally {
    setTimeout(() => {
      isLoading.value = false;
    }, 1000);
  }
}

function handleKeyPress(event) {
  if (event.key === "Escape") {
    activeSection.value = null;
    searchQuery.value = "";
  }
  if ((event.key === "ArrowDown" || event.key === "ArrowUp") && fileIsImported.value) {
    const navButtons = Array.from(document.querySelectorAll(".settings-nav-button"));
    const current = navButtons.findIndex((btn) => btn === document.activeElement);
    if (current !== -1) {
      let next = event.key === "ArrowDown" ? current + 1 : current - 1;
      if (next < 0) next = navButtons.length - 1;
      if (next >= navButtons.length) next = 0;
      navButtons[next].focus();
      event.preventDefault();
    }
  }
}

function handleBeforeReload(event) {
  event.preventDefault();
  event.returnValue = "";
}

onMounted(() => {
  window.addEventListener("keydown", handleKeyPress);
  if (settingsStore.getAllSettings) {
    fileName.value = settingsStore.getFileName;
    fileIsImported.value = true;
    window.addEventListener("beforeunload", handleBeforeReload);
  }
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKeyPress);
  window.removeEventListener("beforeunload", handleBeforeReload);
});
</script>

<template>
  <div class="settings-container">
    <PageHero index="03" :label="t('header.nav.settings')" :title="t('settings.page.title')" title-class="settings-title" word="config">
      <p>{{ t("settings.page.message") }}</p>
    </PageHero>

    <div class="settings-body page container">
      <div v-if="isLoading" class="loading-overlay">
        <LoadingSpinner size="large" :text="t('common.loading')" />
      </div>

      <div v-if="!fileIsImported" class="settings-intro-card fade-in">
        <div class="settings-intro-text">
          <h2 class="settings-subtitle">{{ t("settings.page.how") }}</h2>
          <p class="settings-explanation">{{ t("settings.page.explication") }}</p>
        </div>
        <div class="settings-intro-options">
          <UploadFileComponent ref="upload" @file-uploaded="showFile" />
          <p class="settings-or" aria-hidden="true"><span>{{ t("settings.page.or") }}</span></p>
          <div class="settings-create-card">
            <BrailleWord word="bnote" class="settings-create-braille" />
            <h3 class="settings-create-title">{{ t("settings.page.defaultName") }}</h3>
            <button
              type="button"
              class="btn btn--primary settings-button settings-button-primary focus-ring"
              @click="createBasicData"
            >
              {{ t("settings.page.create") }}
            </button>
          </div>
        </div>
      </div>

      <div v-if="fileIsImported" class="settings-manager fade-in">
        <header class="settings-header">
          <div class="settings-file">
            <span class="settings-file-icon" aria-hidden="true">.bnote</span>
            <div>
              <p class="settings-file-label">{{ t("settings.page.title2") }}</p>
              <h2 class="settings-filename">{{ fileName }}</h2>
            </div>
          </div>

          <div class="search-container">
            <label for="settings-search" class="sr-only">{{ t('settings.page.search') }}</label>
            <svg class="search-icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
              <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="2" />
              <path d="m20 20-3.5-3.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
            </svg>
            <input
              id="settings-search"
              v-model="searchQuery"
              type="search"
              class="settings-search focus-ring"
              :placeholder="t('settings.page.search')"
              @keydown.enter.prevent="() => { if (Object.keys(filteredSettings).length === 1) activeSection = Object.keys(filteredSettings)[0]; }"
            />
          </div>
          <ToolBar
            :actions="TOOLBAR_ACTION" :aria-label="t('settings.page.toolbar')" />
        </header>

        <form v-if="filteredSettings && Object.keys(filteredSettings).length > 0" class="settings-form" @submit.prevent="save">
          <nav class="settings-nav" :aria-label="t('settings.page.navigation-section')">
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
                  <span class="settings-nav-label">{{ t(`settings.id.${section}`) }}</span>
                  <span class="settings-nav-count" aria-hidden="true">{{ Object.keys(settings).length }}</span>
                </button>
              </li>
            </ul>
          </nav>

          <div class="settings-content">
            <div v-if="!activeSection" class="settings-placeholder">
              <BrailleWord word="bnote" size="large" class="settings-placeholder-braille" />
              <p>{{ t("settings.page.select-section") }}</p>
            </div>
            <section
              v-for="(settings, section) in filteredSettings"
              :id="`section-${section}`"
              :key="section"
              class="settings-section slide-in"
              :class="{ 'active': activeSection === section }"
              :aria-hidden="activeSection !== section"
            >
              <h3 class="settings-section-title">{{ t(`settings.id.${section}`) }}</h3>
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
        </form>
        <p v-else class="settings-no-results">
          {{ t("settings.page.no-result") }}
        </p>
      </div>

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
  </div>
</template>

<style scoped>
.settings-container {
  position: relative;
}

.loading-overlay {
  position: fixed;
  inset: 0;
  z-index: 999;
  display: grid;
  place-items: center;
  background: var(--overlay);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
}

.settings-intro-card {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 2fr);
  gap: clamp(2rem, 5vw, 4rem);
  padding-top: clamp(2rem, 4vw, 3rem);
  border-top: 1.5px solid var(--border-strong);
}

.settings-intro-text {
  display: grid;
  align-content: start;
  gap: var(--space-4);
}

.settings-explanation {
  color: var(--text-muted);
  font-size: 1.0625rem;
}

.settings-intro-options {
  display: grid;
  grid-template-columns: minmax(0, 1.3fr) auto minmax(0, 1fr);
  gap: var(--space-4);
  align-items: stretch;
}

.settings-or {
  display: grid;
  place-items: center;
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted);
  position: relative;
}

.settings-or::before {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 1px;
  background: var(--border);
}

.settings-or span {
  position: relative;
  padding: var(--space-2) 0;
  background: var(--bg);
}

.settings-create-card {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
  gap: var(--space-4);
  padding: clamp(1.5rem, 3vw, 2rem);
  color: var(--inverse-text);
  background:
    radial-gradient(100% 80% at 100% 0%, color-mix(in srgb, var(--accent-vivid) 22%, transparent), transparent 60%),
    var(--inverse-bg);
  border-radius: var(--radius-xl);
}

.settings-create-braille {
  --braille-color: var(--accent-vivid);
  color: var(--inverse-muted);
  margin-bottom: auto;
}

:root[data-color-scheme="blue-yellow"] .settings-create-braille {
  --braille-color: var(--inverse-text);
}

.settings-create-title {
  color: var(--inverse-text);
  font-size: 1.5rem;
}

.settings-create-card .btn--primary {
  --focus: var(--inverse-text);
  color: var(--inverse-bg);
  background: var(--inverse-text);
  border-color: var(--inverse-text);
}

.settings-create-card .btn--primary:hover {
  background: var(--accent-vivid);
  border-color: var(--accent-vivid);
}

:root[data-color-scheme="blue-yellow"] .settings-create-card .btn--primary:hover {
  background: var(--inverse-muted);
  border-color: var(--inverse-muted);
}

.settings-manager {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
}

.settings-header {
  position: sticky;
  top: var(--header-height);
  z-index: 20;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  padding: var(--space-5) var(--space-6);
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  border-radius: var(--radius-xl) var(--radius-xl) 0 0;
}

.settings-file {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  min-width: 0;
}

.settings-file-icon {
  display: grid;
  place-items: center;
  width: 3rem;
  height: 3.5rem;
  flex-shrink: 0;
  font-family: var(--font-mono);
  font-size: 0.625rem;
  font-weight: 600;
  color: var(--accent-contrast);
  background: var(--accent);
  border-radius: var(--radius-sm) 1rem var(--radius-sm) var(--radius-sm);
}

.settings-file-label {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.settings-filename {
  font-size: 1.25rem;
  overflow-wrap: anywhere;
}

.search-container {
  position: relative;
  flex: 1;
  min-width: 14rem;
  max-width: 26rem;
}

.search-icon {
  position: absolute;
  top: 50%;
  left: var(--space-4);
  color: var(--text-muted);
  transform: translateY(-50%);
  pointer-events: none;
}

.settings-search {
  width: 100%;
  min-height: 2.75rem;
  padding: 0 var(--space-4) 0 2.75rem;
  font-size: 1rem;
  color: var(--text);
  background: var(--surface-2);
  border: 1.5px solid transparent;
  border-radius: var(--radius-full);
  transition: border-color var(--transition-fast), background-color var(--transition-fast);
}

.settings-search:hover {
  border-color: var(--border);
}

.settings-search:focus-visible {
  outline: none;
  background: var(--surface);
  border-color: var(--focus);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--focus) 30%, transparent);
}

.settings-form {
  display: grid;
  grid-template-columns: 17rem minmax(0, 1fr);
  min-height: 32rem;
}

.settings-nav {
  min-width: 0;
  padding: var(--space-4);
  border-right: 1px solid var(--border);
}

.settings-nav-list {
  position: sticky;
  top: calc(var(--header-height) + 6.5rem);
  display: grid;
  gap: 2px;
  list-style: none;
}

.settings-nav-button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  width: 100%;
  min-height: 2.75rem;
  padding: var(--space-2) var(--space-3);
  font-size: 0.9375rem;
  font-weight: 600;
  text-align: left;
  color: var(--text-muted);
  background: transparent;
  border: 0;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: background-color var(--transition-fast), color var(--transition-fast);
}

.settings-nav-button:hover {
  color: var(--text);
  background: var(--surface-2);
}

.settings-nav-button.active {
  color: var(--bg);
  background: var(--text);
}

.settings-nav-count {
  min-width: 1.75rem;
  padding: 0.125rem var(--space-2);
  font-family: var(--font-mono);
  font-size: 0.75rem;
  text-align: center;
  background: var(--surface-2);
  border-radius: var(--radius-full);
}

.settings-nav-button.active .settings-nav-count {
  color: var(--text);
  background: var(--bg);
}

.settings-content {
  padding: clamp(1.25rem, 3vw, 2rem);
  min-width: 0;
}

.settings-placeholder {
  display: grid;
  place-items: center;
  align-content: center;
  gap: var(--space-6);
  height: 100%;
  min-height: 24rem;
  padding: var(--space-8);
  text-align: center;
  color: var(--text-muted);
  border: 1.5px dashed var(--border);
  border-radius: var(--radius-lg);
}

.settings-placeholder-braille {
  --braille-color: var(--accent);
  color: var(--text-muted);
}

.settings-section {
  display: none;
}

.settings-section.active {
  display: block;
}

.settings-section-title {
  font-size: clamp(1.5rem, 1.2rem + 1vw, 2rem);
  padding-bottom: var(--space-4);
  border-bottom: 1px solid var(--border);
}

.settings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 18rem), 1fr));
  align-items: start;
  gap: var(--space-3);
  margin-top: var(--space-6);
}

.settings-no-results {
  padding: var(--space-16) var(--space-8);
  text-align: center;
  color: var(--text-muted);
}

@media (max-width: 1100px) {
  .settings-intro-card {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .settings-intro-options {
    grid-template-columns: 1fr;
  }

  .settings-or::before {
    top: 50%;
    bottom: auto;
    left: 0;
    right: 0;
    width: auto;
    height: 1px;
  }

  .settings-or span {
    padding: 0 var(--space-3);
  }

  .settings-header {
    position: static;
    padding: var(--space-4);
  }

  .search-container {
    max-width: none;
    flex-basis: 100%;
    order: 3;
  }

  .settings-form {
    grid-template-columns: minmax(0, 1fr);
    min-height: 0;
  }

  .settings-nav {
    padding: var(--space-3) 0;
    border-right: 0;
    border-bottom: 1px solid var(--border);
  }

  .settings-nav-list {
    position: static;
    display: flex;
    gap: var(--space-2);
    padding: var(--space-1) var(--space-4);
    overflow-x: auto;
    scroll-snap-type: x proximity;
    scrollbar-width: none;
  }

  .settings-nav-list::-webkit-scrollbar {
    display: none;
  }

  .settings-nav-list li {
    flex-shrink: 0;
    scroll-snap-align: start;
  }

  .settings-nav-button {
    width: auto;
    white-space: nowrap;
    border: 1px solid var(--border);
    border-radius: var(--radius-full);
  }

  .settings-placeholder {
    min-height: 14rem;
  }
}
</style>
