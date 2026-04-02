import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Send, User, Building, Mail, Phone, CheckCircle } from 'lucide-react';
import './DemoModal.css';

const DemoModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleOpen = () => {
            setIsOpen(true);
            setIsClosing(false);
        };
        window.addEventListener('openDemoModal', handleOpen);
        return () => window.removeEventListener('openDemoModal', handleOpen);
    }, []);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => setIsOpen(false), 500); // Wait for the close animation
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Mock submission delay
        setTimeout(() => {
            setIsSubmitted(true);
            setTimeout(() => {
                handleClose();
            }, 3000);
            setIsSubmitting(false);
        }, 1500);
    };

    if (!isOpen) return null;

    return (
        <div className={`demo-modal-overlay ${isClosing ? 'closing' : ''}`} onClick={handleClose}>
            <div className={`demo-modal-content ${isClosing ? 'closing-genie' : 'opening-genie'}`} onClick={(e) => e.stopPropagation()}>
                <button className="demo-modal-close" onClick={handleClose}>
                    <X size={24} />
                </button>

                {isSubmitted ? (
                    <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                        <CheckCircle size={64} style={{ color: '#10b981', marginBottom: '1rem' }} />
                        <h3 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Demo Booked!</h3>
                        <p style={{ color: '#64748b' }}>Our team will reach out to you shortly to schedule your personalized product walkthrough.</p>
                    </div>
                ) : (
                    <>
                        <div className="demo-modal-header">
                            <h2>Book a Personal Demo</h2>
                            <p>See how our accounting AI can transform your workflow.</p>
                        </div>
                        <form className="demo-modal-form" onSubmit={handleSubmit}>
                            <div className="demo-field-row">
                                <div className="demo-field">
                                    <label><User size={14} /> Full Name</label>
                                    <input type="text" name="fullName" placeholder="John Doe" required />
                                </div>
                                <div className="demo-field">
                                    <label><Building size={14} /> Company Size</label>
                                    <select name="companyName" defaultValue="" required>
                                        <option value="" disabled>Select size</option>
                                        <option>1-10 employees</option>
                                        <option>11-50 employees</option>
                                        <option>51-200 employees</option>
                                        <option>201+ employees</option>
                                    </select>
                                </div>
                            </div>
                            <div className="demo-field">
                                <label><Mail size={14} /> Business Email</label>
                                <input type="email" name="email" placeholder="john@example.com" required />
                            </div>
                            <div className="demo-field">
                                <label><Phone size={14} /> Mobile Number</label>
                                <input type="tel" name="phone" placeholder="+91 98765 43210" required />
                            </div>
                            <button type="submit" className="demo-modal-submit" disabled={isSubmitting}>
                                <span>{isSubmitting ? 'Booking...' : 'Schedule My Demo'}</span>
                                {!isSubmitting && <Send size={16} className="demo-btn-icon" />}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default DemoModal;
