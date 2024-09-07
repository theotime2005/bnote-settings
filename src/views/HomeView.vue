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
      // menu variables
      display_menu: {
        system: false,
        main_menu: false,
        explorer: false,
        editor: false,
        music: false,
      },
    };
  },
  methods: {
    get_data() {
      this.settingsData = this.$refs.upload.fileData;
      this.fileIsImported = true;
      this.complete_empty_values();
    },
    clean_data() {
      const confirm = window.confirm("Voulez-vous vraiment effacer la configuration actuelle? Vous devrez importer un autre fichier.");
      if (confirm) {
        this.settingsData = {};
        this.fileIsImported = false;
      }
    },
    complete_empty_values() {
      // Check data and complete if there are not all values
      for (let section in this.all_settings) {
        for (let setting in this.all_settings[section]) {
          if (this.settingsData[section][setting]===undefined) {
            console.log("complete", section, setting);
            this.settingsData[section][setting] = this.all_settings[section][setting].default;
          }
        }
      }
    },
    togle_menu(key) {
      this.display_menu[key] = !this.display_menu[key];
    },
    save_new_value(section, key, new_value) {
      this.settingsData[section][key] = new_value;
    },
    save() {
      const question = window.confirm("Voulez-vous vraiment télécharger le fichier?");
      return question ? this.download_file() : null;
    },
    download_file() {
      const stringData = JSON.stringify(this.settingsData, null, 2);
      const blob_data = new Blob([stringData], { type: "application/json" });
      const url_object = URL.createObjectURL(blob_data);
      // Create link
      const link = document.createElement("a");
      link.href = url_object;
      const file_name = `settings ${new Date().getDate()}-${new Date().getMonth()}-${new Date().getFullYear()}.bnote`;
      link.download=file_name;
      link.click();
      URL.revokeObjectURL(url_object);
    },
  },
};
</script>
<template>
  <h1>Gestion des préférences du B.note</h1>
  <div v-if="!fileIsImported">
    <p>Bienvenu sur l'interface en ligne de gestion des paramètres de B.note.</p>
    <UploadFile ref="upload" @file-uploaded="get_data" />
  </div>
  <div v-if="fileIsImported">
    <h2>Fichier de préférences</h2>
    <form class="settings" @submit.prevent="save">
      <!-- system -->
      <div id="system">
        <h3>Interface utilisateur</h3>
        <button type="button" @click="togle_menu('system')">{{display_menu['system'] ? 'Réduir' : 'Afficher'}} la section</button>
        <div class="setting" v-if="display_menu['system']">
          <SettingComponent v-for="setting in all_settings['system']" :key="setting['id']"
            :setting="setting"
            :setting_value="settingsData['system'][setting['id']]"
            :name="setting['name']"
            @setting-change="save_new_value('system', setting['id'], $event)"
          />
        </div>
      </div>
      <!-- editor -->
      <div id="editor">
        <h3>Éditeur</h3>
        <button type="button" @click="togle_menu('editor')">{{display_menu['editor'] ? 'Réduir' : 'Afficher'}} la section</button>
        <div class="setting" v-if="display_menu['editor']">
          <SettingComponent v-for="setting in all_settings['editor']" :key="setting['id']"
            :setting="setting"
            :setting_value="settingsData['editor'][setting['id']]"
            :name="setting['name']"
            @setting-change="save_new_value('editor', setting['id'], $event)"
          />
        </div>
      </div>
      <!-- music -->
      <div id="music">
        <h3>Musique</h3>
        <button type="button" @click="togle_menu('music')">{{display_menu['music'] ? 'Réduir' : 'Afficher'}} la section</button>
        <div v-if="display_menu['music']">
          <h4>musicxml</h4>
          <div class="setting" v-for="setting in all_settings['music_xml']" :key="setting['id']">
            <SettingComponent
              :setting="setting"
              :setting_value="settingsData['music_xml'][setting['id']]"
              :name="setting['name']"
              @setting-change="save_new_value('music_xml', setting['id'], $event)"
            />
          </div>
          <h4>bxml</h4>
          <div class="setting" v-for="setting in all_settings['music_bxml']" :key="setting['id']">
            <SettingComponent
              :setting="setting"
              :setting_value="settingsData['music_bxml'][setting['id']]"
              :name="setting['name']"
              @setting-change="save_new_value('music_bxml', setting['id'], $event)"
            />
          </div>
        </div>
      </div>
      <button type="submit">Télécharger le fichier</button>
    </form>
    <button type="button" @click="clean_data">Effacer la configuration actuelle</button>
  </div>
</template>

<style scoped></style>
