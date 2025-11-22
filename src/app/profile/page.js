"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function ProfilePage() {
    const { user } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [username, setUsername] = useState('');
    const [fullName, setFullName] = useState('');
    const [bio, setBio] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');

    useEffect(() => {
        if (!user) return;

        const getProfile = async () => {
            try {
                setLoading(true);
                const { data, error, status } = await supabase
                    .from('profiles')
                    .select(`username, full_name, bio, avatar_url`)
                    .eq('id', user.id)
                    .single();

                if (error && status !== 406) {
                    throw error;
                }

                if (data) {
                    setUsername(data.username || '');
                    setFullName(data.full_name || '');
                    setBio(data.bio || '');
                    setAvatarUrl(data.avatar_url || '');
                }
            } catch (error) {
                console.error('Error loading user data!', error.message);
            } finally {
                setLoading(false);
            }
        };

        getProfile();
    }, [user]);

    const updateProfile = async () => {
        try {
            setSaving(true);

            const updates = {
                id: user.id,
                username,
                full_name: fullName,
                bio,
                updated_at: new Date(),
            };

            const { error } = await supabase.from('profiles').upsert(updates);

            if (error) {
                throw error;
            }
            alert('Profile updated!');
        } catch (error) {
            alert('Error updating the data!');
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    if (!user) {
        return (
            <div className="container">
                <p>Please sign in to view your profile.</p>
                <button onClick={() => router.push('/signin')} className="btn btn-primary">Sign In</button>
            </div>
        );
    }

    return (
        <div className="container">
            <div className={styles.profileHeader}>
                <h1 className="section-title">My Profile</h1>
                <button
                    className="btn btn-secondary"
                    onClick={() => supabase.auth.signOut()}
                >
                    Sign Out
                </button>
            </div>

            <div className={`card ${styles.profileCard}`}>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <div className={styles.form}>
                        <div className={styles.formGroup}>
                            <label htmlFor="email">Email</label>
                            <input id="email" type="text" value={user.email} disabled className="input" />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="username">Username</label>
                            <input
                                id="username"
                                type="text"
                                value={username || ''}
                                onChange={(e) => setUsername(e.target.value)}
                                className="input"
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="fullName">Full Name</label>
                            <input
                                id="fullName"
                                type="text"
                                value={fullName || ''}
                                onChange={(e) => setFullName(e.target.value)}
                                className="input"
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="bio">Bio</label>
                            <textarea
                                id="bio"
                                value={bio || ''}
                                onChange={(e) => setBio(e.target.value)}
                                className="input"
                                rows="4"
                            />
                        </div>

                        <div className={styles.actions}>
                            <button
                                className="btn btn-primary"
                                onClick={updateProfile}
                                disabled={saving}
                            >
                                {saving ? 'Saving...' : 'Update Profile'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
