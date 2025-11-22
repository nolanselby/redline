"use client";
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import styles from './LockedContent.module.css';

export default function LockedContent({ children, title = "Sign in to view" }) {
    const { user, loading } = useAuth();

    if (loading) return null; // Or a spinner

    if (user) {
        return <>{children}</>;
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.blurredContent}>
                {children}
            </div>
            <div className={styles.overlay}>
                <div className={styles.lockContainer}>
                    <div className={styles.lockIcon}>
                        <div className={styles.shackle}></div>
                        <div className={styles.body}></div>
                    </div>
                    <h3 className={styles.title}>{title}</h3>
                    <p className={styles.subtitle}>Join the community to access this feature.</p>
                    <Link href="/signin" className="btn btn-primary">
                        Sign In / Join
                    </Link>
                </div>
            </div>
        </div>
    );
}
