<script>
export default {
  name: "LanguageComponent",
  data() {
    return {
      current_language: null,
    };
  },
  methods: {
    changeLanguage() {
      this.$i18n.locale=this.current_language;
      document.documentElement.lang=this.current_language;
    },
  },
  mounted() {
    this.current_language = this.$i18n.locale;
  },
};
</script>

<template>
  <label for="language">{{$t('languages.select')}}</label>
  <select :value="current_language" v-model="current_language" @change="changeLanguage">
    <option
      v-for="language in $i18n.availableLocales"
      :key="language"
      :value="language">
      {{ $t(`languages.${language}`) }}
    </option>
  </select>
</template>

<style scoped>

</style>
