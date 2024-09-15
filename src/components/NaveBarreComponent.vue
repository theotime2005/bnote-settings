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
      <RouterLink v-for="route in routes" :key="route.name" :to="route.path">{{ $t(`${route.name}.title`) }}
      </RouterLink>
    </menu>
  </nav>
</template>

<style scoped>

</style>
