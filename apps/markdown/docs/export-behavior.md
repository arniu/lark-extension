# 导出行为说明

飞书文档转 Markdown 导出中的特殊逻辑与设计取舍。

---

## 图片块与块间空行

### 现象

文档含**图片块**时，若不处理，导出 Markdown **块与块之间无空行**，整篇连在一起。

### 原因

[mdast-util-to-markdown](https://github.com/syntax-tree/mdast-util-to-markdown) 对 root 的规则：

- 若 root 有**任意 phrasing 子节点**（如 `image`），则用 `containerPhrasing`，子节点**紧挨拼接、无空行**；
- 仅当子节点全是 **flow**（heading、paragraph、list、code 等）时，才用 `containerFlow`，块间插空行。

有图则 root 下必有 `image`（phrasing），整篇变为无空行。

### 处理方式

IMAGE 块不返回裸 `image`，改为返回 **paragraph 包裹 image**：

```ts
return {
  type: "paragraph",
  children: [{ type: "image", url, alt }],
};
```

root 子节点全为 flow，序列化走 `containerFlow`，块间恢复空行。

### 对导出的影响

「仅含一图的段落」与「单独一图」在 CommonMark/GFM 下渲染一致（`![alt](url)` 单独成行），导出可读与解析正常。
