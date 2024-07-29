<script>
import UploadFile from "@/components/UploadFile.vue";

export default {
  components: {
    UploadFile,
  },
  data() {
    return {
      fileIsImported: false,
      settingsData: {},
    };
  },
  methods: {
    getData() {
      this.fileIsImported=true;
    },
  },
};
</script>
<template>
  <div v-if="!fileIsImported">
    <h1>Accueil</h1>
    <p>Bienvenu sur l'interface en ligne de gestion des paramètres de B.note.</p>
    <UploadFile ref="upload" @file-uploaded="getData"/>
  </div>
  <div v-if="fileIsImported">
    <h1>Fichier de préférences</h1>
  </div>
</template>

<style scoped></style>
