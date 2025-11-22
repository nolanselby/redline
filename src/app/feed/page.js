"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import CreatePost from '@/components/CreatePost';
import LockedContent from '@/components/LockedContent';
import styles from './page.module.css';

export default function FeedPage() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPosts = async () => {
        try {
            const { data, error } = await supabase
                .from('posts')
                .select(`
                    *,
                    profiles (
                        username,
                        avatar_url
                    )
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setPosts(data || []);
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        return date.toLocaleDateString();
    };

    return (
        <LockedContent title="Social Feed Locked">
            <div className="container">
                <h1 className="section-title" style={{ marginTop: '40px' }}>Social Feed</h1>

                <CreatePost onPostCreated={fetchPosts} />

                <div className={styles.feed}>
                    {loading ? (
                        <p>Loading posts...</p>
                    ) : posts.length === 0 ? (
                        <p>No posts yet. Be the first to post!</p>
                    ) : (
                        posts.map((post) => (
                            <div key={post.id} className={`card ${styles.post}`}>
                                <div className={styles.postHeader}>
                                    <div className={styles.avatar} style={{
                                        backgroundImage: post.profiles?.avatar_url ? `url(${post.profiles.avatar_url})` : undefined
                                    }}></div>
                                    <div className={styles.user}>
                                        <div className={styles.username}>
                                            {post.profiles?.username || 'Anonymous User'}
                                        </div>
                                        <div className={styles.time}>{formatDate(post.created_at)}</div>
                                    </div>
                                </div>
                                <div className={styles.postContent}>
                                    {post.content}
                                </div>
                                {post.image_url && (
                                    <div className={styles.postImage} style={{ backgroundImage: `url(${post.image_url})` }}></div>
                                )}
                                <div className={styles.postActions}>
                                    <button className="btn btn-secondary">Like</button>
                                    <button className="btn btn-secondary">Comment</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </LockedContent>
    );
}
