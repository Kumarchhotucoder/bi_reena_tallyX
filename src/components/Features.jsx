import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import './Features.css';
import smartInvoiceImg from '../assets/smart-invoice.png';
import connectBanksImg from '../assets/connect-banks.png';
import effortlessTrackingImg from '../assets/effort-tracking.png';

const Features = () => {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.15 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const featuresList = [
        {
            title: "Connect Your Banks",
            desc: "Sync all your bank and credit card accounts securely. Transactions flow securely into the system, drastically reducing data entry and potential errors.",
            accent: "feat-accent-orange",
            image: connectBanksImg
        },
        {
            title: "Smart Invoicing",
            desc: "Create professional invoices within seconds. Set up recurring profiles for repeat customers and implement automated payment reminders.",
            accent: "feat-accent-pink",
            image: smartInvoiceImg
        },
        {
            title: "Effortless Tracking",
            desc: "Snap a picture of your receipts and let our OCR technology automatically scan and categorize the expense to keep your accounts reconciled.",
            accent: "feat-accent-purple",
            image: effortlessTrackingImg
        }
    ];

    return (
        <section className="premium-features-section" id="features" ref={sectionRef}>
            <div className="premium-features-container">
                <div className="features-intro">
                    <span className="features-label">Platform Capabilities</span>
                    <h2 className="features-main-title">
                        Everything you need to manage your{' '}
                        <span className="features-title-gradient">finances</span>
                    </h2>
                    <p className="features-subtitle">
                        Powerful automation algorithms working behind the scenes to keep your business fully synced.
                    </p>
                </div>

                <div className={`features-grid-layout ${isVisible ? 'in-view' : ''}`}>
                    {featuresList.map((feat, idx) => (
                        <div key={idx} className={`feature-card ${feat.accent}`} style={{ '--stagger-idx': idx }}>
                            {/* Decorative top glow */}
                            <div className="feat-card-glow"></div>

                            <div className="feature-visual-block">
                                <div className="feature-mock-ui feature-image-ui">
                                    <img
                                        src={feat.image}
                                        alt={feat.title}
                                        className="feature-invoice-img"
                                    />
                                </div>
                            </div>

                            <div className="feature-text-block">
                                <h3 className="feature-heading">{feat.title}</h3>
                                <p className="feature-description">{feat.desc}</p>
                                <Link
                                    to="/pricing"
                                    className="feat-learn-btn"
                                >
                                    <span>Learn More</span>
                                    <ArrowRight size={15} className="feat-btn-arrow" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
