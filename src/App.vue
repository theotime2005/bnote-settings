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
  },

  beforeMount() {
    // set locale from cookie
    const localeCookie = useLocaleCookie.getLocaleCookie();
    if (localeCookie) {
      this.$i18n.locale = localeCookie;
    }
  },
};
</script>

<template>
  <button @click="focusMain" class="sr-only">{{ $t("skip-content") }}</button>
  <NavBarComponent @move-cursor="focusMain" />
  <main class="flex flex-col grow overflow-y-scroll" ref="mainRef" tabindex="-1">
    <RouterView />
  </main>
  <FooterComponent />
</template>
