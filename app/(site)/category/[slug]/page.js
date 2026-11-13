import { notFound } from 'next/navigation';
import { getCategories, getCategory, getPosts } from '@/app/lib/content';
import { buildMetadata } from '@/app/lib/seo';
import ChapterHeader from '@/app/components/ChapterHeader/ChapterHeader';
import PostListing from '@/app/components/PostListing/PostListing';

export const revalidate = 3600;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const cat = await getCategory(slug);
  if (!cat) return { title: 'Not found' };
  return buildMetadata(cat.seo, {
    title: cat.title,
    description: cat.fields.description || `Every post in ${cat.title} on Every Day Zing.`,
    path: `/category/${slug}`,
  });
}

export default async function CategoryPage({ params, searchParams }) {
  const [{ slug }, { page: pageParam }] = await Promise.all([params, searchParams]);
  const [cat, categories, posts] = await Promise.all([getCategory(slug), getCategories(), getPosts()]);
  if (!cat) notFound();
  const own = posts.filter((p) => p.fields.category === slug);
  const n = Math.max(1, Number.parseInt(pageParam, 10) || 1);

  return (
    <>
      <ChapterHeader
        chapter={cat.chapter}
        title={cat.title}
        text={cat.fields.description}
        aside={cat.count === 1 ? '1 post' : `${cat.count} posts`}
        chips={categories}
        current={slug}
      />
      <PostListing posts={own} categories={categories} page={n} basePath={`/category/${slug}`} heading={`Posts in ${cat.title}`} />
    </>
  );
}
