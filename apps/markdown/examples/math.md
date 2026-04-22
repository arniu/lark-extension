# Math Spec Test Document

Based on [remark-math](https://github.com/remarkjs/remark-math) / KaTeX syntax, supporting inline and block formulas.

---

## 1. Inline Math

Einstein's mass-energy equivalence $E = mc^2$ is one of the most famous equations.

Quadratic formula: $x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$

Greek letters: $\alpha$, $\beta$, $\gamma$, $\sum$, $\int$, $\infty$

---

## 2. Block Math

Quadratic formula (display):

$$
x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}
$$

Einstein's field equation:

$$
G_{\mu\nu} + \Lambda g_{\mu\nu} = \frac{8\pi G}{c^4} T_{\mu\nu}
$$

Summation:

$$
\sum_{n=1}^{\infty} \frac{1}{n^2} = \frac{\pi^2}{6}
$$

---

## 3. Matrix and Cases

Matrix:

$$
\begin{pmatrix}
a & b \\
c & d
\end{pmatrix}
$$

Piecewise function:

$$
f(x) = \begin{cases}
x^2 & x \geq 0 \\
-x^2 & x < 0
\end{cases}
$$

---

## 4. Mixed with Text

Paragraph with inline $a^2 + b^2 = c^2$ Pythagorean theorem and **bold** text.

> Blockquote with $\frac{d}{dx}e^x = e^x$ formula.

---

## 5. Common Symbols

- Fraction: $\frac{1}{2}$
- Square root: $\sqrt{2}$
- Subscript: $x_1$, $x_n$
- Superscript: $x^2$, $e^{i\pi} = -1$
- Integral: $\int_0^1 x \, dx = \frac{1}{2}$
