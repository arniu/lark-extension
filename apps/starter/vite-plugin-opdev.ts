import { existsSync, readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

import type { Plugin } from "vite";
import { loadEnv } from "vite";

const BLOCK_NAME = "index";

function getAppConfig(mode: string, cwd: string) {
  const env = loadEnv(mode, cwd, "");
  const appJsonPath = resolve(cwd, "app.json");
  const defaults = existsSync(appJsonPath) ? JSON.parse(readFileSync(appJsonPath, "utf-8")) : {};

  return {
    appID: env.APP_ID ?? defaults.appID,
    blockTypeID: env.BLOCK_TYPE_ID ?? defaults.blockTypeID,
    projectName: env.PROJECT_NAME ?? defaults.projectName,
    contributes: defaults.contributes,
  };
}

export function opdevPlugin(mode: string): Plugin {
  return {
    name: "opdev",
    closeBundle() {
      const cwd = process.cwd();
      const distDir = resolve(cwd, "dist");
      const appJsonPath = resolve(cwd, "app.json");
      if (!existsSync(appJsonPath)) return;

      const app = getAppConfig(mode, cwd);
      const projectConfig = {
        appid: app.appID ?? "",
        projectname: app.projectName ?? "",
        blocks: [BLOCK_NAME],
      };

      const blockConfig = {
        blockTypeID: app.blockTypeID ?? "",
        blockRenderType: "offlineWeb",
        offlineWebConfig: app.contributes ? { contributes: app.contributes } : undefined,
      };

      writeFileSync(
        resolve(distDir, "project.config.json"),
        JSON.stringify(projectConfig, null, 2),
      );

      writeFileSync(resolve(distDir, `${BLOCK_NAME}.json`), JSON.stringify(blockConfig, null, 2));
    },
  };
}
