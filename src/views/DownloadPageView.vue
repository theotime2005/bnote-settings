<script>
export default {
  name: "DownloadPageView",
  data() {
    return {
      last_version: {},
    };
  },
  methods: {
    async get_last_version() {
      try {
        const request = await fetch("https://api.github.com/repos/theotime2005/bnote/releases");
        const response = await request.json();
        const version = response[0];
        console.log(version);
        this.last_version["tag"]=version["tag_name"];
        this.last_version["file"]=version["assets"][0]["browser_download_url"];
      } catch (e) {
        console.error(e);
      }
    },
  },
  mounted() {
    this.get_last_version();
  },
};
</script>

<template>
  <div class="p-3">
    <div class="flex flex-col mb-3">
      <h1 class="text-3xl">{{$t('download.title')}}</h1>
      <p v-html="$t('download.message-1')"></p>
      <a class="text-green-400 duration-200 transition-all hover:underline hover:text-green-300" href="https://www.eurobraille.fr/download/telecharger-le-fichier-image-de-la-carte-sd-3-3-0-b-note/" title="Télécharger l'image de la carte SD de B.note">Télécharger l'image de la carte SD</a>
    </div>

    <div class="flex flex-col mt-3">
      <h2 class="text-3xl">{{$t('download.eurobrailleTitle')}}</h2>
      <p>{{$t('download.message2')}}</p>
      <a class="text-green-400 duration-200 transition-all hover:underline hover:text-green-300" href="https://www.eurobraille.fr/supports-et-telechargements/produits-braille/b-note/">{{$t('download.downloadEurobraille')}}</a>
    </div>

    <div class="flex flex-col mt-3">
      <h2 class="text-3xl">{{$t('download.otherTitle')}}</h2>
      <p v-html="$t('download.message3')"></p>
      <a class="text-green-400 duration-200 transition-all hover:underline hover:text-green-300" :href="last_version['file']">{{$t('download.downloadOtherLast', {version: last_version['tag']})}}</a>
    </div>
  </div>
</template>

<style scoped>

</style>
