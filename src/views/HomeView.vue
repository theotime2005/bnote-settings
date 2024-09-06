<script>
import UploadFile from "@/components/UploadFile.vue";
import settings from "@/settings.js";
import SettingComponent from "@/components/SettingComponent.vue";
import { isNoCORSSafelistedRequest } from "jsdom/lib/jsdom/living/fetch/header-types.js";

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
    isNoCORSSafelistedRequest,
    getData() {
      this.settingsData = this.$refs.upload.fileData;
      this.fileIsImported = true;
      this.complete_empty_values();
    },
    complete_empty_values() {
      // Check data and complete if there are not all values
      for (let section in this.all_settings) {
        for (let setting in this.all_settings[section]) {
          if (!this.settingsData[section][setting]) {
            this.settingsData[section][setting] = this.all_settings[section][setting];
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
      console.log(this.settingsData);
    },
  },
};
</script>
<template>
  <div v-if="!fileIsImported">
    <h1>Accueil</h1>
    <p>Bienvenu sur l'interface en ligne de gestion des paramètres de B.note.</p>
    <UploadFile ref="upload" @file-uploaded="getData" />
  </div>
  <div v-if="fileIsImported">
    <h1>Fichier de préférences</h1>
    <form class="settings" @submit.prevent="save">
      <!-- system -->
      <div id="system">
        <h2>Interface utilisateur</h2>
        <button @click="togle_menu('system')">{{display_menu['system'] ? 'Réduir' : 'Afficher'}} la section</button>
        <div class="setting" v-if="display_menu['system']" v-for="setting in all_settings['system']" :key="setting['id']">
          <SettingComponent
            :setting="setting"
            :setting_value="settingsData['system'][setting['id']]"
            :name="setting['name']"
            @setting-change="save_new_value('system', setting['id'], $event)"
          />
        </div>
      </div>
      <!-- editor -->
      <div id="editor">
        <h2>Éditeur</h2>
        <button @click="togle_menu('editor')">{{display_menu['editor'] ? 'Réduir' : 'Afficher'}} la section</button>
        <div class="setting" v-if="display_menu['editor']" v-for="setting in all_settings['editor']" :key="setting['id']">
          <SettingComponent
            :setting="setting"
            :setting_value="settingsData['editor'][setting['id']]"
            :name="setting['name']"
            @setting-change="save_new_value('editor', setting['id'], $event)"
          />
        </div>
      </div>
      <!-- music -->
      <div id="music">
        <h2>Musique</h2>
        <button @click="togle_menu('music')">{{display_menu['music'] ? 'Réduir' : 'Afficher'}} la section</button>
        <div v-if="display_menu['music']">
          <h3>musicxml</h3>
          <div class="setting" v-for="setting in all_settings['music_xml']" :key="setting['id']">
            <SettingComponent
              :setting="setting"
              :setting_value="settingsData['music_xml'][setting['id']]"
              :name="setting['name']"
              @setting-change="save_new_value('music_xml', setting['id'], $event)"
            />
          </div>
          <h3>bxml</h3>
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
      <button type="submit">Sauvegarder (non fonctionnel pour le moment)</button>
    </form>

  </div>
</template>

<style scoped></style>
