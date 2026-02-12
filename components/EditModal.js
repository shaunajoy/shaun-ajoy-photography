"use client";
import { useState } from 'react';
import { X, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function EditModal({ photo, onClose, onUpdate }) {
    const [title, setTitle] = useState(photo.title);
    const [description, setDescription] = useState(photo.description || '');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/photos', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: photo.id, title, description }),
            });

            if (res.ok) {
                const updatedPhoto = await res.json();
                onUpdate(updatedPhoto); // Update parent state
                router.refresh(); // Refresh server components
                onClose();
            } else {
                alert('Failed to update photo');
            }
        } catch (error) {
            console.error(error);
            alert('Error updating photo');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(4px)',
            zIndex: 200, // Higher than lightbox
            display: 'grid',
            placeItems: 'center',
            padding: '1rem'
        }}>
            <div style={{
                background: 'var(--card-bg)',
                border: '1px solid var(--border)',
                borderRadius: '1rem',
                width: '100%',
                maxWidth: '400px',
                padding: '1.5rem',
                position: 'relative'
            }}>
                <button
                    onClick={onClose}
                    style={{ position: 'absolute', top: '1rem', right: '1rem', padding: '0.5rem', color: 'var(--secondary)' }}
                >
                    <X size={20} />
                </button>

                <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: 600 }}>Edit Photo Details</h3>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--secondary)' }}>Title</label>
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            style={{
                                width: '100%',
                                background: 'rgba(0,0,0,0.2)',
                                border: '1px solid var(--border)',
                                padding: '0.75rem',
                                borderRadius: 'var(--radius)',
                                color: 'var(--foreground)',
                                outline: 'none'
                            }}
                            required
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--secondary)' }}>Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows="3"
                            style={{
                                width: '100%',
                                background: 'rgba(0,0,0,0.2)',
                                border: '1px solid var(--border)',
                                padding: '0.75rem',
                                borderRadius: 'var(--radius)',
                                color: 'var(--foreground)',
                                outline: 'none',
                                resize: 'none'
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn-outline"
                            style={{ flex: 1, justifyContent: 'center' }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn"
                            disabled={loading}
                            style={{ flex: 1 }}
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
