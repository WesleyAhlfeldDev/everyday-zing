// Builds Next.js Metadata from an entry's SEO settings, falling back to the
// page's defaults for anything left blank in the dashboard.
export function buildMetadata(seo = {}, { title, description, path } = {}) {
  // Titles from the dashboard (and Yoast) already carry the site name.
  const metaTitle = seo.title ? { absolute: seo.title } : title;
  const shareTitle = seo.title || (typeof title === 'string' ? `${title} | Every Day Zing` : title?.absolute);
  const metaDescription = seo.description || description;
  const image = seo.og_image?.url;

  return {
    title: metaTitle,
    description: metaDescription,
    robots: seo.noindex ? { index: false, follow: false } : undefined,
    alternates: path ? { canonical: path } : undefined,
    openGraph: {
      title: shareTitle,
      description: metaDescription,
      url: path,
      type: seo.og_type || 'website',
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: shareTitle,
      description: metaDescription,
      images: image ? [image] : undefined,
    },
  };
}
