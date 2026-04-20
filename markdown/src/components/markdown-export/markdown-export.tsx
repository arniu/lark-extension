import type { Accessor } from "solid-js";
import { Show } from "solid-js";

import { createMarkdownExport } from "../../lib/markdown-export";
import type { ButtonVariant } from "../ui/button";
import { Button } from "../ui/button";

import styles from "./markdown-export.module.css";

function ExportActionButton(props: {
  variant: ButtonVariant;
  idleLabel: string;
  busyLabel: string;
  busy: Accessor<boolean>;
  onAction: () => Promise<boolean>;
}) {
  return (
    <Button variant={props.variant} disabled={props.busy()} onclick={() => void props.onAction()}>
      <Show when={!props.busy()} fallback={props.busyLabel}>
        {props.idleLabel}
      </Show>
    </Button>
  );
}

export function MarkdownExport() {
  const markdownExport = createMarkdownExport();

  return (
    <div class={styles.root}>
      <h3 class={styles.title}>导出为 Markdown</h3>
      <div class={styles.actions}>
        <ExportActionButton
          variant="default"
          idleLabel="复制到剪贴板"
          busyLabel="处理中…"
          busy={markdownExport.loading}
          onAction={markdownExport.copyToClipboard}
        />
        <ExportActionButton
          variant="primary"
          idleLabel="下载 .md 文件"
          busyLabel="处理中…"
          busy={markdownExport.loading}
          onAction={markdownExport.download}
        />
      </div>
    </div>
  );
}
