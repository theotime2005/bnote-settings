const all_settings = {
  system: {
    "braille_type": {
      type: "menu",
      values: ["dot_8", "grade1", "grade2"],
      default: "dot_8",
    },
    "auto_sync_date": {
      type: "checkbox",
      default: false,
    },
    "space_in_label": {
      type: "checkbox",
      default: false,
    },
    "shortcuts_visible": {
      type: "checkbox",
      default: false,
    },
    "app_explorer": {
      type: "menu",
      values: ["invisible", "main_apps_menu", "more_apps_menu"],
      default: "main_apps_menu",
    },
    "app_settings": {
      type: "menu",
      values: ["invisible", "main_apps_menu", "more_apps_menu"],
      default: "main_apps_menu",
    },
    "app_agenda": {
      type: "menu",
      values: ["invisible", "main_apps_menu", "more_apps_menu"],
      default: "invisible",
    },
    "app_radio": {
      type: "menu",
      values: ["invisible", "main_apps_menu", "more_apps_menu"],
      default: "invisible",
    },
    "app_mp3": {
      type: "menu",
      values: ["invisible", "main_apps_menu", "more_apps_menu"],
      default: "invisible",
    },
    "app_timer": {
      type: "menu",
      values: ["invisible", "main_apps_menu", "more_apps_menu"],
      default: "invisible",
    },
    "app_translator": {
      type: "menu",
      values: ["invisible", "main_apps_menu", "more_apps_menu"],
      default: "invisible",
    },
    "app_wikipedia": {
      type: "menu",
      values: ["invisible", "main_apps_menu", "more_apps_menu"],
      default: "invisible",
    },
    "app_write_word": {
      type: "menu",
      values: ["invisible", "main_apps_menu", "more_apps_menu"],
      default: "invisible",
    },
    "app_operation": {
      type: "menu",
      values: ["invisible", "main_apps_menu", "more_apps_menu"],
      default: "invisible",
    },
    "app_mines": {
      type: "menu",
      values: ["invisible", "main_apps_menu", "more_apps_menu"],
      default: "invisible",
    },
    "app_mastermind": {
      type: "menu",
      values: ["invisible", "main_apps_menu", "more_apps_menu"],
      default: "invisible",
    },
    "developer": {
      type: "checkbox",
      default: false,
    },
  },
  explorer: {
    "empty_bluetooth_shutdown": {
      type: "checkbox",
      default: false,
    },
    "empty_trash_shutdown": {
      type: "checkbox",
      default: false,
    },
    "number_recent_files": {
      type: "number",
      min: 1,
      max: 30,
      default: 10,
    },
  },
  editor: {
    "braille_type": {
      type: "menu",
      values: ["dot_8", "grade1", "grade2"],
      default: "dot_8",
    },
    "line_length": {
      type: "number",
      min: 1,
      max: 160,
      default: 80,
    },
    "dot78_visible": {
      type: "checkbox",
      default: true,
    },
    "cursor_visible": {
      type: "checkbox",
      default: true,
    },
    "forward_display_mode": {
      type: "menu",
      values: ["normal", "significative"],
    },
    "autoscroll": {
      type: "number",
      min: 2,
      max: 120,
      default: 5,
    },
  },
  math: {
    "angle": {
      type: "menu",
      values: ["degree", "radian"],
      default: "radian",
    },
    "fraction": {
      type: "checkbox",
      default: true,
    },
    "precision": {
      type: "number",
      min: 0,
      max: 8,
      default: 2,
    },
    "format": {
      type: "menu",
      values: ["scientific", "normal"],
      default: "scientific",
    },
  },
  "music_xml": {
    "edit_mode": {
      type: "menu",
      values: ["expert", "read", "edit", "listen"],
      default: "read",
    },
    "braille_type": {
      type: "menu",
      values: ["dot_8", "grade1"],
      default: "dot_8",
    },
    "notes_dots": {
      type: "menu",
      values: ["8_dots", "6_dots", "6_dots_with_group"],
      default: "6_dots_with_group",
    },
    "ascending_chords": {
      type: "checkbox",
      default: true,
    },
    "fingering": {
      type: "checkbox",
      default: true,
    },
    "clef": {
      type: "checkbox",
      default: true,
    },
    "parts": {
      type: "menu",
      values: ["name", "abbreviation"],
      default: "name",
    },
    "measure_b123": {
      type: "checkbox",
      default: false,
    },
    "measure_number": {
      type: "checkbox",
      default: false,
    },
    "measure_every": {
      type: "number",
      min: 1,
      max: 100,
      default: 1,
    },
    "view": {
      type: "menu",
      values: ["by_section", "by_part"],
      default: "by_section",
    },
    "section": {
      type: "menu",
      values: ["total_part", "system", "number"],
      default: "total_part",
    },
    "measures_per_section": {
      type: "number",
      min: 1,
      max: 100,
      default: 8,
    },
    "words": {
      type: "checkbox",
      default: true,
    },
    "credit_words": {
      type: "checkbox",
      default: true,
    },
    "lyrics": {
      type: "menu",
      values: ["no", "after_each_note", "before_each_section", "after_each_section"],
      default: "no",
    },
  },
  "music_bxml": {
    "edit_mode": {
      type: "menu",
      values: ["expert", "read", "edit", "listen"],
      default: "read",
    },
    "braille_type": {
      type: "menu",
      values: ["dot_8", "grade1"],
      default: "dot_8",
    },
    "notes_dots": {
      type: "menu",
      values: ["8_dots", "6_dots", "6_dots_with_group"],
      default: "6_dots_with_group",
    },
    "ascending_chords": {
      type: "checkbox",
      default: true,
    },
    "fingering": {
      type: "checkbox",
      default: true,
    },
    "clef": {
      type: "checkbox",
      default: true,
    },
    "parts": {
      type: "menu",
      values: ["name", "abbreviation"],
      default: "name",
    },
    "measure_b123": {
      type: "checkbox",
      default: false,
    },
    "measure_number": {
      type: "checkbox",
      default: false,
    },
    "measure_every": {
      type: "number",
      min: 1,
      max: 100,
      default: 1,
    },
    "view": {
      type: "menu",
      values: ["by_section", "by_part"],
      default: "by_section",
    },
    "section": {
      type: "menu",
      values: ["total_part", "system", "number"],
      default: "total_part",
    },
    "measures_per_section": {
      type: "number",
      min: 1,
      max: 100,
      default: 8,
    },
    "words": {
      type: "checkbox",
      default: true,
    },
    "credit_words": {
      type: "checkbox",
      default: true,
    },
    "lyrics": {
      type: "menu",
      values: ["no", "after_each_note", "before_each_section", "after_each_section"],
      default: "no",
    },
    "karaoke": {
      type: "checkbox",
      default: true,
    },
  },
};

const settings_value = {
  "dot_8": "Braille informatique (8 points)",
  "grade1": "Braille intégral (6 points",
  "grade2": "Braille abrégé (6 points)",
  "main_apps_menu": "Menu principal",
  "more_apps_menu": "Sous menu plus d'apps",
  "invisible": "Invisible",
  "normal": "Normal",
  "significative": "Significative",
  "degree": "Degré",
  "radian": "Radian",
  "scientific": "Scientifique",
  "expert": "Expert",
  "read": "Lecture",
  "edit": "Édition",
  "listen": "Écoute",
  "8_dots": "8 points",
  "6_dots": "6 points",
  "6_dots_with_group": "6 points avec groupes",
  "name": "Nom",
  "abbreviation": "Abréviation",
  "by_section": "Par section",
  "by_part": "Par partie",
  "total_part": "Partie complète",
  "system": "Système",
  "number": "Numéro",
  "no": "Non",
  "after_each_note": "Après chaque note",
  "before_each_section": "Avant chaque section",
  "after_each_section": "Après chaque section",
};

module.exports={ all_settings, settings_value };
