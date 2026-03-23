import React, { useState, useEffect } from 'react';
import { X, Mail, Lock, LogIn, Sparkles, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import logoImage from '../assets/bireena_tallyx_premium_logo.png';
import './SignInModal.css';

const SignInModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const handleOpen = () => {
            setIsOpen(true);
            setIsClosing(false);
        };
        window.addEventListener('openSignInModal', handleOpen);
        return () => window.removeEventListener('openSignInModal', handleOpen);
    }, []);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsOpen(false);
            setError('');
            setEmail('');
            setPassword('');
        }, 500); // Matched to TrialModal animation timing
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:5001/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (data.success) {
                // Save real JWT token and user details to localStorage
                localStorage.setItem('tallyx_token', data.token);
                localStorage.setItem('tallyx_user_name', data.name);
                localStorage.setItem('tallyx_company_name', data.companyName);
                localStorage.setItem('tallyx_user_email', data.email);
                
                toast.success('Login Successful! Redirecting...', {
                    style: {
                        background: '#1e1b4b',
                        color: '#fff',
                        border: '1px solid #10b981',
                    }
                });

                setTimeout(() => {
                    window.location.assign('/dashboard');
                }, 1000);
            } else {
                setError(data.message || 'Invalid email or password');
                toast.error(data.message || 'Login failed', {
                    style: {
                        background: '#1e1b4b',
                        color: '#fff',
                        border: '1px solid #ef4444',
                    }
                });
                setLoading(false);
            }
        } catch (err) {
            console.error('Login Error:', err);
            setError('Server connection failed. Is the backend running?');
            toast.error('Connection failed', {
                style: {
                    background: '#1e1b4b',
                    color: '#fff',
                    border: '1px solid #ef4444',
                }
            });
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className={`signin-modal-overlay ${isClosing ? 'closing' : ''}`} onClick={handleClose}>
            <div className={`signin-modal-content ${isClosing ? 'closing-scale' : 'opening-scale'}`} onClick={(e) => e.stopPropagation()}>
                {/* Background Glow Orbs */}
                <div className="signin-glow-orb orb-orange"></div>
                <div className="signin-glow-orb orb-purple"></div>

                <button className="signin-modal-close" onClick={handleClose}>
                    <X size={24} />
                </button>

                <div className="signin-modal-header">
                    <img src={logoImage} alt="BiReenaTellyX" style={{ height: '55px', objectFit: 'contain', margin: '0 auto 1.5rem auto', display: 'block', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))' }} />
                    <div className="signin-badge">
                        <Sparkles size={16} /> Secure Login
                    </div>
                    <h2>Welcome <span className="signin-text-gradient">Back</span></h2>
                    <p>Enter your credentials to access your dashboard</p>
                </div>

                {error && <div className="error-message" style={{ color: '#ef4444', marginBottom: '1rem', textAlign: 'center', position: 'relative', zIndex: 2, background: 'rgba(239, 68, 68, 0.1)', padding: '0.5rem', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>{error}</div>}

                <form className="signin-modal-form" onSubmit={handleSubmit}>
                    <div className="signin-field">
                        <label><Mail size={14} /> Email Address</label>
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

                    <div className="signin-field">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <label style={{ margin: 0 }}><Lock size={14} /> Password</label>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleClose();
                                    setTimeout(() => window.dispatchEvent(new Event('openForgotPasswordModal')), 300);
                                }}
                                style={{ background: 'none', border: 'none', color: '#10b981', fontSize: '0.8rem', cursor: 'pointer', padding: 0 }}
                            >
                                Forgot password?
                            </button>
                        </div>
                        <div className="input-with-icon" style={{ marginTop: '0.5rem' }}>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="signin-modal-submit" disabled={loading}>
                        <span>{loading ? 'Authenticating...' : 'Access Dashboard'}</span>
                        {!loading && <ArrowRight size={18} className="trial-btn-icon" />}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SignInModal;
