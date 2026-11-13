import { redirect } from 'next/navigation';
import Image from 'next/image';
import { getSession } from '@/app/lib/auth';
import LoginForm from './LoginForm';
import styles from '../admin.module.scss';

export const metadata = { title: { absolute: 'Sign in | Every Day Zing' } };

export default async function LoginPage() {
  if (await getSession()) redirect('/admin');

  return (
    <div className={styles.loginWrap}>
      <div className={`card ${styles.loginCard}`}>
        <Image
          src="/brand/everyday-zing-logo.png"
          alt="Every Day Zing"
          width={200}
          height={40}
          style={{ height: 'auto', marginBottom: 24 }}
          priority
        />
        <LoginForm />
      </div>
    </div>
  );
}
