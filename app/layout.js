import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { config } from '@fortawesome/fontawesome-svg-core';
import { Inter, Schibsted_Grotesk } from 'next/font/google';
import './globals.scss';

// Icon CSS is imported above, so Font Awesome must not inject it again at runtime.
config.autoAddCss = false;

// The site: one face in two weights. The dashboard keeps Inter.
const schibsted = Schibsted_Grotesk({
  subsets: ['latin'],
  weight: ['400', '600', '800'],
  variable: '--font-site',
  display: 'swap',
});
const inter = Inter({ subsets: ['latin'], variable: '--font-admin', display: 'swap' });

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://everyday-zing.com'),
  title: { default: 'Every Day Zing', template: '%s | Every Day Zing' },
  description: 'A lifestyle blog by Carol Joy: outfits, recipes, skincare, money and the little finds that make an ordinary week sparkle.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${schibsted.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
