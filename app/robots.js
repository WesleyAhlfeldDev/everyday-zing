const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://everyday-zing.com').replace(/\/$/, '');

export default function robots() {
  return {
    // The dashboard path is left out on purpose: listing it here would publish
    // it. Its pages carry a noindex tag instead (see its root layout.js).
    rules: { userAgent: '*', allow: '/', disallow: ['/api/', '/preview/'] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
