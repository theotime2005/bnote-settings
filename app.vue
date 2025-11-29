<script setup>
import { onMounted, ref } from "vue";

import { useLocaleCookie } from "~/composables/useLocaleCookie.js";

const mainRef = ref(null);
const canReset = ref(false);


onMounted(() => {
  // const localeCookie = useLocaleCookie.getLocaleCookie();
  // if (localeCookie && availableLocales && availableLocales.value?.includes(localeCookie)) {
  //   locale.value = localeCookie;
  // } else {
  //   const navigatorLanguage = navigator.language.split("-")[0];
  //   if (availableLocales && availableLocales.value?.includes(navigatorLanguage)) {
  //     locale.value = navigatorLanguage;
  //     useLocaleCookie.setLocaleCookie(navigatorLanguage);
  //   }
  // }

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
        <NuxtPage />
      </main>
    </div>
    <FooterComponent />
  </div>
  <div v-if="canReset" class="container mt-4">
    <button class="custom-button button-red" @click="resetCookies">Reset all cookies</button>
  </div>
</template>
