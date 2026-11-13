import Image from 'next/image';
import Link from 'next/link';
import { getCategories, getPage, getPosts } from '@/app/lib/content';
import { buildMetadata } from '@/app/lib/seo';
import { CHAPTERS } from '@/app/lib/chapters';
import ChapterHeader from '@/app/components/ChapterHeader/ChapterHeader';
import PostGrid from '@/app/components/PostGrid/PostGrid';
import styles from './Shop.module.scss';

export const revalidate = 3600;

const DISCLOSURE = 'Some links are affiliate links: I may earn a small commission, at no cost to you. I only share what I actually use.';
const LINK_REL = 'noopener noreferrer sponsored';

export async function generateMetadata() {
  const page = await getPage('shop');
  return buildMetadata(page?.seo, {
    title: 'Shop my favourites',
    description: 'The stores I shop, the things I love right now and my Amazon storefront, all in one place.',
    path: '/shop',
  });
}

export default async function ShopPage() {
  const [page, home, posts, categories] = await Promise.all([
    getPage('shop'), getPage('home'), getPosts(), getCategories(),
  ]);
  const f = page?.fields || {};
  const hero = f.hero || {};
  const storefront = f.storefront || {};
  const picks = (f.picks || []).filter((p) => p.name && p.url);
  const stores = (f.stores?.length ? f.stores : home?.fields?.shops || [])
    .filter((s) => s.name && s.url && s.url !== storefront.url);

  const findsSlug = f.finds_category || 'shopping-finds';
  const finds = categories.find((c) => c.slug === findsSlug);
  const findPosts = finds ? posts.filter((p) => p.fields.category === finds.slug).slice(0, 6) : [];
  const cat = Object.fromEntries(categories.map((c) => [c.slug, c]));

  return (
    <>
      <ChapterHeader
        chapter={CHAPTERS.pink}
        title={hero.title || 'Shop my favourites'}
        text={hero.subtext || 'The stores I keep going back to and the things I love right now.'}
        aside={f.disclosure || DISCLOSURE}
      />

      {storefront.url && (
        <section
          className={`${styles.storefront} ${storefront.image?.url ? '' : `${styles.storefrontBand} field`}`}
          aria-labelledby="storefront-title"
        >
          <div className={`frame ${styles.storefrontGrid}`}>
            <div className={styles.storefrontCopy}>
              <h2 id="storefront-title" className={styles.head} data-rise>{storefront.title || 'My Amazon Store'}</h2>
              {storefront.text && <p className={styles.lead} data-rise>{storefront.text}</p>}
              <p data-rise>
                <a href={storefront.url} target="_blank" rel={LINK_REL} className="btn-zing">
                  {storefront.cta_label || 'Shop the storefront'} <span aria-hidden="true">↗</span>
                </a>
              </p>
            </div>
            {storefront.image?.url && (
              <figure className={styles.storefrontPhoto} data-rise>
                <Image src={storefront.image.url} alt={storefront.image.alt || ''} fill sizes="(max-width: 1024px) 100vw, 40vw" />
              </figure>
            )}
          </div>
        </section>
      )}

      {picks.length > 0 && (
        <section className={styles.picks} aria-labelledby="picks-title">
          <div className="frame">
            <h2 id="picks-title" className={styles.head} data-rise>Loving right now</h2>
            <ul className={styles.pickGrid}>
              {picks.map((p) => {
                const c = cat[p.category];
                return (
                  <li key={`${p.name}-${p.url}`} data-rise>
                    <a href={p.url} target="_blank" rel={LINK_REL} className={styles.pick}>
                      <span className={styles.pickPhoto} style={{ background: c?.chapter.bg || 'var(--paper-2)' }}>
                        {p.image?.url && <Image src={p.image.url} alt="" fill sizes="(max-width: 768px) 50vw, 25vw" />}
                      </span>
                      <span className={styles.pickMeta}>
                        {p.store && <span>{p.store}</span>}
                        {p.price && <span>{p.price}</span>}
                      </span>
                      <span className={styles.pickName}>{p.name}</span>
                      {p.note && <span className={styles.pickNote}>{p.note}</span>}
                      <span className={styles.pickGo}>Shop it <span aria-hidden="true">↗</span></span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      )}

      {stores.length > 0 && (
        <section className={`${styles.stores} field`} aria-labelledby="stores-title">
          <div className={`frame ${styles.storesGrid}`}>
            <h2 id="stores-title" className={styles.head} data-rise>Where I shop</h2>
            <ul className={styles.bands}>
              {stores.map((s) => (
                <li key={s.name} data-rise>
                  <a href={s.url} target="_blank" rel={LINK_REL} className={styles.band}>
                    <span className={styles.bandName}>{s.name}</span>
                    {s.note && <span className={styles.bandSub}>{s.note}</span>}
                    <span className={styles.bandGo}>Visit <span aria-hidden="true">↗</span></span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {findPosts.length > 0 && (
        <section className={styles.finds} aria-labelledby="finds-title">
          <div className="frame">
            <div className={styles.findsTop}>
              <h2 id="finds-title" className={styles.head} data-rise>From {finds.title}</h2>
              <Link href={`/category/${finds.slug}`} className="btn-zing" data-rise>All {finds.count} posts</Link>
            </div>
            <PostGrid posts={findPosts} categories={categories} />
          </div>
        </section>
      )}
    </>
  );
}
