<script>
import NaveBarreComponent from "@/components/NaveBarreComponent.vue";
import FooterComponent from "@/components/FooterComponent.vue";
import { RouterView } from "vue-router";
export default {
  name: "App",
  components: {
    NaveBarreComponent,
    FooterComponent,
    RouterView,
  },
  mounted() {
    this.$router.push("/");
  },
};
</script>

<template>
  <NaveBarreComponent/>
  <div class="flex flex-col flex-grow overflow-y-scroll">
    <RouterView/>
  </div>
  <FooterComponent/>
</template>

<style>
</style>
