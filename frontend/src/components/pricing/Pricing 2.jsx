import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import './Pricing.css';

const Pricing = () => {
    const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'yearly'

    const tiers = [
        {
            name: "STANDARD",
            popular: false,
            monthlyPrice: 999,
            yearlyPrice: 849,
            priceLabel: "Price/Org/Month Billed Annually"
        },
        {
            name: "PROFESSIONAL",
            popular: true,
            monthlyPrice: 1899,
            yearlyPrice: 1599,
            priceLabel: "Price/Org/Month Billed Annually"
        },
        {
            name: "PREMIUM",
            popular: false,
            monthlyPrice: 4599,
            yearlyPrice: 3999,
            priceLabel: "Price/Org/Month Billed Annually"
        },
        {
            name: "ELITE",
            popular: false,
            monthlyPrice: 6999,
            yearlyPrice: 5999,
            priceLabel: "Price/Org/Month Billed Annually"
        },
        {
            name: "ULTIMATE",
            popular: false,
            monthlyPrice: 10599,
            yearlyPrice: 8999,
            priceLabel: "Price/Org/Month Billed Annually"
        }
    ];

    return (
        <section className="pricing-section" id="pricing">
            <div className="pricing-container">
                <div className="pricing-header">
                    <div className="pricing-header-left">
                        <span className="pricing-label">PRICING</span>
                        <h2 className="pricing-title">The perfect balance of<br />features and affordability</h2>
                    </div>
                </div>

                <div className="pricing-controls">
                    <div className="country-selector">
                        <span className="country-name">India</span>
                        <ChevronDown size={16} className="country-chevron" />
                    </div>

                    <div className="billing-toggle">
                        <span className={`toggle-label ${billingCycle === 'monthly' ? 'active' : ''}`}>Monthly</span>
                        <div
                            className={`toggle-switch ${billingCycle === 'yearly' ? 'switched' : ''}`}
                            onClick={() => setBillingCycle(prev => prev === 'monthly' ? 'yearly' : 'monthly')}
                        >
                            <div className="toggle-thumb"></div>
                        </div>
                        <span className={`toggle-label ${billingCycle === 'yearly' ? 'active' : ''}`}>
                            Yearly <span className="save-badge">(Save up to 25%)</span>
                        </span>
                    </div>
                </div>                <div className="free-plan-banner">
                    <div className="free-plan-content">
                        <span className="free-plan-title">Free Plan</span>
                        <span className="free-plan-desc">Free accounting software for small businesses</span>
                    </div>
                </div>

                <div className="pricing-grid">
                    {tiers.map((tier, index) => (
                        <div key={index} className={`pricing-card ${tier.popular ? 'popular' : ''}`}>
                            {tier.popular && <div className="popular-badge">Most Popular</div>}
                            <div className="card-inner">
                                <h3 className="tier-name">{tier.name}</h3>
                                <p className="tier-desc">{tier.desc}</p>

                                <div className="tier-price-box">
                                    {billingCycle === 'yearly' && (
                                        <div className="original-price animate-price" key={`orig-${billingCycle}`}>₹{tier.monthlyPrice.toLocaleString()}</div>
                                    )}
                                    <div className="discounted-price animate-price" key={`disc-${billingCycle}`} style={{ marginTop: billingCycle === 'monthly' ? '28px' : '0' }}>
                                        <span className="currency">₹</span>
                                        <span className="amount">
                                            {billingCycle === 'yearly' ? tier.yearlyPrice.toLocaleString() : tier.monthlyPrice.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="price-label animate-price" key={`label-${billingCycle}`}>
                                        {billingCycle === 'yearly' ? tier.priceLabel : "Price/Org/Month"}
                                    </div>
                                </div>

                                <button className="trial-btn">Apply</button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="pricing-footer">
                    <a href="#explore" className="explore-plans-link">Explore all plans</a>
                    <div className="tax-notice">*Prices are exclusive of local taxes.</div>
                </div>
            </div>
        </section>
    );
};

export default Pricing;
