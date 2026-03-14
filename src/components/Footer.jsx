import React from 'react';
import { Facebook, Instagram, Linkedin, Youtube, ArrowRight, Mail, Phone, MapPin, Sparkles } from 'lucide-react';
import './Footer.css';
import logoImage from '../assets/logo_light.png';

const Footer = () => {
    return (
        <footer className="ft-section">
            <div className="ft-container">

                {/* ── Top: Logo + Nav + Social ── */}
                <div className="ft-top">
                    <div className="ft-brand">
                        <div className="ft-logo-row">
                            <img src={logoImage} alt="BiReenaTellyX" className="ft-logo-img" />
                        </div>
                        <p className="ft-tagline">Simple. Secure. Tailored.</p>
                        <div className="ft-social-row">
                            <a href="https://www.facebook.com/people/Bireena-Bireena/61572904348705/" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><Facebook size={16} /></a>
                            <a href="https://www.instagram.com/bireenainfo/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><Instagram size={16} /></a>
                            <a href="https://www.linkedin.com/in/bireena-info-tech-a975533a1/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><Linkedin size={16} /></a>
                            <a href="https://www.youtube.com/@bireenainfotech" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><Youtube size={16} /></a>
                        </div>
                    </div>

                    <div className="ft-nav-cols">
                        <div className="ft-nav-col">
                            <h4>Product</h4>
                            <ul>
                                <li><a href="#">Features</a></li>
                                <li><a href="#">Pricing</a></li>
                                <li><a href="#">Blogs</a></li>
                                <li><a href="#">Tally Alternative</a></li>
                            </ul>
                        </div>
                        <div className="ft-nav-col">
                            <h4>Company</h4>
                            <ul>
                                <li><a href="#">About</a></li>
                                <li><a href="#">Vision</a></li>
                                <li><a href="#">Our Values</a></li>
                                <li><a href="#">Contact Us</a></li>
                                <li><a href="#">Careers</a></li>
                            </ul>
                        </div>
                        <div className="ft-nav-col">
                            <h4>Support</h4>
                            <ul>
                                <li><a href="#">Getting Started</a></li>
                                <li><a href="#">Help Center</a></li>
                                <li><a href="#">Request Support</a></li>
                            </ul>
                        </div>
                        <div className="ft-nav-col">
                            <h4>Contact</h4>
                            <ul>
                                <li className="ft-contact-item">
                                    <Phone size={14} className="ft-contact-icon" />
                                    <span>+91 91351-5593</span>
                                </li>
                                <li className="ft-contact-item">
                                    <Mail size={14} className="ft-contact-icon" />
                                    <span>support@bireenatallyx.com</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* ── CTA Banner ── */}
                <div className="ft-cta-banner">
                    <div className="ft-cta-content">
                        <Sparkles size={18} className="ft-cta-sparkle" />
                        <h2 className="ft-cta-text">
                            Cost-Effective, Customizable, Streamlined, Accounting Software.
                        </h2>
                    </div>
                    <button className="ft-cta-btn" onClick={(e) => { e.preventDefault(); window.dispatchEvent(new Event('openDemoModal')); }}>
                        <span>Book a Demo</span>
                        <ArrowRight size={16} className="ft-cta-arrow" />
                    </button>
                </div>

                {/* ── Bottom Bar ── */}
                <div className="ft-bottom">
                    <p className="ft-copyright">
                        Copyright &copy; 2026 Bireena Info Tech | All Rights Reserved
                    </p>
                    <div className="ft-bottom-links">
                        <a href="#">Terms and Conditions</a>
                        <span className="ft-dot">•</span>
                        <a href="#">Privacy Policy</a>
                    </div>
                </div>

            </div>
        </footer>
    );
};

export default Footer;
