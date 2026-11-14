'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBars, faEnvelope, faFileLines, faFolderOpen, faHouse, faImage, faInbox, faNewspaper,
} from '@fortawesome/free-solid-svg-icons';
import styles from '../admin.module.scss';
import { ADMIN_PATH } from '@/app/lib/admin-path';

const GROUPS = [
  [{ href: ADMIN_PATH, label: 'Overview', icon: faHouse, exact: true }],
  [
    { href: `${ADMIN_PATH}/pages`, label: 'Pages', icon: faFileLines },
    { href: `${ADMIN_PATH}/posts`, label: 'Posts', icon: faNewspaper },
    { href: `${ADMIN_PATH}/categories`, label: 'Categories', icon: faFolderOpen },
  ],
  [
    { href: `${ADMIN_PATH}/submissions`, label: 'Inbox', icon: faInbox, badge: 'unread' },
    { href: `${ADMIN_PATH}/subscribers`, label: 'Zingers', icon: faEnvelope },
  ],
  [
    { href: `${ADMIN_PATH}/menu`, label: 'Menu', icon: faBars },
    { href: `${ADMIN_PATH}/media`, label: 'Media', icon: faImage },
  ],
];

// The floating icon rail. Labels appear as tooltips on hover and focus.
export default function AdminNav({ unread = 0 }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Dashboard">
      {GROUPS.map((group, i) => (
        <div key={i}>
          {i > 0 && <div className={styles.navGroup} aria-hidden="true" />}
          {group.map((link) => {
            const active = link.exact ? pathname === link.href : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-label={link.label}
                aria-current={active ? 'page' : undefined}
                className={`${styles.navLink} ${active ? styles.navLinkActive : ''}`}
              >
                <FontAwesomeIcon icon={link.icon} />
                {link.badge === 'unread' && unread > 0 && <span className={styles.dot}>{unread}</span>}
                <span className={styles.tooltip} aria-hidden="true">{link.label}</span>
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
