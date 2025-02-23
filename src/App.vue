<script setup>
import { ref } from "vue";
import { RouterView } from "vue-router";

import FooterComponent from "@/components/FooterComponent.vue";
import NavBarComponent from "@/components/NavBarComponent.vue";

const mainRef = ref(null);

const focusMain = () => {
  if (mainRef.value) {
    mainRef.value.focus();
  }
};
</script>

<template>
  <button @click="focusMain" class="sr-only">{{$t('skip-content')}}</button>
  <NavBarComponent @move-cursor="focusMain" />
  <main class="flex flex-col grow overflow-y-scroll" ref="mainRef" tabindex="-1">
    <RouterView />
  </main>
  <FooterComponent />
</template>
