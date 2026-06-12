import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Send, User, Building, Mail, Phone, Tag, CheckCircle } from 'lucide-react';
import './PricingModal.css';

const PricingModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleOpen = () => {
            setIsOpen(true);
            setIsClosing(false);
            setIsSubmitted(false);
        };
        window.addEventListener('openPricingModal', handleOpen);
        return () => window.removeEventListener('openPricingModal', handleOpen);
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
        <div className={`pricing-modal-overlay ${isClosing ? 'closing' : ''}`} onClick={handleClose}>
            <div className={`pricing-modal-content ${isClosing ? 'closing-genie' : 'opening-genie'}`} onClick={(e) => e.stopPropagation()}>

                {/* Aesthetic Inner Glows */}
                <div className="pm-inner-glow pm-glow-1"></div>
                <div className="pm-inner-glow pm-glow-2"></div>

                <button className="pricing-modal-close" onClick={handleClose}>
                    <X size={24} />
                </button>

                {isSubmitted ? (
                    <div className="pricing-modal-success">
                        <CheckCircle size={64} className="success-icon" />
                        <h3>Request Sent!</h3>
                        <p>Our pricing specialists will contact you shortly to discuss the best plan for your team.</p>
                    </div>
                ) : (
                    <>
                        <div className="pricing-modal-header">
                            <h2 className="pm-gradient-text">Plan Inquiry</h2>
                            <p>Get all the details you need to choose the perfect accounting package.</p>
                        </div>
                        <form className="pricing-modal-form" onSubmit={handleSubmit}>
                            <div className="pricing-field-row">
                                <div className="pricing-field">
                                    <label><User size={14} /> Full Name</label>
                                    <input type="text" name="fullName" placeholder="John Doe" required />
                                </div>
                                <div className="pricing-field">
                                    <label><Building size={14} /> Company Name</label>
                                    <input type="text" name="companyName" placeholder="Acme Corp" required />
                                </div>
                            </div>
                            <div className="pricing-field-row">
                                <div className="pricing-field">
                                    <label><Mail size={14} /> Work Email</label>
                                    <input type="email" name="email" placeholder="john@acme.com" required />
                                </div>
                                <div className="pricing-field">
                                    <label><Phone size={14} /> Phone Number</label>
                                    <input type="tel" name="phone" placeholder="+91 98765 43210" required />
                                </div>
                            </div>
                            <div className="pricing-field">
                                <label><Tag size={14} /> Interested Plan</label>
                                <select name="interestedPlan" defaultValue="" required>
                                    <option value="" disabled>Select a plan (Optional)</option>
                                    <option value="standard">Standard (₹999/mo)</option>
                                    <option value="professional">Professional (₹1,899/mo)</option>
                                    <option value="premium">Premium (₹4,599/mo)</option>
                                    <option value="elite">Elite (₹6,999/mo)</option>
                                    <option value="ultimate">Ultimate (₹10,599/mo)</option>
                                </select>
                            </div>
                            <button type="submit" className="pricing-modal-submit" disabled={isSubmitting}>
                                <span>{isSubmitting ? 'Sending...' : 'Request Details'}</span>
                                {!isSubmitting && <Send size={16} className="pricing-btn-icon" />}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default PricingModal;
