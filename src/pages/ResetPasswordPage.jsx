import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, ShieldCheck, ArrowRight } from 'lucide-react';
import Layout from '../components/Layout';
import '../components/SignInModal.css'; // Reuse styles

const ResetPasswordPage = () => {
    const { token } = useParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        // Mock reset delay
        setTimeout(() => {
            setMessage('Password reset successfully! You can now log in with your new password.');
            setLoading(false);
            setTimeout(() => {
                navigate('/');
                setTimeout(() => window.dispatchEvent(new Event('openSignInModal')), 500);
            }, 3000);
        }, 1500);
    };

    return (
        <Layout hidePreFooter>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', padding: '2rem 1rem' }}>
                <div className="signin-modal-content" style={{ width: '100%', maxWidth: '500px', transform: 'none', position: 'relative', overflow: 'hidden' }}>

                    <div className="signin-glow-orb orb-orange" style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.3) 0%, transparent 70%)' }}></div>
                    <div className="signin-glow-orb orb-purple"></div>

                    <div className="signin-modal-header">
                        <div className="signin-badge" style={{ color: '#10b981', border: '1px solid rgba(16,185,129,0.2)' }}>
                            <ShieldCheck size={16} /> Secure Reset
                        </div>
                        <h2>Create New <span className="signin-text-gradient">Password</span></h2>
                        <p style={{ fontSize: '0.9rem' }}>Enter your new strong password below to access your account.</p>
                    </div>

                    {error && <div className="error-message" style={{ color: '#ef4444', marginBottom: '1rem', textAlign: 'center', position: 'relative', zIndex: 2, background: 'rgba(239, 68, 68, 0.1)', padding: '0.5rem', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>{error}</div>}
                    {message && <div style={{ color: '#10b981', marginBottom: '1rem', textAlign: 'center', position: 'relative', zIndex: 2, background: 'rgba(16, 185, 129, 0.1)', padding: '0.5rem', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.2)', fontSize: '0.9rem' }}>{message}</div>}

                    <form className="signin-modal-form" onSubmit={handleSubmit}>

                        <div className="signin-field">
                            <label><Lock size={14} /> New Password</label>
                            <div className="input-with-icon" style={{ position: 'relative' }}>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0, display: 'flex' }}>
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="signin-field">
                            <label><Lock size={14} /> Confirm New Password</label>
                            <div className="input-with-icon" style={{ position: 'relative' }}>
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0, display: 'flex' }}>
                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button type="submit" className="signin-modal-submit" disabled={loading} style={{ background: 'linear-gradient(270deg, #10b981, #059669)', marginTop: '0.5rem' }}>
                            <span>{loading ? 'Updating...' : 'Reset Password'}</span>
                            {!loading && <ArrowRight size={18} className="trial-btn-icon" />}
                        </button>

                    </form>
                </div>
            </div>
        </Layout>
    );
};

export default ResetPasswordPage;
