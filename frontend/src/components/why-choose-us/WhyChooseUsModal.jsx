import React, { useState, useEffect } from 'react';
import { X, Sparkles, Building2, User, Phone, Mail, ArrowRight, CheckCircle2 } from 'lucide-react';
import './WhyChooseUsModal.css';

const WhyChooseUsModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        const handleOpen = () => {
            setIsOpen(true);
            setIsClosing(false);
            setIsSubmitting(false);
            setIsSuccess(false);
        };
        window.addEventListener('openWhyChooseUsModal', handleOpen);
        return () => window.removeEventListener('openWhyChooseUsModal', handleOpen);
    }, []);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => setIsOpen(false), 500); // Wait for the close animation
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSuccess(true);
        }, 1500);
    };

    if (!isOpen) return null;

    return (
        <div className={`wcu-modal-overlay ${isClosing ? 'closing' : ''}`} onClick={handleClose}>
            <div className={`wcu-modal-content ${isClosing ? 'closing-genie' : 'opening-genie'}`} onClick={(e) => e.stopPropagation()}>
                <button className="wcu-modal-close" onClick={handleClose}>
                    <X size={24} />
                </button>

                {!isSuccess ? (
                    <>
                        <div className="wcu-modal-header">
                            <div className="wcu-icon-bounce">
                                <Sparkles size={32} />
                            </div>
                            <h2>Unleash <span className="wcu-text-gradient">Total Automation</span></h2>
                            <p>Discover how our AI-powered insights and quantum-level security can transform your workflows.</p>
                        </div>

                        <form className="wcu-modal-form" onSubmit={handleSubmit}>
                            <div className="wcu-field-row">
                                <div className="wcu-field">
                                    <label><User size={14} /> Full Name</label>
                                    <input type="text" placeholder="Alex Morgan" required />
                                </div>
                                <div className="wcu-field">
                                    <label><Building2 size={14} /> Company Name</label>
                                    <input type="text" placeholder="Global Tech Inc." required />
                                </div>
                            </div>

                            <div className="wcu-field-row">
                                <div className="wcu-field">
                                    <label><Mail size={14} /> Work Email</label>
                                    <input type="email" placeholder="alex@globaltech.com" required />
                                </div>
                                <div className="wcu-field">
                                    <label><Phone size={14} /> Phone Number</label>
                                    <input type="tel" placeholder="+91 91234 56789" required />
                                </div>
                            </div>

                            <div className="wcu-field">
                                <label>What capability are you most interested in?</label>
                                <select defaultValue="" required>
                                    <option value="" disabled>Select your core interest</option>
                                    <option>AI-Powered Automation & Machine Learning</option>
                                    <option>Real-Time Analytics & Dashboards</option>
                                    <option>Bank-Grade Security & Encryption</option>
                                    <option>Global Tax Compliance & Multi-Currency</option>
                                    <option>Intelligent OCR Invoicing</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                className={`wcu-modal-submit ${isSubmitting ? 'submitting' : ''}`}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <span>Activating...</span>
                                ) : (
                                    <>
                                        <span>Unlock Premium Tools</span>
                                        <ArrowRight size={18} className="wcu-btn-icon" />
                                    </>
                                )}
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="wcu-success-state">
                        <CheckCircle2 size={64} className="wcu-success-icon" />
                        <h3>You're on the list!</h3>
                        <p>Our automation specialists will be in touch shortly to show you a live demo of these capabilities.</p>
                        <button className="wcu-modal-submit success-btn" onClick={handleClose}>
                            Close
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WhyChooseUsModal;
