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
  <h1>{{$t('download.title')}}</h1>
  <p v-html="$t('download.message-1')"></p>
  <a href="https://www.eurobraille.fr/download/telecharger-le-fichier-image-de-la-carte-sd-3-3-0-b-note/" title="Télécharger l'image de la carte SD de B.note">Télécharger l'image de la carte SD</a>
  <h2>{{$t('download.eurobrailleTitle')}}</h2>
  <p>{{$t('download.message2')}}</p>
  <a href="https://www.eurobraille.fr/supports-et-telechargements/produits-braille/b-note/">{{$t('download.downloadEurobraille')}}</a>
  <h2>{{$t('download.otherTitle')}}</h2>
  <p v-html="$t('download.message3')"></p>
  <a :href="last_version['file']">{{$t('download.downloadOtherLast', {version: last_version['tag']})}}</a>
</template>

<style scoped>

</style>
