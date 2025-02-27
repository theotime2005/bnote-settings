<script setup>
import { onBeforeMount, ref } from "vue";
import { useI18n } from "vue-i18n";
import { RouterView } from "vue-router";

import FooterComponent from "@/components/FooterComponent.vue";
import NavBarComponent from "@/components/NavBarComponent.vue";
import { useLocaleCookie } from "@/scripts/useLocaleCookie.js";

const mainRef = ref(null);

const focusMain = () => {
  if (mainRef.value) {
    mainRef.value.focus();
  }
};

onBeforeMount(function() {
  // set locale from cookie
  const localeCookie = useLocaleCookie.getLocaleCookie();
  if (localeCookie) {
    useI18n().locale.value = localeCookie;
  }
});
</script>

<template>
  <button @click="focusMain" class="sr-only">{{$t('skip-content')}}</button>
  <NavBarComponent @move-cursor="focusMain" />
  <main class="flex flex-col grow overflow-y-scroll" ref="mainRef" tabindex="-1">
    <RouterView />
  </main>
  <FooterComponent />
</template>
