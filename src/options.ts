export interface WebExtSignOptions {
  id?: string;
  verbose?: boolean;
  artifactsDir: string;
  ignoreFiles?: string[];
  apiKey: string;
  apiSecret: string;
  apiUrlPrefix: string;
  apiProxy: string;
  timeout: number;
}

export interface WebExtRunOptions {
  artifactsDir?: string;
  firefox?: string;
  firefoxProfile?: string;
  keepProfileChanges?: boolean;
  preInstall?: boolean;
  browserConsole?: boolean;
  customPrefs?: any;
  startUrl?: string | string[];
  ignoreFiles?: string[];
}

export interface WebExtBuildOptions {
  artifactsDir: string;
  asNeeded?: boolean;
  overwriteDest?: boolean;
  ignoreFiles?: string[];
}

export interface WebExtLintOptions {
  verbose?: boolean;
  selfHosted?: boolean;
  boring?: boolean;
  metadata?: boolean;
  pretty?: boolean;
  warningsAsErrors?: boolean;
  ignoreFiles?: string[];
  artifactsDir?: string;
}

export interface WebExtWebpackPluginOptions {
  build: WebExtBuildOptions;
  run: WebExtRunOptions;
  lint?: WebExtLintOptions;
  sign?: WebExtSignOptions;
}
