<script setup>
import { RouterView } from "vue-router";
import NaveBarreComponent from "@/components/NaveBarreComponent.vue";
import FooterComponent from "@/components/FooterComponent.vue";
</script>

<template>
  <NaveBarreComponent/>
  <div>
    <RouterView/>
  </div>
  <FooterComponent/>
</template>
