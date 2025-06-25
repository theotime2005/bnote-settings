export interface Setting {
  type: 'menu' | 'checkbox' | 'text' | 'number';
  default: string | number | boolean;
  values?: string[];
  min?: number;
  max?: number;
  isTranslate?: boolean;
}

export interface SettingsSection {
  [key: string]: Setting;
}

export interface Settings {
  [section: string]: SettingsSection;
}

export interface FaqItem {
  question: string;
  answer: {
    a?: string;
    b?: string[];
    c?: string;
    [key: string]: string | string[] | undefined;
  };
}

export interface GitHubRelease {
  tag_name: string;
  prerelease: boolean;
  assets: Array<{
    browser_download_url: string;
  }>;
}

export interface AccessibilitySettings {
  textSize: 'small' | 'normal' | 'large';
  contrast: 'normal' | 'high';
  colorScheme: 'default' | 'dark' | 'blue-yellow';
}

export interface RouteItem {
  path: string;
  name: string;
  component: () => Promise<any>;
}

export interface LogMessage {
  fileName: string;
  functionName: string;
  type: 'info' | 'warning' | 'error';
  log: string | Error;
  environment?: boolean;
}