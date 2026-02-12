"use client";
import { X, Download, ChevronLeft, ChevronRight, Trash2, Edit2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import EditModal from './EditModal';
import FormattedDate from './FormattedDate';

export default function Lightbox({ photo, onClose, onNext, onPrev }) {
    const [isEditing, setIsEditing] = useState(false);
    const [currentPhoto, setCurrentPhoto] = useState(photo);
    const router = useRouter();

    // Update local state when prop changes
    useEffect(() => {
        setCurrentPhoto(photo);
    }, [photo]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (isEditing) return; // Disable shortcuts while editing
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowRight') onNext?.();
            if (e.key === 'ArrowLeft') onPrev?.();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose, onNext, onPrev, isEditing]);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'unset'; };
    }, []);

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this photo? This cannot be undone.')) return;

        try {
            const res = await fetch(`/api/photos?id=${currentPhoto.id}`, { method: 'DELETE' });
            if (res.ok) {
                onClose();
                router.refresh();
            } else {
                alert('Failed to delete photo');
            }
        } catch (error) {
            console.error(error);
            alert('Error deleting photo');
        }
    };

    if (!currentPhoto) return null;

    return (
        <>
            <div style={{
                position: 'fixed',
                inset: 0,
                zIndex: 100,
                background: 'rgba(0,0,0,0.95)',
                backdropFilter: 'blur(10px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}>

                {/* Navigation Buttons (Absolute) */}
                {onPrev && (
                    <button
                        onClick={(e) => { e.stopPropagation(); onPrev(); }}
                        style={{
                            position: 'absolute',
                            left: '1rem',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            padding: '1rem',
                            borderRadius: '50%',
                            background: 'rgba(255,255,255,0.1)',
                            color: 'white',
                            zIndex: 20,
                            cursor: 'pointer'
                        }}
                    >
                        <ChevronLeft size={32} />
                    </button>
                )}

                {onNext && (
                    <button
                        onClick={(e) => { e.stopPropagation(); onNext(); }}
                        style={{
                            position: 'absolute',
                            right: '1rem',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            padding: '1rem',
                            borderRadius: '50%',
                            background: 'rgba(255,255,255,0.1)',
                            color: 'white',
                            zIndex: 20,
                            cursor: 'pointer'
                        }}
                    >
                        <ChevronRight size={32} />
                    </button>
                )}

                {/* Close Button (Fixed Top Right) */}
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        padding: '0.5rem',
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.1)',
                        color: 'white',
                        zIndex: 30,
                        cursor: 'pointer'
                    }}
                >
                    <X size={24} />
                </button>


                {/* Main Content Container */}
                <div style={{
                    display: 'flex',
                    width: '95%',
                    height: 'auto',
                    maxHeight: '85vh',
                    maxWidth: '1200px',
                    background: 'var(--card-bg)',
                    borderRadius: '1rem',
                    overflow: 'hidden',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                    flexDirection: 'column'
                }}
                    className="lightbox-container"
                >
                    <style jsx>{`
                .lightbox-container {
                    flex-direction: column;
                }
                .image-section {
                    width: 100%;
                    height: 55vh; /* Fixed height for image area on mobile */
                    min-height: 200px;
                }
                .info-section {
                    width: 100%;
                    max-height: 30vh; /* Constrain info height on mobile */
                    border-top: 1px solid var(--border);
                }

                @media (min-width: 768px) {
                    .lightbox-container {
                        flex-direction: row !important;
                        height: 80vh !important; /* Fixed height on desktop */
                    }
                    .image-section {
                        width: 1fr !important;
                        flex: 1;
                        height: 100% !important;
                    }
                    .info-section {
                        width: 320px !important; /* Fixed narrow sidebar */
                        max-height: 100% !important;
                        height: 100% !important;
                        border-top: none !important;
                        border-left: 1px solid var(--border);
                    }
                }
            `}</style>

                    {/* Left/Top: Image */}
                    <div className="image-section" style={{
                        background: '#000',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '1rem',
                        position: 'relative'
                    }}>
                        <img
                            src={currentPhoto.src}
                            alt={currentPhoto.title}
                            style={{
                                maxWidth: '100%',
                                maxHeight: '100%',
                                objectFit: 'contain'
                            }}
                        />
                    </div>

                    {/* Right/Bottom: Info & Controls */}
                    <div className="info-section" style={{
                        padding: '1.25rem',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                        background: 'var(--card-bg)'
                    }}>
                        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '0.25rem' }}>
                            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.25rem', lineHeight: 1.2 }}>{currentPhoto.title}</h2>
                            <p style={{ color: 'var(--secondary)', fontSize: '0.7rem', marginBottom: '0.75rem' }}>
                                Uploaded on <FormattedDate dateString={currentPhoto.date} />
                            </p>

                            {currentPhoto.description && (
                                <div style={{ marginBottom: '1rem' }}>
                                    <h4 style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--foreground)', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Description</h4>
                                    <p style={{ color: '#d4d4d8', lineHeight: 1.4, fontSize: '0.85rem' }}>{currentPhoto.description}</p>
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div style={{ display: 'grid', gap: '0.5rem', marginTop: '0.75rem', borderTop: '1px solid var(--border)', paddingTop: '0.75rem' }}>
                            <a
                                href={currentPhoto.src}
                                download
                                className="btn"
                                style={{ textDecoration: 'none', justifyContent: 'center', fontSize: '0.85rem', padding: '0.5rem' }}
                            >
                                <Download size={16} />
                                Download Original
                            </a>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="btn-outline"
                                    style={{ justifyContent: 'center', fontSize: '0.85rem', padding: '0.5rem' }}
                                >
                                    <Edit2 size={16} />
                                    Edit
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="btn-outline"
                                    style={{
                                        justifyContent: 'center',
                                        fontSize: '0.85rem',
                                        padding: '0.5rem',
                                        borderColor: 'rgba(239, 68, 68, 0.5)',
                                        color: '#f87171'
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
                                    onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                                >
                                    <Trash2 size={16} />
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {isEditing && (
                <EditModal
                    photo={currentPhoto}
                    onClose={() => setIsEditing(false)}
                    onUpdate={setCurrentPhoto}
                />
            )}
        </>
    );
}
