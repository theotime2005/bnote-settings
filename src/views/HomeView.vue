<script>
import UploadFile from "@/components/UploadFile.vue";
import settings from "@/settings.js";
import SettingComponent from "@/components/SettingComponent.vue";

export default {
  components: {
    SettingComponent,
    UploadFile,
  },
  data() {
    return {
      fileIsImported: false,
      settingsData: {},
      all_settings: settings.all_settings,
      settings_value: settings.settings_value,
    };
  },
  methods: {
    getData() {
      this.settingsData=this.$refs.upload.fileData;
      this.fileIsImported=true;
    },
    save() {
      console.log(this.settingsData);
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
    <div class="settings">
      <div id="system">
        <h2>Interface utilisateur</h2>
        <SettingComponent v-model:setting_value="settingsData['system']['braille_type']" :setting="all_settings['system']['braille_type']" name="Type de braille"/>
        <SettingComponent v-model:setting_value="settingsData['system']['auto_sync_date']" :setting="all_settings['system']['auto_sync_date']" name="Synchroniser la date automatiquement"/>
      </div>
    </div>
    <button @click="save">Sauvegarder</button>
  </div>
</template>

<style scoped></style>
