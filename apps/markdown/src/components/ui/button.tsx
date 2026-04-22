import type { JSX } from "solid-js";
import { splitProps } from "solid-js";

import styles from "./button.module.css";

export type ButtonVariant = "default" | "primary";

export type ButtonProps = JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

export function Button(props: ButtonProps) {
  const [local, rest] = splitProps(props, ["variant", "class", "children"]);

  const variantClass = () => (local.variant === "primary" ? styles.primary : "");

  return (
    <button
      type="button"
      class={[styles.button, variantClass(), local.class].filter(Boolean).join(" ")}
      {...rest}
    >
      {local.children}
    </button>
  );
}
