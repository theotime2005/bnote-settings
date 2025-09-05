<script setup>
import { onBeforeMount, ref } from "vue";
import { useI18n } from "vue-i18n";

import FooterComponent from "@/components/FooterComponent.vue";
import NavBarComponent from "@/components/NavBarComponent.vue";
import { useLocaleCookie } from "@/scripts/useLocaleCookie.js";

const { locale, availableLocales } = useI18n();
const mainRef = ref(null);
const canReset = ref(false);

onBeforeMount(() => {
  // set locale from cookie
  const localeCookie = useLocaleCookie.getLocaleCookie();
  if (localeCookie) {
    locale.value = localeCookie;
  } else {
    const navigatorLanguage = navigator.language;
    if (availableLocales.includes(navigatorLanguage)) {
      locale.value = navigatorLanguage;
      useLocaleCookie.setLocaleCookie(navigatorLanguage);
    }
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

function resetCookies() {
  useLocaleCookie.removeCookie();
  window.location.reload();
}
</script>

<template>
  <div>
    <NavBarComponent @move-cursor="focusMain" />
    <div class="container">
      <main id="main-content" ref="mainRef" tabindex="-1" class="mt-4">
        <RouterView />
      </main>
    </div>
    <FooterComponent />
  </div>
  <div v-if="canReset" class="container mt-4">
    <button class="custom-button button-red" @click="resetCookies">Reset all cookies</button>
  </div>
</template>
