import type { BlockSnapshot } from "@lark-opdev/block-docs-addon-api";
import { gfmAutolinkLiteralToMarkdown } from "mdast-util-gfm-autolink-literal";
import { gfmStrikethroughToMarkdown } from "mdast-util-gfm-strikethrough";
import { gfmTableToMarkdown } from "mdast-util-gfm-table";
import { gfmTaskListItemToMarkdown } from "mdast-util-gfm-task-list-item";
import { mathToMarkdown } from "mdast-util-math";
import { toMarkdown } from "mdast-util-to-markdown";
import type { Accessor } from "solid-js";
import { createSignal } from "solid-js";

import { getBlockitApi, showToast } from "./blockit-api";
import { docsToMdast } from "./docs-to-mdast";

function sanitizeFilename(name: string): string {
  return name.replace(/[/\\?%*:|"<>]/g, "_").trim() || "未命名文档";
}

function snapshotToMarkdown(root: BlockSnapshot, docTitle?: string): string {
  const mdast = docsToMdast(root);
  if (docTitle) {
    const title = docTitle.replace(/^#+\s*/, "").trim();
    mdast.children.unshift({
      type: "heading",
      depth: 1,
      children: [{ type: "text", value: title }],
    });
  }

  return toMarkdown(mdast, {
    rule: "-",
    bullet: "-",
    emphasis: "_",
    fences: true,
    extensions: [
      gfmTableToMarkdown(),
      gfmTaskListItemToMarkdown(),
      gfmStrikethroughToMarkdown(),
      gfmAutolinkLiteralToMarkdown(),
      mathToMarkdown(),
    ],
  });
}

async function readActiveDocAsMarkdown() {
  const blockit = getBlockitApi();
  const docRef = await blockit.getActiveDocumentRef();
  const [root, title] = await Promise.all([
    blockit.Document.getRootBlock(docRef),
    blockit.Document.getTitle(docRef),
  ]);

  const markdown = snapshotToMarkdown(root, title);
  return { markdown, title } as const;
}

export interface MarkdownExport {
  readonly loading: Accessor<boolean>;
  copyToClipboard: () => Promise<boolean>;
  download: () => Promise<boolean>;
}

export function createMarkdownExport(): MarkdownExport {
  const [loading, setLoading] = createSignal(false);

  async function copyToClipboard(): Promise<boolean> {
    setLoading(true);
    try {
      const result = await readActiveDocAsMarkdown();
      await navigator.clipboard.writeText(result.markdown);
      showToast("success", "已复制到剪贴板");
      return true;
    } catch (e) {
      const msg = e instanceof Error ? e.message : "复制失败";
      showToast("error", msg);
      return false;
    } finally {
      setLoading(false);
    }
  }

  async function download(): Promise<boolean> {
    setLoading(true);
    try {
      const result = await readActiveDocAsMarkdown();
      const blob = new Blob([result.markdown], {
        type: "text/markdown;charset=utf-8",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = sanitizeFilename(result.title) + ".md";
      a.click();
      URL.revokeObjectURL(url);
      showToast("success", "下载成功");
      return true;
    } catch (e) {
      const msg = e instanceof Error ? e.message : "下载失败";
      showToast("error", msg);
      return false;
    } finally {
      setLoading(false);
    }
  }

  return { copyToClipboard, download, loading };
}
