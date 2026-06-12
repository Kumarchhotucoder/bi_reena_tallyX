import React, { useState, useEffect } from 'react';
import { X, Smartphone, Mail, Phone, ArrowRight, CheckCircle2, QrCode } from 'lucide-react';
import './MobileAppModal.css';

const MobileAppModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [deliveryMethod, setDeliveryMethod] = useState('phone');

    useEffect(() => {
        const handleOpen = () => {
            setIsOpen(true);
            setIsClosing(false);
            setIsSubmitting(false);
            setIsSuccess(false);
            setDeliveryMethod('phone');
        };
        window.addEventListener('openMobileAppModal', handleOpen);
        return () => window.removeEventListener('openMobileAppModal', handleOpen);
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
        <div className={`mo-app-modal-overlay ${isClosing ? 'closing' : ''}`} onClick={handleClose}>
            <div className={`mo-app-modal-content ${isClosing ? 'closing-genie' : 'opening-genie'}`} onClick={(e) => e.stopPropagation()}>
                <button className="mo-app-modal-close" onClick={handleClose}>
                    <X size={24} />
                </button>

                {!isSuccess ? (
                    <>
                        <div className="mo-app-modal-header">
                            <div className="mo-app-icon-bounce">
                                <Smartphone size={32} />
                            </div>
                            <h2>Get the <span className="mo-app-text-gradient">Mobile App</span></h2>
                            <p>Enter your details below and we'll send you a secure link to download the app directly to your device.</p>
                        </div>

                        <form className="mo-app-modal-form" onSubmit={handleSubmit}>
                            <div className="mo-app-delivery-toggle">
                                <button
                                    type="button"
                                    className={`toggle-btn ${deliveryMethod === 'phone' ? 'active' : ''}`}
                                    onClick={() => setDeliveryMethod('phone')}
                                >
                                    <Phone size={16} /> Text Message
                                </button>
                                <button
                                    type="button"
                                    className={`toggle-btn ${deliveryMethod === 'email' ? 'active' : ''}`}
                                    onClick={() => setDeliveryMethod('email')}
                                >
                                    <Mail size={16} /> Email Link
                                </button>
                                <button
                                    type="button"
                                    className={`toggle-btn ${deliveryMethod === 'qr' ? 'active' : ''}`}
                                    onClick={() => setDeliveryMethod('qr')}
                                >
                                    <QrCode size={16} /> Scan QR
                                </button>
                            </div>

                            {deliveryMethod === 'phone' && (
                                <div className="mo-app-field">
                                    <label><Phone size={14} /> Mobile Number</label>
                                    <div className="phone-input-group">
                                        <select className="country-code" defaultValue="+91">
                                            <option value="+1">+1 (US)</option>
                                            <option value="+44">+44 (UK)</option>
                                            <option value="+91">+91 (IN)</option>
                                            <option value="+61">+61 (AU)</option>
                                        </select>
                                        <input type="tel" placeholder="98765 43210" required />
                                    </div>
                                    <small className="field-hint">We'll text you a link to download the app. Standard rates apply.</small>
                                </div>
                            )}

                            {deliveryMethod === 'email' && (
                                <div className="mo-app-field">
                                    <label><Mail size={14} /> Email Address</label>
                                    <input type="email" placeholder="you@company.com" required />
                                    <small className="field-hint">We'll email you a secure download link.</small>
                                </div>
                            )}

                            {deliveryMethod === 'qr' && (
                                <div className="mo-app-qr-container">
                                    <div className="mo-app-qr-box">
                                        <QrCode size={120} className="qr-placeholder" />
                                    </div>
                                    <p>Point your camera at this QR code to download the app immediately.</p>
                                </div>
                            )}

                            {deliveryMethod !== 'qr' && (
                                <button
                                    type="submit"
                                    className={`mo-app-modal-submit ${isSubmitting ? 'submitting' : ''}`}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <span>Sending Link...</span>
                                    ) : (
                                        <>
                                            <span>Send Download Link</span>
                                            <ArrowRight size={18} className="mo-app-btn-icon" />
                                        </>
                                    )}
                                </button>
                            )}
                        </form>
                    </>
                ) : (
                    <div className="mo-app-success-state">
                        <CheckCircle2 size={64} className="mo-app-success-icon" />
                        <h3>Link Sent Successfully!</h3>
                        <p>Check your {deliveryMethod === 'phone' ? 'messages' : 'inbox'} for the secure download link. See you on mobile!</p>
                        <button className="mo-app-modal-submit success-btn" onClick={handleClose}>
                            Done
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MobileAppModal;
