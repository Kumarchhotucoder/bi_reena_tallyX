import React, { useState, useEffect } from 'react';
import { X, User, Building2, Phone, Mail, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';
import './FeatureModal.css';

const FeatureModal = () => {
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
        window.addEventListener('openFeatureModal', handleOpen);
        return () => window.removeEventListener('openFeatureModal', handleOpen);
    }, []);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => setIsOpen(false), 500); // Wait for genie close
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API fetch
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSuccess(true);
        }, 1500);
    };

    if (!isOpen) return null;

    return (
        <div className={`feat-modal-overlay ${isClosing ? 'closing' : ''}`} onClick={handleClose}>
            <div className={`feat-modal-content ${isClosing ? 'closing-genie' : 'opening-genie'}`} onClick={(e) => e.stopPropagation()}>
                <button className="feat-modal-close" onClick={handleClose}>
                    <X size={24} />
                </button>

                {!isSuccess ? (
                    <>
                        <div className="feat-modal-header">
                            <div className="feat-icon-bounce">
                                <Zap size={32} />
                            </div>
                            <h2>Upgrade Your <span className="feat-text-gradient">Workflow</span></h2>
                            <p>Unlock detailed insights into our premium accounting automation tools.</p>
                        </div>

                        <form className="feat-modal-form" onSubmit={handleSubmit}>
                            <div className="feat-field-row">
                                <div className="feat-field">
                                    <label><User size={14} /> Full Name</label>
                                    <input type="text" placeholder="John Doe" required />
                                </div>
                                <div className="feat-field">
                                    <label><Mail size={14} /> Work Email</label>
                                    <input type="email" placeholder="john@example.com" required />
                                </div>
                            </div>

                            <div className="feat-field-row">
                                <div className="feat-field">
                                    <label><Building2 size={14} /> Business Name</label>
                                    <input type="text" placeholder="Acme Finance" required />
                                </div>
                                <div className="feat-field">
                                    <label><Phone size={14} /> Phone Number</label>
                                    <input type="tel" placeholder="+91 98765 43210" required />
                                </div>
                            </div>

                            <div className="feat-field">
                                <label>Which feature interests you the most?</label>
                                <select defaultValue="" required>
                                    <option value="" disabled>Select a feature</option>
                                    <option>Bank Auto-Reconciliation</option>
                                    <option>Smart Invoicing & Billing</option>
                                    <option>Effortless OCR Receipt Tracking</option>
                                    <option>Real-time Financial Dashboards</option>
                                    <option>All of the above</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                className={`feat-modal-submit ${isSubmitting ? 'submitting' : ''}`}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <span>Processing...</span>
                                ) : (
                                    <>
                                        <span>Request Feature Demo</span>
                                        <ArrowRight size={18} className="feat-btn-icon" />
                                    </>
                                )}
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="feat-success-state">
                        <CheckCircle2 size={64} className="feat-success-icon" />
                        <h3>Request Sent Successfully!</h3>
                        <p>Our product specialist will contact you shortly with a personalized walkthrough of these features.</p>
                        <button className="feat-modal-submit success-btn" onClick={handleClose}>
                            Close Window
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FeatureModal;
