const all_settings = {
  system: {
    "braille_type": {
      id: "braille_type",
      type: "menu",
      values: ["dot-8", "grade1", "grade2"],
      default: "dot-8",
    },
    "auto_sync_date": {
      id: "auto_sync_date",
      type: "checkbox",
      default: false,
    },
    "spaces_in_label": {
      id: "spaces_in_label",
      type: "checkbox",
      default: false,
    },
    "shortcuts_visible": {
      id: "shortcuts_visible",
      type: "checkbox",
      default: false,
    },
    "app_explorer": {
      id: "app_explorer",
      type: "menu",
      values: ["invisible", "main_apps_menu", "more_apps_menu"],
      default: "main_apps_menu",
    },
    "app_settings": {
      id: "app_settings",
      type: "menu",
      values: ["main_apps_menu", "more_apps_menu"],
      default: "main_apps_menu",
    },
    "app_agenda": {
      id: "app_agenda",
      type: "menu",
      values: ["invisible", "main_apps_menu", "more_apps_menu"],
      default: "invisible",
    },
    "app_radio": {
      id: "app_radio",
      type: "menu",
      values: ["invisible", "main_apps_menu", "more_apps_menu"],
      default: "invisible",
    },
    "app_mp3": {
      id: "app_mp3",
      type: "menu",
      values: ["invisible", "main_apps_menu", "more_apps_menu"],
      default: "invisible",
    },
    "app_timer": {
      id: "app_timer",
      type: "menu",
      values: ["invisible", "main_apps_menu", "more_apps_menu"],
      default: "invisible",
    },
    "app_translator": {
      id: "app_translator",
      type: "menu",
      values: ["invisible", "main_apps_menu", "more_apps_menu"],
      default: "invisible",
    },
    "app_wikipedia": {
      id: "app_wikipedia",

      type: "menu",
      values: ["invisible", "main_apps_menu", "more_apps_menu"],
      default: "invisible",
    },
    "app_write_word": {
      id: "app_write_word",
      type: "menu",
      values: ["invisible", "main_apps_menu", "more_apps_menu"],
      default: "invisible",
    },
    "app_operation": {
      id: "app_operation",
      type: "menu",
      values: ["invisible", "main_apps_menu", "more_apps_menu"],
      default: "invisible",
    },
    "app_mines": {
      id: "app_mines",
      type: "menu",
      values: ["invisible", "main_apps_menu", "more_apps_menu"],
      default: "invisible",
    },
    "app_mastermind": {
      id: "app_mastermind",
      type: "menu",
      values: ["invisible", "main_apps_menu", "more_apps_menu"],
      default: "invisible",
    },
    "developer": {
      id: "developer",
      type: "checkbox",
      default: false,
    },
  },
  bluetooth: {
    bnote_visible: {
      id: "bnote_visible",
      type: "checkbox",
      default: true,
    },
    bnote_name: {
      id: "bnote_name",
      type: "text",
      default: "",
    },
    bt_simul_esys: {
      id: "bt_simul_esys",
      type: "checkbox",
      default: false,
    },
  },
  explorer: {
    "empty_bluetooth_shutdown": {
      id: "empty_bluetooth_shutdown",
      type: "checkbox",
      default: false,
    },
    "empty_trash_shutdown": {
      id: "empty_trash_shutdown",
      type: "checkbox",
      default: false,
    },
    "number_recent_files": {
      id: "number_recent_files",
      type: "number",
      min: 1,
      max: 30,
      default: 10,
    },
  },
  editor: {
    "braille_type": {
      id: "braille_type",
      type: "menu",
      values: ["dot-8", "grade1", "grade2"],
      default: "dot-8",
    },
    "line_length": {
      id: "line_length",
      type: "number",
      min: 1,
      max: 160,
      default: 80,
    },
    "dot78_visible": {
      id: "dot78_visible",
      type: "checkbox",
      default: true,
    },
    "cursor_visible": {
      id: "cursor_visible",
      type: "checkbox",
      default: true,
    },
    "forward_display_mode": {
      id: "forward_display_mode",
      type: "menu",
      values: ["normal", "significative"],
      default: "normal",
    },
    "autoscroll": {
      id: "autoscroll",
      type: "number",
      min: 2,
      max: 120,
      default: 5,
    },
  },
  math: {
    "angle": {
      id: "angle",
      type: "menu",
      values: ["degree", "radian"],
      default: "radian",
    },
    "fraction": {
      id: "fraction",
      type: "checkbox",
      default: true,
    },
    "precision": {
      id: "precision",
      type: "number",
      min: 0,
      max: 8,
      default: 2,
    },
    "format": {
      id: "format",
      type: "menu",
      values: ["scientific", "normal"],
      default: "scientific",
    },
  },
  "music_xml": {
    "edit_mode": {
      id: "edit_mode",
      type: "menu",
      values: ["expert", "read", "edit", "listen"],
      default: "read",
    },
    "braille_type": {
      id: "braille_type",
      type: "menu",
      values: ["dot-8", "grade1"],
      default: "dot-8",
    },
    "notes_dots": {
      id: "notes_dots",
      type: "menu",
      values: ["8_dots", "6_dots", "6_dots_with_group"],
      default: "6_dots_with_group",
    },
    "ascending_chords": {
      id: "ascending_chords",

      type: "checkbox",
      default: true,
    },
    "fingering": {
      id: "fingering",
      type: "checkbox",
      default: true,
    },
    "clef": {
      id: "clef",
      type: "checkbox",
      default: true,
    },
    "parts": {
      id: "parts",
      type: "menu",
      values: ["name", "abbreviation"],
      default: "name",
    },
    "measure_b123": {
      id: "measure_b123",
      type: "checkbox",
      default: false,
    },
    "measure_number": {
      id: "measure_number",
      type: "checkbox",
      default: false,
    },
    "measure_every": {
      id: "measure_every",
      type: "number",
      min: 1,
      max: 100,
      default: 1,
    },
    "view": {
      id: "view",
      type: "menu",
      values: ["by_section", "by_part"],
      default: "by_section",
    },
    "section": {
      id: "section",
      type: "menu",
      values: ["total_part", "system", "number"],
      default: "total_part",
    },
    "measures_per_section": {
      id: "measures_per_section",
      type: "number",
      min: 1,
      max: 100,
      default: 8,
    },
    "words": {
      id: "words",
      type: "checkbox",
      default: true,
    },
    "credit_words": {
      id: "credit_words",
      type: "checkbox",
      default: true,
    },
    "lyrics": {
      id: "lyrics",
      type: "menu",
      values: ["no", "after_each_note", "before_each_section", "after_each_section"],
      default: "no",
    },
  },
  "music_bxml": {
    "edit_mode": {
      id: "edit_mode",
      type: "menu",
      values: ["expert", "read", "edit", "listen"],
      default: "read",
    },
    "braille_type": {
      id: "braille_type",
      type: "menu",
      values: ["dot-8", "grade1"],
      default: "dot-8",
    },
    "notes_dots": {
      id: "notes_dots",
      type: "menu",
      values: ["8_dots", "6_dots", "6_dots_with_group"],
      default: "6_dots_with_group",
    },
    "ascending_chords": {
      id: "ascending_chords",
      type: "checkbox",
      default: true,
    },
    "fingering": {
      id: "fingering",
      type: "checkbox",
      default: true,
    },
    "clef": {
      id: "clef",
      type: "checkbox",
      default: true,
    },
    "parts": {
      id: "parts",
      type: "menu",
      values: ["name", "abbreviation"],
      default: "name",
    },
    "measure_b123": {
      id: "measure_b123",
      type: "checkbox",
      default: false,
    },
    "measure_number": {
      id: "measure_number",
      type: "checkbox",
      default: false,
    },
    "measure_every": {
      id: "measure_every",
      type: "number",
      min: 1,
      max: 100,
      default: 1,
    },
    "view": {
      id: "view",
      type: "menu",
      values: ["by_section", "by_part"],
      default: "by_section",
    },
    "section": {
      id: "section",
      type: "menu",
      values: ["total_part", "system", "number"],
      default: "total_part",
    },
    "measures_per_section": {
      id: "measures_per_section",
      type: "number",
      min: 1,
      max: 100,
      default: 8,
    },
    "words": {
      id: "words",
      type: "checkbox",
      default: true,
    },
    "credit_words": {
      id: "credit_words",
      type: "checkbox",
      default: true,
    },
    "lyrics": {
      id: "lyrics",
      type: "menu",
      values: ["no", "after_each_note", "before_each_section", "after_each_section"],
      default: "no",
    },
    "karaoke": {
      id: "karaoke",
      type: "checkbox",
      default: true,
    },
  },
  speech: {
    volume_headphone: {
      id: "volume_headphone",
      type: "number",
      min: 0,
      max: 100,
      default: 50,
    },
    volume_hp: {
      id: "volume_hp",
      type: "number",
      min: 0,
      max: 100,
      default: 50,
    },
    speed: {
      id: "speed",
      type: "number",
      min: 40,
      max: 240,
      default :100,
    },
    synthesis: {
      id: "synthesis",
      type: "menu",
      values: ["picotts", "mbrola", "espeak", "cerence"],
      default: "cerence",
    },
  },
  radio: {
    volume_headphone: {
      id: "volume_headphone",
      type: "number",
      min: 0,
      max: 100,
      default: 50,
    },
    volume_hp: {
      id: "volume_hp",
      type: "number",
      min: 0,
      max: 100,
      default: 50,
    },
  },
  agenda: {
    default_presentation: {
      id: "default_presentation",
      type: "menu",
      values: ["standard", "not_done", "today", "calendar"],
      default: "standard",
    },
    remember: {
      id: "remember",
      type: "menu",
      values: ["no", "same", "tomorrow", "same_tomorrow"],
      default: "no",
    },
  },
  braille_learning: {
    use_vocal: {
      id: "use_vocal",
      type: "menu",
      values: ["auto", "ask", "no"],
      default: "auto",
    },
    keep_spaces: {
      id: "keep_spaces",
      type: "checkbox",
      default: false,
    },
    write_all: {
      id: "write_all",
      type: "checkbox",
      default: false,
    },
  },
};

export default all_settings;
