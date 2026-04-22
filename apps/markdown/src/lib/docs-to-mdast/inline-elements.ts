import type {
  BlockData,
  Button,
  Equation,
  File,
  MentionDoc,
  MentionUser,
  Reminder,
  TextBlockData,
  TextRun,
  URLPreview,
} from "@lark-opdev/block-docs-addon-api";
import type { PhrasingContent } from "mdast";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** 策略：将 Lark 内联元素映射为 MDAST PhrasingContent */
export type TextElement = NonNullable<TextBlockData["text"]>["elements"][number];
export type TextElementHandler = (el: TextElement) => PhrasingContent | null;

export function isTextBlockData(data: BlockData): data is TextBlockData {
  const { text } = data as TextBlockData;
  return text != null && Array.isArray(text.elements);
}

function handleTextRun(el: TextRun): PhrasingContent {
  const { content, style } = el.text_run;
  if (style?.inline_code) {
    return { type: "inlineCode", value: content };
  }

  // 文本颜色/背景色：输出为 HTML span（v0.2.0）
  const textColor = style?.text_color;
  const bgColor = style?.background_color;
  if (textColor ?? bgColor) {
    const parts: string[] = [];
    if (textColor) parts.push(`color:${textColor}`);
    if (bgColor) parts.push(`background-color:${bgColor}`);
    return {
      type: "html",
      value: `<span style="${parts.join(";")}">${escapeHtml(content)}</span>`,
    };
  }

  let node: PhrasingContent = { type: "text", value: content };
  if (style?.italic) node = { type: "emphasis", children: [node] };
  if (style?.bold) node = { type: "strong", children: [node] };
  if (style?.link) node = { type: "link", url: style.link, children: [node] };
  if (style?.strikethrough) node = { type: "delete", children: [node] };
  return node;
}

function handleMentionUser(el: MentionUser): PhrasingContent {
  return { type: "text", value: "@" + el.mention_user.user_name };
}

function handleMentionDoc(el: MentionDoc): PhrasingContent {
  const doc = el.mention_doc;
  return {
    type: "link",
    url: doc.url || "#",
    children: [{ type: "text", value: doc.title }],
  };
}

function handleUrlPreview(el: URLPreview): PhrasingContent {
  const url = el.url_preview;
  return {
    type: "link",
    url: url.raw_url,
    children: [{ type: "text", value: url.title || url.raw_url }],
  };
}

function handleEquation(el: Equation): PhrasingContent {
  return { type: "inlineMath", value: el.equation.content.trim() };
}

function handleFile(el: File): PhrasingContent {
  return { type: "text", value: `[${el.file.name}]` };
}

function handleButton(el: Button): PhrasingContent {
  return { type: "text", value: el.button.text };
}

function handleReminder(el: Reminder): PhrasingContent {
  const r = el.reminder;
  const parts: string[] = [];
  if (r.expire_time) parts.push(`过期: ${r.expire_time}`);
  if (r.is_whole_day) parts.push("全天");
  if (r.should_notify && r.notify_time) parts.push(`提醒: ${r.notify_time}`);
  const content = parts.length > 0 ? parts.join(", ") : "提醒";
  return { type: "text", value: `<!-- ${content} -->` };
}

const elementHandlers: Record<string, TextElementHandler> = {
  text_run: (el) => handleTextRun(el as TextRun),
  mention_user: (el) => handleMentionUser(el as MentionUser),
  mention_doc: (el) => handleMentionDoc(el as MentionDoc),
  url_preview: (el) => handleUrlPreview(el as URLPreview),
  equation: (el) => handleEquation(el as Equation),
  file: (el) => handleFile(el as File),
  reminder: (el) => handleReminder(el as Reminder),
  button: (el) => handleButton(el as Button),
  inline_block: () => null, // 跳过
};

function mergeAdjacentDeletes(phrasing: PhrasingContent[]): PhrasingContent[] {
  const result: PhrasingContent[] = [];
  let i = 0;
  while (i < phrasing.length) {
    const node = phrasing[i];
    if (node.type === "delete") {
      const merged: PhrasingContent[] = [...(node as { children: PhrasingContent[] }).children];
      i++;
      while (i < phrasing.length && phrasing[i].type === "delete") {
        merged.push(...(phrasing[i] as { children: PhrasingContent[] }).children);
        i++;
      }
      result.push({ type: "delete", children: merged });
    } else {
      result.push(node);
      i++;
    }
  }
  return result;
}

function elementsToPhrasing(elements: TextElement[]): PhrasingContent[] {
  const result: PhrasingContent[] = [];
  for (const el of elements) {
    const key = Object.keys(el)[0] as string;
    const handler = elementHandlers[key];
    if (handler) {
      const node = handler(el);
      if (node) result.push(node);
    }
  }
  return mergeAdjacentDeletes(result);
}

/**
 * 从块 data 解析出 MDAST phrasing 内容（用于标题、正文、列表项、表格单元格等）。
 */
export function getPhrasingContent(data: BlockData): PhrasingContent[] {
  if (isTextBlockData(data)) {
    if (data.text.elements.length > 0) {
      return elementsToPhrasing(data.text.elements);
    }
    return [{ type: "text", value: data.plain_text }];
  }
  return [];
}
