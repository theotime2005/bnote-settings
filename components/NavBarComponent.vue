<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";

import { useLocalePath } from "#i18n";

const MOBILE_BREAKPOINT = 960;
const routes = [
  { path: "/", name: "home", label: "home.title" },
  { path: "/download", name: "download", label: "header.nav.download" },
  { path: "/settings", name: "settings.page", label: "header.nav.settings" },
  { path: "/faq", name: "faq", label: "faq.title" },
  { path: "/about", name: "about", label: "about.title" },
];
const TEXT_SIZE_OPTIONS = [
  { value: "small", label: "header.small" },
  { value: "normal", label: "header.normal" },
  { value: "large", label: "header.large" },
];
const CONTRAST_OPTIONS = [
  { value: "normal", label: "header.normalContrast" },
  { value: "high", label: "header.highContrast" },
];
const COLOR_SCHEME_OPTIONS = [
  { value: "default", label: "header.defaultColors" },
  { value: "dark", label: "header.darkMode" },
  { value: "blue-yellow", label: "header.blueYellow" },
];

const localePath = useLocalePath();
const { t } = useI18n();
const route = useRoute();
const buttonIsVisible = ref(false);
const navBarIsVisible = ref(false);
const showAccessibilityMenu = ref(false);
const emit = defineEmits(["move-cursor"]);
const accessibilitySettings = ref({
  textSize: "normal",
  contrast: "normal",
  colorScheme: "default",
});

function toggleNavBar() {
  navBarIsVisible.value = !navBarIsVisible.value;
  const announcement = navBarIsVisible.value
    ? t("header.menuOpened")
    : t("header.menuClosed");
  announceToScreenReader(announcement);
}

function toggleAccessibilityMenu() {
  showAccessibilityMenu.value = !showAccessibilityMenu.value;
}

function handleResize() {
  if (window.innerWidth > MOBILE_BREAKPOINT) {
    navBarIsVisible.value = true;
    buttonIsVisible.value = false;
  } else {
    navBarIsVisible.value = false;
    buttonIsVisible.value = true;
  }
}

function goto() {
  if (buttonIsVisible.value) {
    toggleNavBar();
  }
  emit("move-cursor");
}

function announceToScreenReader(message) {
  const announcement = document.createElement("div");
  announcement.setAttribute("aria-live", "polite");
  announcement.setAttribute("aria-atomic", "true");
  announcement.className = "sr-only";
  announcement.textContent = message;
  document.body.appendChild(announcement);

  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

function updateTextSize(size) {
  accessibilitySettings.value.textSize = size;
  saveAndApplySettings();
}

function updateContrast(contrast) {
  accessibilitySettings.value.contrast = contrast;
  saveAndApplySettings();
}

function updateColorScheme(scheme) {
  accessibilitySettings.value.colorScheme = scheme;
  saveAndApplySettings();
}

function saveAndApplySettings() {
  localStorage.setItem("accessibilitySettings", JSON.stringify(accessibilitySettings.value));
  applyAccessibilitySettings();
}

function loadAccessibilitySettings() {
  const saved = localStorage.getItem("accessibilitySettings");
  if (saved) {
    accessibilitySettings.value = { ...accessibilitySettings.value, ...JSON.parse(saved) };
  }
}

function applyAccessibilitySettings() {
  const root = document.documentElement;
  root.setAttribute("data-text-size", accessibilitySettings.value.textSize);
  root.setAttribute("data-contrast", accessibilitySettings.value.contrast);
  root.setAttribute("data-color-scheme", accessibilitySettings.value.colorScheme);
}

function handleKeyDown(event) {
  if (event.key === "Escape") {
    if (showAccessibilityMenu.value) {
      showAccessibilityMenu.value = false;
    } else if (navBarIsVisible.value && buttonIsVisible.value) {
      toggleNavBar();
    }
  }
}

function handleClickOutside(event) {
  const accessibilityControls = event.target.closest(".accessibility-controls");
  if (!accessibilityControls && showAccessibilityMenu.value) {
    showAccessibilityMenu.value = false;
  }
}

onMounted(() => {
  window.addEventListener("resize", handleResize);
  document.addEventListener("click", handleClickOutside);
  handleResize();
  loadAccessibilitySettings();
  applyAccessibilitySettings();
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
  document.removeEventListener("click", handleClickOutside);
});
</script>

<template>
  <header class="nav-header" @keydown="handleKeyDown">
    <a href="#main-content" class="skip-link">{{ t('skip-content') }}</a>

    <div class="nav-container container">
      <NuxtLink class="nav-brand" :to="localePath('/')" @click="goto">
        <BrailleWord word="bn" size="small" class="nav-brand-braille" />
        <span class="nav-brand-name">B.note</span>
      </NuxtLink>

      <nav
        v-if="navBarIsVisible"
        id="main-navigation"
        class="main-nav"
        :class="{ 'main-nav--mobile': buttonIsVisible }"
        :aria-label="t('header.mainMenu')"
        role="navigation"
      >
        <ul class="nav-menu" role="menubar">
          <li v-for="routeItem in routes" :key="routeItem.name" role="none">
            <NuxtLink
              class="nav-link"
              :to="localePath(routeItem.path)"
              role="menuitem"
              :aria-current="route.path === localePath(routeItem.path) ? 'page' : undefined"
              @click="goto"
              @keydown.enter="goto"
            >
              {{ t(routeItem.label) }}
            </NuxtLink>
          </li>
        </ul>
      </nav>

      <div class="nav-actions">
        <div class="accessibility-controls">
          <button
            class="accessibility-toggle"
            :aria-expanded="showAccessibilityMenu"
            :aria-controls="showAccessibilityMenu ? 'accessibility-menu' : null"
            :title="t('header.accessibilityOptions')"
            @click="toggleAccessibilityMenu"
          >
            <svg class="accessibility-icon" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false">
              <circle cx="12" cy="4.5" r="2" fill="currentColor" />
              <path d="M4 8.5c2.6.8 5.3 1.2 8 1.2s5.4-.4 8-1.2M12 9.7v4.8m0 0-3 6.5m3-6.5 3 6.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <span class="sr-only">{{ t('header.accessibilityOptions') }}</span>
          </button>

          <Transition name="popover">
            <div
              v-if="showAccessibilityMenu"
              id="accessibility-menu"
              class="accessibility-menu"
              role="dialog"
              :aria-label="t('header.accessibilityOptions')"
            >
              <p class="accessibility-menu-title">{{ t('header.accessibilityOptions') }}</p>

              <div class="accessibility-section">
                <h3 class="accessibility-title">{{ t('header.textSize') }}</h3>
                <div class="accessibility-options" role="radiogroup" :aria-label="t('header.textSize')">
                  <label v-for="option in TEXT_SIZE_OPTIONS" :key="option.value" class="accessibility-option">
                    <input
                      type="radio"
                      name="textSize"
                      :value="option.value"
                      :checked="accessibilitySettings.textSize === option.value"
                      @change="updateTextSize(option.value)"
                    />
                    <span>{{ t(option.label) }}</span>
                  </label>
                </div>
              </div>

              <div class="accessibility-section">
                <h3 class="accessibility-title">{{ t('header.contrast') }}</h3>
                <div class="accessibility-options" role="radiogroup" :aria-label="t('header.contrast')">
                  <label v-for="option in CONTRAST_OPTIONS" :key="option.value" class="accessibility-option">
                    <input
                      type="radio"
                      name="contrast"
                      :value="option.value"
                      :checked="accessibilitySettings.contrast === option.value"
                      @change="updateContrast(option.value)"
                    />
                    <span>{{ t(option.label) }}</span>
                  </label>
                </div>
              </div>

              <div class="accessibility-section">
                <h3 class="accessibility-title">{{ t('header.colorScheme') }}</h3>
                <div class="accessibility-options accessibility-options--stacked" role="radiogroup" :aria-label="t('header.colorScheme')">
                  <label v-for="option in COLOR_SCHEME_OPTIONS" :key="option.value" class="accessibility-option">
                    <input
                      type="radio"
                      name="colorScheme"
                      :value="option.value"
                      :checked="accessibilitySettings.colorScheme === option.value"
                      @change="updateColorScheme(option.value)"
                    />
                    <span class="accessibility-swatch" :class="`accessibility-swatch--${option.value}`" aria-hidden="true"></span>
                    <span>{{ t(option.label) }}</span>
                  </label>
                </div>
              </div>
            </div>
          </Transition>
        </div>

        <button
          v-if="buttonIsVisible"
          class="nav-toggle-button"
          :aria-expanded="navBarIsVisible"
          :aria-controls="navBarIsVisible ? 'main-navigation' : null"
          @click="toggleNavBar"
        >
          <span class="nav-toggle-icon" :class="{ 'open': navBarIsVisible }" aria-hidden="true">
            <span></span>
            <span></span>
          </span>
          <span class="sr-only">
            {{ navBarIsVisible ? t('header.close') : t('header.open') }}
          </span>
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.nav-header {
  position: sticky;
  top: 0;
  z-index: 100;
  width: 100%;
  background: var(--header-bg);
  border-bottom: 1px solid var(--border);
  backdrop-filter: saturate(1.6) blur(18px);
  -webkit-backdrop-filter: saturate(1.6) blur(18px);
}

.skip-link {
  position: absolute;
  top: var(--space-3);
  left: var(--space-4);
  opacity: 0;
  pointer-events: none;
  transform: translateY(-150%);
  z-index: 1000;
  padding: var(--space-3) var(--space-4);
  font-weight: 600;
  color: var(--accent-contrast);
  background: var(--accent);
  border-radius: var(--radius-full);
  text-decoration: none;
  transition: transform var(--transition-base), opacity var(--transition-base);
}

.skip-link:focus {
  opacity: 1;
  pointer-events: auto;
  transform: translateY(0);
}

.nav-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-6);
  min-height: var(--header-height);
}

.nav-brand {
  display: inline-flex;
  align-items: center;
  gap: var(--space-3);
  color: var(--text);
  text-decoration: none;
  flex-shrink: 0;
}

.nav-brand:hover {
  color: var(--text);
  text-decoration: none;
}

.nav-brand-braille {
  --braille-color: var(--accent);
  padding: var(--space-2);
  border: 1.5px solid var(--border-strong);
  border-radius: var(--radius-sm);
}

.nav-brand-name {
  font-size: 1.25rem;
  font-weight: 800;
  letter-spacing: -0.03em;
}

.main-nav {
  flex: 1;
  display: flex;
  justify-content: center;
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-1);
  list-style: none;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-full);
}

.nav-link {
  display: inline-flex;
  align-items: center;
  min-height: 2.5rem;
  padding: 0 var(--space-4);
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--text-muted);
  text-decoration: none;
  white-space: nowrap;
  border-radius: var(--radius-full);
  transition: background-color var(--transition-fast), color var(--transition-fast);
}

.nav-link:hover {
  color: var(--text);
  background: var(--surface-2);
  text-decoration: none;
}

.nav-link[aria-current="page"] {
  color: var(--bg);
  background: var(--text);
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  flex-shrink: 0;
}

.accessibility-controls {
  position: relative;
}

.accessibility-toggle,
.nav-toggle-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.75rem;
  height: 2.75rem;
  color: var(--text);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 50%;
  cursor: pointer;
  transition: background-color var(--transition-fast), color var(--transition-fast), border-color var(--transition-fast);
}

.accessibility-toggle:hover,
.nav-toggle-button:hover,
.accessibility-toggle[aria-expanded="true"],
.nav-toggle-button[aria-expanded="true"] {
  color: var(--bg);
  background: var(--text);
  border-color: var(--text);
}

.accessibility-menu {
  position: absolute;
  top: calc(100% + var(--space-3));
  right: 0;
  z-index: 200;
  display: grid;
  gap: var(--space-5);
  width: min(22rem, calc(100vw - 2rem));
  padding: var(--space-5);
  color: var(--text);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
}

.accessibility-menu-title {
  font-size: 1.0625rem;
  font-weight: 700;
}

.accessibility-title {
  margin-bottom: var(--space-2);
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.accessibility-options {
  display: flex;
  gap: var(--space-1);
  padding: var(--space-1);
  background: var(--surface-2);
  border-radius: var(--radius-md);
}

.accessibility-options--stacked {
  flex-direction: column;
}

.accessibility-option {
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  min-height: 2.5rem;
  padding: var(--space-2) var(--space-3);
  font-size: 0.9375rem;
  font-weight: 600;
  text-align: center;
  color: var(--text-muted);
  border: 1.5px solid transparent;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: background-color var(--transition-fast), color var(--transition-fast);
}

.accessibility-options--stacked .accessibility-option {
  justify-content: flex-start;
}

.accessibility-option:hover {
  color: var(--text);
}

.accessibility-option:has(input:checked) {
  color: var(--text);
  background: var(--surface);
  border-color: var(--border-strong);
  box-shadow: var(--shadow-sm);
}

.accessibility-option:focus-within {
  outline: 3px solid var(--focus);
  outline-offset: 1px;
}

.accessibility-option input[type="radio"] {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.accessibility-swatch {
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 50%;
  border: 1px solid var(--border-strong);
  flex-shrink: 0;
}

.accessibility-swatch--default {
  background: linear-gradient(135deg, #f5f3ee 50%, #0a6b42 50%);
}

.accessibility-swatch--dark {
  background: linear-gradient(135deg, #0b0e0c 50%, #3ddc84 50%);
}

.accessibility-swatch--blue-yellow {
  background: linear-gradient(135deg, #ffd400 50%, #002a7a 50%);
}

.popover-enter-active,
.popover-leave-active {
  transition: opacity var(--transition-fast), transform var(--transition-fast);
}

.popover-enter-from,
.popover-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.98);
}

.nav-toggle-icon {
  position: relative;
  display: block;
  width: 18px;
  height: 12px;
}

.nav-toggle-icon span {
  position: absolute;
  left: 0;
  width: 100%;
  height: 2px;
  background: currentColor;
  border-radius: 2px;
  transition: transform var(--transition-base), top var(--transition-base);
}

.nav-toggle-icon span:nth-child(1) {
  top: 1px;
}

.nav-toggle-icon span:nth-child(2) {
  top: 9px;
}

.nav-toggle-icon.open span:nth-child(1) {
  top: 5px;
  transform: rotate(45deg);
}

.nav-toggle-icon.open span:nth-child(2) {
  top: 5px;
  transform: rotate(-45deg);
}

.main-nav--mobile {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  padding: var(--space-4) clamp(1rem, 4vw, 2.5rem) var(--space-6);
  background: var(--bg);
  border-bottom: 1px solid var(--border);
  box-shadow: var(--shadow-lg);
  animation: fadeIn 0.3s var(--ease-out) both;
}

.main-nav--mobile .nav-menu {
  flex-direction: column;
  align-items: stretch;
  width: 100%;
  padding: 0;
  background: transparent;
  border: 0;
  border-radius: 0;
}

.main-nav--mobile .nav-link {
  justify-content: space-between;
  width: 100%;
  min-height: 3.5rem;
  padding: 0 var(--space-2);
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--text);
  border-bottom: 1px solid var(--border);
  border-radius: 0;
}

.main-nav--mobile .nav-link::after {
  content: "→";
  font-weight: 400;
  color: var(--text-muted);
}

.main-nav--mobile .nav-link[aria-current="page"] {
  color: var(--accent);
  background: transparent;
}

@media (max-width: 480px) {
  .nav-brand-braille {
    display: none;
  }
}
</style>
