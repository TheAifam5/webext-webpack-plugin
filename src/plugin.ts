import webext from 'web-ext';
import {
  Compilation,
  Compiler,
  WebpackError,
  WebpackPluginInstance,
} from 'webpack';
import { WebExtWebpackPluginOptions } from './options';

const PLUGIN_NAME = 'WebExtWebpackPlugin';

export class WebExtWebpackPlugin implements WebpackPluginInstance {
  private options: WebExtWebpackPluginOptions;
  private extensionRunner: any;
  private watchEnabled: boolean;

  public constructor(options?: WebExtWebpackPluginOptions) {
    this.options = options || {};
    this.extensionRunner = null;
    this.watchEnabled = false;
  }

  public apply(compiler: Compiler): void {
    compiler.hooks.watchRun.tap(PLUGIN_NAME, this.onWatchRun.bind(this));
    compiler.hooks.watchClose.tap(PLUGIN_NAME, this.onWatchClose.bind(this));
    compiler.hooks.afterEmit.tapAsync(
      PLUGIN_NAME,
      this.onAfterEmitAsync.bind(this),
    );
  }

  private onWatchRun() {
    this.watchEnabled = true;
  }

  private onWatchClose() {
    this.extensionRunner.exit();
  }

  private async onAfterEmitAsync(
    compilation: Compilation,
    callback: () => void,
  ) {
    const outputPath = compilation.outputOptions.path;

    if (await this.lintAsync(compilation, outputPath)) {
      callback();
      return;
    }

    if (this.watchEnabled) await this.runAsync(outputPath);
    else await this.buildAsync(outputPath);

    if (compilation.compiler.options.mode === 'production' && this.options.sign)
      await this.signAsync(outputPath);

    callback();
  }

  private parseLinter(linterMessages: any[]) {
    const messages: { [code: string]: string[] } = {};
    for (const message of linterMessages) {
      if (!messages[message.code]) messages[message.code] = [];

      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      messages[message.code].push(`[${message.code}]: ${message.message}`);
    }
    return messages;
  }

  private async buildAsync(outputPath: string) {
    await webext.cmd.build(
      {
        sourceDir: outputPath,
        overwriteDest: true,
        ...this.options.build,
      },
      {
        showReadyMessage: false,
        shouldExitProgram: false,
      },
    );
  }

  private async lintAsync(
    compilation: Compilation,
    outputPath: string,
  ): Promise<boolean> {
    const linter = await webext.cmd.lint(
      {
        sourceDir: outputPath,
        output: 'none',
        ...this.options.lint,
      },
      { shouldExitProgram: false },
    );
    const errors: { [code: string]: string[] } = this.parseLinter(
      linter.errors,
    );
    const warnings: { [code: string]: string[] } = {
      ...this.parseLinter(linter.warnings),
      ...this.parseLinter(linter.notices),
    };

    for (const [key, value] of Object.entries(errors)) {
      let errorMessage: string = value.join('\n\t');

      if (key === 'JSON_INVALID')
        errorMessage = `manifest.json\n\t${errorMessage}`;

      compilation.errors.push(new WebpackError(errorMessage));
    }

    for (const [key, value] of Object.entries(warnings)) {
      let errorMessage: string = value.join('\n\t');

      if (key === 'JSON_INVALID')
        errorMessage = `manifest.json\n\t${errorMessage}`;

      compilation.warnings.push(new WebpackError(errorMessage));
    }

    return linter.errors.count === 0;
  }

  private async runAsync(outputPath: string) {
    if (this.extensionRunner) {
      await this.extensionRunner.reloadExtensionBySourceDir(outputPath);
      return;
    }

    this.extensionRunner = await webext.cmd.run(
      {
        sourceDir: outputPath,
        browserConsole: true,
        ...this.options.run,
        noInput: true,
        noReload: true,
      },
      {
        shouldExitProgram: false,
        reloadStrategy: null,
      },
    );
    console.log(
      `Automatic extension reloading are handled now by ${PLUGIN_NAME} plugin.`,
    );
  }

  private async signAsync(outputPath: string): Promise<boolean> {
    const signResult = await webext.cmd.sign(
      {
        sourceDir: outputPath,
        ...this.options.sign,
      },
      {
        showReadyMessage: false,
        shouldExitProgram: false,
      },
    );

    return signResult.success as boolean;
  }
}
