<script setup>
import { onBeforeMount, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import FooterComponent from "@/components/FooterComponent.vue";
import NavBarComponent from "@/components/NavBarComponent.vue";
import i18n from "@/i18n.js";
import { useLocaleCookie } from "@/scripts/useLocaleCookie.js";

const mainRef = ref(null);
const hasLanguage = ref(false);
const canReset = ref(false);

onBeforeMount(() => {
  // set locale from cookie
  const localeCookie = useLocaleCookie.getLocaleCookie();
  if (localeCookie) {
    i18n.global.locale = localeCookie;
    hasLanguage.value = true;
  } else if (import.meta.env.MODE === "test") {
    hasLanguage.value = true;
  }
  // Toggle the reset cookies variable
  if (import.meta.env.MODE === "development") {
    canReset.value = true;
  }
});

function focusMain() {
  if (mainRef.value) {
    mainRef.value.focus();
  }
}

function setLocale(locale) {
  i18n.global.locale = locale;
  useLocaleCookie.setLocaleCookie(locale);
  hasLanguage.value = true;
  const router = useRouter();
  const route = useRoute();
  router.push(route.path);
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
    <NavBarComponent @move-cursor="focusMain" />
    <div class="container">
      <main id="main-content" ref="mainRef" tabindex="-1" class="mt-4">
        <RouterView />
      </main>
    </div>
    <FooterComponent />
  </div>
  <div v-else class="container">
    <div class="card text-center mt-4">
      <h1>Select your language</h1>
      <div class="divider"></div>
      <ul class="flex gap-4 justify-between mt-4 mb-4">
        <li v-for="locale in i18n.global.availableLocales" :key="locale">
          <button class="custom-button button-blue" @click="setLocale(locale)">
            {{ locale }}
          </button>
        </li>
      </ul>
    </div>
  </div>
  <div v-if="canReset" class="container mt-4">
    <button class="custom-button button-red" @click="resetCookies">Reset all cookies</button>
  </div>
</template>
