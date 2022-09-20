import clsx from "clsx";
import { ReactNode } from "react";
import striptags from "striptags";

import styles from "./SanitizedTitle.module.css";

export type SanitizedTitleClassKey = "root" | "strong";

export interface SanitizedTitleProps {
  component?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  children: ReactNode;
  classes?: Partial<Record<SanitizedTitleClassKey, string>>;
  className?: string;
}

export default function SanitizedTitle({
  component: Component = "h1",
  children,
  classes: c,
  className,
  ...props
}: SanitizedTitleProps) {
  const sanitizedHtml =
    typeof children === "string" ? sanitizeTitle(children, { ...c }) : null;
  return sanitizedHtml || children ? (
    <Component
      {...props}
      className={clsx(styles.root, c?.root, className)}
      {...(sanitizedHtml
        ? { dangerouslySetInnerHTML: { __html: sanitizedHtml } }
        : { children })}
    />
  ) : null;
}

export function sanitizeTitle(
  value: string,
  c?: Partial<Record<SanitizedTitleClassKey, string>>
) {
  return striptags(value, ["i", "em", "b", "strong"]).replace(
    /<(b|strong)>/g,
    `<$1 class="${clsx(styles?.strong, c?.strong)}">`
  );
}
