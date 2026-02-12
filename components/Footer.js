import { Instagram, Twitter } from 'lucide-react';

export default function Footer() {
    return (
        <footer style={{
            borderTop: '1px solid var(--border)',
            padding: '3rem 0',
            marginTop: 'auto',
            color: 'var(--secondary)'
        }}>
            <div className="container" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem'
            }}>
                <p>© {new Date().getFullYear()} Shaun Ajoy Photography. All rights reserved.</p>

                <div style={{ display: 'flex', gap: '1.5rem' }}>
                    <a href="#" style={{ transition: 'color 0.2s' }} aria-label="Instagram">
                        <Instagram size={20} />
                    </a>
                    <a href="#" style={{ transition: 'color 0.2s' }} aria-label="Twitter">
                        <Twitter size={20} />
                    </a>
                </div>
            </div>
        </footer>
    );
}
