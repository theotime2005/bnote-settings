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

  beforeMount() {
    // set locale from cookie
    const localeCookie = useLocaleCookie.getLocaleCookie();
    if (localeCookie) {
      this.$i18n.locale = localeCookie;
      this.hasLanguage = true;
    } else if (import.meta.env.MODE==="test") {
      this.hasLanguage = true;
    }
    // Toggle the reset cookies variable
    if (import.meta.env.MODE=== "development") {
      this.canReset = true;
    }
  },
};
</script>

<template>
  <div v-if="hasLanguage">
    <button @click="focusMain" class="sr-only">{{ $t("skip-content") }}</button>
    <NavBarComponent @move-cursor="focusMain" />
    <main class="flex flex-col grow overflow-y-scroll" ref="mainRef" tabindex="-1">
      <RouterView />
    </main>
    <FooterComponent />
  </div>
  <div v-else>
    <h1>Select your language</h1>
    <ul class="flex flex-row">
      <li v-for="locale in $i18n.availableLocales" :key="locale">
        <button @click="setLocale(locale)">{{locale}}</button>
      </li>
    </ul>
  </div>
  <button v-if="canReset" @click="resetCookies">Reset all cookies</button>
</template>
