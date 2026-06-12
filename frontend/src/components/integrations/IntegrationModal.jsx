import React, { useState, useEffect } from 'react';
import { X, Link2, Key, Database, RefreshCw, CheckCircle2 } from 'lucide-react';
import './IntegrationModal.css';

const IntegrationModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const handleOpen = () => {
            setIsOpen(true);
            setIsClosing(false);
            setIsConnecting(false);
            setIsConnected(false);
        };
        window.addEventListener('openIntegrationModal', handleOpen);
        return () => window.removeEventListener('openIntegrationModal', handleOpen);
    }, []);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => setIsOpen(false), 500); // Wait for the close animation
    };

    const handleConnect = (e) => {
        e.preventDefault();
        setIsConnecting(true);
        // Simulate an API connection delay
        setTimeout(() => {
            setIsConnecting(false);
            setIsConnected(true);
        }, 2000);
    };

    if (!isOpen) return null;

    return (
        <div className={`int-modal-overlay ${isClosing ? 'closing' : ''}`} onClick={handleClose}>
            <div className={`int-modal-content ${isClosing ? 'closing-genie' : 'opening-genie'}`} onClick={(e) => e.stopPropagation()}>
                <button className="int-modal-close" onClick={handleClose}>
                    <X size={24} />
                </button>

                <div className="int-modal-header">
                    <div className="int-icon-bounce">
                        <Link2 size={32} />
                    </div>
                    <h2>Secure <span className="int-text-gradient">App Sync</span></h2>
                    <p>Connect your favorite bank or payment gateway to automate your accounting ledger.</p>
                </div>

                {!isConnected ? (
                    <form className="int-modal-form" onSubmit={handleConnect}>
                        <div className="int-field">
                            <label><Database size={14} /> Workspace ID / Merchant ID</label>
                            <input type="text" placeholder="e.g., WS-987654321" required />
                        </div>

                        <div className="int-field">
                            <label><Key size={14} /> Secure API Key / Secret</label>
                            <input type="password" placeholder="••••••••••••••••••••••••" required />
                            <span className="int-help-text">Your keys are encrypted end-to-end and never stored in plain text.</span>
                        </div>

                        <div className="int-field">
                            <label>Data Sync Frequency</label>
                            <select defaultValue="daily">
                                <option value="realtime">Real-time (Premium)</option>
                                <option value="hourly">Every Hour</option>
                                <option value="daily">Daily at Midnight</option>
                                <option value="weekly">Weekly</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            className={`int-modal-submit ${isConnecting ? 'connecting' : ''}`}
                            disabled={isConnecting}
                        >
                            {isConnecting ? (
                                <>
                                    <RefreshCw size={18} className="int-spin-icon" />
                                    <span>Establishing Secure Connection...</span>
                                </>
                            ) : (
                                <span>Connect Integration</span>
                            )}
                        </button>
                    </form>
                ) : (
                    <div className="int-success-state">
                        <CheckCircle2 size={64} className="int-success-icon" />
                        <h3>Successfully Connected!</h3>
                        <p>Your transactions will now automatically sync directly into BiReenaTallyX.</p>
                        <button className="int-modal-submit success-btn" onClick={handleClose}>
                            Return to Dashboard
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default IntegrationModal;
