import React from 'react';
import { Link } from 'react-router-dom';
import './WhyChooseUs.css';
import {
    Settings, BarChart3, ShieldCheck, Globe,
    FileCheck, Calculator, Users, Smartphone, ArrowRight, Sparkles
} from 'lucide-react';

const WhyChooseUs = () => {
    const mainCards = [
        {
            icon: <Settings size={26} />,
            title: "AI-Powered Automation",
            desc: "Automate repetitive tasks, streamline operations with intelligent algorithms that learn and adapt.",
            accent: "wcu-orange",
            btnText: "Explore AI"
        },
        {
            icon: <BarChart3 size={26} />,
            title: "Real-Time Strategic Insights",
            desc: "Immediate dashboard updates with live data analytics accessible anytime, anywhere.",
            accent: "wcu-pink",
            btnText: "See Analytics"
        },
        {
            icon: <ShieldCheck size={26} />,
            title: "Quantum Level Security",
            desc: "Your financial data encrypted end-to-end with anti-tampering and fraud protection built in.",
            accent: "wcu-purple",
            btnText: "Learn Security"
        },
        {
            icon: <Globe size={26} />,
            title: "Seamless Global Connectivity",
            desc: "Tax compliance and integrations for worldwide business operations across currencies.",
            accent: "wcu-indigo",
            btnText: "Go Global"
        }
    ];

    const bottomFeatures = [
        { icon: <FileCheck size={24} />, label: "Intelligent Invoicing", accent: "wcu-orange" },
        { icon: <Calculator size={24} />, label: "Tax Expense Management", accent: "wcu-pink" },
        { icon: <Users size={24} />, label: "Multi-User Collaboration", accent: "wcu-purple" },
        { icon: <Smartphone size={24} />, label: "Mobile Accessibility", accent: "wcu-indigo" }
    ];

    return (
        <section className="wcu-section">
            <div className="wcu-container">
                {/* Header */}
                <div className="wcu-header">
                    <span className="wcu-label"><Sparkles size={14} /> Why Choose Us</span>
                    <h2 className="wcu-title">
                        Why We're <span className="wcu-title-gradient">Unbeatable</span>
                    </h2>
                    <p className="wcu-subtitle">
                        Built for modern accountants — powerful features that set us apart from the rest.
                    </p>
                </div>

                {/* Main Cards */}
                <div className="wcu-cards-grid">
                    {mainCards.map((card, i) => (
                        <div key={i} className={`wcu-card ${card.accent}`} style={{ animationDelay: `${i * 0.1}s` }}>
                            <div className="wcu-card-icon">
                                {card.icon}
                            </div>
                            <h3 className="wcu-card-title">{card.title}</h3>
                            <p className="wcu-card-desc">{card.desc}</p>
                            <Link
                                to="/about"
                                className="wcu-card-btn"
                            >
                                <span>{card.btnText}</span>
                                <ArrowRight size={14} className="wcu-btn-arrow" />
                            </Link>
                        </div>
                    ))}
                </div>

                {/* Bottom Feature Strip */}
                <div className="wcu-bottom-strip">
                    {bottomFeatures.map((feat, i) => (
                        <div key={i} className={`wcu-bottom-item ${feat.accent}`}>
                            <div className="wcu-bottom-icon">{feat.icon}</div>
                            <span className="wcu-bottom-label">{feat.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WhyChooseUs;
