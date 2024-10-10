<script>
import routes from "@/router/router-list.js";

export default {
  name: "NaveBarreComponent",
  data() {
    return {
      routes: routes,
      desktopMode: false,
    };
  },
  mounted() {
    this.desktopMode = window.isElectron;
  },
  computed: {
    currentRoute() {
      return this.$route.path; // Récupère la route actuelle
    },
  },
};
</script>

<template>
  <header>
    <nav class="mb-5 p-3 bg-slate-900 border-b border-b-slate-600" :aria-label="$t('header.mainMenu')">
      <!-- Mobile Menu -->
      <menu class="flex gap-3" v-if="!desktopMode">
        <RouterLink
          class="p-2 w-fit flex items-center justify-center text-green-400 border border-green-400 rounded duration-200 transition-all hover:border-green-400 hover:bg-green-400 hover:text-black hover:scale-95"
          v-for="route in routes" :key="route.name" :to="route.path">{{ $t(`${route.name}.title`) }}
        </RouterLink>
      </menu>
      <!-- Desktop Menu as Tabs -->
      <menu class="flex gap-3 border-b border-b-slate-600" v-else>
        <button
          class="tab-item px-4 py-2 text-green-400 border-b-2 border-transparent transition-all hover:text-green-200 hover:border-green-400"
          :class="{ 'tab-item-active': currentRoute === route.path }"
          :aria-selected="currentRoute === route.path"
          v-for="route in routes" :key="route.name" @click="$router.push(route.path)">
          {{ $t(`${route.name}.title`) }}
        </button>
      </menu>
    </nav>
  </header>
</template>

<style scoped>
.tab-item {
  cursor: pointer;
  transition: all 0.2s ease;
}

.tab-item-active {
  border-bottom-color: #22c55e; /* Couleur verte pour l'onglet actif */
  color: #22c55e;
}

.tab-item:hover {
  border-bottom-color: #22c55e; /* Couleur verte lors du hover */
}
</style>
