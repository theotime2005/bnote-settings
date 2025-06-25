import { DefineLocaleMessage, DefineDateTimeFormat, DefineNumberFormat } from 'vue-i18n';

declare module 'vue-i18n' {
  export interface DefineLocaleMessage {
    about: {
      bug_report: string;
      contribution: string;
      feature: string;
      'feature-bug': string;
      github: string;
      message1: string;
      message2: string;
      message3: string;
      title: string;
    };
    download: {
      downloadEurobraille: string;
      downloadOtherLast: string;
      eurobrailleTitle: string;
      'message-1': string;
      'message-3-1': string;
      'message-3-2': string;
      message2: string;
      message3: string;
      otherTitle: string;
      releases: string;
      title: string;
    };
    faq: {
      nofaq: string;
      presentation: string;
      title: string;
    };
    footer: {
      code: string;
      label: string;
      message1: string;
      message2: string;
      version: string;
    };
    header: {
      accessibilityOptions: string;
      blueYellow: string;
      close: string;
      colorScheme: string;
      contrast: string;
      darkMode: string;
      defaultColors: string;
      highContrast: string;
      large: string;
      mainMenu: string;
      menuClosed: string;
      menuOpened: string;
      normal: string;
      normalContrast: string;
      open: string;
      small: string;
      textSize: string;
    };
    home: {
      'goto-settings': string;
      'message-1': string;
      message2: string;
      title: string;
      title2: string;
    };
    languages: {
      en: string;
      es: string;
      fr: string;
      it: string;
      select: string;
    };
    settings: {
      id: Record<string, string>;
      page: {
        create: string;
        defaultName: string;
        download: string;
        downloadName: string;
        explication: string;
        how: string;
        message: string;
        'navigation-section': string;
        'no-result': string;
        openOther: string;
        question: string;
        resetQuestion: string;
        search: string;
        title: string;
        title2: string;
      };
      values: Record<string, string>;
    };
    'skip-content': string;
    title: string;
    uploadFile: {
      incorrectFormatFile: string;
      select: string;
      show: string;
      title: string;
    };
  }

  export interface DefineDateTimeFormat {}

  export interface DefineNumberFormat {}
}