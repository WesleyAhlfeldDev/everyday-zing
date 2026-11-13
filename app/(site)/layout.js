import { Analytics } from '@vercel/analytics/next';
import NavBar from '@/app/components/NavBar/NavBar';
import Footer from '@/app/components/Footer/Footer';
import JoinBand from '@/app/components/JoinBand/JoinBand';
import MotionLayer from '@/app/components/MotionLayer/MotionLayer';
import { getCategories, getMenu, getPage } from '@/app/lib/content';

export default async function SiteLayout({ children }) {
  const [menuItems, categories, home] = await Promise.all([getMenu(), getCategories(), getPage('home')]);
  const join = home?.fields?.join || {};

  return (
    <div className="site">
      <NavBar menuItems={menuItems} />
      <main id="main">{children}</main>
      <JoinBand text={join.text} />
      <Footer menuItems={menuItems} categories={categories} />
      <MotionLayer />
      <Analytics />
    </div>
  );
}
