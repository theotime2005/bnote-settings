<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { RouterLink } from "vue-router";

import routes from "@/router/router-list.js";

const { t } = useI18n();
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
  if (window.innerWidth > 768) {
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

  // Apply text size
  root.setAttribute("data-text-size", accessibilitySettings.value.textSize);

  // Apply contrast
  root.setAttribute("data-contrast", accessibilitySettings.value.contrast);

  // Apply color scheme
  root.setAttribute("data-color-scheme", accessibilitySettings.value.colorScheme);
}

function handleKeyDown(event) {
  // Handle escape key to close menus
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
    <!-- Skip to main content link for screen readers -->
    <a href="#main-content" class="skip-link">{{ t('skip-content') }}</a>

    <div class="nav-container">
      <!-- Accessibility controls -->
      <div class="accessibility-controls">
        <button
          class="accessibility-toggle"
          :aria-expanded="showAccessibilityMenu"
          :aria-controls="showAccessibilityMenu ? 'accessibility-menu' : null"
          :title="t('header.accessibilityOptions')"
          @click="toggleAccessibilityMenu"
        >
          <span class="accessibility-icon" aria-hidden="true">⚙️</span>
          <span class="sr-only">{{ t('header.accessibilityOptions') }}</span>
        </button>

        <!-- Accessibility menu -->
        <div
          v-if="showAccessibilityMenu"
          id="accessibility-menu"
          class="accessibility-menu"
          role="dialog"
          :aria-label="t('header.accessibilityOptions')"
        >
          <div class="accessibility-section">
            <h3 class="accessibility-title">{{ t('header.textSize') }}</h3>
            <div class="accessibility-options" role="radiogroup" :aria-label="t('header.textSize')">
              <label class="accessibility-option">
                <input
                  type="radio"
                  name="textSize"
                  value="small"
                  :checked="accessibilitySettings.textSize === 'small'"
                  @change="updateTextSize('small')"
                />
                <span>{{ t('header.small') }}</span>
              </label>
              <label class="accessibility-option">
                <input
                  type="radio"
                  name="textSize"
                  value="normal"
                  :checked="accessibilitySettings.textSize === 'normal'"
                  @change="updateTextSize('normal')"
                />
                <span>{{ t('header.normal') }}</span>
              </label>
              <label class="accessibility-option">
                <input
                  type="radio"
                  name="textSize"
                  value="large"
                  :checked="accessibilitySettings.textSize === 'large'"
                  @change="updateTextSize('large')"
                />
                <span>{{ t('header.large') }}</span>
              </label>
            </div>
          </div>

          <div class="accessibility-section">
            <h3 class="accessibility-title">{{ t('header.contrast') }}</h3>
            <div class="accessibility-options" role="radiogroup" :aria-label="t('header.contrast')">
              <label class="accessibility-option">
                <input
                  type="radio"
                  name="contrast"
                  value="normal"
                  :checked="accessibilitySettings.contrast === 'normal'"
                  @change="updateContrast('normal')"
                />
                <span>{{ t('header.normalContrast') }}</span>
              </label>
              <label class="accessibility-option">
                <input
                  type="radio"
                  name="contrast"
                  value="high"
                  :checked="accessibilitySettings.contrast === 'high'"
                  @change="updateContrast('high')"
                />
                <span>{{ t('header.highContrast') }}</span>
              </label>
            </div>
          </div>

          <div class="accessibility-section">
            <h3 class="accessibility-title">{{ t('header.colorScheme') }}</h3>
            <div class="accessibility-options" role="radiogroup" :aria-label="t('header.colorScheme')">
              <label class="accessibility-option">
                <input
                  type="radio"
                  name="colorScheme"
                  value="default"
                  :checked="accessibilitySettings.colorScheme === 'default'"
                  @change="updateColorScheme('default')"
                />
                <span>{{ t('header.defaultColors') }}</span>
              </label>
              <label class="accessibility-option">
                <input
                  type="radio"
                  name="colorScheme"
                  value="dark"
                  :checked="accessibilitySettings.colorScheme === 'dark'"
                  @change="updateColorScheme('dark')"
                />
                <span>{{ t('header.darkMode') }}</span>
              </label>
              <label class="accessibility-option">
                <input
                  type="radio"
                  name="colorScheme"
                  value="blue-yellow"
                  :checked="accessibilitySettings.colorScheme === 'blue-yellow'"
                  @change="updateColorScheme('blue-yellow')"
                />
                <span>{{ t('header.blueYellow') }}</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile menu toggle -->
      <button
        v-if="buttonIsVisible"
        class="nav-toggle-button"
        :aria-expanded="navBarIsVisible"
        :aria-controls="navBarIsVisible ? 'main-navigation' : null"
        @click="toggleNavBar"
      >
        <span class="nav-toggle-icon" :class="{ 'open': navBarIsVisible }">
          <span></span>
          <span></span>
          <span></span>
        </span>
        <span class="nav-toggle-text">
          {{ navBarIsVisible ? t('header.close') : t('header.open') }}
        </span>
      </button>
    </div>

    <!-- Main navigation -->
    <nav
      v-if="navBarIsVisible"
      id="main-navigation"
      class="main-nav"
      :aria-label="t('header.mainMenu')"
      role="navigation"
    >
      <ul class="nav-menu" role="menubar">
        <li v-for="route in routes" :key="route.name" role="none">
          <RouterLink
            class="nav-link"
            :to="route.path"
            role="menuitem"
            :aria-current="$route.path === route.path ? 'page' : null"
            @click="goto"
            @keydown.enter="goto"
          >
            {{ t(`${route.name}.title`) }}
          </RouterLink>
        </li>
      </ul>
    </nav>
  </header>
</template>

<style scoped>
.nav-header {
  width: 100%;
  position: relative;
}

.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: var(--color-blue-600);
  color: white;
  padding: 8px;
  text-decoration: none;
  border-radius: 4px;
  z-index: 1000;
  transition: top 0.3s;
}

.skip-link:focus {
  top: 6px;
}

.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: rgb(15, 23, 42);
}

.nav-toggle-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: transparent;
  border: 2px solid rgb(74, 222, 128);
  border-radius: 0.375rem;
  color: rgb(74, 222, 128);
  cursor: pointer;
  transition: all 0.3s ease;
}

.nav-toggle-button:hover,
.nav-toggle-button:focus {
  background-color: rgb(74, 222, 128);
  color: rgb(15, 23, 42);
  outline: none;
}

.nav-toggle-icon {
  display: flex;
  flex-direction: column;
  width: 20px;
  height: 16px;
  justify-content: space-between;
}

.nav-toggle-icon span {
  display: block;
  height: 2px;
  width: 100%;
  background-color: currentColor;
  transition: all 0.3s ease;
  transform-origin: center;
}

.nav-toggle-icon.open span:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}

.nav-toggle-icon.open span:nth-child(2) {
  opacity: 0;
}

.nav-toggle-icon.open span:nth-child(3) {
  transform: rotate(-45deg) translate(7px, -6px);
}

.nav-toggle-text {
  font-weight: 500;
}

.accessibility-controls {
  position: relative;
}

.accessibility-toggle {
  padding: var(--space-3);
  background: transparent;
  border: 2px solid var(--color-blue-500);
  border-radius: var(--radius-md);
  color: var(--color-blue-600);
  cursor: pointer;
  transition: var(--transition-base);
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 44px;
  min-height: 44px;
}

.accessibility-toggle:hover,
.accessibility-toggle:focus {
  background-color: var(--color-blue-500);
  color: var(--color-white);
  outline: none;
  transform: scale(1.05);
}

.accessibility-toggle:focus-visible {
  outline: 3px solid var(--color-blue-300);
  outline-offset: 2px;
}

.accessibility-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background: #ffffff !important;
  border: 2px solid #d1d5db;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  padding: var(--space-4);
  width: 300px;
  z-index: 9999;
  transform: translateX(calc(100% - 44px));
  color: #111827 !important;
}

.accessibility-menu * {
  color: #111827 !important;
}

.accessibility-section {
  margin-bottom: 1rem;
}

.accessibility-section:last-child {
  margin-bottom: 0;
}

.accessibility-title {
  font-size: 1rem;
  font-weight: 700;
  color: #111827 !important;
  margin-bottom: var(--space-3);
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: var(--space-2);
}

.accessibility-options {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.accessibility-option {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3);
  cursor: pointer;
  border-radius: var(--radius-md);
  transition: var(--transition-base);
  border: 1px solid transparent;
  background-color: transparent;
}

.accessibility-option:hover {
  background-color: var(--color-green-100) !important;
  border-color: var(--color-green-500);
}

.accessibility-option:focus-within {
  background-color: var(--color-green-100) !important;
  border-color: var(--color-green-500);
}

.accessibility-option input[type="radio"] {
  margin: 0;
  width: 16px;
  height: 16px;
}

.accessibility-option span {
  font-weight: 500;
  color: #111827 !important;
}

.accessibility-option:hover span {
  color: #111827 !important;
}

.accessibility-option:focus-within span {
  color: #111827 !important;
}

.accessibility-option label {
  color: #111827 !important;
}

.accessibility-option label span {
  color: #111827 !important;
}

.main-nav {
  background-color: rgb(15, 23, 42);
  border-top: 1px solid rgb(71, 85, 105);
  padding: 1rem;
}

.nav-menu {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1rem;
  color: rgb(74, 222, 128);
  background: transparent;
  border: 2px solid rgb(74, 222, 128);
  border-radius: 0.375rem;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  position: relative;
}

.nav-link:hover,
.nav-link:focus {
  background-color: rgb(74, 222, 128);
  color: rgb(15, 23, 42);
  outline: none;
  transform: translateY(-2px);
}

.nav-link[aria-current="page"] {
  background-color: rgb(74, 222, 128);
  color: rgb(15, 23, 42);
}

.nav-link[aria-current="page"]::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  height: 2px;
  background-color: rgb(34, 197, 94);
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

/* Responsive design */
@media (max-width: 768px) {
  .nav-menu {
    flex-direction: column;
  }

  .nav-link {
    width: 100%;
    text-align: center;
  }

  .accessibility-menu {
    right: auto;
    left: 0;
  }
}

/* Accessibility enhancements based on user preferences */
:root[data-text-size="small"] {
  font-size: 14px;
}

:root[data-text-size="large"] {
  font-size: 18px;
}

:root[data-contrast="high"] .nav-header {
  --color-primary: #000000;
  --color-secondary: #ffffff;
  --color-accent: #ffff00;
}

:root[data-contrast="high"] .nav-toggle-button,
:root[data-contrast="high"] .nav-link,
:root[data-contrast="high"] .accessibility-toggle {
  border-color: var(--color-accent);
  color: var(--color-accent);
}

:root[data-contrast="high"] .nav-toggle-button:hover,
:root[data-contrast="high"] .nav-toggle-button:focus,
:root[data-contrast="high"] .nav-link:hover,
:root[data-contrast="high"] .nav-link:focus,
:root[data-contrast="high"] .accessibility-toggle:hover,
:root[data-contrast="high"] .accessibility-toggle:focus {
  background-color: var(--color-accent);
  color: var(--color-primary);
}

:root[data-color-scheme="dark"] .nav-container,
:root[data-color-scheme="dark"] .main-nav {
  background-color: #1a1a1a;
}

:root[data-color-scheme="dark"] .accessibility-menu {
  background-color: var(--color-gray-100);
  color: var(--color-gray-900);
  border-color: var(--color-gray-400);
}

:root[data-color-scheme="dark"] .accessibility-title {
  color: var(--color-gray-900);
  border-bottom-color: var(--color-gray-400);
}

:root[data-color-scheme="dark"] .accessibility-option span {
  color: var(--color-gray-800);
}

:root[data-color-scheme="dark"] .accessibility-option:hover {
  background-color: var(--color-green-200) !important;
  border-color: var(--color-green-600);
}

:root[data-color-scheme="dark"] .accessibility-option:focus-within {
  background-color: var(--color-green-200) !important;
  border-color: var(--color-green-600);
}

:root[data-color-scheme="dark"] .accessibility-option:hover span {
  color: var(--color-gray-900) !important;
}

:root[data-color-scheme="dark"] .accessibility-option:focus-within span {
  color: var(--color-gray-900) !important;
}

:root[data-color-scheme="blue-yellow"] .nav-toggle-button,
:root[data-color-scheme="blue-yellow"] .nav-link,
:root[data-color-scheme="blue-yellow"] .accessibility-toggle {
  border-color: #0066cc;
  color: #0066cc;
}

:root[data-color-scheme="blue-yellow"] .nav-toggle-button:hover,
:root[data-color-scheme="blue-yellow"] .nav-toggle-button:focus,
:root[data-color-scheme="blue-yellow"] .nav-link:hover,
:root[data-color-scheme="blue-yellow"] .nav-link:focus,
:root[data-color-scheme="blue-yellow"] .accessibility-toggle:hover,
:root[data-color-scheme="blue-yellow"] .accessibility-toggle:focus {
  background-color: #ffcc00;
  color: #000000;
}

/* Focus indicators for better keyboard navigation */
.nav-toggle-button:focus-visible,
.nav-link:focus-visible,
.accessibility-toggle:focus-visible,
.accessibility-option:focus-within {
  outline: 3px solid #4A90E2;
  outline-offset: 2px;
}

/* Accessibility settings */
:root[data-text-size="small"] {
  font-size: 14px;
}

:root[data-text-size="large"] {
  font-size: 18px;
}

:root[data-contrast="high"] {
  --color-gray-900: #000000;
  --color-gray-800: #1a1a1a;
  --color-gray-700: #333333;
  --color-gray-600: #4a4a4a;
  --color-gray-500: #666666;
  --color-gray-400: #808080;
  --color-gray-300: #999999;
  --color-gray-200: #b3b3b3;
  --color-gray-100: #cccccc;
  --color-gray-50: #e6e6e6;
}

:root[data-color-scheme="dark"] {
  --color-gray-50: #1f2937;
  --color-gray-100: #374151;
  --color-gray-200: #4b5563;
  --color-gray-300: #6b7280;
  --color-gray-400: #9ca3af;
  --color-gray-500: #d1d5db;
  --color-gray-600: #e5e7eb;
  --color-gray-700: #f3f4f6;
  --color-gray-800: #f9fafb;
  --color-gray-900: #ffffff;
}

:root[data-color-scheme="blue-yellow"] {
  --color-blue-500: #0066cc;
  --color-blue-600: #0052a3;
  --color-blue-700: #003d7a;
  --color-green-500: #ffcc00;
  --color-green-600: #e6b800;
  --color-green-700: #cca300;
}

/* Reduced motion for users who prefer it */
@media (prefers-reduced-motion: reduce) {
  .nav-toggle-button,
  .nav-link,
  .accessibility-toggle,
  .nav-toggle-icon span {
    transition: none;
  }
}
</style>
