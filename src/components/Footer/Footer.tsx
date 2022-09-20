import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import { FiGithub, FiHeart } from "react-icons/fi";
import { MdOutlinePrivacyTip } from "react-icons/md";

import styles from "./Footer.module.css";

export type FooterClassKey =
  | "root"
  | "info"
  | "heart"
  | "buttonGroup"
  | "button"
  | "buttonHelp"
  | "buttonGithub";

export interface FooterProps {
  component?: keyof JSX.IntrinsicElements;
  classes?: Partial<Record<FooterClassKey, string>>;
  className?: string;
}

export default function Footer({
  component: Component = "footer",
  classes: c,
  className,
  ...props
}: FooterProps) {
  const router = useRouter();
  return (
    <Component {...props} className={clsx(styles.root, c?.root, className)}>
      <div className={clsx(styles.info, c?.info)}>
        Made with{" "}
        <FiHeart aria-label="love" className={clsx(styles.heart, c?.heart)} />{" "}
        by <a href="https://origen.studio">Origen Studio</a>
      </div>
      <div className={clsx(styles.buttonGroup, c?.buttonGroup)}>
        <Link href={{ pathname: "/info", query: router.query }} replace>
          <a
            className={clsx(
              styles.button,
              c?.button,
              styles.buttonHelp,
              c?.buttonHelp
            )}
            aria-label="Info"
          >
            <MdOutlinePrivacyTip />
          </a>
        </Link>
        <a
          className={clsx(
            styles.button,
            c?.button,
            styles.buttonGithub,
            c?.buttonGithub
          )}
          href="https://github.com/OrigenStudio/daily-huddle"
          aria-label="GitHub"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FiGithub />
        </a>
      </div>
    </Component>
  );
}
