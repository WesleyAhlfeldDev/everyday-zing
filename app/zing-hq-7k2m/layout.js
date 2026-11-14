import styles from './admin.module.scss';

export const metadata = {
  title: { absolute: 'Dashboard | Every Day Zing' },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }) {
  return (
    <div className={styles.admin} data-bs-theme="light">
      {children}
    </div>
  );
}
