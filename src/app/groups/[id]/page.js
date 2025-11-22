"use client";
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import styles from './page.module.css';

export default function GroupChatPage() {
    const { id } = useParams();
    const { user } = useAuth();
    const [group, setGroup] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        fetchGroupDetails();
        fetchMessages();

        // Subscribe to new messages
        const channel = supabase
            .channel(`group_chat:${id}`)
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `group_id=eq.${id}` }, (payload) => {
                setMessages((prev) => [...prev, payload.new]);
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [id]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const fetchGroupDetails = async () => {
        const { data } = await supabase.from('groups').select('*').eq('id', id).single();
        setGroup(data);
    };

    const fetchMessages = async () => {
        const { data } = await supabase
            .from('messages')
            .select('*')
            .eq('group_id', id)
            .order('created_at', { ascending: true });
        if (data) setMessages(data);
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !user) return;

        const { error } = await supabase
            .from('messages')
            .insert([
                {
                    content: newMessage,
                    group_id: id,
                    user_id: user.id,
                    user_email: user.email
                }
            ]);

        if (error) {
            console.error('Error sending message:', error);
            alert('Error sending message. Did you run the messages SQL?');
        } else {
            setNewMessage('');
        }
    };

    if (!group) return <div className="container" style={{ paddingTop: '40px' }}>Loading crew details...</div>;

    return (
        <div className={styles.chatContainer}>
            <div className={styles.sidebar}>
                <div className={styles.groupHeader}>
                    <div className={styles.groupIcon}>{group.name[0]}</div>
                    <div>
                        <h2 className={styles.groupName}>{group.name}</h2>
                        <p className={styles.memberCount}>{group.members_count} Members</p>
                    </div>
                </div>
                <div className={styles.description}>
                    <h3>About</h3>
                    <p>{group.description}</p>
                </div>
                <div className={styles.actions}>
                    <button className="btn btn-secondary" style={{ width: '100%' }}>Invite Members</button>
                    <button className="btn btn-secondary" style={{ width: '100%', marginTop: '10px' }}>Leave Crew</button>
                </div>
            </div>

            <div className={styles.chatArea}>
                <div className={styles.messagesList}>
                    {messages.map((msg) => (
                        <div key={msg.id} className={`${styles.message} ${msg.user_id === user?.id ? styles.ownMessage : ''}`}>
                            <div className={styles.messageHeader}>
                                <span className={styles.sender}>{msg.user_email?.split('@')[0]}</span>
                                <span className={styles.timestamp}>{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <div className={styles.bubble}>
                                {msg.content}
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                <form onSubmit={handleSendMessage} className={styles.inputArea}>
                    <input
                        type="text"
                        className={styles.chatInput}
                        placeholder="Send a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <button type="submit" className="btn btn-primary">Send</button>
                </form>
            </div>
        </div>
    );
}
