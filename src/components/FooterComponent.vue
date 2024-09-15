<script>
import LanguageComponent from "@/components/LanguageComponent.vue";

export default {
  name: "FooterComponent",
  components: { LanguageComponent },
};
</script>

<template>
  <footer>
    <p>{{$t('footer.message1')}}</p>
    <a href="https://github.com/theotime2005/bnote-settings">{{$t('footer.code')}}</a>
    <p>{{$t('footer.message2')}}</p>
  </footer>
  <LanguageComponent/>
</template>

<style scoped>

</style>
