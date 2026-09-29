<script setup>
import { onMounted, ref } from "vue";

import { useLocaleCookie } from "@/composables/useLocaleCookie.js";
import { useFlags } from "@/stores/flags-store.js";

const PRELOADER_DURATION = 1800;

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

  window.setTimeout(() => {
    document.documentElement.setAttribute("data-visited", "");
  }, PRELOADER_DURATION);

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
    <div class="preloader" aria-hidden="true">
      <div class="preloader__cells">
        <span v-for="cell in 6" :key="cell" class="preloader__dot" :style="{ '--dot-index': cell }"></span>
      </div>
      <span class="preloader__label">B.note</span>
    </div>
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

.preloader {
  position: fixed;
  inset: 0;
  z-index: 10000;
  display: grid;
  place-content: center;
  justify-items: center;
  gap: var(--space-5);
  background: var(--inverse-bg);
  color: var(--inverse-text);
  pointer-events: none;
  animation: preloaderOut 0.8s var(--ease-in-out) 1.1s both;
}

.preloader__cells {
  display: grid;
  grid-template-columns: repeat(2, 1rem);
  grid-auto-flow: column;
  grid-template-rows: repeat(3, 1rem);
  gap: 0.6rem;
}

.preloader__dot {
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  background: var(--accent-vivid);
  animation: preloaderDot 0.5s var(--ease-out) both;
  animation-delay: calc(var(--dot-index) * 90ms);
}

.preloader__label {
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--inverse-muted);
}

:root[data-visited] .preloader {
  display: none;
}

@keyframes preloaderDot {
  from { transform: scale(0); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

@keyframes preloaderOut {
  to { transform: translateY(-100%); }
}

@media (prefers-reduced-motion: reduce) {
  .preloader {
    display: none;
  }
}

.dev-tools {
  padding-block: 0 var(--space-6);
  background: var(--inverse-bg);
}
</style>
