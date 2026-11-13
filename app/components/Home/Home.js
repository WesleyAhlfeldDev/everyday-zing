import Image from 'next/image';
import Link from 'next/link';
import PostGrid from '../PostGrid/PostGrid';
import ShopTabs from './ShopTabs';
import styles from './Home.module.scss';

// ── Welcome: lemon field, the statement beside two tilted prints of Carol ──

export function Welcome({ fields = {} }) {
  const { title = 'So glad you’re here', text, image, image_2: image2, cta } = fields;
  return (
    <section className={`${styles.welcome} field`} aria-labelledby="welcome-title">
      <div className={`frame ${styles.welcomeGrid}`}>
        <div className={styles.welcomeCopy}>
          <h2 id="welcome-title" className={styles.head} data-rise>{title}</h2>
          {text && <p className={styles.statement} data-rise>{text}</p>}
          {cta?.url && (
            <p data-rise><Link href={cta.url} className="text-link">{cta.title || 'More about me'}</Link></p>
          )}
        </div>
        <div className={styles.prints} aria-hidden={!image?.url}>
          {image?.url && (
            <figure className={`${styles.print} ${styles.printA}`} data-rise>
              <Image src={image.url} alt={image.alt || ''} fill sizes="(max-width: 768px) 60vw, 26vw" />
            </figure>
          )}
          {image2?.url && (
            <figure className={`${styles.print} ${styles.printB}`} data-rise>
              <Image src={image2.url} alt={image2.alt || ''} fill sizes="(max-width: 768px) 45vw, 18vw" />
            </figure>
          )}
        </div>
      </div>
    </section>
  );
}

// ── Latest posts: an even grid of cards ──

export function LatestTiles({ posts, categories, total }) {
  return (
    <section className={styles.latest} aria-labelledby="latest-title">
      <div className="frame">
        <div className={styles.latestTop}>
          <h2 id="latest-title" className={styles.head} data-rise>Fresh posts</h2>
          <Link href="/blog" className="btn-zing" data-rise>See all {total} posts</Link>
        </div>
        <PostGrid posts={posts.slice(0, 6)} categories={categories} />
      </div>
    </section>
  );
}

// ── Chapters: one colour tile per category ──

export function ChapterTiles({ categories, total }) {
  return (
    <section className={styles.chapters} aria-labelledby="chapters-title">
      <div className="frame">
        <h2 id="chapters-title" className={styles.head} data-rise>Pick a chapter</h2>
        <ul className={styles.chapterGrid}>
          {categories.map((c) => (
            <li key={c.slug} data-rise>
              <Link href={`/category/${c.slug}`} className={styles.chapter}>
                <span className={styles.chapterImg} style={{ background: c.chapter.bg }}>
                  {c.cover?.url && <Image src={c.cover.url} alt="" fill sizes="(max-width: 768px) 50vw, 25vw" />}
                </span>
                <span className={styles.chapterName}>{c.title}</span>
                <span className={styles.chapterCount}>{c.count === 1 ? '1 post' : `${c.count} posts`}</span>
              </Link>
            </li>
          ))}
          <li data-rise>
            <Link href="/blog" className={styles.chapter}>
              <span className={`${styles.chapterImg} ${styles.allTile}`}>
                <span>Every post, newest first</span>
              </span>
              <span className={styles.chapterName}>The whole blog</span>
              <span className={styles.chapterCount}>{total} posts</span>
            </Link>
          </li>
        </ul>
      </div>
    </section>
  );
}

// ── Where I shop / who I follow ──

export function ShopAndFollow({ shops = [], follows = [] }) {
  if (!shops.length && !follows.length) return null;
  return (
    <section className={`${styles.shop} field`} aria-labelledby="shop-title">
      <div className="frame">
        <h2 id="shop-title" className={styles.shopHead} data-rise>
          <span>Where I shop</span> and who I follow
        </h2>
        <ShopTabs shops={shops} follows={follows} />
      </div>
    </section>
  );
}

// ── Instagram: prints either side of the handle ──

export function InstaPrints({ fields = {}, fallback = [] }) {
  const handle = fields.handle || 'everydayzing';
  const prints = (fields.prints?.length ? fields.prints : fallback).filter((p) => p.image?.url).slice(0, 3);
  const url = `https://www.instagram.com/${handle}/`;
  return (
    <section className={`${styles.insta} field`} aria-labelledby="insta-title">
      <div className={`frame ${styles.instaInner}`}>
        {prints.map((p, i) => (
          <a
            key={p.image.url}
            href={p.url || url}
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.instaPrint} ${styles[`ip${i}`]}`}
          >
            <Image src={p.image.url} alt={p.caption || p.image.alt || ''} fill sizes="(max-width: 768px) 46vw, 24vw" />
          </a>
        ))}
        <h2 id="insta-title" className={styles.instaHead} data-rise>
          <a href={url} target="_blank" rel="noopener noreferrer">Follow along<br />@{handle}</a>
        </h2>
        {fields.text && <p className={styles.instaText} data-rise>{fields.text}</p>}
      </div>
    </section>
  );
}
