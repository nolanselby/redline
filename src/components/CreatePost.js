"use client";
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import styles from './CreatePost.module.css';

export default function CreatePost({ onPostCreated }) {
    const { user } = useAuth();
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim()) return;

        setLoading(true);
        try {
            // First check if user has a profile
            const { data: profile } = await supabase
                .from('profiles')
                .select('id')
                .eq('id', user.id)
                .single();

            if (!profile) {
                // Auto-create profile if it doesn't exist (fallback)
                await supabase.from('profiles').insert({ id: user.id });
            }

            const { error } = await supabase
                .from('posts')
                .insert({
                    user_id: user.id,
                    content: content.trim(),
                });

            if (error) throw error;

            setContent('');
            if (onPostCreated) onPostCreated();
        } catch (error) {
            console.error('Error creating post:', error);
            alert('Error creating post');
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div className={`card ${styles.createPost}`}>
            <form onSubmit={handleSubmit}>
                <textarea
                    className="input"
                    placeholder="What's on your mind?"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows="3"
                    style={{ resize: 'none', marginBottom: '10px' }}
                />
                <div className={styles.actions}>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading || !content.trim()}
                    >
                        {loading ? 'Posting...' : 'Post'}
                    </button>
                </div>
            </form>
        </div>
    );
}
