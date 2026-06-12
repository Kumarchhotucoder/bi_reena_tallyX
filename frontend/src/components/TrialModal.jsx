import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Building2, User, Mail, Lock, Sparkles, ArrowRight, CheckCircle, Eye, EyeOff, Globe, MapPin, Phone } from 'lucide-react';
import toast from 'react-hot-toast';
import logoImage from '../assets/logo.jpeg';
import './TrialModal.css';
import { API_BASE_URL } from '../config';

const TrialModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const handleOpen = () => {
            setIsOpen(true);
            setIsClosing(false);
        };
        window.addEventListener('openTrialModal', handleOpen);
        return () => window.removeEventListener('openTrialModal', handleOpen);
    }, []);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => setIsOpen(false), 500);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData(e.target);
        const password = formData.get('password');
        const confirmPassword = formData.get('confirmPassword');

        if (password !== confirmPassword) {
            setError("Passwords do not match!");
            setIsSubmitting(false);
            return;
        }

        setError('');

        try {
            const countryCode = formData.get('countryCode');
            const mobile = formData.get('mobile');
            const response = await fetch(`${API_BASE_URL}/api/`, { // matches router.post('/') in userRoutes.js
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: formData.get('companyName'), // Using company name as user name for simplicity in this demo logic
                    email: formData.get('email'),
                    password: password,
                    companyName: formData.get('companyName'),
                    phone: countryCode + mobile
                })
            });

            const data = await response.json();

            if (data.success) {
                setIsSubmitted(true);
                setIsSubmitting(false);
                toast.success('Account created successfully!', {
                    style: {
                        background: '#1e1b4b',
                        color: '#fff',
                        border: '1px solid #10b981',
                    }
                });
            } else {
                setError(data.message || 'Registration failed');
                setIsSubmitting(false);
            }
        } catch (err) {
            console.error('Registration Error:', err);
            setError('Server connection failed. Is the backend running?');
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className={`trial-modal-overlay ${isClosing ? 'closing' : ''}`} onClick={handleClose}>
            {/* Colorful neon background orbs behind the modal */}
            <div className={`trial-modal-content ${isClosing ? 'closing-genie' : 'opening-genie'}`} onClick={(e) => e.stopPropagation()}>
                <div className="trial-glow-orb orb-orange"></div>
                <div className="trial-glow-orb orb-purple"></div>

                <button className="trial-modal-close" onClick={handleClose}>
                    <X size={24} />
                </button>

                {isSubmitted ? (
                    <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                        <CheckCircle size={72} style={{ color: '#10b981', marginBottom: '1.5rem' }} />
                        <h3 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'white' }}>Account Created!</h3>
                        <p style={{ color: '#cbd5e1', fontSize: '1.1rem', marginBottom: '2rem' }}>Your account is ready. Please sign in with your email and password to access the dashboard.</p>
                        <button
                            onClick={() => {
                                handleClose();
                                setTimeout(() => window.dispatchEvent(new Event('openSignInModal')), 300);
                            }}
                            className="trial-modal-submit"
                            style={{ maxWidth: '300px', margin: '0 auto' }}
                        >
                            <span>Sign In Now</span>
                            <ArrowRight size={18} className="trial-btn-icon" />
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="trial-modal-header">
                            <img src={logoImage} alt="BiReenaTellyX" style={{ height: '55px', objectFit: 'contain', margin: '0 auto 1.5rem auto', display: 'block', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))' }} />
                            <h2>Start Your <span className="trial-text-gradient">Financial Journey</span></h2>
                            <p>No credit card required. Full access to all premium accounting tools.</p>
                        </div>

                        {error && (
                            <div className="trial-error-notification">
                                <div className="trial-error-glow"></div>
                                <div className="trial-error-content">
                                    <div className="trial-error-icon-wrap">
                                        <img src={logoImage} alt="Logo" className="trial-error-logo" />
                                    </div>
                                    <span className="trial-error-text">
                                        {error}
                                    </span>
                                    <button
                                        onClick={() => setError('')}
                                        className="trial-error-close"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            </div>
                        )}

                        <form className="trial-modal-form" onSubmit={handleSubmit}>
                            <div className="trial-field-row">
                                <div className="trial-field">
                                    <label><Building2 size={14} /> Company Name</label>
                                    <input type="text" name="companyName" placeholder="Acme Corporation" required />
                                </div>
                                <div className="trial-field">
                                    <label><Mail size={14} /> Email address</label>
                                    <input type="email" name="email" placeholder="jane@company.com" required />
                                </div>
                            </div>

                            <div className="trial-field">
                                <label><Phone size={14} /> Mobile Number</label>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <select name="countryCode" defaultValue="+91" style={{ width: '90px', padding: '0.9rem', flexShrink: 0 }} required>
                                        <option value="+91">+91 (IN)</option>
                                        <option value="+1">+1 (US)</option>
                                        <option value="+44">+44 (UK)</option>
                                        <option value="+61">+61 (AU)</option>
                                        <option value="+971">+971 (AE)</option>
                                    </select>
                                    <input type="tel" name="mobile" placeholder="Mobile Number" style={{ flex: 1 }} required />
                                </div>
                            </div>

                            <div className="trial-field-row">
                                <div className="trial-field">
                                    <label><Globe size={14} /> Country</label>
                                    <select name="country" defaultValue="" required>
                                        <option value="" disabled hidden>Select Country</option>
                                        <option value="India">India</option>
                                        <option value="United States">United States</option>
                                        <option value="United Kingdom">United Kingdom</option>
                                        <option value="Australia">Australia</option>
                                        <option value="Canada">Canada</option>
                                        <option value="UAE">United Arab Emirates</option>
                                    </select>
                                </div>
                                <div className="trial-field">
                                    <label><MapPin size={14} /> State/Location</label>
                                    <select name="state" defaultValue="" required>
                                        <option value="" disabled hidden>Select State</option>
                                        <option value="Chhattisgarh">Chhattisgarh</option>
                                        <option value="Maharashtra">Maharashtra</option>
                                        <option value="Delhi">Delhi</option>
                                        <option value="Karnataka">Karnataka</option>
                                        <option value="Gujarat">Gujarat</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>

                            <div className="trial-field-row">
                                <div className="trial-field">
                                    <label><Lock size={14} /> Password</label>
                                    <div style={{ position: 'relative', width: '100%' }}>
                                        <input type={showPassword ? "text" : "password"} name="password" placeholder="••••••••" required style={{ width: '100%', paddingRight: '40px' }} />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0, display: 'flex' }}>
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>
                                <div className="trial-field">
                                    <label><Lock size={14} /> Confirm Password</label>
                                    <div style={{ position: 'relative', width: '100%' }}>
                                        <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" placeholder="••••••••" required style={{ width: '100%', paddingRight: '40px' }} />
                                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0, display: 'flex' }}>
                                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="trial-terms-checkbox" style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginTop: '1rem', marginBottom: '1.5rem' }}>
                                <input type="checkbox" id="terms" required style={{ marginTop: '4px', cursor: 'pointer', accentColor: '#10b981' }} />
                                <label htmlFor="terms" style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: '1.4', cursor: 'pointer' }}>
                                    I've read and agreed to the <a href="#" style={{ color: '#10b981', textDecoration: 'none', fontWeight: '500' }}>Terms & Conditions</a> and <a href="#" style={{ color: '#10b981', textDecoration: 'none', fontWeight: '500' }}>Privacy Policy</a>
                                </label>
                            </div>

                            <button type="submit" className="trial-modal-submit" disabled={isSubmitting}>
                                <span>{isSubmitting ? 'Creating Account...' : 'Sign Up'}</span>
                                {!isSubmitting && <ArrowRight size={18} className="trial-btn-icon" />}
                            </button>

                            <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
                                <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                                    Already have an account?{' '}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            handleClose();
                                            setTimeout(() => window.dispatchEvent(new Event('openSignInModal')), 300);
                                        }}
                                        style={{ background: 'none', border: 'none', color: '#10b981', fontWeight: '700', cursor: 'pointer', padding: 0, fontSize: '0.9rem' }}
                                    >
                                        Sign in
                                    </button>
                                </p>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default TrialModal;
