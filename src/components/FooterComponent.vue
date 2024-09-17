<script>
import LanguageComponent from "@/components/LanguageComponent.vue";

export default {
  name: "FooterComponent",
  components: { LanguageComponent },
};
</script>
<template>
  <footer class="bg-slate-900 p-2 flex flex-col items-center justify-center text-[11px] border-t border-t-slate-600">
    <div class="flex">
      <div class="flex flex-col justify-center items-center">
        <p>{{$t('footer.message1')}}</p>
        <p>{{$t('footer.message2')}}</p>
      </div>
    </div>
    <LanguageComponent/>
    <a class="text-green-400 hover:text-green-300 hover:underline transition-all duration-200" href="https://github.com/theotime2005/bnote-settings">{{$t('footer.code')}}</a>
  </footer>
</template>

<style scoped>

</style>
