"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import styles from './Navbar.module.css';

export default function Navbar() {
  const pathname = usePathname();
  const { user } = useAuth();

  const isActive = (path) => pathname === path;

  return (
    <nav className={styles.navbar}>
      <div className={`container ${styles.container}`}>
        <Link href="/" className={styles.logo}>
          REDLINE
        </Link>

        <div className={styles.links}>
          <Link href="/" className={`${styles.link} ${isActive('/') ? styles.active : ''}`}>
            Hub
          </Link>
          <Link href="/map" className={`${styles.link} ${isActive('/map') ? styles.active : ''}`}>
            Map
          </Link>
          <Link href="/feed" className={`${styles.link} ${isActive('/feed') ? styles.active : ''}`}>
            Feed
          </Link>
          <Link href="/groups" className={`${styles.link} ${isActive('/groups') ? styles.active : ''}`}>
            Groups
          </Link>
        </div>

        <div className={styles.auth}>
          {user ? (
            <Link href="/profile" className={styles.profileBtn}>
              <div className={styles.avatar}></div>
              <span>Profile</span>
            </Link>
          ) : (
            <div style={{ display: 'flex', gap: '10px' }}>
              <Link href="/signin" className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
                Sign In
              </Link>
              <Link href="/signup" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
