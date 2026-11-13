import Image from 'next/image';
import Link from 'next/link';
import { formatDate } from '@/app/lib/content';
import styles from './InstagramFeed.module.scss';

const TYPE_LABEL = { video: 'Reel', carousel: 'Carousel' };

// The newest Instagram posts on a lime field: the handle and a follow button
// up top, then the newest post large beside four smaller ones. Every tile
// opens its post (on Instagram, or on the blog before the account is
// connected); hovering shows the start of its caption.
export default function InstagramFeed({ posts, handle = 'everydayzing', text }) {
  const profile = `https://www.instagram.com/${handle}/`;

  return (
    <section className={`${styles.feed} field`} aria-labelledby="insta-title">
      <div className="frame">
        <div className={styles.top}>
          <h2 id="insta-title" className={styles.head} data-rise>
            Follow along <a href={profile} target="_blank" rel="noopener noreferrer">@{handle}</a>
          </h2>
          <div className={styles.side} data-rise>
            {text && <p>{text}</p>}
            <a href={profile} target="_blank" rel="noopener noreferrer" className="btn-zing">
              Follow on Instagram <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>

        <ul className={styles.grid}>
          {posts.map((post, i) => {
            const external = /^https?:/.test(post.url);
            const Tile = external ? 'a' : Link;
            const linkProps = external ? { target: '_blank', rel: 'noopener noreferrer' } : {};
            return (
              <li key={post.id} className={i === 0 ? styles.lead : undefined} data-rise>
                <Tile href={post.url} {...linkProps} className={styles.tile}>
                  <Image
                    src={post.image}
                    alt=""
                    fill
                    unoptimized
                    sizes={i === 0 ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 768px) 50vw, 25vw'}
                  />
                  {TYPE_LABEL[post.type] && (
                    <span className={styles.badge}>
                      <TypeIcon type={post.type} />
                      <span className="visually-hidden">{TYPE_LABEL[post.type]}</span>
                    </span>
                  )}
                  <span className={styles.overlay}>
                    <span className={styles.caption}>{shorten(post.caption, i === 0 ? 180 : 110)}</span>
                    {post.date && <time dateTime={post.date}>{formatDate(post.date, 'short')}</time>}
                  </span>
                  <span className="visually-hidden">{external ? 'Open on Instagram' : 'Read the post'}</span>
                </Tile>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

// The caption's first line, cut at a word near `max` characters.
function shorten(caption = '', max) {
  const line = caption.split('\n')[0].trim();
  if (line.length <= max) return line;
  return `${line.slice(0, line.lastIndexOf(' ', max)).replace(/[,.;:!?-]+$/, '')}…`;
}

function TypeIcon({ type }) {
  if (type === 'video') {
    return (
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
        <path d="M8 5.5v13l10.5-6.5z" fill="currentColor" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
      <rect x="7.5" y="3.5" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M4.5 7.5v13h13" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
