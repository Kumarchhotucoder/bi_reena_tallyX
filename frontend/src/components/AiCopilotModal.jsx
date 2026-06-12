import React, { useState, useEffect } from 'react';
import { X, Sparkles, Building2, User, Phone, Mail, ArrowRight, CheckCircle2, Bot } from 'lucide-react';
import './AiCopilotModal.css';

const AiCopilotModal = () => {
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
        window.addEventListener('openAiCopilotModal', handleOpen);
        return () => window.removeEventListener('openAiCopilotModal', handleOpen);
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
        <div className={`aic-modal-overlay ${isClosing ? 'closing' : ''}`} onClick={handleClose}>
            <div className={`aic-modal-content ${isClosing ? 'closing-genie' : 'opening-genie'}`} onClick={(e) => e.stopPropagation()}>
                <button className="aic-modal-close" onClick={handleClose}>
                    <X size={24} />
                </button>

                {!isSuccess ? (
                    <>
                        <div className="aic-modal-header">
                            <div className="aic-icon-bounce">
                                <Bot size={32} />
                            </div>
                            <h2>Experience the <span className="aic-text-gradient">AI Engine</span></h2>
                            <p>Get a personalized live demo of how our virtual CFO can secure and optimize your cash flow.</p>
                        </div>

                        <form className="aic-modal-form" onSubmit={handleSubmit}>
                            <div className="aic-field-row">
                                <div className="aic-field">
                                    <label><User size={14} /> Full Name</label>
                                    <input type="text" placeholder="Jane Doe" required />
                                </div>
                                <div className="aic-field">
                                    <label><Building2 size={14} /> Organization</label>
                                    <input type="text" placeholder="Acme Logistics" required />
                                </div>
                            </div>

                            <div className="aic-field-row">
                                <div className="aic-field">
                                    <label><Mail size={14} /> Work Email</label>
                                    <input type="email" placeholder="jane@acme.com" required />
                                </div>
                                <div className="aic-field">
                                    <label><Phone size={14} /> Phone Number</label>
                                    <input type="tel" placeholder="+91 98765 00000" required />
                                </div>
                            </div>

                            <div className="aic-field">
                                <label>AI Feature of Interest</label>
                                <select defaultValue="" required>
                                    <option value="" disabled>Select your primary use-case</option>
                                    <option>Cashflow Projection & Forecasting</option>
                                    <option>Anomaly & Fraud Detection</option>
                                    <option>Tax Optimization (GST/TDS)</option>
                                    <option>Auto-Categorization of Transactions</option>
                                    <option>I want to see everything</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                className={`aic-modal-submit ${isSubmitting ? 'submitting' : ''}`}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Sparkles size={18} className="aic-spin" />
                                        <span>Initializing Agent...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Schedule Live AI Demo</span>
                                        <ArrowRight size={18} className="aic-btn-icon" />
                                    </>
                                )}
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="aic-success-state">
                        <CheckCircle2 size={64} className="aic-success-icon" />
                        <h3>Demo Scheduled!</h3>
                        <p>Our AI specialists will contact you shortly to give you exclusive access to the virtual CFO.</p>
                        <button className="aic-modal-submit success-btn" onClick={handleClose}>
                            Close Window
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AiCopilotModal;
