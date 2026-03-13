import React, { useState, useEffect } from 'react';
import { X, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import './SignInModal.css';

const ForgotPasswordModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const handleOpen = () => {
            setIsOpen(true);
            setIsClosing(false);
        };
        window.addEventListener('openForgotPasswordModal', handleOpen);
        return () => window.removeEventListener('openForgotPasswordModal', handleOpen);
    }, []);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsOpen(false);
            setMessage('');
            setError('');
            setEmail('');
        }, 500);
    };

    const handleBackToLogin = () => {
        handleClose();
        setTimeout(() => window.dispatchEvent(new Event('openSignInModal')), 300);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            const res = await fetch('http://localhost:5001/api/password/forgot', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();

            if (data.success) {
                setMessage('An email with a reset link has been sent to your address (valid for 10 minutes).');
            } else {
                setError(data.message || 'Failed to send email. Please try again.');
            }
        } catch (err) {
            console.error(err);
            setError('Unable to connect to server. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className={`signin-modal-overlay ${isClosing ? 'closing' : ''}`} onClick={handleClose}>
            <div className={`signin-modal-content ${isClosing ? 'closing-scale' : 'opening-scale'}`} onClick={(e) => e.stopPropagation()}>
                {/* Background Glow Orbs */}
                <div className="signin-glow-orb orb-orange" style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.3) 0%, transparent 70%)' }}></div>
                <div className="signin-glow-orb orb-purple"></div>

                <button className="signin-modal-close" onClick={handleClose}>
                    <X size={24} />
                </button>

                <div className="signin-modal-header">
                    <div className="signin-badge" style={{ color: '#10b981', border: '1px solid rgba(16,185,129,0.2)' }}>
                        <ShieldCheck size={16} /> Account Recovery
                    </div>
                    <h2>Reset <span className="signin-text-gradient">Password</span></h2>
                    <p style={{ fontSize: '0.9rem' }}>Enter your email address and we'll send you a secure link to reset your password.</p>
                </div>

                {error && <div className="error-message" style={{ color: '#ef4444', marginBottom: '1rem', textAlign: 'center', position: 'relative', zIndex: 2, background: 'rgba(239, 68, 68, 0.1)', padding: '0.5rem', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>{error}</div>}
                {message && <div style={{ color: '#10b981', marginBottom: '1rem', textAlign: 'center', position: 'relative', zIndex: 2, background: 'rgba(16, 185, 129, 0.1)', padding: '0.5rem', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.2)', fontSize: '0.9rem' }}>{message}</div>}

                <form className="signin-modal-form" onSubmit={handleSubmit}>
                    <div className="signin-field">
                        <label><Mail size={14} /> Registered Email</label>
                        <div className="input-with-icon">
                            <input
                                type="email"
                                placeholder="name@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="signin-modal-submit" disabled={loading} style={{ background: 'linear-gradient(270deg, #10b981, #059669)', marginTop: '0.5rem' }}>
                        <span>{loading ? 'Sending...' : 'Send Reset Link'}</span>
                        {!loading && <ArrowRight size={18} className="trial-btn-icon" />}
                    </button>

                    <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
                        <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                            Remember your password?{' '}
                            <button
                                type="button"
                                onClick={handleBackToLogin}
                                style={{ background: 'none', border: 'none', color: '#10b981', fontWeight: '700', cursor: 'pointer', padding: 0, fontSize: '0.9rem' }}
                            >
                                Back to Log in
                            </button>
                        </p>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default ForgotPasswordModal;
