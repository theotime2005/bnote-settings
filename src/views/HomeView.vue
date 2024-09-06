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
    getData() {
      this.settingsData = this.$refs.upload.fileData;
      this.fileIsImported = true;
    },
    togle_menu(key) {
      this.display_menu[key] = !this.display_menu[key];
    },
    save_new_value(section, key, new_value) {
      console.log(new_value);
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
    <div class="settings">
      <div id="system">
        <h2>Interface utilisateur</h2>
        <button @click="togle_menu('system')">{{ display_menu['system'] ? 'Réduir' : 'Développer'}} la section</button>
        <div v-if="display_menu['system']" class="setting">
          <SettingComponent
            ref="system_braille_type"
            :setting_value="settingsData['system']['braille_type']"
            :setting="all_settings['system']['braille_type']"
            name="Type de braille"
            @setting-change="save_new_value('system', 'braille_type', $refs.system_braille_type.settingValue)" />
          <SettingComponent ref="system_auto_sync_date"
                            :setting_value="settingsData['system']['auto_sync_date']"
                            :setting="all_settings['system']['auto_sync_date']"
                            name="Synchroniser la date automatiquement"
                            @setting-change="save_new_value('system', 'auto_sync_date', $refs.system_auto_sync_date.settingValue)" />
          <SettingComponent
            ref="system_space_in_label"
            :setting_value="settingsData['system']['space_in_label']"
            :setting="all_settings['system']['space_in_label']"
            name="Espace dans les noms de labels"
            @setting-change="save_new_value('system', 'space_in_label', $refs.system_space_in_label.settingValue)" />
          <SettingComponent
            ref="system_shortcuts_visible"
            :setting_value="settingsData['system']['shortcuts_visible']"
            :setting="all_settings['system']['shortcuts_visible']"
            name="Afficher les raccourcis clavier"
            @setting-change="save_new_value('system', 'shortcuts_visible', $refs.system_shortcuts_visible.settingValue)" />
        </div>
      </div>
      <div id="main-menu">
        <h2>Menu principal</h2>
        <button @click="togle_menu('main_menu')">{{ display_menu['main_menu'] ? 'Réduir' : 'Développer'}} la section</button>
        <div v-if="display_menu['main_menu']" class="setting">
          <SettingComponent
            ref="system_app_explorer"
            :setting_value="settingsData['system']['app_explorer']"
            :setting="all_settings['system']['app_explorer']"
            name="Afficher l'app Explorateur"
            @setting-change="save_new_value('system', 'app_explorer', $refs.system_app_explorer.settingValue)" />
          <SettingComponent
            ref="system_app_settings"
            :setting_value="settingsData['system']['app_settings']"
            :setting="all_settings['system']['app_settings']"
            name="Afficher l'app Préférences"
            @setting-change="save_new_value('system', 'app_settings', $refs.system_app_settings.settingValue)" />
          <SettingComponent
            ref="system_app_agenda"
            :setting_value="settingsData['system']['app_agenda']"
            :setting="all_settings['system']['app_agenda']"
            name="Afficher l'app Agenda"
            @setting-change="save_new_value('system', 'app_agenda', $refs.system_app_agenda.settingValue)" />
          <SettingComponent
            ref="system_app_radio"
            :setting_value="settingsData['system']['app_radio']"
            :setting="all_settings['system']['app_radio']"
            name="Afficher l'app Radio"
            @setting-change="save_new_value('system', 'app_radio', $refs.system_app_radio.settingValue)" />
          <SettingComponent
            ref="system_app_mp3"
            :setting_value="settingsData['system']['app_mp3']"
            :setting="all_settings['system']['app_mp3']"
            name="Afficher l'app MP3"
            @setting-change="save_new_value('system', 'app_mp3', $refs.system_app_mp3.settingValue)" />
          <SetingComponent
            ref="system_app_wikipedia"
            :setting_value="settingsData['system']['app_wikipedia']"
            :setting="all_settings['system']['app_wikipedia']"
            name="Afficher l'app Wikipedia"
            @setting-change="save_new_value('system', 'app_wikipedia', $refs.system_app_wikipedia.settingValue)" />
          <SettingComponent
            ref="system_app_timer"
            :setting_value="settingsData['system']['app_timer']"
            :setting="all_settings['system']['app_timer']"
            name="Afficher l'app Chronomètre"
            @setting-change="save_new_value('system', 'app_timer', $refs.system_app_timer.settingValue)" />
          <SettingComponent
            ref="system_app_translator"
            :setting_value="settingsData['system']['app_translator']"
            :setting="all_settings['system']['app_translator']"
            name="Afficher l'app Traducteur"
            @setting-change="save_new_value('system', 'app_translator', $refs.system_app_translator.settingValue)" />
          <SettingComponent
            ref="system_app_write_word"
            :setting_value="settingsData['system']['app_write_word']"
            :setting="all_settings['system']['app_write_word']"
            name="Afficher l'app Ecrire mot"
            @setting-change="save_new_value('system', 'app_write_word', $refs.system_app_write_word.settingValue)" />
          <SettingComponent
            ref="system_app_operation"
            :setting_value="settingsData['system']['app_operation']"
            :setting="all_settings['system']['app_operation']"
            name="Afficher l'app Opération"
            @setting-change="save_new_value('system', 'app_operation', $refs.system_app_operation.settingValue)" />
          <SettingComponent
            ref="system_app_mines"
            :setting_value="settingsData['system']['app_mines']"
            :setting="all_settings['system']['app_mines']"
            name="Afficher l'app Démineur"
            @setting-change="save_new_value('system', 'app_mines', $refs.system_app_mines.settingValue)" />
          <SettingComponent
            ref="system_app_mastermind"
            :setting_value="settingsData['system']['app_mastermind']"
            :setting="all_settings['system']['app_mastermind']"
            name="Afficher l'app Mastermind"
            @setting-change="save_new_value('system', 'app_mastermind', $refs.system_app_mastermind.settingValue)" />
          <SettingComponent
            ref="system_developer"
            :setting_value="settingsData['system']['developer']"
            :setting="all_settings['system']['developer']"
            name="Mode développeur"
            @setting-change="save_new_value('system', 'developer', $refs.system_developer.settingValue)" />
        </div>
      </div>
      <div id="explorer">
        <h2>Explorateur</h2>
        <button @click="togle_menu('explorer')">{{ display_menu['explorer'] ? 'Réduir' : 'Développer'}} la section</button>
        <div v-if="display_menu['explorer']" class="setting">
          <SettingComponent
            ref="explorer_empty_trash_shutdown"
            :setting_value="settingsData['explorer']['empty_trash_shutdown']"
            :setting="all_settings['explorer']['empty_trash_shutdown']"
            name="Vider la corbeille à l'extinction"
            @setting-change="save_new_value('explorer', 'empty_trash_shutdown', $refs.explorer_empty_trash_shutdown.settingValue)" />
          <SettingComponent
            ref="explorer_empty_bluetooth_shutdown"
            :setting_value="settingsData['explorer']['empty_bluetooth_shutdown']"
            :setting="all_settings['explorer']['empty_bluetooth_shutdown']"
            name="Vider le dossier bluetooth à l'extinction"
            @setting-change="save_new_value('explorer', 'empty_bluetooth_shutdown', $refs.explorer_empty_bluetooth_shutdown.settingValue)" />
        </div>
      </div>
    </div>
    <hr>
    <button @click="save">Sauvegarder (non fonctionnel pour le moment)</button>
  </div>
</template>

<style scoped></style>
