# CommonMark Spec Test Document

Based on [CommonMark Spec 0.31.2](https://spec.commonmark.org/0.31.2/).

---

## 1. ATX Headings

# H1

## H2

### H3

#### H4

##### H5

###### H6

## 2. Setext Headings

H1
===

H2
---

## 3. Paragraphs and Line Breaks

First paragraph.

Second paragraph, separated by a blank line.

Two trailing spaces produce a hard line break.  
This is a new line.

No trailing spaces yields a soft break
continuing in the same paragraph.

## 4. Emphasis

*Single asterisk italic* and _underscore italic_

**Double asterisk bold** and __double underscore bold__

***Bold italic*** and ___combined___

## 5. Code Spans

Inline `code` and `` `nested backticks` ``

## 6. Links

[Inline link](https://example.com)

[With title](https://example.com "optional title")

[Reference link][ref]

[ref]: https://example.com "reference definition"

## 7. Images

![Alternative text](https://via.placeholder.com/100x30)

![With title](https://via.placeholder.com/100x30 "image title")

## 8. Autolinks

<https://example.com>

<user@example.com>

## 9. Blockquotes

> Single line quote

> Multi-line quote
> Second line
> Third line

> Quote with nested
>
> - list
> - items

## 10. Unordered Lists

- item
- item
- item

* asterisk

+ plus

* item
  - nested
  - nested

## 11. Ordered Lists

1. First
2. Second
3. Third

4. item
   1. nested
   2. nested

## 12. Indented Code Blocks

    Four spaces indent
    code block

## 13. Fenced Code Blocks

```
No language identifier
multi-line code
```

```javascript
console.log("with language");
```

## 14. Thematic Breaks

---

***

___

- - -

## 15. HTML Blocks

<div>
Block-level HTML
</div>

<p>Paragraph HTML</p>

## 16. Escaping

\* escaped asterisk \` escaped backtick \[ escaped brackets

## 17. Backslash Escape Characters

\\ \` \* \_ \{ \} \[ \] \( \) \# \+ \- \. \!
