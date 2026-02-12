"use client";
import { useState } from 'react';
import PhotoCard from './PhotoCard';
import Lightbox from './Lightbox';

export default function PhotoGrid({ photos }) {
    const [lightboxIndex, setLightboxIndex] = useState(-1);

    const currentPhoto = photos[lightboxIndex];

    return (
        <>
            <div style={{
                columnCount: 3,
                columnGap: '1.5rem',
                padding: '1.5rem 0'
            }}
                className="masonry-grid"
            >
                <style jsx global>{`
          @media (max-width: 1024px) {
            .masonry-grid { column-count: 2 !important; }
          }
          @media (max-width: 640px) {
            .masonry-grid { column-count: 1 !important; }
          }
        `}</style>

                {photos.map((photo, index) => (
                    <PhotoCard
                        key={photo.id}
                        photo={photo}
                        onClick={() => setLightboxIndex(index)}
                    />
                ))}

                {photos.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '4rem', gridColumn: '1/-1', color: 'var(--secondary)' }}>
                        <p>No photos yet. Be the first to upload one!</p>
                    </div>
                )}
            </div>

            {lightboxIndex >= 0 && (
                <Lightbox
                    photo={currentPhoto}
                    onClose={() => setLightboxIndex(-1)}
                    onNext={lightboxIndex < photos.length - 1 ? () => setLightboxIndex(i => i + 1) : null}
                    onPrev={lightboxIndex > 0 ? () => setLightboxIndex(i => i - 1) : null}
                />
            )}
        </>
    );
}
