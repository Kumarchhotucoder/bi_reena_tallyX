import React, { useState, useEffect } from 'react';
import { X, Mail, Lock, LogIn, Eye, EyeOff, Shield, User } from 'lucide-react';
import toast from 'react-hot-toast';
import './SignInModal.css';

const SignInModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [role, setRole] = useState('admin'); // 'admin' or 'staff'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
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
        }, 300);
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
                // Check if role matches if needed, but usually login returns the role
                localStorage.setItem('tallyx_token', data.token);
                localStorage.setItem('tallyx_user_name', data.name);
                localStorage.setItem('tallyx_user_role', data.role);
                
                toast.success('Login Successful!', {
                    style: {
                        background: '#fff',
                        color: '#f43f5e',
                        border: '1px solid #f43f5e',
                    }
                });

                setTimeout(() => {
                    window.location.assign('/dashboard');
                }, 1000);
            } else {
                setError(data.message || 'Invalid email or password');
                toast.error(data.message || 'Login failed');
                setLoading(false);
            }
        } catch (err) {
            console.error('Login Error:', err);
            setError('Server connection failed.');
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className={`signin-v2-overlay ${isClosing ? 'closing' : ''}`} onClick={handleClose}>
            <div className={`signin-v2-card ${isClosing ? 'closing' : ''}`} onClick={(e) => e.stopPropagation()}>
                <button className="signin-v2-close" onClick={handleClose}>
                    <X size={20} />
                </button>

                <div className="signin-v2-header">
                    <h1>Welcome Back!</h1>
                    <p>Login to manage your hotel operations</p>
                </div>

                <div className="signin-v2-role-selector">
                    <button 
                        className={`role-btn ${role === 'admin' ? 'active' : ''}`}
                        onClick={() => setRole('admin')}
                    >
                        <Shield size={18} />
                        <span>Admin</span>
                    </button>
                    <button 
                        className={`role-btn ${role === 'staff' ? 'active' : ''}`}
                        onClick={() => setRole('staff')}
                    >
                        <User size={18} />
                        <span>Staff</span>
                    </button>
                </div>

                <form className="signin-v2-form" onSubmit={handleSubmit}>
                    <div className="signin-v2-field">
                        <label>Email Address</label>
                        <div className="input-group">
                            <Mail className="input-icon" size={20} />
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="signin-v2-field">
                        <label>Password</label>
                        <div className="input-group">
                            <Lock className="input-icon" size={20} />
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button 
                                type="button" 
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    {error && <div className="signin-v2-error">{error}</div>}

                    <button type="submit" className="signin-v2-submit" disabled={loading}>
                        {loading ? 'LOGGING IN...' : 'LOGIN'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SignInModal;
