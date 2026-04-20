# GFM Spec Test Document

Based on [GFM Spec](https://github.github.com/gfm/), including CommonMark base + GFM extensions.

---

## CommonMark Base

### Headings and Paragraphs

# ATX heading

**Bold** *italic* `inline code`
[Link](https://example.com) <https://autolink.com>

### Lists and Blockquotes

- Unordered
- list

> Blockquote

```js
// Code block
```

---

## GFM Extensions

### 1. Tables (GFM extension)

| Col 1 | Col 2 | Col 3 |
| --- | --- | --- |
| a   | b   | c   |
| 1   | 2   | 3   |

| Left | Center | Right |
| :--- | :----: | ----: |
| left | center | right |
| L    |   C    |     R |

| Cell with \| |
| -------------- |
| Pipe \| escaped |

Table without header:

| --- | --- |
| a | b |

### 2. Strikethrough (GFM extension)

~~Strikethrough text~~

~~Nested **bold** and *italic*~~

Non~~continuous~~ strikethrough~~text~~

### 3. Task Lists (GFM extension)

- [ ] Unchecked
- [x] Checked
- [X] Uppercase X also works
- [ ] Nested list
  - [ ] Sub-task
  - [x] Checked sub-task

- [ ] Task lists can mix with regular list
- Regular list item

---

### 4. Autolink Extension (GFM extension)

URL without angle brackets: https://github.com

Email: user@example.com

www.example.com

---

### 5. Inline Formatting in Tables

| Format | Example |
| --- | --- |
| **Bold** | **bold** |
| *Italic* | *italic* |
| `Code` | `code` |
| [Link](https://example.com) | link |

---

### 6. Fenced Code Block Language Identifiers

```json
{ "key": "value" }
```

```html
<div>HTML</div>
```

```diff
- Delete line
+ Add line
```
