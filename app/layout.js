import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Shaun Ajoy Photography',
  description: 'A showcase of moments captured in time.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main style={{ minHeight: 'calc(100vh - 160px)', paddingBottom: '3rem' }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
