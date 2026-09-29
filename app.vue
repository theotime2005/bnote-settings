<script setup>
import { onMounted, ref } from "vue";

import { useLocaleCookie } from "@/composables/useLocaleCookie.js";
import { useFlags } from "@/stores/flags-store.js";

const flags = useFlags();
const mainRef = ref(null);
const canReset = ref(false);


onMounted(async () => {
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
  await flags.fetchFlags();
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
  <div class="app-shell">
    <NavBarComponent @move-cursor="focusMain" />
    <main id="main-content" ref="mainRef" tabindex="-1" class="site-main">
      <NuxtPage />
    </main>
    <FooterComponent />
    <div v-if="canReset" class="dev-tools">
      <div class="container">
        <button class="custom-button button-red" @click="resetCookies">Reset all cookies</button>
      </div>
    </div>
  </div>
</template>

<style>
.app-shell {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.site-main {
  flex: 1;
}

.site-main:focus {
  outline: none;
}

.dev-tools {
  padding-block: 0 var(--space-6);
  background: var(--inverse-bg);
}
</style>
