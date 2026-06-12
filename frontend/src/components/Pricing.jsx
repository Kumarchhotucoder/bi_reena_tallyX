import React from 'react';
import { Check } from 'lucide-react';

const Pricing = () => {
    return (
        <section className="section pricing-section" id="pricing">
            <div className="container">
                <div className="section-header">
                    <h2 className="section-title">Simple, Transparent Pricing</h2>
                    <p className="section-subtitle">Choose the plan that fits your business scale.</p>
                </div>

                <div className="pricing-grid">
                    {/* Standard Plan */}
                    <div className="pricing-card">
                        <div className="plan-name">Standard</div>
                        <div className="plan-price">
                            <span className="currency">$</span>
                            <span className="amount">29</span>
                            <span className="period">/mo</span>
                        </div>
                        <p className="plan-desc">Perfect for small businesses and startups.</p>
                        <div className="plan-features">
                            {['Unlimited Invoices', 'Expense Tracking', 'Basic Reports', 'Tax Estimator', 'Email Support'].map((feat, i) => (
                                <div key={i} className="feature-item">
                                    <Check size={18} className="check-icon" /> {feat}
                                </div>
                            ))}
                        </div>
                        <button className="btn btn-outline btn-full">Get Started</button>
                    </div>

                    {/* Enterprise Plan */}
                    <div className="pricing-card featured">
                        <div className="popular-tag">Most Popular</div>
                        <div className="plan-name">Enterprise</div>
                        <div className="plan-price">
                            <span className="amount">Custom</span>
                        </div>
                        <p className="plan-desc">For large organizations requiring maximum control.</p>
                        <div className="plan-features">
                            {['Everything in Standard', 'Multi-Entity Support', 'Advanced Analytics', 'API Access', 'Dedicated Account Manager', 'Custom Integrations'].map((feat, i) => (
                                <div key={i} className="feature-item">
                                    <Check size={18} className="check-icon" /> {feat}
                                </div>
                            ))}
                        </div>
                        <button className="btn btn-primary btn-full">Schedule Meeting</button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Pricing;
