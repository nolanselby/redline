import Link from 'next/link';
import LockedContent from '@/components/LockedContent';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.hub}>
      <section className={styles.hero}>
        <div className="container">
          <h1 className={styles.heroTitle}>
            The Ultimate <span className={styles.highlight}>Automotive Hub</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Buy, sell, trade, and connect. The redline is just the beginning.
          </p>
          <div className={styles.heroActions}>
            <Link href="/groups" className="btn btn-primary">Join a Crew</Link>
            <Link href="/map" className="btn btn-secondary">Find Meets</Link>
          </div>
        </div>
      </section>

      <section className={`container ${styles.categories}`}>
        <h2 className="section-title">Marketplace</h2>
        <LockedContent title="Marketplace Locked">
          <div className={styles.grid}>
            {['Cars', 'Parts', 'Paints', 'Mechanics'].map((item) => (
              <div key={item} className="card">
                <div className={styles.cardIcon}></div>
                <h3>{item}</h3>
                <p>Browse the best {item.toLowerCase()} in your area.</p>
              </div>
            ))}
          </div>
        </LockedContent>
      </section>
    </div>
  );
}
