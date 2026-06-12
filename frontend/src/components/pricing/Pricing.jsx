import React, { useState } from 'react';
import { ChevronDown, Check, Zap, Crown, Gem, Shield, Rocket } from 'lucide-react';
import './Pricing.css';

const Pricing = ({ compact = false }) => {
    const [billingCycle, setBillingCycle] = useState('monthly');

    const tiers = [
        {
            name: "Standard",
            icon: <Shield size={24} />,
            popular: false,
            monthlyPrice: 999,
            yearlyPrice: 849,
            priceLabel: "per org / month",
            accent: "accent-blue",
            features: [
                "Single User Access",
                "Basic Ledger & Journals",
                "GST-Ready Invoicing",
                "Standard Reports",
                "Email Support"
            ]
        },
        {
            name: "Professional",
            icon: <Zap size={24} />,
            popular: true,
            monthlyPrice: 1899,
            yearlyPrice: 1599,
            priceLabel: "per org / month",
            accent: "accent-orange",
            features: [
                "Up to 5 Users",
                "Advanced Ledger & Journals",
                "Multi-GST Invoicing",
                "Inventory Management",
                "Priority Support",
                "Bank Reconciliation"
            ]
        },
        {
            name: "Premium",
            icon: <Crown size={24} />,
            popular: false,
            monthlyPrice: 4599,
            yearlyPrice: 3999,
            priceLabel: "per org / month",
            accent: "accent-purple",
            features: [
                "Up to 15 Users",
                "Multi-Branch Support",
                "Advanced Analytics",
                "Custom Report Builder",
                "API Access",
                "Dedicated Manager",
                "Audit Trail"
            ]
        },
        {
            name: "Elite",
            icon: <Gem size={24} />,
            popular: false,
            monthlyPrice: 6999,
            yearlyPrice: 5999,
            priceLabel: "per org / month",
            accent: "accent-pink",
            features: [
                "Up to 30 Users",
                "Multi-Company Support",
                "Real-Time Collaboration",
                "Advanced Inventory",
                "Custom Integrations",
                "24/7 Phone Support",
                "Data Migration Help",
                "Role-Based Access"
            ]
        },
        {
            name: "Ultimate",
            icon: <Rocket size={24} />,
            popular: false,
            monthlyPrice: 10599,
            yearlyPrice: 8999,
            priceLabel: "per org / month",
            accent: "accent-indigo",
            features: [
                "Unlimited Users",
                "Enterprise Security",
                "White-Label Branding",
                "Dedicated Server",
                "SLA Guarantee",
                "Custom Development",
                "On-Site Training",
                "Priority Bug Fixes",
                "Compliance Toolkit"
            ]
        }
    ];

    return (
        <section className="pricing-section" id="pricing">
            <div className="pricing-container">
                {/* Header */}
                <div className="pricing-header">
                    <span className="pricing-label">Pricing</span>
                    <h2 className="pricing-title">
                        Choose the <span className="gradient-text">Perfect Plan</span> for Your Business
                    </h2>
                    <p className="pricing-subtitle">
                        Transparent pricing with no hidden fees. Scale effortlessly as your business grows.
                    </p>
                </div>

                {/* Billing Toggle */}
                <div className="pricing-toggle-wrapper">
                    <div className="billing-toggle">
                        <span className={`toggle-label ${billingCycle === 'monthly' ? 'active' : ''}`}>Monthly</span>
                        <div
                            className={`toggle-switch ${billingCycle === 'yearly' ? 'switched' : ''}`}
                            onClick={() => setBillingCycle(prev => prev === 'monthly' ? 'yearly' : 'monthly')}
                        >
                            <div className="toggle-thumb"></div>
                        </div>
                        <span className={`toggle-label ${billingCycle === 'yearly' ? 'active' : ''}`}>
                            Yearly <span className="save-badge">Save 25%</span>
                        </span>
                    </div>
                </div>

                {/* Cards Grid */}
                <div className="pricing-grid">
                    {tiers.map((tier, index) => (
                        <div
                            key={index}
                            className={`pricing-card ${tier.popular ? 'popular' : ''} ${tier.accent}`}
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            {tier.popular && (
                                <div className="popular-ribbon">
                                    <span>Most Popular</span>
                                </div>
                            )}

                            <div className="card-header">
                                <div className="tier-icon">{tier.icon}</div>
                                <h3 className="tier-name">{tier.name}</h3>
                            </div>

                            <div className="tier-price-box">
                                {billingCycle === 'yearly' && (
                                    <div className="original-price" key={`orig-${billingCycle}`}>
                                        ₹{tier.monthlyPrice.toLocaleString()}
                                    </div>
                                )}
                                <div className="discounted-price" key={`disc-${billingCycle}`}>
                                    <span className="currency">₹</span>
                                    <span className="amount">
                                        {billingCycle === 'yearly' ? tier.yearlyPrice.toLocaleString() : tier.monthlyPrice.toLocaleString()}
                                    </span>
                                </div>
                                <div className="price-period">{tier.priceLabel}</div>
                            </div>

                            {!compact && <ul className="features-list">
                                {tier.features.map((feature, i) => (
                                    <li key={i} className="feature-item">
                                        <Check size={16} className="feature-check" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>}

                            <button
                                className={`trial-btn ${tier.popular ? 'btn-popular' : ''}`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    window.dispatchEvent(new Event('openPricingModal'));
                                }}
                            >
                                <span>{compact ? 'View Details' : 'Get Started'}</span>
                            </button>
                        </div>
                    ))}
                </div>

                {compact && (
                    <div className="pricing-cta-wrapper">
                        <a href="/pricing" className="pricing-view-all">
                            Explore All Plans & Features →
                        </a>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Pricing;
