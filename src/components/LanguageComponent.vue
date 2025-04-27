<script>
import { useLocaleCookie } from "@/scripts/useLocaleCookie.js";
export default {
  name: "LanguageComponent",
  data() {
    return {
      current_language: null,
    };
  },
  methods: {
    changeLanguage() {
      this.$i18n.locale = this.current_language;
      document.documentElement.lang = this.current_language;
      useLocaleCookie.setLocaleCookie(this.current_language);
    },
  },
  mounted() {
    this.current_language = this.$i18n.locale;
  },
};
</script>

<template>
  <div class="language-container">
    <label for="language" class="language-label">{{ $t('languages.select') }}</label>
    <select
      id="language"
      :value="current_language"
      v-model="current_language"
      @change="changeLanguage"
      class="language-select">
      <option v-for="language in $i18n.availableLocales" :key="language" :value="language">
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
