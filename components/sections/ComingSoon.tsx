import { DiceMark } from "@/components/motion/DiceMark";
import { Notify } from "@/components/ui/Notify";
import { site } from "@/lib/site";
import styles from "./ComingSoon.module.css";

/**
 * The front door before launch. The mark is the whole statement; everything
 * else is metadata pinned to the margins.
 */
export function ComingSoon() {
  return (
    <main className={styles.root}>
      <DiceMark />

      <div className={styles.grain} aria-hidden="true" />

      <div className={styles.frame}>
        <header className={styles.row}>
          <h1 className={`${styles.label} ${styles.wordmark}`}>Greatest Hustlers</h1>
          <span />
          <a
            className={`${styles.label} ${styles.link} ${styles.end}`}
            href={site.instagram.url}
            target="_blank"
            rel="noreferrer"
            title={`@${site.instagram.handle} on Instagram`}
          >
            <span aria-hidden="true">IG</span>
            <span className={styles.hidden}>Instagram</span>
          </a>
        </header>

        <footer className={styles.row}>
          <p className={styles.label}>GH / {site.year}</p>
          {site.newsletterEndpoint ? (
            <div className={styles.label}>
              <Notify endpoint={site.newsletterEndpoint} />
            </div>
          ) : (
            <span />
          )}
          <p className={`${styles.label} ${styles.end}`}>Coming soon</p>
        </footer>
      </div>
    </main>
  );
}
