import { getPhotos } from '@/utils/storage';
import PhotoGrid from '@/components/PhotoGrid';

// Force dynamic rendering to ensure new uploads appear on refresh
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
  const photos = await getPhotos();

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section style={{
        padding: '6rem 0 4rem',
        textAlign: 'center'
      }}>
        <div className="container">
          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: 800,
            marginBottom: '1.5rem',
            background: 'linear-gradient(to right, #fff, #a1a1aa)',
            WebkitBackgroundClip: 'text',
            WebkitFillColor: 'transparent',
            letterSpacing: '-0.03em'
          }}>
            Capturing the Unseen
          </h1>
          <p style={{
            fontSize: '1.125rem',
            color: 'var(--secondary)',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: 1.6
          }}>
            Welcome to my personal portfolio. Here I share the moments, places, and people that inspire me.
          </p>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="container">
        <PhotoGrid photos={photos} />
      </section>
    </div>
  );
}
