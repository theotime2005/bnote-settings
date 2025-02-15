<script setup>
import { ref } from "vue";
import { RouterView } from "vue-router";

import FooterComponent from "@/components/FooterComponent.vue";
import NaveBarreComponent from "@/components/NaveBarreComponent.vue";

const mainRef = ref(null);

const focusMain = () => {
  if (mainRef.value) {
    mainRef.value.focus();
  }
};
</script>

<template>
  <button @click="focusMain">{{$t('skip-content')}}</button>
  <NaveBarreComponent />
  <main class="flex flex-col grow overflow-y-scroll main-content" ref="mainRef" tabindex="-1">
    <RouterView />
  </main>
  <FooterComponent />
</template>
