import React from 'react';
import { PlayCircle, Headphones, BadgeIndianRupee, ArrowRight, Sparkles } from 'lucide-react';
import './PreFooter.css';

const PreFooter = () => {
    const cards = [
        {
            icon: <PlayCircle size={32} strokeWidth={1.8} />,
            title: "Free Trial",
            desc: "Experience the full power of BiReenaTallyX — no strings attached for 14 days.",
            btnText: "Start Free Trial",
            href: "#trial",
            accent: "pf-accent-orange"
        },
        {
            icon: <Headphones size={32} strokeWidth={1.8} />,
            title: "Request a Demo",
            desc: "Get a personalised walkthrough with our accounting product expert.",
            btnText: "Book a Demo",
            href: "#demo",
            accent: "pf-accent-pink"
        },
        {
            icon: <BadgeIndianRupee size={32} strokeWidth={1.8} />,
            title: "Plans & Pricing",
            desc: "Flexible plans designed for every business — from startups to enterprises.",
            btnText: "View All Plans",
            href: "/pricing",
            accent: "pf-accent-purple"
        }
    ];

    return (
        <section className="prefooter-section">
            {/* Animated background particles */}
            <div className="pf-bg-glow pf-glow-1"></div>
            <div className="pf-bg-glow pf-glow-2"></div>
            <div className="pf-bg-glow pf-glow-3"></div>

            <div className="prefooter-container">
                <div className="pf-header">
                    <span className="pf-badge"><Sparkles size={14} /> Get Started Today</span>
                    <h2 className="pf-heading">Ready to Transform Your <span className="pf-heading-gradient">Accounting?</span></h2>
                    <p className="pf-subheading">Choose how you'd like to begin your journey with BiReenaTallyX</p>
                </div>

                <div className="pf-grid">
                    {cards.map((card, i) => (
                        <div key={i} className={`pf-card ${card.accent}`} style={{ animationDelay: `${i * 0.12}s` }}>
                            <div className="pf-card-shimmer"></div>
                            <div className="pf-icon-wrap">
                                {card.icon}
                            </div>
                            <h3 className="pf-card-title">{card.title}</h3>
                            <p className="pf-card-desc">{card.desc}</p>
                            <a href={card.href} className="pf-card-btn" onClick={(e) => {
                                if (card.btnText === "Book a Demo") {
                                    e.preventDefault();
                                    window.dispatchEvent(new Event('openDemoModal'));
                                } else if (card.btnText === "Start Free Trial") {
                                    e.preventDefault();
                                    window.dispatchEvent(new Event('openTrialModal'));
                                }
                            }}>
                                <span>{card.btnText}</span>
                                <ArrowRight size={16} className="pf-btn-arrow" />
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PreFooter;
