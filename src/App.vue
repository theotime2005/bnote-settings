<script setup>
import { RouterView } from "vue-router";
import NaveBarreComponent from "@/components/NaveBarreComponent.vue";
import FooterComponent from "@/components/FooterComponent.vue";
</script>

<template>
  <NaveBarreComponent />
  <main class="flex flex-col flex-grow overflow-y-scroll">
    <RouterView />
  </main>
  <FooterComponent />
</template>
