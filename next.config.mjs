/** @type {import('next').NextConfig} */
const nextConfig = {
  // Local-only embedded database; loaded at runtime, never bundled.
  serverExternalPackages: ['@electric-sql/pglite'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.public.blob.vercel-storage.com' },
      // Images not yet copied to Blob still load from the WordPress site.
      { protocol: 'https', hostname: 'everyday-zing.com' },
    ],
  },
};

export default nextConfig;
