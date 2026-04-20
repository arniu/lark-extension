import type { BlockSnapshot, DocumentRef } from "@lark-opdev/block-docs-addon-api";
import { createSignal, onMount, onCleanup, type Accessor } from "solid-js";

import { getBlockitApi } from "../../lib/blockit-api";

import styles from "./word-count.module.css";

const THROTTLE_MS = 16;

function wordsInBlock(b: BlockSnapshot): number {
  const n = b.data?.plain_text?.length ?? 0;
  return b.childSnapshots.reduce((s, c) => s + wordsInBlock(c), n);
}

function createDocumentWordCount(): Accessor<number> {
  const [n, setN] = createSignal(0);

  onMount(() => {
    let dead = false;
    let stop: (() => void) | undefined;
    let gen = 0;

    const pull = async (ref: DocumentRef) => {
      const id = ++gen;
      const root = await getBlockitApi().Document.getRootBlock(ref);
      if (dead || id !== gen) return;
      setN(wordsInBlock(root));
    };

    async function startActiveDocumentWordCount() {
      const api = getBlockitApi();
      const ref = await api.getActiveDocumentRef();
      if (dead) return;

      let lastSelectionEvent = 0;
      function onSelectionChange() {
        if (Date.now() - lastSelectionEvent < THROTTLE_MS) return;
        lastSelectionEvent = Date.now();
        void pull(ref);
      }

      api.Selection.onSelectionChange(ref, onSelectionChange);
      stop = () => api.Selection.offSelectionChange(ref, onSelectionChange);
      await pull(ref);
    }

    void startActiveDocumentWordCount();

    onCleanup(() => {
      dead = true;
      stop?.();
    });
  });

  return n;
}

export function WordCount() {
  const wordCount = createDocumentWordCount();

  return (
    <div class={styles.root}>
      <h2>
        当前文档字数为：<span class={styles.count}>{wordCount()}</span> 个
      </h2>
    </div>
  );
}
