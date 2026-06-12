import React from 'react';
import './WhyChooseUs.css';
import { Settings, BarChart3, ShieldCheck, Globe, FileCheck, Calculator, Users, Smartphone } from 'lucide-react';

const WhyChooseUs = () => {
    return (
        <section className="wcu-modern-section">
            <div className="wcu-modern-container">
                <h2 className="wcu-modern-title">Why Choose Us is Unbeatable</h2>

                <div className="wcu-hex-grid">
                    {/* Card 1 */}
                    <div className="wcu-hex-card card-orange">
                        <div className="wcu-hex-icon">
                            <Settings size={28} />
                        </div>
                        <h3 className="wcu-hex-title">AI-Powered Automation</h3>
                        <p className="wcu-hex-desc">Automate repetitive tasks, streamline operations with intelligent algorithms.</p>
                    </div>

                    {/* Card 2 */}
                    <div className="wcu-hex-card card-blue">
                        <div className="wcu-hex-icon">
                            <BarChart3 size={28} />
                        </div>
                        <h3 className="wcu-hex-title">Real-Time Strategic Insights</h3>
                        <p className="wcu-hex-desc">Immediate dashboard updates, accessing data analytics anywhere.</p>
                    </div>

                    {/* Card 3 */}
                    <div className="wcu-hex-card card-purple">
                        <div className="wcu-hex-icon">
                            <ShieldCheck size={28} />
                        </div>
                        <h3 className="wcu-hex-title">Quantum Level Security</h3>
                        <p className="wcu-hex-desc">Your financial data encrypted completely and anti-tampering protection.</p>
                    </div>

                    {/* Card 4 */}
                    <div className="wcu-hex-card card-indigo">
                        <div className="wcu-hex-icon">
                            <Globe size={28} />
                        </div>
                        <h3 className="wcu-hex-title">Seamless Global Connectivity</h3>
                        <p className="wcu-hex-desc">Tax compliance and integrations for worldwide business.</p>
                    </div>
                </div>

                <div className="wcu-bottom-features">
                    <div className="wcu-feature-item">
                        <FileCheck size={20} className="wcu-feature-icon text-pink" />
                        <span>Intelligent Invoicing</span>
                    </div>
                    <div className="wcu-feature-item">
                        <Calculator size={20} className="wcu-feature-icon text-blue" />
                        <span>Tax Expense Management</span>
                    </div>
                    <div className="wcu-feature-item">
                        <Users size={20} className="wcu-feature-icon text-orange" />
                        <span>Multi-User Collaboration</span>
                    </div>
                    <div className="wcu-feature-item">
                        <Smartphone size={20} className="wcu-feature-icon text-purple" />
                        <span>Mobile Accessibility</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WhyChooseUs;
