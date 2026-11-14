import { redirect } from 'next/navigation';
import Image from 'next/image';
import { getSession } from '@/app/lib/auth';
import LoginForm from './LoginForm';
import styles from '../admin.module.scss';
import { ADMIN_PATH } from '@/app/lib/admin-path';

export const metadata = { title: { absolute: 'Sign in | Every Day Zing' } };

export default async function LoginPage() {
  if (await getSession()) redirect(ADMIN_PATH);

  return (
    <div className={styles.loginWrap}>
      <div className={`card ${styles.loginCard}`}>
        <Image
          src="/brand/everyday-zing-logo.svg"
          alt="Every Day Zing"
          width={240}
          height={42}
          style={{ height: 'auto', marginBottom: 24 }}
          priority
          unoptimized
        />
        <LoginForm />
      </div>
    </div>
  );
}
