<script>
import FooterComponent from "@/components/FooterComponent.vue";
import NavBarComponent from "@/components/NavBarComponent.vue";
import { useLocaleCookie } from "@/scripts/useLocaleCookie.js";

export default {
  components: {
    FooterComponent,
    NavBarComponent,
  },
  data() {
    return {
      mainRef: null,
      hasLanguage: false,
      canReset: false,
    };
  },

  beforeMount() {
    // set locale from cookie
    const localeCookie = useLocaleCookie.getLocaleCookie();
    if (localeCookie) {
      this.$i18n.locale = localeCookie;
      this.hasLanguage = true;
    } else if (import.meta.env.MODE === "test") {
      this.hasLanguage = true;
    }
    // Toggle the reset cookies variable
    if (import.meta.env.MODE === "development") {
      this.canReset = true;
    }
  },

  methods: {
    focusMain() {
      if (this.$refs.mainRef) {
        this.$refs.mainRef.focus();
      }
    },

    setLocale(locale) {
      this.$i18n.locale = locale;
      useLocaleCookie.setLocaleCookie(locale);
      this.hasLanguage = true;
      this.$router.push(this.$route.path);
    },

    resetCookies() {
      useLocaleCookie.removeCookie();
      this.hasLanguage = false;
      this.$router.push(this.$route.path);
    },
  },
};
</script>

<template>
  <div v-if="hasLanguage">
    <button class="sr-only custom-button" @click="focusMain">{{ $t("skip-content") }}</button>
    <NavBarComponent @move-cursor="focusMain" />
    <div class="container">
      <main ref="mainRef" tabindex="-1" class="mt-4">
        <RouterView />
      </main>
    </div>
    <FooterComponent />
  </div>
  <div v-else class="container">
    <div class="card text-center mt-4">
      <h1>Select your language</h1>
      <div class="divider"></div>
      <ul class="flex gap-4 justify-between mt-4 mb-4">
        <li v-for="locale in $i18n.availableLocales" :key="locale">
          <button class="custom-button button-blue" @click="setLocale(locale)">
            {{ locale }}
          </button>
        </li>
      </ul>
    </div>
  </div>
  <div v-if="canReset" class="container mt-4">
    <button class="custom-button button-red" @click="resetCookies">Reset all cookies</button>
  </div>
</template>
