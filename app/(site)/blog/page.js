import { getCategories, getPage, getPosts } from '@/app/lib/content';
import { buildMetadata } from '@/app/lib/seo';
import { CHAPTERS } from '@/app/lib/chapters';
import ChapterHeader from '@/app/components/ChapterHeader/ChapterHeader';
import PostListing from '@/app/components/PostListing/PostListing';

export const revalidate = 3600;

export async function generateMetadata() {
  const page = await getPage('blog');
  return buildMetadata(page?.seo, {
    title: 'The blog',
    description: 'Every post on Every Day Zing: style, recipes, skincare, money, home and favourite finds.',
    path: '/blog',
  });
}

export default async function BlogPage({ searchParams }) {
  const [{ page: pageParam }, page, posts, categories] = await Promise.all([
    searchParams, getPage('blog'), getPosts(), getCategories(),
  ]);
  const hero = page?.fields?.hero || {};
  const n = Math.max(1, Number.parseInt(pageParam, 10) || 1);

  return (
    <>
      <ChapterHeader
        chapter={CHAPTERS.night}
        title={hero.title || 'The blog'}
        text={hero.subtext || 'Every post, newest first. Pick a chapter to narrow it down.'}
        aside={`${posts.length} posts in ${categories.length} chapters`}
        chips={categories}
      />
      <PostListing posts={posts} categories={categories} page={n} basePath="/blog" heading="All posts" />
    </>
  );
}
