<script setup>
import { ref } from "vue";

import i18n from "@/i18n.js";
import { useLocaleCookie } from "@/scripts/useLocaleCookie.js";

const current_language = ref(i18n.global.locale.value || i18n.global.locale || "fr");
const availableLocales = ref(i18n.global.availableLocales || Object.keys(i18n.global.messages));

function changeLanguage() {
  if (typeof i18n.global.locale === "object" && "value" in i18n.global.locale) {
    i18n.global.locale.value = current_language.value;
  } else {
    i18n.global.locale = current_language.value;
  }
  document.documentElement.lang = current_language.value;
  useLocaleCookie.setLocaleCookie(current_language.value);
}
</script>

<template>
  <div class="language-container">
    <label for="language" class="language-label">{{ $t('languages.select') }}</label>
    <select
      id="language"
      v-model="current_language"
      :value="current_language"
      class="language-select"
      @change="changeLanguage">
      <option v-for="language in availableLocales" :key="language" :value="language">
        {{ $t(`languages.${language}`) }}
      </option>
    </select>
  </div>
</template>

<style scoped>
.language-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.language-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #4b5563;
}

.language-select {
  padding: 0.375rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background-color: white;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  font-size: 0.875rem;
  min-width: 8rem;
  cursor: pointer;
}

.language-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px #3b82f6;
}

.language-select:hover {
  border-color: #9ca3af;
}
</style>
