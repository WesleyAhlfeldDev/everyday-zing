'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBars, faEnvelope, faFileLines, faFolderOpen, faHouse, faImage, faInbox, faNewspaper,
} from '@fortawesome/free-solid-svg-icons';
import styles from '../admin.module.scss';

const GROUPS = [
  [{ href: '/admin', label: 'Overview', icon: faHouse, exact: true }],
  [
    { href: '/admin/pages', label: 'Pages', icon: faFileLines },
    { href: '/admin/posts', label: 'Posts', icon: faNewspaper },
    { href: '/admin/categories', label: 'Categories', icon: faFolderOpen },
  ],
  [
    { href: '/admin/submissions', label: 'Inbox', icon: faInbox, badge: 'unread' },
    { href: '/admin/subscribers', label: 'Zingers', icon: faEnvelope },
  ],
  [
    { href: '/admin/menu', label: 'Menu', icon: faBars },
    { href: '/admin/media', label: 'Media', icon: faImage },
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
