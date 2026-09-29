<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";

import { useLocaleCookie } from "@/composables/useLocaleCookie.js";

const { t, locale, availableLocales, setLocale } = useI18n();
const currentLanguage = computed({
  get() {
    return locale.value;
  },
  set(value) {
    setLocale(value);
    document.documentElement.lang = value;
    useLocaleCookie.setLocaleCookie(value);
  },
});

</script>

<template>
  <div class="language-container">
    <label for="language" class="language-label">{{ t('languages.select') }}</label>
    <select
      id="language"
      v-model="currentLanguage"
      class="language-select"
    >
      <option v-for="language in availableLocales" :key="language" :value="language">
        {{ t(`languages.${language}`) }}
      </option>
    </select>
  </div>
</template>

<style scoped>
.language-container {
  display: inline-flex;
  align-items: center;
  gap: var(--space-3);
}

.language-label {
  font-size: 0.9375rem;
  color: var(--inverse-muted);
}

.language-select {
  appearance: none;
  min-width: 9rem;
  min-height: 2.5rem;
  padding: 0 2.25rem 0 var(--space-4);
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--inverse-text);
  background:
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' fill='none' stroke='%23888' stroke-width='2' stroke-linecap='round'%3E%3Cpath d='m1 1.5 5 5 5-5'/%3E%3C/svg%3E") no-repeat right 0.875rem center,
    var(--inverse-surface);
  border: 1px solid color-mix(in srgb, var(--inverse-text) 22%, transparent);
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: border-color var(--transition-fast);
}

.language-select:hover {
  border-color: var(--inverse-text);
}

.language-select option {
  color: #111412;
  background: #ffffff;
}
</style>
