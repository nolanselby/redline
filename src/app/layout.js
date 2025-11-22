import Navbar from '@/components/Navbar';
import { AuthProvider } from '@/context/AuthContext';
import './globals.css';

export const metadata = {
  title: 'Redline | The Car Enthusiast Platform',
  description: 'Buy, sell, trade, and connect with car enthusiasts.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />
          <main style={{ minHeight: 'calc(100vh - 70px)' }}>
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
