import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowUpRightFromSquare, faFileLines, faFolderOpen, faNewspaper, faPen,
} from '@fortawesome/free-solid-svg-icons';
import { requireAdmin } from '@/app/lib/auth';
import { COLLECTIONS, TYPE_LABELS, entryPath } from '@/app/lib/content-schema';
import { chapterFor } from '@/app/lib/chapters';
import { listEntries } from '../../data';
import { createEntry } from '../../actions';
import styles from '../../admin.module.scss';
import { ADMIN_PATH } from '@/app/lib/admin-path';

const ICONS = { page: faFileLines, post: faNewspaper, category: faFolderOpen };
const TINTS = [styles.tint0, styles.tint1, styles.tint2, styles.tint3, styles.tint4];
const FILTERS = [['all', 'All'], ['published', 'Published'], ['draft', 'Drafts']];

export default async function CollectionPage({ params, searchParams }) {
  await requireAdmin();
  const { collection } = await params;
  const { status = 'all', category } = await searchParams;
  const type = COLLECTIONS[collection];
  if (!type) notFound();

  const all = await listEntries(type);
  const rows = all
    .filter((r) => status === 'all' || r.status === status)
    .filter((r) => !category || r.category === category);
  const label = TYPE_LABELS[type];
  const showOrder = type === 'category';
  const published = all.filter((r) => r.status === 'published').length;

  return (
    <>
      <div className={styles.pageHeader}>
        <div>
          <h1>{label.plural}</h1>
          <p>{published} published · {all.length - published} draft{all.length - published === 1 ? '' : 's'}</p>
        </div>
        <div className={styles.chips}>
          {FILTERS.map(([value, text]) => (
            <Link
              key={value}
              href={value === 'all' ? `${ADMIN_PATH}/${collection}` : `${ADMIN_PATH}/${collection}?status=${value}`}
              className={`${styles.chip} ${status === value ? styles.chipActive : ''}`}
            >
              {text}
            </Link>
          ))}
          {type !== 'page' && (
            <form action={createEntry.bind(null, type)} className="ms-2">
              <button type="submit" className="btn btn-primary btn-sm">+ New {label.singular.toLowerCase()}</button>
            </form>
          )}
        </div>
      </div>

      <div className={styles.cardGrid}>
        {rows.map((row, i) => {
          const path = entryPath(type, row.slug);
          const live = path && row.status === 'published';
          const date = row.publishedAt || row.updatedAt;
          return (
            <article key={row.id} className={`${styles.entryCard} ${styles.rise}`} style={{ '--i': i }}>
              <div
                className={`${styles.entryThumb} ${TINTS[i % TINTS.length]}`}
                style={type === 'category' ? { background: chapterFor({ fields: { color: row.color } }, i).bg } : undefined}
              >
                <span className={`${styles.cardBadge} ${row.status === 'published' ? '' : styles.cardBadgeDraft}`}>
                  {row.status === 'published' ? 'Live' : 'Draft'}
                </span>
                {row.thumbnail ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={row.thumbnail} alt="" loading="lazy" />
                ) : (
                  <span className={styles.thumbIcon}><FontAwesomeIcon icon={ICONS[type]} /></span>
                )}
              </div>
              <div className={styles.entryBody}>
                <h2 className={styles.entryTitle}>
                  <Link href={`${ADMIN_PATH}/${collection}/${row.id}`}>{row.title}</Link>
                </h2>
                <div className={styles.muted}>/{row.slug}{showOrder ? ` · order ${row.sortOrder}` : ''}</div>
                <div className={styles.entryFoot}>
                  <span className={styles.muted}>{date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  <span className="d-flex gap-1">
                    {live && (
                      <a href={path} target="_blank" rel="noopener noreferrer" className={styles.iconBtn} aria-label={`View ${row.title} on the site`}>
                        <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                      </a>
                    )}
                    <Link href={`${ADMIN_PATH}/${collection}/${row.id}`} className={styles.iconBtn} aria-label={`Edit ${row.title}`}>
                      <FontAwesomeIcon icon={faPen} />
                    </Link>
                  </span>
                </div>
              </div>
            </article>
          );
        })}

        {type !== 'page' && status === 'all' && (
          <form action={createEntry.bind(null, type)} className={styles.rise} style={{ '--i': rows.length }}>
            <button type="submit" className={styles.newCard}>+ New {label.singular.toLowerCase()}</button>
          </form>
        )}
      </div>

      {!rows.length && (type === 'page' || status !== 'all') && (
        <div className={`card card-body mt-3 ${styles.muted}`}>
          Nothing here{type === 'page' && status === 'all' ? ' yet. Run the WordPress import to create the pages' : ''}.
        </div>
      )}
    </>
  );
}
