"use client";
import { useState } from 'react';
import styles from './CreateGroupModal.module.css';

export default function CreateGroupModal({ isOpen, onClose, onCreate }) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isPrivate, setIsPrivate] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onCreate({ name, description, isPrivate });
        setName('');
        setDescription('');
        setIsPrivate(false);
        onClose();
    };

    return (
        <div className={styles.overlay}>
            <div className={`${styles.modal} glass-panel`}>
                <div className={styles.header}>
                    <h2>Create New Crew</h2>
                    <button onClick={onClose} className={styles.closeBtn}>&times;</button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label>Crew Name</label>
                        <input
                            type="text"
                            className="input"
                            placeholder="e.g. Night Runners"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Description</label>
                        <textarea
                            className="input"
                            placeholder="What's this crew about?"
                            rows="3"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        ></textarea>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.checkboxLabel}>
                            <input
                                type="checkbox"
                                checked={isPrivate}
                                onChange={(e) => setIsPrivate(e.target.checked)}
                            />
                            <span>Private Group (Invite Only)</span>
                        </label>
                    </div>

                    <div className={styles.actions}>
                        <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
                        <button type="submit" className="btn btn-primary">Create Crew</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
