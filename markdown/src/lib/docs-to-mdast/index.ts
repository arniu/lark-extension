import {
  BlockType,
  type BlockSnapshot,
  type CodeBlockData,
  type ImageBlockData,
  type TableBlockData,
  type TodoBlockData,
} from "@lark-opdev/block-docs-addon-api";
import type {
  Blockquote,
  Code,
  Heading,
  Html,
  Image,
  List,
  ListItem,
  Paragraph,
  Root,
  RootContent,
  Table,
  TableCell,
  TableRow,
} from "mdast";

import { getPhrasingContent } from "./inline-elements";

// --- Constants ---

const SPREAD_FALSE = false as const;
const MAX_HEADING_DEPTH = 6;

// --- Handler mode ---

export type MdastContext = {
  blockToMdast: (block: BlockSnapshot) => RootContent | RootContent[];
};

export type BlockHandler = (block: BlockSnapshot, ctx: MdastContext) => RootContent | RootContent[];

/** 将块递归转换为 MDAST 节点并扁平化 */
function flattenBlocks(blocks: BlockSnapshot[], ctx: MdastContext): RootContent[] {
  return blocks.flatMap((block) => {
    const node = ctx.blockToMdast(block);
    return Array.isArray(node) ? node : [node];
  });
}

// --- Handlers ---

function safeStringify(obj: unknown): string {
  try {
    return JSON.stringify(obj, null, 2);
  } catch {
    return Object.prototype.toString.call(obj);
  }
}

const unsupportedHandler: BlockHandler = (block, _ctx) => {
  const childCount = block.childSnapshots?.length ?? 0;
  const dataJson = safeStringify(block.data ?? null);

  const content = [
    `<!-- Unsupported block -->`,
    `<!-- type: ${block.type} -->`,
    `<!-- id: ${block.id} -->`,
    `<!-- recordId: ${block.recordId} -->`,
    `<!-- children: ${childCount} -->`,
    `<!-- data:\n${dataJson}\n-->`,
    block.type,
  ].join("\n");

  return {
    type: "html",
    value: content,
  } satisfies Html;
};

const headingHandler: BlockHandler = (block, _ctx) => {
  const data = block.data ?? {};
  const ss = /heading(\d+)/.exec(block.type);
  const depth = ss ? parseInt(ss[1], 10) : 1;
  if (depth < 1 || depth > MAX_HEADING_DEPTH) {
    console.warn("Markdown only supports heading depths 1-6, got", depth);
  }

  return {
    type: "heading",
    depth: Math.min(depth, MAX_HEADING_DEPTH) as 1 | 2 | 3 | 4 | 5 | 6,
    children: getPhrasingContent(data),
  } satisfies Heading;
};

const textHandler: BlockHandler = (block, _ctx) => {
  const phrasing = getPhrasingContent(block.data ?? {});

  // 如果只有一个 inlineMath 节点，则直接返回 math 节点
  if (phrasing.length === 1 && phrasing[0].type === "inlineMath") {
    return { type: "math", value: phrasing[0].value, meta: null };
  }

  return {
    type: "paragraph",
    children: phrasing,
  } satisfies Paragraph;
};

const listHandler: BlockHandler = (block, ctx) => {
  const data = block.data ?? {};
  const children = block.childSnapshots ?? [];
  const isTodo = block.type === BlockType.TODO;
  const isOrdered = block.type === BlockType.ORDERED;
  const listItemChildren: ListItem["children"] = [
    { type: "paragraph", children: getPhrasingContent(data) },
  ];

  const nested = flattenBlocks(children, ctx);
  const nestedLists = nested.filter((n): n is List => n.type === "list");
  const otherBlocks = nested.filter((n) => n.type !== "list");
  if (nestedLists.length === 1) {
    listItemChildren.push(nestedLists[0]);
  } else if (nestedLists.length > 1) {
    const merged: ListItem[] = nestedLists.flatMap((l) => l.children);
    listItemChildren.push({
      type: "list",
      ordered: false,
      spread: SPREAD_FALSE,
      children: merged,
    });
  }
  listItemChildren.push(...(otherBlocks as ListItem["children"]));

  const listItem: ListItem = {
    type: "listItem",
    spread: SPREAD_FALSE,
    children: listItemChildren,
    ...(isTodo && {
      checked: (data as TodoBlockData)?.done ?? false,
    }),
  };

  return {
    type: "list",
    ordered: isOrdered,
    spread: SPREAD_FALSE,
    children: [listItem],
  };
};

const codeHandler: BlockHandler = (block, _ctx) => {
  const data = block.data as CodeBlockData;
  return {
    type: "code",
    lang: data?.language,
    // meta: data?.meta,
    value: data.plain_text,
  } satisfies Code;
};

const quoteContainerHandler: BlockHandler = (block, ctx) => {
  const childNodes = flattenBlocks(block.childSnapshots ?? [], ctx);
  return { type: "blockquote", children: childNodes as Blockquote["children"] };
};

const dividerHandler: BlockHandler = (_block, _ctx) => ({
  type: "thematicBreak",
});

/** IMAGE 块：输出为段落内图片，使 root 使用 containerFlow，块之间有空行。 */
const imageHandler: BlockHandler = (block, _ctx) => {
  const data = block.data as ImageBlockData;
  const w = data.width ?? 600;
  const h = data.height ?? 400;
  const url = `https://placehold.co/${w}x${h}`;
  const imageNode: Image = {
    type: "image",
    url,
    alt: `image with token ${data.token}`,
  };
  return {
    type: "paragraph",
    children: [imageNode],
  } satisfies Paragraph;
};

const tableHandler: BlockHandler = (block, _ctx) => {
  const data = block.data as TableBlockData;
  const { row_size, column_size } = data.property;
  const children = block.childSnapshots;

  if (row_size <= 0 || column_size <= 0 || children.length < row_size * column_size) {
    return {
      type: "html",
      value: "<!-- 表格数据错误 -->",
    } satisfies Html;
  }

  const rows: TableRow[] = Array.from({ length: row_size }, (_, r) => ({
    type: "tableRow",
    children: Array.from({ length: column_size }, (_, c) => {
      const cellBlock = children[r * column_size + c];

      return {
        type: "tableCell",
        children: cellBlock.childSnapshots.flatMap((sub) => getPhrasingContent(sub.data)),
      } satisfies TableCell;
    }),
  }));

  const tableAlign = children.slice(0, column_size).map((cellBlock) => {
    const firstChild = cellBlock.childSnapshots?.[0];
    return firstChild?.data?.align ?? null;
  });

  return {
    type: "table",
    align: tableAlign,
    children: rows,
  } satisfies Table;
};

/** 默认 handler 注册表 */
const handlers: Partial<Record<string, BlockHandler>> = {
  [BlockType.HEADING1]: headingHandler,
  [BlockType.HEADING2]: headingHandler,
  [BlockType.HEADING3]: headingHandler,
  [BlockType.HEADING4]: headingHandler,
  [BlockType.HEADING5]: headingHandler,
  [BlockType.HEADING6]: headingHandler,
  [BlockType.HEADING7]: headingHandler,
  [BlockType.HEADING8]: headingHandler,
  [BlockType.HEADING9]: headingHandler,
  [BlockType.TEXT]: textHandler,
  [BlockType.BULLET]: listHandler,
  [BlockType.ORDERED]: listHandler,
  [BlockType.TODO]: listHandler,
  [BlockType.CODE]: codeHandler,
  [BlockType.QUOTE_CONTAINER]: quoteContainerHandler,
  [BlockType.DIVIDER]: dividerHandler,
  [BlockType.IMAGE]: imageHandler,
  [BlockType.TABLE]: tableHandler,
};

// --- Public API ---

/**
 * 将飞书文档 BlockSnapshot 树转换为 MDAST Root。
 */
export function docsToMdast(root: BlockSnapshot): Root {
  const dispatch = (block: BlockSnapshot, ctx: MdastContext) => {
    const handler = handlers[block.type] ?? unsupportedHandler;
    return handler(block, ctx);
  };

  const ctx: MdastContext = {
    blockToMdast: (block) => dispatch(block, ctx),
  };

  const children = flattenBlocks(root.childSnapshots ?? [], ctx);
  return {
    type: "root",
    children: mergeConsecutiveLists(children),
  };
}

function isTaskList(list: List): boolean {
  return list.children.every((item: ListItem) => {
    return "checked" in item && item.checked !== undefined && item.checked !== null;
  });
}

function isUnorderedList(list: List): boolean {
  return !list.ordered;
}

function mergeConsecutiveLists(children: RootContent[]): RootContent[] {
  const result: RootContent[] = [];
  let i = 0;
  while (i < children.length) {
    const node = children[i];
    if (node.type !== "list") {
      result.push(node);
      i++;
      continue;
    }
    const list = node as List;
    const mergedItems = [...list.children];
    i++;
    while (i < children.length) {
      const next = children[i];
      if (next.type !== "list") break;
      const nextList = next as List;
      const canMerge =
        (isTaskList(list) && isTaskList(nextList)) ||
        (isUnorderedList(list) &&
          isUnorderedList(nextList) &&
          !nextList.children.some((item: ListItem) => "checked" in item && item.checked != null));
      if (!canMerge) break;
      mergedItems.push(...nextList.children);
      i++;
    }
    result.push({
      type: "list",
      ordered: list.ordered,
      spread: SPREAD_FALSE,
      children: mergedItems,
    } satisfies List);
  }
  return result;
}
