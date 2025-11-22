import LockedContent from '@/components/LockedContent';
import styles from './page.module.css';

export default function MapPage() {
    return (
        <LockedContent title="Live Map Locked">
            <div className={styles.mapContainer}>
                <div className={styles.mapPlaceholder}>
                    <h2>Live Map</h2>
                    <p>Locating nearest car meets...</p>
                    <div className={styles.radar}></div>
                </div>
            </div>
        </LockedContent>
    );
}
