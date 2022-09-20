import type { NextPage } from "next";
import Head from "next/head";
import { FiLogOut } from "react-icons/fi";

import styles from "./index.module.css";
import clsx from "clsx";
import useTheme from "../modules/theme/hooks/useTheme";
import useThemeStyles from "../modules/theme/hooks/useThemeStyles";
import SanitizedTitle from "../components/SanitizedTitle/SanitizedTitle";
import Footer from "../components/Footer/Footer";
import { defaultHuddle } from "../modules/huddle/hooks/useHuddle";
import striptags from "striptags";
import { useRouter } from "next/router";
import Link from "next/link";
import { siteMetadata } from "../../config/siteMetadata";

const Home: NextPage = () => {
  const [theme] = useTheme();
  const [themeStyles] = useThemeStyles(theme);

  const router = useRouter();

  return (
    <>
      <Head>
        <title>{striptags(defaultHuddle.title)} - Info</title>
        <meta name="description" content={siteMetadata.description} />
      </Head>
      <div
        className={clsx(
          styles.themeBase,
          { light: styles.themeLight, dark: styles.themeDark }[theme.mode],
          themeStyles.className,
          styles.containerOuter,
          styles.info
        )}
      >
        <div className={styles.containerInner}>
          <SanitizedTitle component="h1" className={styles.title}>
            {defaultHuddle.title}
          </SanitizedTitle>
          <div className={clsx(styles.section, styles.center)}>
            <div className={styles.buttonGroup}>
              <Link href={{ pathname: "/", query: router.query }}>
                <a
                  key="cancel"
                  className={clsx(styles.button, styles.buttonDanger)}
                  aria-label="Back"
                >
                  <FiLogOut />
                </a>
              </Link>
            </div>
          </div>
          <div className={clsx(styles.section, styles.center)}>
            <h3 className={styles.subtitle}>What&#39;s this?</h3>
            <p>
              Simple and configurable tool to manage daily huddles in a remote
              team.
            </p>
            <p>
              A huddle can be configured to have a set of members and a set of
              time blocks. When the huddle starts, it will go through each
              member and each time block until it finishes.
            </p>
          </div>
          <div className={clsx(styles.section, styles.center)}>
            <h3 className={styles.subtitle}>Privacy policy</h3>
            <p>
              This is a client-side only application and no data leaves your
              browser. All configuration is stored as URL query parameters so
              huddles can be easily shared or stored as bookmarks.
            </p>
            <p>This is a cookie free site.</p>
          </div>
          <Footer
            classes={{
              root: styles.footer,
              buttonGroup: styles.buttonGroupSmall,
              button: clsx(styles.button, styles.buttonSmall),
            }}
          />
        </div>
      </div>
    </>
  );
};

export default Home;
