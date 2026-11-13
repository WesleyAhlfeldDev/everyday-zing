import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEnvelope, faFolderOpen, faInbox, faNewspaper, faPenNib,
} from '@fortawesome/free-solid-svg-icons';
import { chapterFor } from '@/app/lib/chapters';
import { getOverview } from '../data';
import styles from '../admin.module.scss';

const TINTS = [styles.tint0, styles.tint1, styles.tint2, styles.tint3, styles.tint4];

export default async function OverviewPage() {
  const { counts, unread, recentPosts, categories, subscribers, newSubscribers, recentMessages } = await getOverview();
  const posts = counts.post || { published: 0, draft: 0 };

  const stats = [
    { href: '/admin/posts?status=published', label: 'Published posts', value: posts.published, icon: faNewspaper },
    { href: '/admin/posts?status=draft', label: 'Drafts in progress', value: posts.draft, icon: faPenNib },
    { href: '/admin/subscribers', label: newSubscribers ? `Zingers · ${newSubscribers} new this week` : 'Zingers', value: subscribers, icon: faEnvelope },
    { href: '/admin/submissions', label: 'Unread messages', value: unread, icon: faInbox },
  ];

  const max = Math.max(1, ...categories.map((c) => c.posts));
  const catTitle = Object.fromEntries(categories.map((c) => [c.slug, c.title]));

  return (
    <>
      <div className={styles.pageHeader}>
        <div>
          <h1>Overview</h1>
          <p>Posts, categories and readers across Every Day Zing.</p>
        </div>
        <div className={styles.chips}>
          <Link href="/admin/posts" className={`${styles.chip} ${styles.chipActive}`}>Posts</Link>
          <Link href="/admin/categories" className={styles.chip}>Categories</Link>
          <Link href="/admin/subscribers" className={styles.chip}>Zingers</Link>
          <a href="/" target="_blank" rel="noopener noreferrer" className={styles.chip}>View site ↗</a>
        </div>
      </div>

      <div className={styles.statGrid}>
        {stats.map((s, i) => (
          <Link key={s.href} href={s.href} className={`${styles.statCard} ${TINTS[i]} ${styles.rise}`} style={{ '--i': i }}>
            <span className={styles.thumbIcon}><FontAwesomeIcon icon={s.icon} /></span>
            <div className={styles.statNum}>{s.value}</div>
            <div className={styles.statLabel}>{s.label}</div>
          </Link>
        ))}
      </div>

      <div className={styles.boardGrid}>
        <section>
          <div className={styles.panelHead}>
            <h2>Recently edited posts</h2>
            <Link href="/admin/posts" className="small">View all</Link>
          </div>
          {recentPosts.length ? (
            <div className={styles.cardGrid}>
              {recentPosts.map((p, i) => {
                const img = p.fields?.featured_image?.url;
                return (
                  <article key={p.id} className={`${styles.entryCard} ${styles.rise}`} style={{ '--i': i + 4 }}>
                    <div className={`${styles.entryThumb} ${TINTS[i % 5]}`}>
                      <span className={`${styles.cardBadge} ${p.status === 'published' ? '' : styles.cardBadgeDraft}`}>
                        {p.status === 'published' ? 'Live' : 'Draft'}
                      </span>
                      {img ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={img} alt="" loading="lazy" />
                      ) : (
                        <span className={styles.thumbIcon}><FontAwesomeIcon icon={faNewspaper} /></span>
                      )}
                    </div>
                    <div className={styles.entryBody}>
                      <h3 className={styles.entryTitle}>
                        <Link href={`/admin/posts/${p.id}`}>{p.title}</Link>
                      </h3>
                      <div className={styles.muted}>{catTitle[p.fields?.category] || 'No category'}</div>
                      <div className={styles.entryFoot}>
                        <span className={styles.muted}>
                          {(p.publishedAt || p.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className={`card card-body ${styles.muted}`}>No posts yet. Run the WordPress import, or start a new post.</div>
          )}

          {recentMessages.length > 0 && (
            <>
              <div className={`${styles.panelHead} mt-4`}>
                <h2>Latest messages</h2>
                <Link href="/admin/submissions" className="small">Open inbox</Link>
              </div>
              <div className={`${styles.panel} ${styles.rise}`} style={{ '--i': 10 }}>
                <ul className={styles.panelList}>
                  {recentMessages.map((m) => (
                    <li key={m.id}>
                      <Link href="/admin/submissions" className={styles.panelItem}>
                        <span className={`${styles.panelIcon} ${m.read ? styles.tint3 : styles.tint2}`}>
                          <FontAwesomeIcon icon={faInbox} />
                        </span>
                        <span>
                          <span className={styles.panelLabel}>{m.firstName} {m.lastName}{m.read ? '' : ' · New'}</span>
                          <span className={styles.muted}>{m.subject}</span>
                        </span>
                        <span className={styles.panelCount}>
                          {m.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </section>

        <aside className={`${styles.panel} ${styles.rise}`} style={{ '--i': 3 }}>
          <div className={styles.panelHead}>
            <h2>Categories</h2>
            <Link href="/admin/categories" className={styles.iconBtn} aria-label="Open categories">
              <FontAwesomeIcon icon={faFolderOpen} />
            </Link>
          </div>
          <ul className={styles.panelList}>
            {categories.map((c, i) => {
              const chapter = chapterFor(c, i);
              return (
                <li key={c.slug}>
                  <Link href={`/admin/posts?category=${c.slug}`} className={styles.panelItem}>
                    <span className={styles.panelIcon} style={{ background: chapter.bg, color: chapter.ink }}>{c.posts}</span>
                    <span>
                      <span className={styles.panelLabel}>{c.title}</span>
                      <span className={styles.bar}><span style={{ width: `${(c.posts / max) * 100}%` }} /></span>
                    </span>
                    <span className={styles.panelCount}>{c.posts === 1 ? '1 post' : `${c.posts} posts`}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className={styles.panelFoot}>
            <strong>{posts.published}</strong>
            <span className={styles.muted}>posts live on the site</span>
          </div>
        </aside>
      </div>
    </>
  );
}
