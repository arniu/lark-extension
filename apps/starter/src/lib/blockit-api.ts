import { BlockitClient } from "@lark-opdev/block-docs-addon-api";

let api: ReturnType<BlockitClient["initAPI"]> | null = null;

export function getBlockitApi() {
  if (!api) {
    api = new BlockitClient().initAPI();
  }

  return api;
}
