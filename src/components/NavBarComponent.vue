<script>
import routes from "@/router/router-list.js";

export default {
  name: "NavBarComponent",
  emits: ["move-cursor"],
  data() {
    return {
      routes: routes,
      buttonIsVisible: false,
      navBarIsVisible: false,
    };
  },
  mounted() {
    window.addEventListener("resize", this.handleResize);
    this.handleResize(); // Initial check
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.handleResize);
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
};
</script>

<template>
  <header class="nav-header">
    <button
      v-if="buttonIsVisible"
      class="nav-toggle-button"
      @click="toggleNavBar"
    >{{ navBarIsVisible ? $t('header.close') : $t('header.open') }}</button>
    <nav v-if="navBarIsVisible" class="main-nav" :aria-label="$t('header.mainMenu')">
      <menu class="nav-menu">
        <RouterLink
          v-for="route in routes"
          :key="route.name"
          class="nav-link"
          :to="route.path"
          @click="goto"
        >{{ $t(`${route.name}.title`) }}
        </RouterLink>
      </menu>
    </nav>
  </header>
</template>

<style scoped>
.nav-header {
  width: 100%;
}

.nav-toggle-button {
  padding: 0.5rem;
  width: fit-content;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgb(74, 222, 128);
  border: 1px solid rgb(74, 222, 128);
  border-radius: 0.125rem;
  transition: all 0.2s ease;
  cursor: pointer;
}

.nav-toggle-button:hover {
  background-color: rgb(74, 222, 128);
  color: black;
  transform: scale(0.95);
}

.main-nav {
  margin-bottom: 1.25rem;
  padding: 0.75rem;
  background-color: rgb(15, 23, 42);
  border-bottom: 1px solid rgb(71, 85, 105);
}

.nav-menu {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.nav-link {
  padding: 0.5rem;
  width: fit-content;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgb(74, 222, 128);
  border: 1px solid rgb(74, 222, 128);
  border-radius: 0.125rem;
  transition: all 0.2s ease;
  cursor: pointer;
  text-decoration: none;
}

.nav-link:hover {
  background-color: rgb(74, 222, 128);
  color: black;
  transform: scale(0.95);
}

/* Styles responsifs */
@media (max-width: 768px) {
  .nav-menu {
    flex-direction: column;
  }
}
</style>
