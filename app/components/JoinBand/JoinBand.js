import SignupForm from '../SignupForm/SignupForm';
import styles from './JoinBand.module.scss';

// "Become a Zinger": a compact pink band with the sign-up form showing.
export default function JoinBand({ text }) {
  const sentence = text || 'Giveaways, specials and partner deals by email, and nothing you don’t need.';

  return (
    <section id="join" className={styles.band} aria-labelledby="join-title">
      <div className={`frame ${styles.inner}`}>
        <div>
          <h2 id="join-title" className={styles.title} data-rise>Become a Zinger</h2>
          <p className={styles.text} data-rise>{sentence}</p>
        </div>
        <div data-rise>
          <SignupForm idPrefix="join" />
        </div>
      </div>
    </section>
  );
}
