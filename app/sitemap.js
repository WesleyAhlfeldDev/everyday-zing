import { getCategories, getPage, getPosts } from '@/app/lib/content';
import { PAGE_PATHS } from '@/app/lib/content-schema';

export const revalidate = 3600;

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://everyday-zing.com').replace(/\/$/, '');

export default async function sitemap() {
  const [pages, posts, categories] = await Promise.all([
    Promise.all(Object.keys(PAGE_PATHS).map((slug) => getPage(slug))),
    getPosts(),
    getCategories(),
  ]);

  const entry = (path, date) => ({ url: `${SITE_URL}${path}`, lastModified: date ? new Date(date) : undefined });

  return [
    ...pages.filter(Boolean).map((p) => entry(PAGE_PATHS[p.slug], p.date)),
    ...categories.map((c) => entry(`/category/${c.slug}`, c.latest?.date)),
    ...posts.map((p) => entry(`/${p.slug}`, p.date)),
  ];
}
