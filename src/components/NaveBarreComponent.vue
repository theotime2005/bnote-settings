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
  <header>
    <nav class="mb-5 p-3 bg-slate-900 border-b border-b-slate-600" :aria-label="$t('header.mainMenu')">
      <menu class="flex gap-3">
        <RouterLink
          class="p-2 w-fit flex items-center justify-center text-green-400 border border-green-400 rounded-sm duration-200 transition-all hover:border-green-400 hover:bg-green-400 hover:text-black hover:scale-95"
          v-for="route in routes"
          :key="route.name"
          :to="route.path"
          >{{ $t(`${route.name}.title`) }}
        </RouterLink>
      </menu>
    </nav>
  </header>
</template>

<style scoped>

</style>
