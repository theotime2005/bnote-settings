<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useLocaleCookie } from "@/scripts/useLocaleCookie";

const { locale, availableLocales } = useI18n();
const current_language = ref<string>('');

onMounted(() => {
  current_language.value = locale.value;
});

function changeLanguage(): void {
  locale.value = current_language.value;
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