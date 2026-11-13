import { getCategories, getPage, getPosts } from '@/app/lib/content';
import { buildMetadata } from '@/app/lib/seo';
import FeaturedHero from '@/app/components/FeaturedHero/FeaturedHero';
import { ChapterTiles, InstaPrints, LatestTiles, ShopAndFollow, Welcome } from '@/app/components/Home/Home';

export const revalidate = 3600;

export async function generateMetadata() {
  const page = await getPage('home');
  return buildMetadata(page?.seo, {
    title: { absolute: 'Every Day Zing | A lifestyle blog by Carol Joy' },
    description: 'Outfits, recipes, skincare, money and the little finds that make an ordinary week sparkle.',
    path: '/',
  });
}

export default async function HomePage() {
  const [page, posts, categories] = await Promise.all([getPage('home'), getPosts(), getCategories()]);
  const f = page?.fields || {};
  const hero = f.hero || {};
  const [featured, ...rest] = posts;
  const featuredCategory = categories.find((c) => c.slug === featured?.fields.category) || null;

  const fallbackPrints = rest.slice(6, 9).map((p) => ({ image: p.fields.featured_image, caption: p.title }));

  return (
    <>
      <FeaturedHero
        title={hero.title || 'Every Day Zing'}
        subtext={hero.subtext}
        ctaLabel={hero.cta_label || 'Read the post'}
        post={featured}
        category={featuredCategory}
        categories={categories}
      />
      <Welcome fields={f.welcome} />
      <LatestTiles posts={rest} categories={categories} total={posts.length} />
      <ChapterTiles categories={categories} total={posts.length} />
      <ShopAndFollow shops={f.shops} follows={f.follows} />
      <InstaPrints fields={f.instagram} fallback={fallbackPrints} />
    </>
  );
}
