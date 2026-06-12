import React, { useState } from 'react';
import { Building2, Landmark, Wallet, CreditCard, Banknote } from 'lucide-react';
import './Integrations.css';

const BankLogo = ({ src, alt, fallbackIcon }) => {
    const [error, setError] = useState(false);

    if (error) {
        return <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>{fallbackIcon}</div>;
    }

    return (
        <img
            src={src}
            alt={alt}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            onError={() => setError(true)}
            loading="lazy"
        />
    );
};

const banks = [
    { name: "HDFC Bank", logo: "https://upload.wikimedia.org/wikipedia/commons/2/28/HDFC_Bank_Logo.svg", fallback: <Building2 size={40} /> },
    { name: "ICICI Bank", logo: "https://upload.wikimedia.org/wikipedia/commons/1/12/ICICI_Bank_Logo.svg", fallback: <Landmark size={40} /> },
    { name: "Axis Bank", logo: "https://upload.wikimedia.org/wikipedia/commons/1/1a/Axis_Bank_logo.svg", fallback: <Building2 size={40} /> },
    { name: "SBI Bank", logo: "https://upload.wikimedia.org/wikipedia/commons/c/cc/SBI-logo.svg", fallback: <Landmark size={40} /> },
    { name: "Kotak Bank", logo: "https://upload.wikimedia.org/wikipedia/commons/c/c3/Kotak_Mahindra_Bank_logo.svg", fallback: <Building2 size={40} /> },
    { name: "Yes Bank", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a1/YES_Bank_logo.svg", fallback: <Landmark size={40} /> },
    { name: "Paypal", logo: "https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg", fallback: <Banknote size={40} /> },
    { name: "Razorpay", logo: "https://upload.wikimedia.org/wikipedia/commons/8/89/Razorpay_logo.svg", fallback: <CreditCard size={40} /> },
    { name: "Paytm", logo: "https://upload.wikimedia.org/wikipedia/commons/2/24/Paytm_Logo_%28standalone%29.svg", fallback: <Wallet size={40} /> },
    { name: "Stripe", logo: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg", fallback: <CreditCard size={40} /> },
];

const Integrations = () => {
    // Duplicate array multiple times to create a seamless loop
    const loopedBanks = [...banks, ...banks, ...banks, ...banks];

    return (
        <section className="integrations-section">
            <div className="container integrations-box">
                <div className="integrations-container">
                    <span className="integration-label">INTEGRATIONS</span>
                    <h2 className="integration-title">Connect and conquer</h2>
                    <p className="integration-desc">Orchestrate success connecting with the apps you love</p>

                    <div className="marquee-container">
                        <div className="marquee-track">
                            {loopedBanks.map((bank, index) => (
                                <div key={`${bank.name}-${index}`} className="app-item">
                                    <div className="app-card" style={{ backgroundColor: '#ffffff', padding: '10px' }}>
                                        <div className="app-logo" style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                            <BankLogo
                                                src={bank.logo}
                                                alt={bank.name}
                                                fallbackIcon={bank.fallback}
                                            />
                                        </div>
                                    </div>
                                    <span className="app-name">{bank.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <a href="#integrations" className="more-link">More Integrations</a>
                </div>
            </div>
        </section>
    );
};

export default Integrations;
