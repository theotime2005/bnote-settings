<script>
import routes from "@/router/router-list.js";

export default {
  name: "NavBarComponent",
  data() {
    return {
      routes: routes,
      buttonIsVisible: false,
      navBarIsVisible: false,
    };
  },
  methods: {
    toggleNavBar() {
      this.navBarIsVisible = !this.navBarIsVisible;
    },
    handleResize() {
      if (window.innerWidth > 768) {
        this.navBarIsVisible = true;
        this.buttonIsVisible = false;
      } else {
        this.navBarIsVisible = false;
        this.buttonIsVisible = true;
      }
    },
    goto() {
      if (this.buttonIsVisible) {
        this.toggleNavBar();
      }
      this.$emit("move-cursor");
    },
  },
  mounted() {
    window.addEventListener("resize", this.handleResize);
    this.handleResize(); // Initial check
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.handleResize);
  },
};
</script>

<template>
  <header>
    <button
      class="p-2 w-fit flex items-center justify-center text-green-400 border border-green-400 rounded-sm duration-200 transition-all hover:border-green-400 hover:bg-green-400 hover:text-black hover:scale-95"
      @click="toggleNavBar"
      v-if="buttonIsVisible"
    >{{ navBarIsVisible ? $t('header.close') : $t('header.open') }}</button>
    <nav class="mb-5 p-3 bg-slate-900 border-b border-b-slate-600" :aria-label="$t('header.mainMenu')" v-if="navBarIsVisible">
      <menu class="flex gap-3">
        <RouterLink
          class="p-2 w-fit flex items-center justify-center text-green-400 border border-green-400 rounded-sm duration-200 transition-all hover:border-green-400 hover:bg-green-400 hover:text-black hover:scale-95"
          v-for="route in routes"
          :key="route.name"
          :to="route.path"
          @click="goto"
        >{{ $t(`${route.name}.title`) }}
        </RouterLink>
      </menu>
    </nav>
  </header>
</template>
