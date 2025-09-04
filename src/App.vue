<script setup>
import { computed, onBeforeMount, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";

import FooterComponent from "@/components/FooterComponent.vue";
import NavBarComponent from "@/components/NavBarComponent.vue";
import { useLocaleCookie } from "@/scripts/useLocaleCookie.js";

const { locale, availableLocales, t } = useI18n();
const mainRef = ref(null);
const hasLanguage = ref(false);
const canReset = ref(false);
const routeAnnouncement = ref("");
const selectedLanguage = ref(null);

const languageLabels = computed(() => ({
  en: "English",
  fr: "Français",
  es: "Español",
  it: "Italiano",
}));

onBeforeMount(() => {
  // set locale from cookie
  const localeCookie = useLocaleCookie.getLocaleCookie();
  if (localeCookie) {
    locale.value = localeCookie;
    hasLanguage.value = true;
  } else if (import.meta.env.MODE === "test") {
    hasLanguage.value = true;
  }
  // Toggle the reset cookies variable
  if (import.meta.env.MODE === "development") {
    canReset.value = true;
  }
});

// Re-announce current page title when locale changes (html lang is handled elsewhere)
watch(() => locale.value, () => {
  const route = useRoute();
  routeAnnouncement.value = t(`${route.name}.title`);
});

// Announce route changes for screen readers
watch(() => useRoute().fullPath, () => {
  const route = useRoute();
  routeAnnouncement.value = t(`${route.name}.title`);
});

function focusMain() {
  if (mainRef.value) {
    mainRef.value.focus();
  }
}

function setLocale(newLocale) {
  locale.value = newLocale;
  useLocaleCookie.setLocaleCookie(newLocale);
  hasLanguage.value = true;
  const router = useRouter();
  const route = useRoute();
  router.push(route.path);
}

function confirmLanguage() {
  if (selectedLanguage.value) {
    setLocale(selectedLanguage.value);
  }
}

function resetCookies() {
  useLocaleCookie.removeCookie();
  hasLanguage.value = false;
  const route = useRoute();
  const router = useRouter();
  router.push(route.path);
}
</script>

<template>
  <div v-if="hasLanguage">
    <a href="#main-content" class="skip-link">Skip to main content</a>
    <NavBarComponent @move-cursor="focusMain" />
    <div aria-live="polite" aria-atomic="true" class="sr-only">{{ routeAnnouncement }}</div>
    <div class="container">
      <main id="main-content" ref="mainRef" tabindex="-1" class="mt-4">
        <RouterView />
      </main>
    </div>
    <FooterComponent />
  </div>
  <div v-else class="container">
    <div class="card mt-4" role="region" aria-labelledby="language-title" aria-describedby="language-desc">
      <h1 id="language-title">Select your language</h1>
      <p id="language-desc">Choose your preferred language for the interface.</p>
      <div class="divider"></div>
      <form class="mt-4" aria-labelledby="language-title" aria-describedby="language-desc" @submit.prevent="confirmLanguage">
        <fieldset>
          <legend class="form-label">Available languages</legend>
          <ul class="language-grid mt-4 mb-4" role="radiogroup" aria-label="Languages">
            <li v-for="language in availableLocales" :key="language">
              <input
                :id="`lang-${language}`"
                class="sr-only"
                v-model="selectedLanguage"
                type="radio"
                name="language"
                :value="language"
              />
              <label class="radio-card" :for="`lang-${language}`">
                <span class="radio-title">{{ languageLabels[language] || language }}</span>
                <span class="radio-code" aria-hidden="true">{{ language.toUpperCase() }}</span>
              </label>
            </li>
          </ul>
        </fieldset>
        <div class="flex justify-between items-center language-actions">
          <button type="submit" class="custom-button button-blue" :disabled="!selectedLanguage">Continue</button>
        </div>
      </form>
    </div>
  </div>
  <div v-if="canReset" class="container mt-4">
    <button class="custom-button button-red" @click="resetCookies">Reset all cookies</button>
  </div>
</template>
