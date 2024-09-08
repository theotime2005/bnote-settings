<script>
import routes from "@/router/router-list.js";
export default {
  name: "NaveBarreComponent",
  data() {
    return {
      routes: routes,
    };
  },
};
</script>

<template>
  <nav>
    <menu>
      <RouterLink v-for="route in routes" :key="route['path']" :to="route['path']">{{route['name']}}</RouterLink>
    </menu>
  </nav>
</template>

<style scoped>

</style>
