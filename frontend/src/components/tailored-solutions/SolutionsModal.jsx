import React, { useState, useEffect } from 'react';
import { X, Briefcase, User, Mail, Phone, ArrowRight, CheckCircle2, LayoutDashboard } from 'lucide-react';
import './SolutionsModal.css';

const SolutionsModal = () => {
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
        window.addEventListener('openSolutionsModal', handleOpen);
        return () => window.removeEventListener('openSolutionsModal', handleOpen);
    }, []);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => setIsOpen(false), 500); // Wait for the genie close animation
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API request
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSuccess(true);
        }, 1500);
    };

    if (!isOpen) return null;

    return (
        <div className={`sol-modal-overlay ${isClosing ? 'closing' : ''}`} onClick={handleClose}>
            <div className={`sol-modal-content ${isClosing ? 'closing-genie' : 'opening-genie'}`} onClick={(e) => e.stopPropagation()}>
                <button className="sol-modal-close" onClick={handleClose}>
                    <X size={24} />
                </button>

                {!isSuccess ? (
                    <>
                        <div className="sol-modal-header">
                            <div className="sol-icon-bounce">
                                <LayoutDashboard size={32} />
                            </div>
                            <h2>Discover Your <span className="sol-text-gradient">Accounting Fit</span></h2>
                            <p>Tell us a bit about your workflow so we can customize your BiReenaTallyX experience.</p>
                        </div>

                        <form className="sol-modal-form" onSubmit={handleSubmit}>
                            <div className="sol-field-row">
                                <div className="sol-field">
                                    <label><User size={14} /> Full Name</label>
                                    <input type="text" placeholder="John Doe" required />
                                </div>
                                <div className="sol-field">
                                    <label><Briefcase size={14} /> Business / Role</label>
                                    <input type="text" placeholder="e.g. CA, Agency, Startup" required />
                                </div>
                            </div>

                            <div className="sol-field-row">
                                <div className="sol-field">
                                    <label><Mail size={14} /> Work Email</label>
                                    <input type="email" placeholder="john@example.com" required />
                                </div>
                                <div className="sol-field">
                                    <label><Phone size={14} /> Phone Number</label>
                                    <input type="tel" placeholder="+91 98765 43210" required />
                                </div>
                            </div>

                            <div className="sol-field">
                                <label>What is your primary accounting need?</label>
                                <select defaultValue="" required>
                                    <option value="" disabled>Select your primary goal</option>
                                    <option>Comprehensive Bookkeeping & Ledger</option>
                                    <option>Automated Invoicing & GST</option>
                                    <option>Multi-currency & Global Business</option>
                                    <option>Student Learning & Practice</option>
                                    <option>Bulk Client Management (For CAs)</option>
                                </select>
                            </div>

                            <div className="sol-field">
                                <label>What software are you currently using?</label>
                                <select defaultValue="">
                                    <option value="" disabled>Select current software</option>
                                    <option>Tally</option>
                                    <option>Zoho Books</option>
                                    <option>Quickbooks</option>
                                    <option>Excel / Spreadsheets</option>
                                    <option>None (Starting fresh)</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                className={`sol-modal-submit ${isSubmitting ? 'submitting' : ''}`}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <span>Processing Request...</span>
                                ) : (
                                    <>
                                        <span>Get My Custom Solution</span>
                                        <ArrowRight size={18} className="sol-btn-icon" />
                                    </>
                                )}
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="sol-success-state">
                        <CheckCircle2 size={64} className="sol-success-icon" />
                        <h3>Request Received!</h3>
                        <p>Our solution experts will reach out to you shortly with a workflow perfectly tailored to your needs.</p>
                        <button className="sol-modal-submit success-btn" onClick={handleClose}>
                            Close
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SolutionsModal;
