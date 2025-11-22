"use client";
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '../signin/page.module.css'; // Reuse styles

export default function SignUp() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { signUp } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const { data, error } = await signUp(email, password);
            if (error) throw error;

            if (data?.session) {
                // Email confirmation is disabled, user is logged in
                router.push('/profile');
            } else {
                // Email confirmation is required
                alert('Success! Please check your email for the confirmation link.');
                router.push('/signin');
            }
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className={styles.container}>
            <div className={`card ${styles.authCard}`}>
                <h1 className="section-title">Sign Up</h1>
                {error && <div className={styles.error}>{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label>Email</label>
                        <input
                            type="email"
                            className="input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Password</label>
                        <input
                            type="password"
                            className="input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Sign Up</button>
                </form>
                <p className={styles.footer}>
                    Already have an account? <Link href="/signin" style={{ color: 'var(--primary)' }}>Sign In</Link>
                </p>
            </div>
        </div>
    );
}
