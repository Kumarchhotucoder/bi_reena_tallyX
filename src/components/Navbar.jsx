import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, User, Settings, LogOut, LayoutDashboard } from 'lucide-react';
import logoImage from '../assets/bireena_tallyx_premium_logo.png';
import './Navbar.css';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileRef = useRef(null);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);

        // Check auth status
        const token = localStorage.getItem('tallyx_token');
        if (token) {
            setUser({
                name: localStorage.getItem('tallyx_user_name') || 'User',
                email: localStorage.getItem('tallyx_user_email') || 'user@bireena.com',
            });
        }

        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('tallyx_token');
        localStorage.removeItem('tallyx_user_name');
        localStorage.removeItem('tallyx_user_email');
        setUser(null);
        setIsProfileOpen(false);
        window.location.assign('/');
    };

    const navLinks = [
        { label: 'Home', to: '/' },
        { label: 'About', to: '/about' },
        { label: 'Services', to: '/services' },
        { label: 'Features', to: '/features' },
        { label: 'Pricing', to: '/pricing' },
        { label: 'Contact', to: '/contact' },
    ];

    return (
        <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
            <div className="top-gradient-bar">
                Powered by AI, Ringless Voicemails &amp; Marketing That Converts
            </div>

            <div className="container navbar-container">
                <div className="logo-section">
                    <Link to="/" className="navbar-logo-link">
                        <img src={logoImage} alt="BiReenaTellyX Logo" className="navbar-logo-img" />
                    </Link>
                </div>

                <div className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
                    {navLinks.map(({ label, to }) => (
                        <Link
                            key={to}
                            to={to}
                            className={location.pathname === to ? 'active-nav-link' : ''}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {label}
                            {label === 'Contact' && <ChevronDown size={14} style={{ marginLeft: 4 }} />}
                        </Link>
                    ))}
                    <div className="mobile-nav-actions">
                        <button
                            className="btn btn-default demo-btn"
                            onClick={(e) => {
                                e.preventDefault();
                                setIsMobileMenuOpen(false);
                                window.dispatchEvent(new Event('openDemoModal'));
                            }}
                        >
                            Schedule a Demo
                        </button>
                        <button
                            className="btn signin-nav-btn"
                            style={{
                                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.9) 0%, rgba(168, 85, 247, 0.9) 100%)',
                                color: 'white',
                                padding: '0.8rem 1.4rem',
                                borderRadius: '9999px',
                                width: '100%',
                                marginTop: '1rem',
                                fontWeight: 700
                            }}
                            onClick={(e) => {
                                e.preventDefault();
                                setIsMobileMenuOpen(false);
                                window.dispatchEvent(new Event('openSignInModal'));
                            }}
                        >
                            Sign In
                        </button>
                    </div>
                </div>

                <div className="nav-actions">
                    <button
                        className="btn btn-default demo-btn"
                        style={{ marginRight: '1rem' }}
                        onClick={(e) => {
                            e.preventDefault();
                            window.dispatchEvent(new Event('openDemoModal'));
                        }}
                    >
                        Schedule a Demo <span className="arrow">→</span>
                    </button>
                    <button
                        className="btn signin-nav-btn"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontWeight: 700,
                            fontSize: '0.95rem',
                            cursor: 'pointer',
                            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.9) 0%, rgba(168, 85, 247, 0.9) 100%)',
                            backdropFilter: 'blur(12px)',
                            color: 'white',
                            padding: '0.5rem 1.4rem',
                            borderRadius: '9999px',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            boxShadow: '0 8px 24px rgba(168, 85, 247, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
                            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                            letterSpacing: '0.3px',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(139, 92, 246, 1) 0%, rgba(168, 85, 247, 1) 100%)';
                            e.currentTarget.style.boxShadow = '0 12px 28px rgba(168, 85, 247, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.5)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(139, 92, 246, 0.9) 0%, rgba(168, 85, 247, 0.9) 100%)';
                            e.currentTarget.style.boxShadow = '0 8px 24px rgba(168, 85, 247, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.4)';
                        }}
                        onClick={(e) => {
                            e.preventDefault();
                            window.dispatchEvent(new Event('openSignInModal'));
                        }}
                    >
                        Sign In
                    </button>
                    <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                        {isMobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
