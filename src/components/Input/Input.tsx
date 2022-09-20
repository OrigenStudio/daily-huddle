import clsx from "clsx";
import { ReactNode, useId } from "react";

import styles from "./Input.module.css";

export type InputClassKey = "root" | "label" | "labelText" | "input";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: ReactNode;
  labelProps?: React.LabelHTMLAttributes<HTMLLabelElement>;
  classes?: Partial<Record<InputClassKey, string>>;
}

export default function Input({
  label,
  labelProps,
  classes: c,
  id: maybeId,
  ...props
}: InputProps) {
  const defaultId = useId();
  const id = maybeId ?? defaultId;
  return (
    <div className={clsx(styles.root, c?.root)}>
      <input {...props} id={id} className={clsx(styles.input, c?.input)} />
      {label && (
        <label
          {...labelProps}
          htmlFor={id}
          className={clsx(styles.label, c?.label)}
        >
          {label}
        </label>
      )}
    </div>
  );
}
