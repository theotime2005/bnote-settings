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
  <h1>Téléchargement B.note</h1>
  <p>Depuis la version 3.0.0 de B.note, le code source est libre et disponible sur <a href="https://github.com/devel-erb/bnote">GitHub</a>. Téléchargez l'image ci-dessous</p>
  <a href="https://www.eurobraille.fr/download/telecharger-le-fichier-image-de-la-carte-sd-3-3-0-b-note/" title="Télécharger l'image de la carte SD de B.note">Télécharger l'image de la carte SD</a>
  <h2>Site d'Eurobraille</h2>
  <p>La version officielle de B.note est disponible sur le site d'Eurobraille. Vous pouvez la télécharger sur le site.</p>
  <a href="https://www.eurobraille.fr/supports-et-telechargements/produits-braille/b-note/" title="Télécharger B.note sur le site d'Eurobraille">Télécharger B.note</a>
  <h2>Autre version</h2>
  <p>Je mets à disposition une autre version dont le code source est disponible <a href="https://github.com/theotime2005/bnote">Ici</a>. Vous pouvez la télécharger ci-dessous</p>
  <a :href="last_version['file']">Télécharger {{last_version['tag']}}</a>
</template>

<style scoped>

</style>
