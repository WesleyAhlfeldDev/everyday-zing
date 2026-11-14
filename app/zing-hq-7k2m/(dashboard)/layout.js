import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpRightFromSquare, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { requireAdmin } from '@/app/lib/auth';
import { getOverview } from '../data';
import { logout } from '../actions';
import AdminNav from '../components/AdminNav';
import styles from '../admin.module.scss';

export const dynamic = 'force-dynamic';

export default async function DashboardLayout({ children }) {
  const session = await requireAdmin();
  const { unread } = await getOverview();

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <Link href="/admin" className={styles.brand} aria-label="Dashboard home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/zing-mark.svg" alt="" width={30} height={30} />
        </Link>
        <AdminNav unread={unread} />
        <div className={styles.sidebarFooter}>
          <a href="/" target="_blank" rel="noopener noreferrer" className={styles.navLink} aria-label="View site">
            <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
            <span className={styles.tooltip} aria-hidden="true">View site</span>
          </a>
          <form action={logout}>
            <button type="submit" className={styles.navLink} aria-label={`Sign out ${session.sub}`}>
              <FontAwesomeIcon icon={faRightFromBracket} />
              <span className={styles.tooltip} aria-hidden="true">Sign out</span>
            </button>
          </form>
        </div>
      </aside>
      <main className={styles.main}>{children}</main>
    </div>
  );
}
