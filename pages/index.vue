<script setup>
import { useHead } from "#imports";


import { useHead } from "#imports";

const { t } = useI18n();

useHead({
  title: () => `${t("home.title")} | ${t("title")}`,
});
</script>

<template>
  <div class="home-container">
    <h1 class="home-title">{{ t('home.title') }}</h1>

    <div class="home-section">
      <p>{{ t('home.message-1') }}</p>
      <NuxtLink class="home-link" to="/settings">{{ t('home.goto-settings') }}</NuxtLink>
    </div>
    <div class="home-section">
      <h2 class="home-subtitle">{{ t('home.title2') }}</h2>
      <p>{{ t('home.message2') }}</p>
    </div>
  </div>
</template>

<style scoped>
.home-container {
  display: flex;
  flex-direction: column;
  padding: 0.75rem;
}

.home-title {
  font-size: 1.875rem;
  margin-bottom: 0.75rem;
  color: inherit;
}

.home-section {
  display: flex;
  flex-direction: column;
  text-align: justify;
}

.home-subtitle {
  font-size: 1.5rem;
  margin-top: 1.25rem;
  margin-bottom: 0.5rem;
  color: inherit;
}

.home-link {
  text-align: left;
  width: fit-content;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgb(74, 222, 128);
  border-radius: 0.25rem;
  transition: all 0.2s ease;
}

.home-link:hover {
  border-color: rgb(74, 222, 128);
  color: rgb(134, 239, 172);
  text-decoration: underline;
}
</style>
