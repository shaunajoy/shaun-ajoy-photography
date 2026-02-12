"use client";
import Link from 'next/link';
import { Camera, Upload } from 'lucide-react';
import { useState } from 'react';
import UploadModal from './UploadModal';

export default function Header() {
    const [isUploadOpen, setIsUploadOpen] = useState(false);

    return (
        <>
            <header style={{
                position: 'sticky',
                top: 0,
                zIndex: 50,
                borderBottom: '1px solid var(--border)',
                backdropFilter: 'blur(12px)',
                backgroundColor: 'rgba(10, 10, 10, 0.8)'
            }}>
                <div className="container" style={{
                    height: '80px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <Link href="/" style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        fontWeight: 700,
                        fontSize: '1.25rem',
                        letterSpacing: '-0.025em'
                    }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            background: 'var(--primary)',
                            color: 'var(--background)',
                            display: 'grid',
                            placeItems: 'center',
                            borderRadius: '12px'
                        }}>
                            <Camera size={20} />
                        </div>
                        <span>Shaun Ajoy Photography</span>
                    </Link>

                    <nav style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                        <button
                            onClick={() => setIsUploadOpen(true)}
                            className="btn"
                            style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                        >
                            <Upload size={16} />
                            <span>Upload Photo</span>
                        </button>
                    </nav>
                </div>
            </header>

            {isUploadOpen && <UploadModal onClose={() => setIsUploadOpen(false)} />}
        </>
    );
}
