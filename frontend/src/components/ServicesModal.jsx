import React, { useState, useEffect } from 'react';
import { X, Building2, User, Phone, Mail, ArrowRight, Briefcase, CheckCircle2 } from 'lucide-react';
import './ServicesModal.css';

const ServicesModal = () => {
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
        window.addEventListener('openServicesModal', handleOpen);
        return () => window.removeEventListener('openServicesModal', handleOpen);
    }, []);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => setIsOpen(false), 500); // Wait for the close animation
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate an API connection delay
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSuccess(true);
        }, 1500);
    };

    if (!isOpen) return null;

    return (
        <div className={`serv-modal-overlay ${isClosing ? 'closing' : ''}`} onClick={handleClose}>
            <div className={`serv-modal-content ${isClosing ? 'closing-genie' : 'opening-genie'}`} onClick={(e) => e.stopPropagation()}>
                <button className="serv-modal-close" onClick={handleClose}>
                    <X size={24} />
                </button>

                {!isSuccess ? (
                    <>
                        <div className="serv-modal-header">
                            <div className="serv-icon-bounce">
                                <Briefcase size={32} />
                            </div>
                            <h2>Expert <span className="serv-text-gradient">Advisory Services</span></h2>
                            <p>Let our accounting experts handle the numbers while you focus on growth.</p>
                        </div>

                        <form className="serv-modal-form" onSubmit={handleSubmit}>
                            <div className="serv-field-row">
                                <div className="serv-field">
                                    <label><User size={14} /> Full Name</label>
                                    <input type="text" placeholder="Sarah Jenkins" required />
                                </div>
                                <div className="serv-field">
                                    <label><Building2 size={14} /> Company Size</label>
                                    <select defaultValue="" required>
                                        <option value="" disabled>Select employees</option>
                                        <option>1-10 Employees</option>
                                        <option>11-50 Employees</option>
                                        <option>51-200 Employees</option>
                                        <option>201+ Employees</option>
                                    </select>
                                </div>
                            </div>

                            <div className="serv-field-row">
                                <div className="serv-field">
                                    <label><Mail size={14} /> Work Email</label>
                                    <input type="email" placeholder="sarah@company.com" required />
                                </div>
                                <div className="serv-field">
                                    <label><Phone size={14} /> Phone Number</label>
                                    <input type="tel" placeholder="+91 98765 43210" required />
                                </div>
                            </div>

                            <div className="serv-field">
                                <label>Which service are you interested in?</label>
                                <select defaultValue="" required>
                                    <option value="" disabled>Select a core service</option>
                                    <option>Automated Bookkeeping</option>
                                    <option>Tax Preparation & Compliance</option>
                                    <option>Financial Reporting</option>
                                    <option>Payroll Management</option>
                                    <option>CFO Advisory Services</option>
                                    <option>Enterprise Solutions</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                className={`serv-modal-submit ${isSubmitting ? 'submitting' : ''}`}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <span>Submitting Details...</span>
                                ) : (
                                    <>
                                        <span>Request Free Consultation</span>
                                        <ArrowRight size={18} className="serv-btn-icon" />
                                    </>
                                )}
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="serv-success-state">
                        <CheckCircle2 size={64} className="serv-success-icon" />
                        <h3>Consultation Requested!</h3>
                        <p>Our financial advisory team will get in touch with you shortly to discuss your custom solution.</p>
                        <button className="serv-modal-submit success-btn" onClick={handleClose}>
                            Return to Services
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ServicesModal;
