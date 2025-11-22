"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import CreateGroupModal from '@/components/CreateGroupModal';
import LockedContent from '@/components/LockedContent';
import styles from './page.module.css';

export default function GroupsPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [groups, setGroups] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        fetchGroups();
    }, []);

    const fetchGroups = async () => {
        const { data, error } = await supabase
            .from('groups')
            .select('*')
            .order('created_at', { ascending: false });

        if (data) setGroups(data);
    };

    const handleCreateGroup = async (newGroup) => {
        if (!user) {
            alert('You must be signed in to create a group.');
            return;
        }

        const { data, error } = await supabase
            .from('groups')
            .insert([
                {
                    name: newGroup.name,
                    description: newGroup.description,
                    is_private: newGroup.isPrivate,
                    created_by: user.id
                }
            ])
            .select();

        if (error) {
            console.error('Error creating group:', error);
            alert(`Error: ${error.message}`);
        } else {
            setGroups([data[0], ...groups]);
        }
    };

    return (
        <LockedContent title="Crews Locked">
            <div className="container">
                <div className={styles.header}>
                    <div>
                        <h1 className="section-title">Crews & Teams</h1>
                        <p className={styles.subtitle}>Join a squad or start your own.</p>
                    </div>
                    <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
                        + Create Crew
                    </button>
                </div>

                <div className={styles.grid}>
                    {groups.length === 0 && <p style={{ color: 'var(--text-secondary)' }}>No crews found. Be the first to start one!</p>}
                    {groups.map((group) => (
                        <Link href={`/groups/${group.id}`} key={group.id} style={{ textDecoration: 'none' }}>
                            <div className="card" style={{ height: '100%', cursor: 'pointer' }}>
                                <div className={styles.cardHeader}>
                                    <div className={styles.groupIcon}>{group.name[0]}</div>
                                    <div className={styles.badge}>{group.is_private ? 'Private' : 'Public'}</div>
                                </div>
                                <h3 className={styles.groupName}>{group.name}</h3>
                                <p className={styles.groupDesc}>{group.description}</p>
                                <div className={styles.groupFooter}>
                                    <span className={styles.members}>{group.members_count} Members</span>
                                    <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                                        {group.is_private ? 'Request Join' : 'Join'}
                                    </button>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                <CreateGroupModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onCreate={handleCreateGroup}
                />
            </div>
        </LockedContent>
    );
}
