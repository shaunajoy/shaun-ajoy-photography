"use client";
import { useState } from 'react';
import FormattedDate from './FormattedDate';

export default function PhotoCard({ photo, onClick }) {
    const [isLoaded, setIsLoaded] = useState(false);

    return (
        <div
            onClick={onClick}
            style={{
                breakInside: 'avoid',
                marginBottom: '1.5rem',
                position: 'relative',
                cursor: 'zoom-in',
                borderRadius: 'var(--radius)',
                overflow: 'hidden',
                background: 'var(--card-bg)'
            }}
            className="group"
        >
            <img
                src={photo.src}
                alt={photo.title}
                onLoad={() => setIsLoaded(true)}
                style={{
                    width: '100%',
                    display: 'block',
                    opacity: isLoaded ? 1 : 0,
                    transition: 'opacity 0.5s ease',
                    borderRadius: 'var(--radius)'
                }}
            />

            {/* Overlay */}
            <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                opacity: 0,
                transition: 'opacity 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: '1rem'
            }}
                onMouseOver={(e) => e.currentTarget.style.opacity = 1}
                onMouseOut={(e) => e.currentTarget.style.opacity = 0}
            >
                <h4 style={{ color: 'white', fontWeight: 500, fontSize: '0.95rem' }}>{photo.title}</h4>
                {photo.date && <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem' }}><FormattedDate dateString={photo.date} /></span>}
            </div>
        </div>
    );
}
