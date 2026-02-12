"use client";
import { useState, useRef } from 'react';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { X, Upload, Check, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function UploadModal({ onClose }) {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [status, setStatus] = useState('idle'); // idle, success, error
    const router = useRouter();
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
            setStatus('idle');
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const selectedFile = e.dataTransfer.files[0];
        if (selectedFile && selectedFile.type.startsWith('image/')) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
            setStatus('idle');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Client: handleSubmit triggered");
        if (!file) {
            alert("No file selected");
            return;
        }

        setUploading(true);
        setStatus('idle');

        try {
            // 1. Upload to Firebase Storage directly from Client
            // This bypasses Vercel's 5MB payload limit
            console.log("Client: Uploading binary to Firebase Storage...");
            const filename = `${Date.now()}-${file.name.replace(/\s+/g, '-').toLowerCase()}`;
            const storagePath = `uploads/${filename}`;
            const storageRef = ref(storage, storagePath);
            
            await uploadBytes(storageRef, file);
            console.log("Client: Storage upload successful");
            
            const downloadURL = await getDownloadURL(storageRef);
            console.log(`Client: Got download URL: ${downloadURL}`);

            // 2. Send Metadata to API (small JSON payload)
            console.log("Client: Sending metadata to /api/photos");
            const res = await fetch('/api/photos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    src: downloadURL,
                    title: e.target.title.value || 'Untitled',
                    description: e.target.description.value || '',
                    storagePath: storagePath
                }),
            });

            if (res.ok) {
                const data = await res.json();
                console.log("Client: Metadata saved successfully", data);
                setStatus('success');
                setTimeout(() => {
                    onClose();
                    router.refresh();
                }, 1500);
            } else {
                let errorMsg = `Server error (${res.status})`;
                try {
                    const text = await res.text();
                    try {
                        const errorData = JSON.parse(text);
                        errorMsg = errorData.error || errorMsg;
                    } catch (parseError) {
                        errorMsg += ": " + text.substring(0, 100);
                    }
                } catch (e) {
                    errorMsg += " - Could not read response body";
                }
                console.error("Client: Server error:", errorMsg);
                alert("Metadata save failed: " + errorMsg);
                setStatus('error');
            }
        } catch (error) {
            console.error("Client: Upload process error:", error);
            alert("Upload failed: " + error.message);
            setStatus('error');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(8px)',
            zIndex: 100,
            display: 'grid',
            placeItems: 'center',
            padding: '1rem'
        }}>
            <div style={{
                background: 'var(--card-bg)',
                border: '1px solid var(--border)',
                borderRadius: '1rem',
                width: '100%',
                maxWidth: '500px',
                padding: '2rem',
                position: 'relative',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }}>
                <button
                    onClick={onClose}
                    style={{ position: 'absolute', top: '1rem', right: '1rem', padding: '0.5rem', borderRadius: '50%', color: 'var(--secondary)' }}
                >
                    <X size={20} />
                </button>

                <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem' }}>Upload Photo</h2>

                {status === 'success' ? (
                    <div style={{ textAlign: 'center', padding: '2rem 0', color: '#10b981' }}>
                        <div style={{ background: 'rgba(16, 185, 129, 0.1)', display: 'inline-flex', padding: '1rem', borderRadius: '50%', marginBottom: '1rem' }}>
                            <Check size={48} />
                        </div>
                        <p style={{ fontSize: '1.125rem', fontWeight: 500 }}>Upload Successful!</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div>
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                onDragOver={handleDragOver}
                                onDrop={handleDrop}
                                style={{
                                    border: '2px dashed var(--border)',
                                    borderRadius: 'var(--radius)',
                                    padding: '2rem',
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    background: preview ? `url(${preview}) center/cover no-repeat` : 'rgba(255,255,255,0.02)',
                                    minHeight: '200px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'border-color 0.2s',
                                    position: 'relative'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--secondary)'}
                                onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
                            >
                                {preview && <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)' }} />}

                                <div style={{ position: 'relative', zIndex: 1 }}>
                                    <Upload size={32} style={{ margin: '0 auto 1rem', color: 'var(--secondary)' }} />
                                    <p style={{ color: 'var(--secondary)' }}>
                                        {preview ? 'Click or Drag to change' : 'Drag & Drop or Click to Upload'}
                                    </p>
                                </div>

                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    accept="image/*"
                                    hidden
                                />
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.875rem', color: 'var(--secondary)' }}>Title</label>
                            <input
                                name="title"
                                placeholder="Give your photo a title"
                                style={{
                                    background: 'none',
                                    border: '1px solid var(--border)',
                                    padding: '0.75rem',
                                    borderRadius: 'var(--radius)',
                                    color: 'var(--foreground)',
                                    outline: 'none'
                                }}
                                required
                            />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.875rem', color: 'var(--secondary)' }}>Description (Optional)</label>
                            <textarea
                                name="description"
                                placeholder="Tell the story behind this shot..."
                                rows="3"
                                style={{
                                    background: 'none',
                                    border: '1px solid var(--border)',
                                    padding: '0.75rem',
                                    borderRadius: 'var(--radius)',
                                    color: 'var(--foreground)',
                                    outline: 'none',
                                    resize: 'none'
                                }}
                            />
                        </div>

                        {status === 'error' && (
                            <div style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                                <AlertCircle size={16} />
                                <span>Something went wrong. Please try again.</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="btn"
                            disabled={!file || uploading}
                            style={{ width: '100%', opacity: (!file || uploading) ? 0.5 : 1 }}
                        >
                            {uploading ? 'Uploading...' : 'Publish Photo'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
